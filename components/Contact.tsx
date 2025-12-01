
import React, { useState, useCallback } from 'react';
import { Phone, Mail, MapPin, Send, Upload, X, Loader2 } from 'lucide-react';
import { BRAND } from '../constants';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useHighLevel } from '../hooks/useHighLevel';
import { validateEmail, validateFile } from '../utils/formValidation';

export const Contact: React.FC = () => {
  const { config } = useSiteConfig();
  const theme = config.themeColor;
  const { submitForm, uploadFile, loading, error: apiError } = useHighLevel();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: 'Sports Photography - Game Day Package',
    message: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formErrors, setFormErrors] = useState<{email?: string, file?: string}>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
        setFormErrors(prev => ({ ...prev, file: undefined }));
      } else {
        setFormErrors(prev => ({ ...prev, file: validation.error }));
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
        setFormErrors(prev => ({ ...prev, file: undefined }));
      } else {
        setFormErrors(prev => ({ ...prev, file: validation.error }));
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSuccessMessage(null);

    if (!validateEmail(formState.email)) {
        setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
        return;
    }

    try {
        let imageUrl = '';
        if (selectedFile) {
            const uploadResponse = await uploadFile(selectedFile);
            // Assuming uploadResponse contains the url. 
            // GHL upload-file response usually has { fileId, url, ... } or similar.
            // I'll check the response structure if possible, but for now assume .url or .meta.url
            imageUrl = uploadResponse.url || uploadResponse.meta?.url || ''; 
        }

        // Prepare Custom Fields
        const customFields = [];
        if (formState.message) {
             customFields.push({ key: 'project_details', field_value: formState.message });
        }
        if (imageUrl) {
             customFields.push({ key: 'project_image_url', field_value: imageUrl });
             customFields.push({ key: 'has_project_image', field_value: 'Yes' });
        }

        const contactData = {
            name: formState.name,
            email: formState.email,
            tags: ['Website Lead', 'React Form', `Service: ${formState.service}`],
            source: 'Website Contact Form',
            customFields: customFields.length > 0 ? customFields : undefined
        };

        await submitForm(contactData);

        setSuccessMessage("Thank you! Your message has been sent successfully.");
        setFormState({ name: '', email: '', service: 'Sports Photography - Game Day Package', message: '' });
        setSelectedFile(null);

    } catch (err) {
        console.error("Submission failed:", err);
        // ApiError is handled by useHighLevel and returned as error string
    }
  };

  return (
    <section id="contact" className="py-24 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className={`text-${theme}-500 font-medium tracking-[0.2em] uppercase mb-4`}>Get in Touch</h2>
            <h3 className="text-3xl md:text-5xl font-serif text-white font-bold mb-8">Let's Create Something Beautiful</h3>
            <p className="text-stone-400 mb-12 max-w-md">
              Ready to capture your memories? We typically respond to all inquiries within 24 hours. For urgent requests, text or call.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-stone-900 p-3 rounded-none border border-stone-800">
                  <Phone className={`w-6 h-6 text-${theme}-500`} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-serif mb-1">Phone</h4>
                  <p className="text-stone-400">{BRAND.phone}</p>
                  <p className="text-stone-600 text-sm">Text preferred for quick response</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-stone-900 p-3 rounded-none border border-stone-800">
                  <Mail className={`w-6 h-6 text-${theme}-500`} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-serif mb-1">Email</h4>
                  <p className="text-stone-400">{BRAND.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-stone-900 p-3 rounded-none border border-stone-800">
                  <MapPin className={`w-6 h-6 text-${theme}-500`} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-serif mb-1">Area</h4>
                  <p className="text-stone-400">{BRAND.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-900 p-8 md:p-10 border border-stone-800">
            {successMessage ? (
                <div className="bg-green-900/30 border border-green-800 p-6 text-center">
                    <h3 className="text-xl font-serif text-white font-bold mb-2">Message Sent!</h3>
                    <p className="text-stone-300">{successMessage}</p>
                    <button 
                        onClick={() => setSuccessMessage(null)}
                        className={`mt-6 text-${theme}-500 hover:text-${theme}-400 font-bold uppercase text-sm tracking-wider`}
                    >
                        Send Another Message
                    </button>
                </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-400 mb-2 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formState.name}
                  onChange={e => setFormState({...formState, name: e.target.value})}
                  className={`w-full bg-stone-950 border border-stone-800 text-white px-4 py-3 focus:outline-none focus:border-${theme}-600 focus:ring-1 focus:ring-${theme}-600 transition-colors`}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-400 mb-2 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formState.email}
                  onChange={e => setFormState({...formState, email: e.target.value})}
                  className={`w-full bg-stone-950 border border-stone-800 text-white px-4 py-3 focus:outline-none focus:border-${theme}-600 focus:ring-1 focus:ring-${theme}-600 transition-colors ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-stone-400 mb-2 uppercase tracking-wide">Interested In</label>
                <select
                  id="service"
                  value={formState.service}
                  onChange={e => setFormState({...formState, service: e.target.value})}
                  className={`w-full bg-stone-950 border border-stone-800 text-white px-4 py-3 focus:outline-none focus:border-${theme}-600 focus:ring-1 focus:ring-${theme}-600 transition-colors`}
                >
                  <option>Sports Photography - Game Day Package</option>
                  <option>Family Portrait Session</option>
                  <option>Wildlife Photography/Prints</option>
                  <option>Real Estate Photography</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-400 mb-2 uppercase tracking-wide">Message (Project Details)</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                  className={`w-full bg-stone-950 border border-stone-800 text-white px-4 py-3 focus:outline-none focus:border-${theme}-600 focus:ring-1 focus:ring-${theme}-600 transition-colors`}
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                 <label className="block text-sm font-medium text-stone-400 mb-2 uppercase tracking-wide">Project Image (Optional)</label>
                 <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded p-6 text-center transition-all ${
                        isDragging ? `border-${theme}-500 bg-${theme}-500/10` : 'border-stone-800 hover:border-stone-600'
                    } ${selectedFile ? 'bg-stone-800/50' : ''}`}
                 >
                    {selectedFile ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded bg-${theme}-900/50 text-${theme}-400`}>
                                    <Upload size={16} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm text-white font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                                    <p className="text-xs text-stone-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={removeFile}
                                className="p-1 hover:bg-stone-700 rounded transition-colors text-stone-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Upload className="mx-auto h-8 w-8 text-stone-500 mb-2" />
                            <p className="text-stone-300 text-sm font-medium">Drag & drop an image here</p>
                            <p className="text-stone-500 text-xs mt-1 mb-3">or click to browse (Max 10MB)</p>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                onChange={handleFileSelect}
                            />
                            <label
                                htmlFor="file-upload"
                                className={`cursor-pointer inline-block px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors`}
                            >
                                Browse Files
                            </label>
                        </div>
                    )}
                 </div>
                 {formErrors.file && <p className="text-red-500 text-xs mt-1">{formErrors.file}</p>}
              </div>

              {apiError && (
                  <div className="bg-red-900/20 border border-red-900 p-3 text-red-200 text-sm">
                      Error: {apiError}
                  </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-${theme}-600 hover:bg-${theme}-500 text-white font-bold py-4 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                ) : (
                    <>
                        Send Message <Send className="w-4 h-4" />
                    </>
                )}
              </button>
            </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

