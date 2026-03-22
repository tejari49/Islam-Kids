import React, { useMemo } from 'react';
import { Sparkles, ChevronRight, Calendar } from 'lucide-react';

export default function Home({ selectedLang, uiTexts, setSelectedDua, setSelectedStory, setSelectedHadith, setSelectedFeature, duas, hadiths, stories }) {
  
  // Funktion zur Berechnung des "täglichen" Index basierend auf dem Datum
  const dailyIndices = useMemo(() => {
    const today = new Date();
    // Nutze Jahr, Monat und Tag, um jeden Tag genau eine feste Nummer zu bekommen
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    return {
      dua: duas.length > 0 ? seed % duas.length : 0,
      hadith: hadiths.length > 0 ? seed % hadiths.length : 0,
      story: stories.length > 0 ? seed % stories.length : 0
    };
  }, [duas.length, hadiths.length, stories.length]);

  const dailyDua = duas[dailyIndices.dua];
  const dailyHadith = hadiths[dailyIndices.hadith];
  const dailyStory = stories[dailyIndices.story];

  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-6 rounded-3xl text-white shadow-lg text-center relative overflow-hidden">
        <Sparkles className="absolute top-2 right-2 opacity-20" size={48} />
        <h1 className="text-2xl font-bold mb-2 relative z-10">{uiTexts[selectedLang].welcome}</h1>
        <p className="text-green-50 opacity-90 relative z-10 font-medium flex items-center justify-center gap-2">
          <Calendar size={16} /> Heutige Auswahl
        </p>
      </div>

      <div className="space-y-4">
        {/* Dua des Tages */}
        {dailyDua && (
          <div className="bg-white rounded-3xl shadow-sm border-2 border-green-100 overflow-hidden">
            <div className="bg-green-50 px-4 py-2 text-xs font-bold text-green-600 uppercase tracking-wider">
              Dua des Tages
            </div>
            <button 
              onClick={() => setSelectedDua(dailyDua)}
              className="w-full text-left p-4 flex items-center gap-4 hover:bg-green-50/50 transition-colors cursor-pointer"
            >
              <div className="text-4xl">{dailyDua.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{dailyDua.title[selectedLang]}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{dailyDua.transliteration}</p>
              </div>
              <ChevronRight className="text-gray-400 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Hadith des Tages */}
        {dailyHadith && (
          <div className="bg-white rounded-3xl shadow-sm border-2 border-yellow-100 overflow-hidden">
            <div className="bg-yellow-50 px-4 py-2 text-xs font-bold text-yellow-600 uppercase tracking-wider">
              Hadith des Tages
            </div>
            <button 
              onClick={() => setSelectedHadith(dailyHadith)}
              className="w-full text-left p-4 flex items-center gap-4 hover:bg-yellow-50/50 transition-colors cursor-pointer"
            >
              <div className="text-4xl bg-yellow-50 p-2 rounded-xl">{dailyHadith.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{dailyHadith.title[selectedLang]}</h3>
              </div>
              <ChevronRight className="text-gray-400 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Geschichte des Tages */}
        {dailyStory && (
          <div className="bg-white rounded-3xl shadow-sm border-2 border-purple-100 overflow-hidden">
            <div className="bg-purple-50 px-4 py-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
              Geschichte des Tages
            </div>
            <button 
              onClick={() => setSelectedStory(dailyStory)}
              className="w-full text-left p-4 flex items-center gap-4 hover:bg-purple-50/50 transition-colors cursor-pointer"
            >
              <div className="text-4xl bg-purple-50 p-3 rounded-xl">{dailyStory.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 leading-tight">{dailyStory.title[selectedLang]}</h3>
              </div>
              <ChevronRight className="text-gray-400 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Beten lernen Button (Neu) */}
        <div className="bg-white rounded-3xl shadow-sm border-2 border-blue-100 overflow-hidden">
          <div className="bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            {selectedLang === 'de' ? 'Praxis' : selectedLang === 'al' ? 'Praktika' : 'Pratik'}
          </div>
          <button 
            onClick={() => setSelectedFeature('prayer')}
            className="w-full text-left p-4 flex items-center gap-4 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <div className="text-4xl bg-blue-50 p-2 rounded-xl">🤲</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{selectedLang === 'de' ? 'Beten lernen' : selectedLang === 'al' ? 'Mëso të falesh' : 'Namaz kılmayı öğren'}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{selectedLang === 'de' ? 'Schritt für Schritt Anleitung' : selectedLang === 'al' ? 'Udhëzues hap pas hapi' : 'Adım adım rehber'}</p>
            </div>
            <ChevronRight className="text-gray-400 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
