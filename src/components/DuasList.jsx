import React, { useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';

export default function DuasList({ selectedLang, uiTexts, setSelectedDua, duas }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDuas = duas.filter((dua) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = dua.title[selectedLang]?.toLowerCase().includes(term);
    const meaningMatch = dua.meaning[selectedLang]?.toLowerCase().includes(term);
    const transMatch = dua.transliteration?.toLowerCase().includes(term);
    return titleMatch || meaningMatch || transMatch;
  });

  return (
    <div className="p-6 pb-24 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{uiTexts[selectedLang].selectDua}</h2>
      
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Suchen..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-gray-700 outline-none focus:border-green-300 transition-colors"
        />
      </div>

      {filteredDuas.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Keine Ergebnisse gefunden.</p>
      ) : (
        filteredDuas.map((dua) => (
          <button
            key={dua.id}
            onClick={() => setSelectedDua(dua)}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center gap-4 hover:border-green-300 transition-all text-left cursor-pointer"
          >
            <div className="text-4xl">{dua.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">{dua.title[selectedLang]}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{dua.transliteration}</p>
            </div>
            <ChevronLeft className="text-gray-400 rotate-180 flex-shrink-0" />
          </button>
        ))
      )}
    </div>
  );
}
