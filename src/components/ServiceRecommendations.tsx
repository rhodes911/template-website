"use client";
import React, { useEffect, useState, useRef } from 'react';

interface ContentMetaEntry { slug: string; type: string; title: string; relatedServices: string[]; excerpt?: string }

interface Props { serviceId: string; }

export default function ServiceRecommendations({ serviceId }: Props) {
  const [content, setContent] = useState<ContentMetaEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Direct simple selection (no theme inference)
    // Try SSR-side helper via API only if needed in future; for now call local util (runs server-side only)
    fetch('/api/content-index').then(r => r.json()).then(data => {
      const entries: ContentMetaEntry[] = Array.isArray(data?.entries) ? data.entries : [];
      const picks = entries
        .filter(e => Array.isArray(e.relatedServices) && e.relatedServices.includes(serviceId))
        .slice(0,4);
      setContent(picks); // may be empty; component will hide itself
    }).catch(()=>{});
  }, [serviceId]);
  
  // Handle outside click to close panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    }
    
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  if (!content.length) return null;
  return (
    <div className="fixed right-0 bottom-28 z-50 flex items-start" ref={panelRef}>
      {/* Tab - always visible */}
      <div 
        className="bg-primary-500 text-white py-3 px-2 rounded-l-lg shadow-md cursor-pointer rotate-180 [writing-mode:vertical-lr] text-sm font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        For You
      </div>
      
      {/* Content panel - only visible when open */}
      <div className={`bg-gradient-to-br from-white to-primary-50 border-l border-t border-b border-primary-500 rounded-l-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-w-[280px] opacity-100 p-5' : 'max-w-0 opacity-0 p-0'}`}>
        <div className="w-64 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-primary-200">
            <span className="text-primary-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </span>
            <h3 className="font-bold text-primary-800">Recommended For You</h3>
          </div>
          
          <div className="space-y-3">
            {content.map(c => (
              <a
                key={c.slug}
                href={`/${c.slug}`}
                className="group block rounded-lg border border-primary-100 bg-white p-3 hover:shadow-md hover:border-primary-300 transition relative overflow-hidden"
              >
                <span className="absolute top-0 right-0 bg-primary-100 text-primary-700 text-xs px-2 py-1 font-medium rounded-bl-lg">
                  {c.type === 'blog' ? 'Blog' : c.type === 'case-study' || c.type === 'case-studies' ? 'Case Study' : c.type}
                </span>
                <div className="mt-1">
                  <h4 className="font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors text-sm mb-2">{c.title}</h4>
                  {c.excerpt && (
                    <p className="text-xs text-neutral-600 line-clamp-2">{c.excerpt}</p>
                  )}
                </div>
                <div className="flex items-center mt-2 text-xs text-primary-600 font-medium">
                  Read more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          <div className="flex justify-end pt-1">
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-xs text-primary-700 font-medium flex items-center hover:underline"
            >
              Close
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
