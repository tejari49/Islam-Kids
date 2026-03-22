import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Play, Pause, Loader2, Heart } from 'lucide-react';

export default function DuaDetail({ 
  selectedDua, 
  selectedLang, 
  uiTexts, 
  setSelectedDua, 
  isDarkMode, 
  toggleFavorite, 
  isFavorite,
  incrementStat
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (selectedDua && !hasIncremented.current) {
      incrementStat('itemsRead');
      hasIncremented.current = true;
    }
  }, [selectedDua?.id, incrementStat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsLoadingAudio(false);
    setCurrentAudioUrl(null);
  }, [selectedDua]);

  const toggleAudio = async () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (currentAudioUrl) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Fehler beim Abspielen:", err);
      }
      return;
    }

    setIsLoadingAudio(true);
    
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${selectedDua.ayah}/ar.alafasy`);
      const data = await response.json();
      const urlToPlay = data.data.audio;

      setCurrentAudioUrl(urlToPlay);
      
      audioRef.current.src = urlToPlay;
      audioRef.current.load();
      
      await audioRef.current.play();
      setIsPlaying(true);

    } catch (error) {
      console.error("Fehler beim Laden des Audios:", error);
      alert("Audio konnte nicht geladen werden. Bitte überprüfe deine Internetverbindung.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  if (!selectedDua) return null;

  return (
    <div className={`p-6 pb-24 space-y-6 flex flex-col min-h-screen relative transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setSelectedDua(null)}
          className={`flex flex-row items-center gap-2 font-bold px-4 py-2 rounded-full shadow-sm border transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
        >
          <ChevronLeft size={20} /> {selectedLang === 'de' ? 'Zurück' : selectedLang === 'al' ? 'Mbrapsht' : 'Geri'}
        </button>
        {selectedDua.ayah && selectedDua.ayah !== "" && (
          <button 
            onClick={toggleAudio}
            disabled={isLoadingAudio}
            className={`flex flex-row items-center gap-2 px-5 py-2 rounded-full shadow-sm font-bold text-white transition-all transform active:scale-95 cursor-pointer ${
              isLoadingAudio ? 'bg-gray-400' : isPlaying ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isLoadingAudio ? (
              <Loader2 size={20} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-1" />
            )}
            {uiTexts[selectedLang].listen || 'Anhören'}
          </button>
        )}
      </div>

      <div className={`rounded-3xl p-8 shadow-sm border-2 text-center space-y-8 flex-1 relative transition-colors ${isDarkMode ? 'bg-slate-800 border-green-900/30 shadow-slate-950/50' : 'bg-white border-green-100'}`}>
        <button 
          onClick={() => toggleFavorite('duas', selectedDua.id)}
          className={`absolute top-6 right-6 p-2 rounded-full transition-all active:scale-125 ${isFavorite ? 'text-red-500 bg-red-50/10' : isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <Heart size={28} className={isFavorite ? 'fill-red-500' : ''} />
        </button>

        <div className="text-6xl mb-4">{selectedDua.icon}</div>
        
        <h2 className={`text-2xl font-bold border-b-2 pb-4 transition-colors ${isDarkMode ? 'text-white border-slate-700' : 'text-gray-800 border-gray-100'}`}>
          {selectedDua.title[selectedLang]}
        </h2>

        <div className="space-y-6 py-4">
          <p className={`text-4xl font-arabic leading-relaxed transition-colors ${isDarkMode ? 'text-green-400' : 'text-green-700'}`} dir="rtl">
            {selectedDua.arabic}
          </p>
          
          {selectedDua.transliteration && (
            <div className={`p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Aussprache</p>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{selectedDua.transliteration}</p>
            </div>
          )}

          <div className={`p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
            <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-blue-400/60' : 'text-blue-400'}`}>Bedeutung</p>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{selectedDua.meaning[selectedLang]}</p>
          </div>

          {selectedDua.source && (
            <div className={`p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-emerald-400/60' : 'text-emerald-500'}`}>Quelle</p>
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{selectedDua.source}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
