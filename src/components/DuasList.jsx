import React, { useMemo, useState } from 'react';
import { ChevronRight, Search, Heart, Volume2 } from 'lucide-react';

function getLangValue(value, lang) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.de || Object.values(value)[0] || '';
}

export default function DuasList({ 
  selectedLang, 
  uiTexts, 
  setSelectedDua, 
  duas, 
  isDarkMode, 
  toggleFavorite, 
  favorites 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDuas = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const list = [...duas].sort((a, b) => a.id - b.id);

    if (!term) return list;

    return list.filter((dua) => {
      const fields = [
        getLangValue(dua.title, selectedLang),
        getLangValue(dua.meaning, selectedLang),
        getLangValue(dua.explanation, selectedLang),
        getLangValue(dua.when, selectedLang),
        getLangValue(dua.pronunciation, selectedLang),
        getLangValue(dua.transliteration, selectedLang)
      ]
        .join(' ')
        .toLowerCase();

      return fields.includes(term);
    });
  }, [duas, searchTerm, selectedLang]);

  return (
    <div className="p-6 pb-24 space-y-4">
      <h2 className={`text-2xl font-black mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {uiTexts[selectedLang].selectDua}
      </h2>
      
      <div className="relative mb-6">
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} size={20} />
        <input 
          type="text" 
          placeholder={selectedLang === 'de' ? 'Suche nach Dua, Bedeutung oder Situation…' : selectedLang === 'al' ? 'Kërko dua, kuptim ose situatë…' : 'Dua, anlam veya durum ara…'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full border-2 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-green-500' : 'bg-white border-gray-100 text-gray-700 focus:border-green-300'}`}
        />
      </div>

      {filteredDuas.length === 0 ? (
        <p className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Keine Ergebnisse gefunden.</p>
      ) : (
        <div className="space-y-3">
          {filteredDuas.map((dua) => {
            const isFav = favorites.duas?.includes(dua.id);
            const whenText = getLangValue(dua.when, selectedLang);
            const pronunciation = getLangValue(dua.pronunciation, selectedLang) || getLangValue(dua.transliteration, selectedLang);
            const hasAudio = Boolean(dua.ayah || dua.audioAyahs?.length);

            return (
              <div 
                key={dua.id}
                className={`group w-full p-4 rounded-3xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
              >
                <div 
                  className="flex-1 flex items-start gap-4 cursor-pointer"
                  onClick={() => setSelectedDua(dua)}
                >
                  <div className={`text-3xl p-3 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-green-50'}`}>{dua.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={`font-bold text-lg leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{dua.title[selectedLang]}</h3>
                      {hasAudio && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                          <Volume2 size={12} /> API
                        </span>
                      )}
                    </div>
                    {pronunciation && (
                      <p className={`text-sm line-clamp-1 mt-1 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{pronunciation}</p>
                    )}
                    {whenText && (
                      <p className={`text-xs mt-2 line-clamp-2 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{whenText}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite('duas', dua.id);
                    }}
                    className={`p-2 rounded-full transition-all active:scale-125 ${isFav ? 'text-red-500 bg-red-50/10' : isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-gray-300 hover:text-gray-400'}`}
                  >
                    <Heart size={22} className={isFav ? 'fill-red-500' : ''} />
                  </button>
                  <button
                    onClick={() => setSelectedDua(dua)}
                    className={`p-2 rounded-full ${isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-300 hover:bg-gray-50'} transition-colors`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
