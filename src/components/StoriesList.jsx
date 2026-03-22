import React, { useState } from 'react';
import { ChevronRight, Search, Heart } from 'lucide-react';

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

  const filteredStories = stories.filter((story) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = story.title[selectedLang]?.toLowerCase().includes(term);
    const contentMatch = story.content[selectedLang]?.toLowerCase().includes(term);
    return titleMatch || contentMatch;
  });

  return (
    <div className="p-6 pb-24 space-y-4">
      <h2 className={`text-2xl font-black mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {uiTexts[selectedLang].selectStory}
      </h2>
      
      <div className="relative mb-6">
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} size={20} />
        <input 
          type="text" 
          placeholder={selectedLang === 'de' ? 'Suchen...' : selectedLang === 'al' ? 'Kërko...' : 'Ara...'}
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
            return (
              <div 
                key={story.id}
                className={`group w-full p-4 rounded-3xl border-2 flex items-center gap-4 transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
              >
                <div 
                  className="flex-1 flex items-center gap-4 cursor-pointer"
                  onClick={() => setSelectedStory(story)}
                >
                  <div className={`text-4xl p-3 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-purple-50'}`}>{story.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{story.title[selectedLang]}</h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite('stories', story.id);
                    }}
                    className={`p-2 rounded-full transition-all active:scale-125 ${isFav ? 'text-red-500 bg-red-50/10' : isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-gray-300 hover:text-gray-400'}`}
                  >
                    <Heart size={22} className={isFav ? 'fill-red-500' : ''} />
                  </button>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
