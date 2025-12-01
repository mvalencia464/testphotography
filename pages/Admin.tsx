
import React, { useState, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useAuth } from '../context/AuthContext';
import { Upload, Trash2, Home, CheckCircle, Lock, LogOut, Edit2, X, Save, Palette, Wand2, Loader2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Photo, ThemeColor } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

export const Admin: React.FC = () => {
  const { photos, addPhoto, deletePhoto, updatePhoto } = usePortfolio();
  const { config, updateTheme, updateContent } = useSiteConfig();
  const { isAuthenticated, login, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'photos' | 'settings'>('photos');
  const [isDragging, setIsDragging] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Auth Form State
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  // Editing state for Photos
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  // AI & Settings State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files) as File[];
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const newPhoto: Photo = {
          id: Date.now().toString() + Math.random().toString(),
          url: URL.createObjectURL(file),
          title: file.name.split('.')[0], 
          category: 'Uploads'
        };
        addPhoto(newPhoto);
      }
    });

    if (files.length > 0) {
      showNotification(`Successfully added ${files.length} images!`);
    }
  }, [addPhoto]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
       files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const newPhoto: Photo = {
            id: Date.now().toString() + Math.random().toString(),
            url: URL.createObjectURL(file),
            title: file.name.split('.')[0],
            category: 'Uploads'
          };
          addPhoto(newPhoto);
        }
      });
      showNotification(`Successfully added ${files.length} images!`);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(passwordInput)) {
        setError('');
    } else {
        setError('Incorrect password');
        setPasswordInput('');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPhoto) {
      updatePhoto(editingPhoto);
      setEditingPhoto(null);
      showNotification("Photo updated successfully!");
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a professional website copywriter. 
        Current Content JSON: ${JSON.stringify(config.content)}
        User Request: ${aiPrompt}
        
        Return a JSON object with the fields: heroHeadline, heroSubheadline, aboutHeadline, aboutText.
        Make the copy sound professional, engaging, and aligned with the user's request. Keep the 'aboutText' relatively short (under 400 characters) but impactful.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              heroHeadline: { type: Type.STRING },
              heroSubheadline: { type: Type.STRING },
              aboutHeadline: { type: Type.STRING },
              aboutText: { type: Type.STRING },
            }
          }
        }
      });

      const newContent = JSON.parse(response.text);
      updateContent(newContent);
      showNotification("Content updated by AI!");
      setAiPrompt('');
    } catch (err) {
      console.error(err);
      showNotification("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4">
            <Link to="/" className="mb-8 flex items-center gap-2 text-stone-500 hover:text-amber-500 transition-colors">
                <Home size={16} /> Back to Home
            </Link>
            
            <div className="w-full max-w-md bg-stone-900 border border-stone-800 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-600"></div>
                
                <div className="text-center mb-8">
                    <div className="bg-stone-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-700">
                        <Lock className="text-amber-500 h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-serif text-white font-bold mb-2">Admin Access</h2>
                    <p className="text-stone-400 text-sm">Please enter the password to manage the portfolio.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Enter password"
                            className="w-full bg-stone-950 border border-stone-700 text-white px-4 py-3 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors text-center tracking-widest"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-2 text-center animate-pulse">{error}</p>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 uppercase tracking-widest transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
            <p className="text-stone-600 text-xs mt-8">Mark Beecham Photography &copy; {new Date().getFullYear()}</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      {/* Admin Nav */}
      <div className="bg-stone-900 border-b border-stone-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-amber-600 p-2 rounded-md">
                 <Settings className="text-white h-5 w-5" />
             </div>
             <h1 className="text-xl font-serif font-bold text-white">Site Manager</h1>
          </div>

          <div className="flex gap-2 bg-stone-950 p-1 rounded-lg border border-stone-800">
             <button 
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'photos' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-300'}`}
             >
                Photos
             </button>
             <button 
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-300'}`}
             >
                AI & Settings
             </button>
          </div>

          <div className="flex items-center gap-6">
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-stone-400 hover:text-red-400 transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
              <Link to="/" className="flex items-center gap-2 text-stone-400 hover:text-amber-500 transition-colors border-l border-stone-700 pl-6">
                <Home size={18} />
                <span className="text-sm font-medium">View Site</span>
              </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        
        {/* Notification */}
        {notification && (
          <div className="fixed top-20 right-4 bg-green-900/90 text-green-100 px-6 py-3 rounded shadow-xl flex items-center gap-3 animate-fade-in z-50">
            <CheckCircle size={20} />
            {notification}
          </div>
        )}

        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <div className="animate-fade-in">
              {/* Edit Modal */}
              {editingPhoto && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="bg-stone-900 border border-stone-700 w-full max-w-lg p-6 rounded-lg shadow-2xl relative">
                    <button 
                      onClick={() => setEditingPhoto(null)} 
                      className="absolute top-4 right-4 text-stone-500 hover:text-white"
                    >
                      <X size={24} />
                    </button>
                    
                    <h3 className="text-xl font-serif text-white font-bold mb-6 flex items-center gap-2">
                      <Edit2 size={20} className="text-amber-500" />
                      Edit Photo Details
                    </h3>

                    <div className="flex gap-6 mb-6">
                      <div className="w-1/3 aspect-square bg-stone-950 rounded overflow-hidden">
                          <img src={editingPhoto.url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <form onSubmit={handleSaveEdit} className="flex-1 space-y-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Title</label>
                            <input 
                              type="text" 
                              value={editingPhoto.title}
                              onChange={e => setEditingPhoto({...editingPhoto, title: e.target.value})}
                              className="w-full bg-stone-950 border border-stone-800 text-white px-3 py-2 text-sm focus:border-amber-600 outline-none"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Category</label>
                            <select 
                              value={editingPhoto.category}
                              onChange={e => setEditingPhoto({...editingPhoto, category: e.target.value as any})}
                              className="w-full bg-stone-950 border border-stone-800 text-white px-3 py-2 text-sm focus:border-amber-600 outline-none"
                            >
                              <option value="Sports">Sports</option>
                              <option value="Wildlife">Wildlife</option>
                              <option value="Nature">Nature</option>
                              <option value="Landscape">Landscape</option>
                              <option value="Family">Family</option>
                              <option value="Real Estate">Real Estate</option>
                              <option value="Uploads">Uploads</option>
                            </select>
                          </div>

                          <div className="pt-2 flex justify-end gap-3">
                            <button 
                              type="button" 
                              onClick={() => setEditingPhoto(null)}
                              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                            >
                              <Save size={14} /> Save
                            </button>
                          </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div 
                className={`mb-12 border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-amber-500 bg-amber-500/10 scale-[1.01]' 
                    : 'border-stone-700 bg-stone-900/50 hover:border-stone-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`p-4 rounded-full ${isDragging ? 'bg-amber-500/20' : 'bg-stone-800'}`}>
                      <Upload className={`h-8 w-8 ${isDragging ? 'text-amber-500' : 'text-stone-400'}`} />
                  </div>
                  <div>
                      <p className="text-xl font-medium text-white mb-2">Drag and drop photos here</p>
                      <p className="text-stone-500 mb-6">or click to browse from your computer</p>
                      
                      <label className="cursor-pointer bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded text-sm font-bold uppercase tracking-wider transition-colors inline-block">
                          Select Files
                          <input 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleFileSelect} 
                          />
                      </label>
                  </div>
                  <p className="text-stone-600 text-xs mt-4">Supports JPG, PNG, WEBP</p>
                </div>
              </div>

              {/* Gallery Management */}
              <div>
                  <h2 className="text-2xl font-serif text-white font-bold mb-6 flex items-center gap-3">
                      Current Gallery 
                      <span className="text-sm font-sans font-normal text-stone-500 bg-stone-900 px-2 py-1 rounded">
                          {photos.length} items
                      </span>
                  </h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {photos.map(photo => (
                          <div key={photo.id} className="group relative aspect-square bg-stone-900 rounded overflow-hidden border border-stone-800 hover:border-amber-500/50 transition-colors">
                              <img 
                                  src={photo.url} 
                                  alt={photo.title} 
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              {/* Overlay Actions */}
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                  <span className="text-xs text-stone-300 font-medium truncate">{photo.title}</span>
                                  
                                  <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => setEditingPhoto(photo)}
                                        className="bg-stone-700 hover:bg-amber-600 text-white p-2 rounded-full transition-colors"
                                        title="Edit Photo"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => deletePhoto(photo.id)}
                                        className="bg-stone-700 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                                        title="Delete Photo"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                  </div>
                              </div>
                              <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                                  {photo.category}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
           <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Color Theme */}
              <div className="bg-stone-900 border border-stone-800 p-8 rounded-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="text-amber-500" />
                    <h2 className="text-xl font-serif text-white font-bold">Theme Color</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {(['amber', 'sky', 'rose', 'emerald', 'violet'] as ThemeColor[]).map((color) => (
                      <button
                        key={color}
                        onClick={() => updateTheme(color)}
                        className={`group relative p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          config.themeColor === color 
                            ? `border-${color}-500 bg-${color}-500/10` 
                            : 'border-stone-800 hover:border-stone-600'
                        }`}
                      >
                         <div className={`w-8 h-8 rounded-full bg-${color}-500 shadow-lg`}></div>
                         <span className="text-xs uppercase font-medium text-stone-400">{color}</span>
                         {config.themeColor === color && (
                           <div className="absolute top-2 right-2">
                             <CheckCircle className={`w-4 h-4 text-${color}-500`} />
                           </div>
                         )}
                      </button>
                    ))}
                  </div>
              </div>

              {/* AI Assistant */}
              <div className="bg-stone-900 border border-stone-800 p-8 rounded-lg relative overflow-hidden">
                 {/* Decorative gradient */}
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl pointer-events-none"></div>

                 <div className="flex items-center gap-3 mb-6 relative z-10">
                    <Wand2 className="text-purple-400" />
                    <div>
                        <h2 className="text-xl font-serif text-white font-bold">AI Content Assistant</h2>
                        <p className="text-xs text-stone-500">Powered by Gemini</p>
                    </div>
                 </div>

                 <div className="relative z-10">
                    <p className="text-stone-400 text-sm mb-4">
                      Describe the tone or focus you want for your homepage (e.g., "Make it sound more luxurious and focused on weddings" or "Fun and energetic for sports").
                    </p>
                    
                    <textarea 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Enter your prompt here..."
                      className="w-full h-32 bg-stone-950 border border-stone-800 rounded p-4 text-stone-200 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none mb-4 resize-none"
                    />

                    <button
                      onClick={handleAIGenerate}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className={`w-full py-3 rounded font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all ${
                        isGenerating 
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-purple-900/20'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" /> Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" /> Generate & Apply
                        </>
                      )}
                    </button>
                 </div>
              </div>

              {/* Current Content Preview (Read Only) */}
              <div className="md:col-span-2 bg-stone-900 border border-stone-800 p-8 rounded-lg opacity-75">
                 <h3 className="text-sm font-bold uppercase text-stone-500 mb-4">Current Content Preview</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-stone-600 uppercase block mb-1">Hero Headline</label>
                      <p className="text-stone-300 font-serif text-lg">{config.content.heroHeadline}</p>
                    </div>
                    <div>
                      <label className="text-xs text-stone-600 uppercase block mb-1">Hero Subheadline</label>
                      <p className="text-stone-300">{config.content.heroSubheadline}</p>
                    </div>
                 </div>
              </div>

           </div>
        )}
      </div>
    </div>
  );
};
