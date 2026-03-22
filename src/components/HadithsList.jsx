import React, { useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';

export default function HadithsList({ selectedLang, uiTexts, setSelectedHadith, hadiths }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHadiths = hadiths.filter((hadith) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = hadith.title[selectedLang]?.toLowerCase().includes(term);
    const textMatch = hadith.text[selectedLang]?.toLowerCase().includes(term);
    return titleMatch || textMatch;
  });

  return (
    <div className="p-6 pb-24 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{uiTexts[selectedLang].selectHadith}</h2>
      
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Suchen..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-gray-700 outline-none focus:border-yellow-300 transition-colors"
        />
      </div>

      {filteredHadiths.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Keine Ergebnisse gefunden.</p>
      ) : (
        filteredHadiths.map((hadith) => (
          <button
            key={hadith.id}
            onClick={() => setSelectedHadith(hadith)}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center gap-4 hover:border-yellow-300 transition-all text-left cursor-pointer"
          >
            <div className="text-4xl bg-yellow-50 p-2 rounded-xl">{hadith.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">{hadith.title[selectedLang]}</h3>
              <p className="text-xs text-yellow-600 font-medium mt-1">{uiTexts[selectedLang].source}: {hadith.source}</p>
            </div>
            <ChevronLeft className="text-gray-400 rotate-180 flex-shrink-0" />
          </button>
        ))
      )}
    </div>
  );
}
