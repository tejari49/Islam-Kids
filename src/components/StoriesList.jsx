import React, { useMemo, useState } from 'react';
import { ChevronRight, Search, Heart, Sparkles } from 'lucide-react';

function getLangValue(value, lang) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.de || Object.values(value)[0] || '';
}

export default function StoriesList({ 
  selectedLang, 
  uiTexts, 
  setSelectedStory, 
  stories, 
  isDarkMode, 
  toggleFavorite, 
  favorites 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStories = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const sorted = [...stories].sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
      return a.id - b.id;
    });

    if (!term) return sorted;

    return sorted.filter((story) => {
      const haystack = [
        getLangValue(story.title, selectedLang),
        getLangValue(story.summary, selectedLang),
        getLangValue(story.background, selectedLang),
        getLangValue(story.story, selectedLang),
        getLangValue(story.lesson, selectedLang),
        getLangValue(story.content, selectedLang)
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [stories, searchTerm, selectedLang]);

  return (
    <div className="p-6 pb-24 space-y-4">
      <h2 className={`text-2xl font-black mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {uiTexts[selectedLang].selectStory}
      </h2>
      
      <div className="relative mb-6">
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} size={20} />
        <input 
          type="text" 
          placeholder={selectedLang === 'de' ? 'Suche nach Geschichte, Thema oder Lehre…' : selectedLang === 'al' ? 'Kërko histori, temë ose mësim…' : 'Hikâye, konu veya ders ara…'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full border-2 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-purple-500' : 'bg-white border-gray-100 text-gray-700 focus:border-purple-300'}`}
        />
      </div>

      {filteredStories.length === 0 ? (
        <p className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Keine Ergebnisse gefunden.</p>
      ) : (
        <div className="space-y-3">
          {filteredStories.map((story) => {
            const isFav = favorites.stories?.includes(story.id);
            const excerpt = getLangValue(story.summary, selectedLang) || getLangValue(story.content, selectedLang);
            return (
              <div 
                key={story.id}
                className={`group w-full p-4 rounded-3xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
              >
                <div 
                  className="flex-1 flex items-start gap-4 cursor-pointer"
                  onClick={() => setSelectedStory(story)}
                >
                  <div className={`text-4xl p-3 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-purple-50'}`}>{story.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={`font-bold text-lg leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{story.title[selectedLang]}</h3>
                      {story.featured && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700 border border-purple-100'}`}>
                          <Sparkles size={12} /> {selectedLang === 'de' ? 'Mehr Kontext' : selectedLang === 'al' ? 'Më shumë' : 'Daha fazla'}
                        </span>
                      )}
                    </div>
                    {excerpt && (
                      <p className={`text-sm line-clamp-2 mt-2 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{excerpt}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite('stories', story.id);
                    }}
                    className={`p-2 rounded-full transition-all active:scale-125 ${isFav ? 'text-red-500 bg-red-50/10' : isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-gray-300 hover:text-gray-400'}`}
                  >
                    <Heart size={22} className={isFav ? 'fill-red-500' : ''} />
                  </button>
                  <button
                    onClick={() => setSelectedStory(story)}
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
