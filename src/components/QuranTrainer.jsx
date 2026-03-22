import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Play, Pause, Loader2, Music, CheckCircle2, Repeat } from 'lucide-react';

const SHORT_SURAHS = [
  { id: 114, name: { de: "An-Nas", al: "En-Nas", tr: "Nas" }, icon: "👐" },
  { id: 113, name: { de: "Al-Falaq", al: "El-Felek", tr: "Felak" }, icon: "🌅" },
  { id: 112, name: { de: "Al-Ikhlas", al: "El-Ihlas", tr: "İhlas" }, icon: "☝️" },
  { id: 111, name: { de: "Al-Masad", al: "El-Mesed", tr: "Tebbet" }, icon: "🔥" },
  { id: 110, name: { de: "An-Nasr", al: "En-Nasr", tr: "Nasr" }, icon: "🏳️" },
  { id: 109, name: { de: "Al-Kafirun", al: "El-Kafirun", tr: "Kafirun" }, icon: "🚫" },
  { id: 108, name: { de: "Al-Kawthar", al: "El-Keuther", tr: "Kevser" }, icon: "⛲" },
  { id: 107, name: { de: "Al-Ma'un", al: "El-Maun", tr: "Maun" }, icon: "🙏" },
  { id: 106, name: { de: "Quraish", al: "Kurajsh", tr: "Kureyş" }, icon: "🐫" },
  { id: 105, name: { de: "Al-Fil", al: "El-Fil", tr: "Fil" }, icon: "🐘" },
];

export default function QuranTrainer({ selectedLang, setSelectedFeature, isDarkMode, addXp }) {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (selectedSurah) {
      fetchSurah(selectedSurah.id);
    }
  }, [selectedSurah]);

  const fetchSurah = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`);
      const data = await response.json();
      setAyahs(data.data.ayahs);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onAyahEnd = () => {
    if (currentAyahIndex < ayahs.length - 1) {
      setCurrentAyahIndex(prev => prev + 1);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = ayahs[currentAyahIndex + 1].audio;
          audioRef.current.play();
        }
      }, 500);
    } else {
      setIsPlaying(false);
      addXp(50);
      alert(selectedLang === 'de' ? "Masha'Allah! Du hast die Sure beendet! +50 EP" : "Masha'Allah! Sure bitti! +50 XP");
    }
  };

  useEffect(() => {
    if (ayahs.length > 0 && audioRef.current) {
      audioRef.current.src = ayahs[currentAyahIndex].audio;
    }
  }, [ayahs, currentAyahIndex]);

  if (!selectedSurah) {
    return (
      <div className={`p-6 pb-24 space-y-6 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setSelectedFeature(null)} className={`p-2 rounded-full shadow-sm transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>
            <ChevronLeft size={24} />
          </button>
          <h2 className={`text-2xl font-black transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {selectedLang === 'de' ? 'Suren lernen' : selectedLang === 'al' ? 'Mëso Sura' : 'Sureleri Öğren'}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {SHORT_SURAHS.map((surah) => (
            <button
              key={surah.id}
              onClick={() => setSelectedSurah(surah)}
              className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all active:scale-[0.98] cursor-pointer ${isDarkMode ? 'bg-slate-800 border-indigo-900/30' : 'bg-white border-indigo-100 hover:border-indigo-300'}`}
            >
              <div className="text-4xl">{surah.icon}</div>
              <div className="text-center">
                <h3 className={`font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {surah.name[selectedLang]}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 pb-24 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-indigo-50/50'}`}>
      <audio ref={audioRef} onEnded={onAyahEnd} />

      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setSelectedSurah(null)} className={`p-2 rounded-full shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
        </button>
        <div className={`font-black px-4 py-1 rounded-full text-xs tracking-widest transition-colors ${isDarkMode ? 'text-indigo-400 bg-indigo-900/20' : 'text-indigo-600 bg-indigo-100'}`}>
          {selectedSurah.name[selectedLang]}
        </div>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center p-8 rounded-[3rem] shadow-xl border-2 relative transition-colors ${isDarkMode ? 'bg-slate-800 border-indigo-900/20' : 'bg-white border-indigo-100'}`}>
        {loading ? (
          <Loader2 className="animate-spin text-indigo-500" size={48} />
        ) : (
          <div className="w-full space-y-8 overflow-y-auto max-h-[60vh] py-4 scrollbar-hide">
            {ayahs.map((ayah, idx) => (
              <div 
                key={ayah.number}
                className={`text-center space-y-4 transition-all duration-300 ${idx === currentAyahIndex ? 'scale-105 opacity-100' : 'opacity-40 scale-95 blur-[1px]'}`}
              >
                <p className={`text-4xl font-arabic leading-relaxed ${idx === currentAyahIndex ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-700') : (isDarkMode ? 'text-slate-400' : 'text-slate-300')}`} dir="rtl">
                  {ayah.text}
                </p>
                {idx === currentAyahIndex && (
                  <div className={`text-xs px-3 py-1 rounded-full w-fit mx-auto ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-indigo-50 text-indigo-400'}`}>
                    Vers {ayah.numberInSurah}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center gap-6">
           <button 
             onClick={() => setCurrentAyahIndex(prev => Math.max(0, prev - 1))}
             disabled={currentAyahIndex === 0}
             className={`p-3 rounded-full transition-all ${currentAyahIndex === 0 ? 'text-slate-300' : 'text-indigo-500 hover:bg-white active:scale-90 shadow-sm'}`}
           >
             <ChevronLeft size={32} />
           </button>

           <button 
             onClick={togglePlay}
             className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-xl transform active:scale-90 transition-all"
           >
             {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
           </button>

           <button 
             onClick={() => {
               if (currentAyahIndex < ayahs.length - 1) setCurrentAyahIndex(prev => prev + 1);
             }}
             disabled={currentAyahIndex === ayahs.length - 1}
             className={`p-3 rounded-full transition-all ${currentAyahIndex === ayahs.length - 1 ? 'text-slate-300' : 'text-indigo-500 hover:bg-white active:scale-90 shadow-sm'}`}
           >
             <ChevronLeft size={32} className="rotate-180" />
           </button>
        </div>
      </div>

      <div className="mt-8 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
         <Music size={14} /> Stimme von Mishary Alafasy
      </div>
    </div>
  );
}
