import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function HadithDetail({ selectedHadith, selectedLang, setSelectedHadith }) {
  if (!selectedHadith) return null;

  return (
    <div className="p-6 pb-24 space-y-6 flex flex-col min-h-screen bg-gray-50">
      <button 
        onClick={() => setSelectedHadith(null)}
        className="flex flex-row items-center gap-2 text-gray-600 font-bold mb-4 bg-white self-start px-4 py-2 rounded-full shadow-sm border border-gray-100 cursor-pointer"
      >
        <ChevronLeft size={20} /> Zurück
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-yellow-100 text-center space-y-6 flex-1 relative overflow-hidden">
        <div className="text-7xl mb-2">{selectedHadith.icon}</div>
        
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-yellow-50 pb-4">
          {selectedHadith.title[selectedLang]}
        </h2>

        <div className="text-left bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
          <p className="text-xl text-gray-800 leading-relaxed font-bold italic">
            "{selectedHadith.text[selectedLang]}"
          </p>
          <p className="text-right text-sm text-yellow-600 mt-2 font-medium">
            – {selectedHadith.source}
          </p>
        </div>

        <div className="text-left bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-2">Was das bedeutet:</p>
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            {selectedHadith.explanation[selectedLang]}
          </p>
        </div>
      </div>
    </div>
  );
}
