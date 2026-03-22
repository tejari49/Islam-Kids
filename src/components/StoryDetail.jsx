import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function StoryDetail({ selectedStory, selectedLang, setSelectedStory }) {
  if (!selectedStory) return null;

  return (
    <div className="p-6 pb-24 space-y-6 flex flex-col min-h-screen bg-gray-50">
      <button 
        onClick={() => setSelectedStory(null)}
        className="flex flex-row items-center gap-2 text-gray-600 font-bold mb-4 bg-white self-start px-4 py-2 rounded-full shadow-sm border border-gray-100 cursor-pointer"
      >
        <ChevronLeft size={20} /> Zurück
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-purple-100 text-center space-y-6 flex-1 relative overflow-hidden">
        <div className="text-7xl mb-2">{selectedStory.icon}</div>
        
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-50 pb-4">
          {selectedStory.title[selectedLang]}
        </h2>

        <div className="text-left bg-purple-50 p-6 rounded-2xl">
          <p className="text-lg text-gray-800 leading-relaxed font-medium">
            {selectedStory.content[selectedLang]}
          </p>
        </div>
      </div>
    </div>
  );
}
