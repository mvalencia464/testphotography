
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { BRAND } from '../constants';
import { useSiteConfig } from '../context/SiteConfigContext';

export const Contact: React.FC = () => {
  const { config } = useSiteConfig();
  const theme = config.themeColor;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: 'Sports Photography - Game Day Package',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert("Thank you for your message! Mark will be in touch shortly.");
    setFormState({ name: '', email: '', service: 'Sports Photography', message: '' });
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
                  className={`w-full bg-stone-950 border border-stone-800 text-white px-4 py-3 focus:outline-none focus:border-${theme}-600 focus:ring-1 focus:ring-${theme}-600 transition-colors`}
                />
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
                <label htmlFor="message" className="block text-sm font-medium text-stone-400 mb-2 uppercase tracking-wide">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                  className={`w-full bg-stone-950 border border-stone-800 text-white px-4 py-3 focus:outline-none focus:border-${theme}-600 focus:ring-1 focus:ring-${theme}-600 transition-colors`}
                ></textarea>
              </div>

              <button
                type="submit"
                className={`w-full bg-${theme}-600 hover:bg-${theme}-500 text-white font-bold py-4 uppercase tracking-widest transition-colors flex items-center justify-center gap-2`}
              >
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
