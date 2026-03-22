import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { hadiths } from '../data/hadiths';

export default function HadithsList({ selectedLang, uiTexts, setSelectedHadith }) {
  return (
    <div className="p-6 pb-24 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{uiTexts[selectedLang].selectHadith}</h2>
      {hadiths.map((hadith) => (
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
      ))}
    </div>
  );
}
