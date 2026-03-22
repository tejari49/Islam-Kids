import React, { useState } from 'react';
import { Search, Heart, ChevronRight, BookOpen } from 'lucide-react';

export default function SurenList({ suren, onSelect, selectedLang, isDarkMode, favorites, toggleFavorite }) {
  const [search, setSearch] = useState("");

  const filtered = suren.filter(item => 
    item.title[selectedLang].toLowerCase().includes(search.toLowerCase()) ||
    (item.arabic && item.arabic.includes(search))
  );

  const labels = {
    de: { title: "Alle Suren", search: "Suchen...", type: "Qur'an-Sure" },
    al: { title: "Të gjitha Suret", search: "Kërko...", type: "Sure e Kuranit" },
    tr: { title: "Tüm Sureler", search: "Ara...", type: "Kur'an suresi" }
  };

  return (
    <div className={`p-6 pb-24 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-500 rounded-2xl text-white shadow-lg shadow-green-500/20">
          <BookOpen size={28} />
        </div>
        <h1 className="text-3xl font-black">{labels[selectedLang].title}</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder={labels[selectedLang].search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-12 pr-4 py-4 rounded-3xl border-2 transition-all outline-none focus:ring-4 focus:ring-green-500/10 ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500' : 'bg-white border-green-50 focus:border-green-200'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-green-900/40' : 'bg-white border-green-50 hover:border-green-100 shadow-sm'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black ${isDarkMode ? 'bg-slate-700 text-green-400' : 'bg-green-50 text-green-600'}`}>
              {item.id}
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-0.5">{item.title[selectedLang]}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>{labels[selectedLang].type}</p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite('suren', item.id); }}
                className={`p-2 rounded-xl transition-all ${favorites.suren?.includes(item.id) ? 'bg-red-50 text-red-500' : (isDarkMode ? 'text-slate-600' : 'text-gray-200 hover:text-red-300')}`}
              >
                <Heart size={22} fill={favorites.suren?.includes(item.id) ? "currentColor" : "none"} />
              </button>
              <ChevronRight size={20} className={isDarkMode ? 'text-slate-600' : 'text-gray-300'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
