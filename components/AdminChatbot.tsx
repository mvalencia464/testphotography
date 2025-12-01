import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, Bot, User, Paperclip, X } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useHighLevel } from '../hooks/useHighLevel';
import { useSiteConfig } from '../context/SiteConfigContext';
import { usePortfolio } from '../context/PortfolioContext';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    image?: string; // Data URL for preview
    timestamp: number;
}

export const AdminChatbot: React.FC = () => {
    const { uploadFile, deleteFile } = useHighLevel();
    const { updateContent, config, saveToGitHub } = useSiteConfig();
    const { photos, deletePhoto, saveMetadataToGitHub } = usePortfolio();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'model',
            text: "Hello! I'm your AI site assistant. I can help you upload photos, update text content, or answer questions about your site. How can I help you today?",
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const processAction = async (action: any) => {
        console.log("Processing action:", action);

        if (action.action === 'upload_photo' && selectedImage) {
            try {
                const result = await uploadFile(selectedImage);
                return `Successfully uploaded photo! URL: ${result.url || result.meta?.url}`;
            } catch (error: any) {
                return `Failed to upload photo: ${error.message}`;
            }
        }

        if (action.action === 'delete_photo' && action.parameters?.photoId) {
            try {
                await deletePhoto(action.parameters.photoId);
                return `Successfully deleted photo from HighLevel!`;
            } catch (error: any) {
                return `Failed to delete photo: ${error.message}`;
            }
        }

        if (action.action === 'update_content' && action.parameters) {
            try {
                updateContent(action.parameters);
                return `Successfully updated site content!`;
            } catch (error: any) {
                return `Failed to update content: ${error.message}`;
            }
        }

        if (action.action === 'save_changes') {
            try {
                const configRes = await saveToGitHub();
                const portfolioRes = await saveMetadataToGitHub();

                if (configRes.success && portfolioRes.success) {
                    return "Successfully saved content and photo metadata to GitHub!";
                }
                return `Partial success or failure. Content: ${configRes.success ? 'Saved' : configRes.message}, Photos: ${portfolioRes.success ? 'Saved' : portfolioRes.message}`;
            } catch (error: any) {
                return `Failed to save changes: ${error.message}`;
            }
        }

        return null;
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isProcessing) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            image: imagePreview || undefined,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsProcessing(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
            const ai = new GoogleGenAI({ apiKey });

            // Convert image to base64 if present
            let imagePart = null;
            if (selectedImage) {
                const base64Data = imagePreview?.split(',')[1];
                if (base64Data) {
                    imagePart = {
                        inlineData: {
                            data: base64Data,
                            mimeType: selectedImage.type
                        }
                    };
                }
            }

            // Build photo context for deletion
            const photoContext = photos.map(p => `ID: ${p.id}, Title: "${p.title}", Category: ${p.category}`).join('\n');

            const systemPrompt = `
        You are a helpful AI assistant for a photography website admin dashboard.
        
        Current Site Configuration:
        ${JSON.stringify(config.content, null, 2)}
        
        Current Photos in Gallery:
        ${photoContext}
        
        Capabilities:
        1. Upload Photos: If the user provides an image and asks to upload it, request the 'upload_photo' action.
        2. Delete Photos: If the user asks to delete a photo, identify it from the gallery list above and request 'delete_photo' with the photoId.
        3. Update Content: If the user wants to change text (headlines, about text), request the 'update_content' action with the new text fields.
           - Available fields: heroHeadline, heroSubheadline, aboutHeadline, aboutText.
        4. Save & Deploy: If the user asks to save or deploy changes, request the 'save_changes' action.
        5. General Chat: Answer questions about the site or photography.

        When you want to perform an action, return a JSON object with the 'action' field.
        If no action is needed, just return a conversational response in the 'response_to_user' field.
        
        Schema for JSON response:
        {
          "action": "upload_photo" | "delete_photo" | "update_content" | "save_changes" | "none",
          "parameters": {
            "photoId": "string (for delete_photo)",
            "heroHeadline": "string (optional, for update_content)",
            "heroSubheadline": "string (optional, for update_content)",
            "aboutHeadline": "string (optional, for update_content)",
            "aboutText": "string (optional, for update_content)"
          },
          "response_to_user": "string"
        }
      `;

            const contents = [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'user', parts: imagePart ? [{ text: input }, imagePart] : [{ text: input }] }
            ];

            const result = await ai.models.generateContent({
                model: "gemini-2.0-flash", // Using a model that supports images and JSON
                contents: contents as any,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            action: { type: Type.STRING, enum: ["upload_photo", "delete_photo", "update_content", "save_changes", "none"] },
                            parameters: {
                                type: Type.OBJECT,
                                properties: {
                                    photoId: { type: Type.STRING },
                                    heroHeadline: { type: Type.STRING },
                                    heroSubheadline: { type: Type.STRING },
                                    aboutHeadline: { type: Type.STRING },
                                    aboutText: { type: Type.STRING }
                                }
                            },
                            response_to_user: { type: Type.STRING }
                        },
                        required: ["action", "response_to_user"]
                    }
                }
            });

            const responseText = result.text;
            console.log("AI Response:", responseText);

            let parsedResponse;
            try {
                parsedResponse = JSON.parse(responseText || '{}');
            } catch (e) {
                console.error("Failed to parse JSON", e);
                parsedResponse = { action: 'none', response_to_user: "I'm sorry, I had trouble processing that request." };
            }

            let actionResult = null;
            if (parsedResponse.action !== 'none') {
                actionResult = await processAction(parsedResponse);
            }

            const finalResponseText = actionResult
                ? `${parsedResponse.response_to_user}\n\n*[System: ${actionResult}]*`
                : parsedResponse.response_to_user;

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: finalResponseText,
                timestamp: Date.now()
            }]);

            if (parsedResponse.action === 'upload_photo') {
                clearImage(); // Clear image after successful upload handling
            }

        } catch (error: any) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "I encountered an error processing your request. Please check your API key and try again.",
                timestamp: Date.now()
            }]);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-stone-900 border border-stone-800 rounded-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-full">
                    <Bot size={20} className="text-white" />
                </div>
                <div>
                    <h3 className="text-white font-bold font-serif">AI Assistant</h3>
                    <p className="text-xs text-stone-400">Powered by Gemini</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-900/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                            ? 'bg-amber-600 text-white rounded-tr-none'
                            : 'bg-stone-800 text-stone-200 rounded-tl-none border border-stone-700'
                            }`}>
                            {msg.image && (
                                <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
                                    <img src={msg.image} alt="User upload" className="max-w-full h-auto" />
                                </div>
                            )}
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="bg-stone-800 text-stone-400 rounded-2xl rounded-tl-none p-4 border border-stone-700 flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-xs">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-stone-950 border-t border-stone-800">
                {imagePreview && (
                    <div className="mb-3 flex items-center gap-2 bg-stone-900 p-2 rounded-lg border border-stone-800 w-fit">
                        <div className="w-10 h-10 rounded overflow-hidden">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-stone-400 max-w-[150px] truncate">{selectedImage?.name}</span>
                        <button onClick={clearImage} className="text-stone-500 hover:text-red-400 p-1">
                            <X size={14} />
                        </button>
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <label className={`p-3 rounded-full cursor-pointer transition-colors ${selectedImage ? 'bg-amber-500/20 text-amber-500' : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'}`}>
                        <Paperclip size={20} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                    </label>

                    <div className="flex-1 relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message or instruction..."
                            className="w-full bg-stone-900 border-none rounded-2xl px-4 py-3 text-white placeholder-stone-500 focus:ring-2 focus:ring-amber-600 resize-none max-h-32 min-h-[48px]"
                            rows={1}
                            style={{ height: 'auto', minHeight: '48px' }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={(!input.trim() && !selectedImage) || isProcessing}
                        className={`p-3 rounded-full transition-all ${(!input.trim() && !selectedImage) || isProcessing
                            ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                            : 'bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-900/20'
                            }`}
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-[10px] text-stone-600 text-center mt-2">
                    AI can make mistakes. Please review changes.
                </p>
            </div>
        </div>
    );
};
