
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit2, Check, X } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { SiteContent } from '../types';

interface EditableTextProps {
  contentKey: keyof SiteContent;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  contentKey, 
  className = '', 
  as: Tag = 'div',
  multiline = false
}) => {
  const { isAuthenticated } = useAuth();
  const { config, updateContent } = useSiteConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(config.content[contentKey]);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync value if config changes externally (e.g. AI generation)
  useEffect(() => {
    setValue(config.content[contentKey]);
  }, [config.content, contentKey]);

  // Focus on edit
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateContent({ [contentKey]: value });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(config.content[contentKey]);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isAuthenticated) {
    return <Tag className={className}>{config.content[contentKey]}</Tag>;
  }

  if (isEditing) {
    return (
      <div className={`relative group ${multiline ? 'w-full' : 'inline-block'}`}>
        {multiline ? (
          <textarea
            ref={inputRef as any}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full bg-stone-800 text-white p-3 rounded outline-none border-2 border-amber-500 shadow-xl ${className}`}
            rows={6}
          />
        ) : (
          <input
            ref={inputRef as any}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`min-w-[200px] w-full bg-stone-800 text-white p-2 rounded outline-none border-2 border-amber-500 shadow-xl ${className}`}
          />
        )}
        <div className="absolute top-full right-0 mt-2 flex gap-2 z-50">
          <button 
            onClick={handleSave} 
            className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            <Check size={14} /> Save
          </button>
          <button 
            onClick={handleCancel} 
            className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-white text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            <X size={14} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${multiline ? 'block' : 'inline-block'}`}>
      <Tag 
        className={`${className} cursor-text border-2 border-transparent hover:border-amber-500/30 hover:bg-amber-500/5 rounded transition-all px-1 -mx-1`}
        onClick={(e: React.MouseEvent) => {
             e.preventDefault(); 
             setIsEditing(true);
        }}
        title="Click to edit"
      >
        {config.content[contentKey]}
      </Tag>
      <span className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-600 text-white p-1.5 rounded-full pointer-events-none shadow-lg z-10">
        <Edit2 size={12} />
      </span>
    </div>
  );
};
