import React from 'react';
import { ChevronLeft, Heart } from 'lucide-react';

export default function HadithDetail({ 
  selectedHadith, 
  selectedLang, 
  setSelectedHadith, 
  isDarkMode, 
  toggleFavorite, 
  isFavorite,
  incrementStat 
}) {
  React.useEffect(() => {
    if (selectedHadith) {
      incrementStat('itemsRead');
    }
  }, [selectedHadith?.id]);

  if (!selectedHadith) return null;

  return (
    <div className={`p-6 pb-24 space-y-6 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <button 
        onClick={() => setSelectedHadith(null)}
        className={`flex flex-row items-center gap-2 font-bold mb-4 self-start px-4 py-2 rounded-full shadow-sm border transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
      >
        <ChevronLeft size={20} /> {selectedLang === 'de' ? 'Zurück' : selectedLang === 'al' ? 'Mbrapsht' : 'Geri'}
      </button>

      <div className={`rounded-3xl p-8 shadow-sm border-2 text-center space-y-6 flex-1 relative overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-800 border-yellow-900/30 shadow-slate-950/50' : 'bg-white border-yellow-100'}`}>
        <button 
          onClick={() => toggleFavorite('hadiths', selectedHadith.id)}
          className={`absolute top-6 right-6 p-2 rounded-full transition-all active:scale-125 ${isFavorite ? 'text-red-500 bg-red-50/10' : isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <Heart size={28} className={isFavorite ? 'fill-red-500' : ''} />
        </button>

        <div className="text-7xl mb-2">{selectedHadith.icon}</div>
        
        <h2 className={`text-2xl font-bold border-b-2 pb-4 transition-colors ${isDarkMode ? 'text-white border-slate-700' : 'text-gray-800 border-yellow-50'}`}>
          {selectedHadith.title[selectedLang]}
        </h2>

        <div className={`text-left p-6 rounded-2xl border transition-colors ${isDarkMode ? 'bg-yellow-900/10 border-yellow-900/30' : 'bg-yellow-50 border-yellow-100'}`}>
          <p className={`text-xl leading-relaxed font-bold italic transition-colors ${isDarkMode ? 'text-yellow-200/90' : 'text-gray-800'}`}>
            "{selectedHadith.text[selectedLang]}"
          </p>
          <p className={`text-right text-sm mt-3 font-bold transition-colors ${isDarkMode ? 'text-yellow-500/80' : 'text-yellow-600'}`}>
            – {selectedHadith.source}
          </p>
        </div>

        <div className={`text-left p-6 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-700/30 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
          <p className={`text-sm uppercase font-bold tracking-wider mb-2 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{selectedLang === 'de' ? 'Was das bedeutet:' : selectedLang === 'al' ? 'Çfarë do të thotë kjo:' : 'Bu ne anlama geliyor:'}</p>
          <p className={`text-lg leading-relaxed font-medium transition-colors ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            {selectedHadith.explanation[selectedLang]}
          </p>
        </div>
      </div>
    </div>
  );
}
