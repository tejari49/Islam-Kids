import React from 'react';
import { ChevronLeft, Heart } from 'lucide-react';

export default function StoryDetail({ 
  selectedStory, 
  selectedLang, 
  setSelectedStory, 
  isDarkMode, 
  toggleFavorite, 
  isFavorite,
  incrementStat 
}) {
  React.useEffect(() => {
    if (selectedStory) {
      incrementStat('itemsRead');
    }
  }, [selectedStory?.id]);

  if (!selectedStory) return null;

  return (
    <div className={`p-6 pb-24 space-y-6 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <button 
        onClick={() => setSelectedStory(null)}
        className={`flex flex-row items-center gap-2 font-bold mb-4 self-start px-4 py-2 rounded-full shadow-sm border transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
      >
        <ChevronLeft size={20} /> {selectedLang === 'de' ? 'Zurück' : selectedLang === 'al' ? 'Mbrapsht' : 'Geri'}
      </button>

      <div className={`rounded-3xl p-8 shadow-sm border-2 text-center space-y-6 flex-1 relative overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-800 border-purple-900/30 shadow-slate-950/50' : 'bg-white border-purple-100'}`}>
        <button 
          onClick={() => toggleFavorite('stories', selectedStory.id)}
          className={`absolute top-6 right-6 p-2 rounded-full transition-all active:scale-125 ${isFavorite ? 'text-red-500 bg-red-50/10' : isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <Heart size={28} className={isFavorite ? 'fill-red-500' : ''} />
        </button>

        <div className="text-7xl mb-2">{selectedStory.icon}</div>
        
        <h2 className={`text-2xl font-bold border-b-2 pb-4 transition-colors ${isDarkMode ? 'text-white border-slate-700' : 'text-gray-800 border-purple-50'}`}>
          {selectedStory.title[selectedLang]}
        </h2>

        <div className={`text-left p-6 rounded-2xl border transition-colors ${isDarkMode ? 'bg-purple-900/10 border-purple-900/30' : 'bg-purple-50 border-purple-100'}`}>
          <p className={`text-lg leading-relaxed font-medium transition-colors ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
            {selectedStory.content[selectedLang]}
          </p>
        </div>
      </div>
    </div>
  );
}
