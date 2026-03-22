import React, { useEffect } from 'react';
import { ChevronLeft, Heart, BookOpen, Share2 } from 'lucide-react';

export default function SureDetail({ item, onBack, selectedLang, isDarkMode, favorites, toggleFavorite, incrementStat }) {
  
  useEffect(() => {
    incrementStat('itemsRead');
  }, [incrementStat]);

  const labels = {
    de: { back: "Zurück", share: "Teilen" },
    al: { back: "Mbrapa", share: "Shpërndo" },
    tr: { back: "Geri", share: "Paylaş" }
  };

  return (
    <div className={`p-6 pb-24 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className={`p-3 rounded-2xl shadow-sm transition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button className={`p-3 rounded-2xl transition-all ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-400'}`}>
            <Share2 size={24} />
          </button>
          <button 
            onClick={() => toggleFavorite('suren', item.id)}
            className={`p-3 rounded-2xl shadow-sm transition-all active:scale-90 ${favorites.suren?.includes(item.id) ? 'bg-red-50 text-red-500' : (isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-white text-gray-300')}`}
          >
            <Heart size={24} fill={favorites.suren?.includes(item.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className={`p-8 rounded-[3rem] shadow-xl space-y-8 border-2 ${isDarkMode ? 'bg-slate-800 border-green-900/20 shadow-slate-950/50' : 'bg-white border-green-50 shadow-green-900/5'}`}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg shadow-green-500/20 animate-bounce-slow">
            <BookOpen size={40} />
          </div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title[selectedLang]}</h2>
          <div className={`px-4 py-1 rounded-full text-xs font-black tracking-widest ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'}`}>
            SURE {item.id}
          </div>
        </div>

        <div className="space-y-6">
          <div className={`p-8 rounded-[2rem] text-center space-y-6 ${isDarkMode ? 'bg-slate-900/50' : 'bg-green-50/30'}`}>
            <p className="text-4xl font-arabic leading-[4rem] text-green-600 drop-shadow-sm">{item.arabic}</p>
          </div>

          <div className="space-y-4">
            <h4 className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Bedeutung</h4>
            <p className={`text-xl leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {item.meaning[selectedLang]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
