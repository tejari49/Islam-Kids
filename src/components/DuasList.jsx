import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { duas } from '../data/duas';

export default function DuasList({ selectedLang, uiTexts, setSelectedDua }) {
  return (
    <div className="p-6 pb-24 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{uiTexts[selectedLang].selectDua}</h2>
      {duas.map((dua) => (
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
      ))}
    </div>
  );
}
