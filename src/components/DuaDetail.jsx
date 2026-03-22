import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Play, Pause, Loader2 } from 'lucide-react';

export default function DuaDetail({ selectedDua, selectedLang, uiTexts, setSelectedDua }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const audioRef = useRef(null);

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
    <div className="p-6 pb-24 space-y-6 flex flex-col min-h-screen bg-gray-50 relative">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setSelectedDua(null)}
          className="flex flex-row items-center gap-2 text-gray-600 font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 cursor-pointer"
        >
          <ChevronLeft size={20} /> Zurück
        </button>
        
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
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-green-100 text-center space-y-8 flex-1">
        <div className="text-6xl mb-4">{selectedDua.icon}</div>
        
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-100 pb-4">
          {selectedDua.title[selectedLang]}
        </h2>

        <div className="space-y-6 py-4">
          <p className="text-4xl font-arabic text-green-700 leading-relaxed" dir="rtl">
            {selectedDua.arabic}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Aussprache</p>
            <p className="text-lg font-medium text-gray-800">{selectedDua.transliteration}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-400 uppercase font-bold tracking-wider mb-1">Bedeutung</p>
            <p className="text-lg font-medium text-gray-800">{selectedDua.meaning[selectedLang]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
