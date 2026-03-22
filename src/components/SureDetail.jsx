import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, Heart, BookOpen, Share2, Play, Pause, Loader2, Volume2 } from 'lucide-react';

export default function SureDetail({ item, onBack, selectedLang, isDarkMode, favorites, toggleFavorite, incrementStat }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [pronunciation, setPronunciation] = useState('');
  const audioRef = useRef(null);

  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!hasIncremented.current) {
      incrementStat('itemsRead');
      hasIncremented.current = true;
    }
  }, [incrementStat]);

  useEffect(() => {
    let isCancelled = false;

    const loadPronunciation = async () => {
      if (item.id > 114) {
        setPronunciation('');
        return;
      }

      try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${item.id}`);
        const data = await response.json();
        if (!isCancelled) {
          setPronunciation(data?.data?.englishName || '');
        }
      } catch (error) {
        console.error("Fehler beim Laden der Suren-Aussprache:", error);
        if (!isCancelled) {
          setPronunciation('');
        }
      }
    };

    loadPronunciation();

    return () => {
      isCancelled = true;
    };
  }, [item.id]);

  // Audio Logic
  useEffect(() => {
    if (item.id <= 114) {
      const paddedId = item.id.toString().padStart(3, '0');
      // Alternative stable source
      const audioUrl = `https://server8.mp3quran.net/afs/${paddedId}.mp3`;
      audioRef.current = new Audio(audioUrl);
      audioRef.current.crossOrigin = "anonymous";

      const audio = audioRef.current;
      
      const setAudioData = () => setDuration(audio.duration);
      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const setBuffering = () => setIsBuffering(true);
      const clearBuffering = () => setIsBuffering(false);
      const onEnded = () => setIsPlaying(false);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('waiting', setBuffering);
      audio.addEventListener('playing', clearBuffering);
      audio.addEventListener('canplay', clearBuffering);
      audio.addEventListener('ended', onEnded);

      return () => {
        audio.pause();
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('waiting', setBuffering);
        audio.removeEventListener('playing', clearBuffering);
        audio.removeEventListener('canplay', clearBuffering);
        audio.removeEventListener('ended', onEnded);
      };
    }
  }, [item.id]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const labels = {
    de: { back: "Zurück", share: "Teilen", listen: "Anhören", meaning: "Bedeutung", verses: "Verse", revelation: "Offenbarung", pronunciation: "Aussprache" },
    al: { back: "Mbrapa", share: "Shpërndo", listen: "Dëgjo", meaning: "Kuptimi", verses: "Ajete", revelation: "Shpallja", pronunciation: "Shqiptimi" },
    tr: { back: "Geri", share: "Paylaş", listen: "Dinle", meaning: "Anlamı", verses: "Ayet", revelation: "Nüzul", pronunciation: "Okunuş" }
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
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg shadow-green-500/20">
            <BookOpen size={40} />
          </div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title[selectedLang]}</h2>
          <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'}`}>
            SURE {item.id}
          </div>
          {(item.verses || item.revelation) && (
            <div className="flex flex-wrap justify-center gap-2">
              {item.verses && (
                <div className={`px-4 py-2 rounded-full text-xs font-bold ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
                  {labels[selectedLang].verses}: {item.verses}
                </div>
              )}
              {item.revelation && (
                <div className={`px-4 py-2 rounded-full text-xs font-bold ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
                  {labels[selectedLang].revelation}: {item.revelation}
                </div>
              )}
            </div>
          )}
          {pronunciation && (
            <div className={`w-full p-4 rounded-[1.5rem] border text-center ${isDarkMode ? 'bg-slate-900/40 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                {labels[selectedLang].pronunciation}
              </p>
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                {pronunciation}
              </p>
            </div>
          )}
        </div>

        {/* Audio Player UI */}
        {item.id <= 114 && (
          <div className={`p-6 rounded-[2rem] border-2 transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-700' : 'bg-gray-50/50 border-gray-100'}`}>
            <div className="flex items-center gap-5">
              <button 
                onClick={togglePlay}
                disabled={isBuffering && !isPlaying}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${
                  isPlaying ? 'bg-red-500 shadow-red-500/20' : 'bg-green-500 shadow-green-500/20'
                } text-white`}
              >
                {isBuffering && !isPlaying ? (
                  <Loader2 className="animate-spin" size={32} />
                ) : isPlaying ? (
                  <Pause size={32} />
                ) : (
                  <Play size={32} className="ml-1" />
                )}
              </button>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                  <span className="flex items-center gap-1"><Volume2 size={12} /> {labels[selectedLang].listen}</span>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-2 rounded-full bg-gray-200 accent-green-500 cursor-pointer appearance-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {item.arabic && (
            <div className={`p-8 rounded-[2rem] text-center space-y-6 ${isDarkMode ? 'bg-slate-900/50' : 'bg-green-50/30'}`}>
              <p className="text-4xl font-arabic leading-[4rem] text-green-600 drop-shadow-sm">{item.arabic}</p>
            </div>
          )}

          <div className="space-y-4">
            <h4 className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels[selectedLang].meaning}</h4>
            <p className={`text-xl leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              {item.meaning[selectedLang]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
