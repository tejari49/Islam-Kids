import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, Play, Pause, Loader2, Music, Search } from 'lucide-react';
import { fetchAyahBundle, fetchSurahBundle } from '../utils/quranAudio';

const SHORT_SURAH_IDS = [114, 113, 112, 111, 110, 109, 108, 107, 106, 105];

const LABELS = {
  de: {
    title: 'Suren lernen',
    search: 'Sure suchen …',
    featured: 'Empfohlene Lernsuren',
    all: 'Alle Suren',
    verse: 'Vers',
    reciter: 'Stimme von Mishary Alafasy',
    complete: 'vollständig',
    loading: 'Sure wird geladen …',
    done: 'Masha’Allah! Du hast die Sure beendet! +50 EP',
    meaningTitle: 'Bedeutung der Sure',
    liveWord: 'Aktives Wort'
  },
  al: {
    title: 'Mëso Sura',
    search: 'Kërko suren …',
    featured: 'Sure të rekomanduara',
    all: 'Të gjitha Suret',
    verse: 'Ajeti',
    reciter: 'Zëri i Mishary Alafasy',
    complete: 'e plotë',
    loading: 'Sureja po ngarkohet …',
    done: 'Masha’Allah! E përfundove suren! +50 XP',
    meaningTitle: 'Kuptimi i sures',
    liveWord: 'Fjala aktive'
  },
  tr: {
    title: 'Sureleri Öğren',
    search: 'Sure ara …',
    featured: 'Önerilen kısa sureler',
    all: 'Tüm Sureler',
    verse: 'Ayet',
    reciter: 'Mishary Alafasy kıraati',
    complete: 'tamamı',
    loading: 'Sure yükleniyor …',
    done: 'Masha’Allah! Sureyi tamamladın! +50 XP',
    meaningTitle: 'Surenin anlamı',
    liveWord: 'Aktif kelime'
  }
};

function tokenizeArabic(text = '') {
  return text
    .split(/(\s+)/)
    .filter((token) => token.length > 0)
    .map((token) => ({ text: token, isSpace: /^\s+$/.test(token) }));
}

export default function QuranTrainer({ selectedLang, setSelectedFeature, isDarkMode, addXp, suren = [] }) {
  const labels = LABELS[selectedLang] || LABELS.de;
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahBundle, setSurahBundle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState('');
  const audioRef = useRef(null);

  const featuredSurahs = useMemo(() => suren.filter((surah) => SHORT_SURAH_IDS.includes(surah.id)), [suren]);
  const filteredAllSurahs = useMemo(() => suren.filter((surah) =>
    surah.title[selectedLang].toLowerCase().includes(search.toLowerCase()) ||
    surah.arabic?.includes(search)
  ), [suren, selectedLang, search]);

  useEffect(() => {
    let cancelled = false;

    const loadSelectedSurah = async () => {
      if (!selectedSurah) return;

      setLoading(true);
      setCurrentAyahIndex(0);
      setCurrentWordIndex(-1);
      setIsPlaying(false);

      try {
        const bundle = await fetchSurahBundle(selectedSurah.id, selectedLang);
        if (!cancelled) {
          setSurahBundle(bundle);
        }
      } catch (error) {
        console.error('Sure-Trainer konnte Sure nicht laden.', error);
        if (!cancelled) {
          setSurahBundle(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSelectedSurah();

    return () => {
      cancelled = true;
    };
  }, [selectedSurah, selectedLang]);

  useEffect(() => {
    let cancelled = false;

    const prepareCurrentVerseAudio = async () => {
      if (!surahBundle?.verses?.length) return;

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const currentVerse = surahBundle.verses[currentAyahIndex];
      if (!currentVerse) return;

      try {
        if (currentVerse.audio) {
          audioRef.current.src = currentVerse.audio;
        } else if (currentVerse.ayahRef) {
          const ayahAudio = await fetchAyahBundle(currentVerse.ayahRef);
          if (cancelled || !ayahAudio?.audio) return;
          audioRef.current.src = ayahAudio.audio;
        } else {
          return;
        }

        audioRef.current.load();
      } catch (error) {
        console.error('Vers-Audio konnte nicht vorbereitet werden.', error);
      }
    };

    prepareCurrentVerseAudio();

    return () => {
      cancelled = true;
    };
  }, [surahBundle, currentAyahIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handleEnded = async () => {
      if (!surahBundle?.verses?.length) {
        setIsPlaying(false);
        return;
      }

      if (currentAyahIndex < surahBundle.verses.length - 1) {
        const nextIndex = currentAyahIndex + 1;
        setCurrentAyahIndex(nextIndex);
        setTimeout(async () => {
          try {
            const nextVerse = surahBundle.verses[nextIndex];
            if (!audioRef.current || !nextVerse) return;

            if (nextVerse.audio) {
              audioRef.current.src = nextVerse.audio;
            } else if (nextVerse.ayahRef) {
              const ayahAudio = await fetchAyahBundle(nextVerse.ayahRef);
              if (!ayahAudio?.audio) return;
              audioRef.current.src = ayahAudio.audio;
            } else {
              return;
            }

            audioRef.current.load();
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Nächster Vers konnte nicht abgespielt werden.', error);
            setIsPlaying(false);
          }
        }, 250);
      } else {
        setIsPlaying(false);
        addXp(50);
        window.alert(labels.done);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentAyahIndex, surahBundle, addXp, labels.done]);

  useEffect(() => {
    const audio = audioRef.current;
    const verse = surahBundle?.verses?.[currentAyahIndex];
    if (!audio || !verse?.arabic) return undefined;

    const onTimeUpdate = () => {
      const words = tokenizeArabic(verse.arabic).filter((token) => !token.isSpace);
      const duration = audio.duration || 0;
      if (!words.length || !duration) {
        setCurrentWordIndex(-1);
        return;
      }
      const progress = Math.min(Math.max((audio.currentTime || 0) / duration, 0), 0.999999);
      setCurrentWordIndex(Math.floor(progress * words.length));
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [surahBundle, currentAyahIndex]);

  useEffect(() => () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current || !surahBundle?.verses?.length) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Trainer-Audio konnte nicht abgespielt werden.', error);
      setIsPlaying(false);
    }
  };

  const stepToAyah = (nextIndex) => {
    if (!surahBundle?.verses?.length) return;
    const safeIndex = Math.max(0, Math.min(nextIndex, surahBundle.verses.length - 1));
    setCurrentAyahIndex(safeIndex);
    setCurrentWordIndex(-1);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  if (!selectedSurah) {
    return (
      <div className={`p-6 pb-24 space-y-6 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => setSelectedFeature(null)} className={`p-2 rounded-full shadow-sm transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>
            <ChevronLeft size={24} />
          </button>
          <h2 className={`text-2xl font-black transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{labels.title}</h2>
        </div>

        <div className="space-y-3">
          <h3 className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels.featured}</h3>
          <div className="grid grid-cols-2 gap-4">
            {featuredSurahs.map((surah) => (
              <button
                key={surah.id}
                onClick={() => setSelectedSurah(surah)}
                className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${isDarkMode ? 'bg-slate-800 border-indigo-900/30' : 'bg-white border-indigo-100 hover:border-indigo-300'}`}
              >
                <div className={`text-3xl font-black ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{surah.id}</div>
                <div className="text-center">
                  <h3 className={`font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{surah.title[selectedLang]}</h3>
                  <p className={`text-xl font-arabic ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} dir="rtl">{surah.arabic || '—'}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels.all}</h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={labels.search}
              className={`w-full pl-11 pr-4 py-3 rounded-3xl border-2 outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-indigo-100 text-gray-800 placeholder-gray-400'}`}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-1">
            {filteredAllSurahs.map((surah) => (
              <button
                key={surah.id}
                onClick={() => setSelectedSurah(surah)}
                className={`p-4 rounded-3xl border-2 text-left transition-all active:scale-[0.99] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-50 shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${isDarkMode ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>{surah.id}</div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{surah.title[selectedLang]}</h4>
                    <p className={`text-xl font-arabic truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} dir="rtl">{surah.arabic || '—'}</p>
                  </div>
                  <div className={`text-xs font-black px-3 py-1 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-indigo-50 text-indigo-600'}`}>{labels.complete}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentVerse = surahBundle?.verses?.[currentAyahIndex];
  const highlightedArabic = tokenizeArabic(currentVerse?.arabic || '');

  return (
    <div className={`p-6 pb-24 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-indigo-50/50'}`}>
      <div className="flex justify-between items-center mb-8 gap-4">
        <button onClick={() => { setSelectedSurah(null); setSurahBundle(null); }} className={`p-2 rounded-full shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
        </button>
        <div className={`font-black px-4 py-1 rounded-full text-xs tracking-widest transition-colors ${isDarkMode ? 'text-indigo-400 bg-indigo-900/20' : 'text-indigo-600 bg-indigo-100'}`}>
          {selectedSurah.title[selectedLang]}
        </div>
      </div>

      <div className={`flex-1 flex flex-col p-6 rounded-[3rem] shadow-xl border-2 relative transition-colors ${isDarkMode ? 'bg-slate-800 border-indigo-900/20' : 'bg-white border-indigo-100'}`}>
        {loading ? (
          <div className="flex-1 flex items-center justify-center gap-3">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
            <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>{labels.loading}</span>
          </div>
        ) : currentVerse ? (
          <>
            <div className="text-center mb-6">
              <div className={`text-4xl font-arabic mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`} dir="rtl">{surahBundle?.arabicName || selectedSurah.arabic}</div>
              <div className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels.verse} {currentVerse.numberInSurah} / {surahBundle?.versesCount}</div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              <div className={`p-6 rounded-[2rem] ${isDarkMode ? 'bg-slate-900/50' : 'bg-indigo-50/60'}`}>
                <p className={`text-4xl font-arabic leading-[3.5rem] text-right ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`} dir="rtl">
                  {(() => {
                    let wordPosition = -1;
                    return highlightedArabic.map((token, index) => {
                      if (token.isSpace) return <span key={`s-${index}`}>{token.text}</span>;
                      wordPosition += 1;
                      const isActive = wordPosition === currentWordIndex;
                      return (
                        <span
                          key={`w-${index}`}
                          className={isActive ? 'bg-emerald-400/50 rounded-xl px-1' : ''}
                        >
                          {token.text}
                        </span>
                      );
                    });
                  })()}
                </p>
                <div className={`mt-3 text-xs font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  {labels.liveWord}: {currentWordIndex >= 0 ? currentWordIndex + 1 : '—'}
                </div>
              </div>

              {currentVerse.translation && (
                <div className={`p-6 rounded-[2rem] ${isDarkMode ? 'bg-slate-900/50 text-slate-200' : 'bg-gray-50 text-gray-700'}`}>
                  <p className="text-base leading-relaxed">{currentVerse.translation}</p>
                </div>
              )}

              <div className={`p-6 rounded-[2rem] ${isDarkMode ? 'bg-slate-900/50 text-slate-200' : 'bg-emerald-50 text-emerald-900'}`}>
                <p className="text-xs font-black uppercase tracking-widest mb-2">{labels.meaningTitle}</p>
                <p className="text-sm leading-relaxed">{selectedSurah?.meaning?.[selectedLang] || selectedSurah?.meaning?.de || '—'}</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                onClick={() => stepToAyah(currentAyahIndex - 1)}
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
                onClick={() => stepToAyah(currentAyahIndex + 1)}
                disabled={currentAyahIndex === surahBundle.verses.length - 1}
                className={`p-3 rounded-full transition-all ${currentAyahIndex === surahBundle.verses.length - 1 ? 'text-slate-300' : 'text-indigo-500 hover:bg-white active:scale-90 shadow-sm'}`}
              >
                <ChevronLeft size={32} className="rotate-180" />
              </button>
            </div>
          </>
        ) : (
          <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{labels.loading}</div>
        )}
      </div>

      <div className="mt-8 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
        <Music size={14} /> {labels.reciter}
      </div>
    </div>
  );
}
