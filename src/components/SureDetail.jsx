import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, Heart, BookOpen, Share2, Play, Pause, Loader2, Volume2, AlertCircle, ScrollText, Languages } from 'lucide-react';
import { fetchSurahBundle } from '../utils/quranAudio';

const LABELS = {
  de: {
    back: 'Zurück',
    share: 'Teilen',
    listen: 'Anhören',
    meaning: 'Bedeutung',
    verses: 'Verse',
    revelation: 'Offenbarung',
    pronunciation: 'Aussprache',
    completeText: 'Vollständige Sure',
    translation: 'Bedeutung',
    explanation: 'Kurze Erklärung',
    translationSource: 'Quelle aus quran-api',
    loading: 'Die vollständige Sure wird geladen …',
    error: 'Die Sure konnte nicht vollständig geladen werden.',
    noTranslation: 'Für diese Sprache wurde keine vollständige Übersetzung gefunden. Es wird nur der arabische Text angezeigt.',
    meccan: 'Mekkanisch',
    medinan: 'Medinensisch',
    textLanguage: 'Textsprache',
    arabicOnly: 'Nur Arabisch',
    playerTitle: 'Rezitation der ganzen Sure',
    copied: 'Link kopiert'
  },
  al: {
    back: 'Mbrapa',
    share: 'Shpërndo',
    listen: 'Dëgjo',
    meaning: 'Kuptimi',
    verses: 'Ajete',
    revelation: 'Shpallja',
    pronunciation: 'Shqiptimi',
    completeText: 'Sureja e plotë',
    translation: 'Përkthimi',
    explanation: 'Shpjegim i shkurtër',
    translationSource: 'Burimi nga quran-api',
    loading: 'Sureja e plotë po ngarkohet …',
    error: 'Sureja nuk u ngarkua e plotë.',
    noTranslation: 'Për këtë gjuhë nuk u gjet përkthim i plotë. Po shfaqet vetëm teksti arabisht.',
    meccan: 'Mekase',
    medinan: 'Medinase',
    textLanguage: 'Gjuha e tekstit',
    arabicOnly: 'Vetëm arabisht',
    playerTitle: 'Recitim i gjithë sures',
    copied: 'Lidhja u kopjua'
  },
  tr: {
    back: 'Geri',
    share: 'Paylaş',
    listen: 'Dinle',
    meaning: 'Anlamı',
    verses: 'Ayet',
    revelation: 'Nüzul',
    pronunciation: 'Okunuş',
    completeText: 'Surenin tamamı',
    translation: 'Mana',
    explanation: 'Kısa açıklama',
    translationSource: 'quran-api kaynağı',
    loading: 'Surenin tamamı yükleniyor …',
    error: 'Sure tam olarak yüklenemedi.',
    noTranslation: 'Bu dil için tam çeviri bulunamadı. Yalnızca Arapça metin gösteriliyor.',
    meccan: 'Mekkî',
    medinan: 'Medenî',
    textLanguage: 'Metin dili',
    arabicOnly: 'Sadece Arapça',
    playerTitle: 'Surenin tamamının kıraati',
    copied: 'Bağlantı kopyalandı'
  }
};

const TRANSLATION_OPTIONS = [
  { value: 'ar', label: 'AR' },
  { value: 'de', label: 'DE' },
  { value: 'al', label: 'AL' },
  { value: 'tr', label: 'TR' }
];

function formatRevelation(value, labels) {
  if (!value) return '';
  if (value.toLowerCase().startsWith('mec')) return labels.meccan;
  if (value.toLowerCase().startsWith('med')) return labels.medinan;
  return value;
}

export default function SureDetail({ item, onBack, selectedLang, isDarkMode, favorites, toggleFavorite, incrementStat }) {
  const labels = LABELS[selectedLang] || LABELS.de;
  const [translationLang, setTranslationLang] = useState(['de', 'al', 'tr'].includes(selectedLang) ? selectedLang : 'de');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [surahBundle, setSurahBundle] = useState(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState(true);
  const [loadError, setLoadError] = useState('');
  const audioRef = useRef(null);
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (['de', 'al', 'tr'].includes(selectedLang)) {
      setTranslationLang(selectedLang);
    }
  }, [selectedLang]);

  useEffect(() => {
    if (!hasIncremented.current) {
      incrementStat('itemsRead');
      hasIncremented.current = true;
    }
  }, [incrementStat]);

  useEffect(() => {
    let cancelled = false;

    const loadSurah = async () => {
      setIsLoadingSurah(true);
      setLoadError('');

      try {
        const data = await fetchSurahBundle(item.id, translationLang);
        if (!cancelled) {
          setSurahBundle(data);
        }
      } catch (error) {
        console.error('Fehler beim Laden der vollständigen Sure:', error);
        if (!cancelled) {
          setLoadError(labels.error);
          setSurahBundle(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSurah(false);
        }
      }
    };

    loadSurah();

    return () => {
      cancelled = true;
    };
  }, [item.id, translationLang, labels.error]);

  useEffect(() => {
    const surahAudioUrl = surahBundle?.surahAudioUrl;

    if (!surahAudioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return undefined;
    }

    const audio = new Audio(surahAudioUrl);
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    const setAudioData = () => setDuration(audio.duration || 0);
    const setAudioTime = () => setCurrentTime(audio.currentTime || 0);
    const setBuffering = () => setIsBuffering(true);
    const clearBuffering = () => setIsBuffering(false);
    const onEnded = () => setIsPlaying(false);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('waiting', setBuffering);
    audio.addEventListener('playing', clearBuffering);
    audio.addEventListener('canplay', clearBuffering);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('waiting', setBuffering);
      audio.removeEventListener('playing', clearBuffering);
      audio.removeEventListener('canplay', clearBuffering);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
    };
  }, [surahBundle?.surahAudioUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio konnte nicht abgespielt werden.', error);
      setIsPlaying(false);
    }
  };

  const handleProgressChange = (event) => {
    const time = Number(event.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = item.title[selectedLang] || item.title.de;

    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, text: shareTitle, url: shareUrl });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        window.alert(labels.copied);
      }
    } catch (error) {
      console.warn('Teilen nicht möglich.', error);
    }
  };

  const formatTime = (time) => {
    if (Number.isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderedRevelation = useMemo(() => {
    const raw = surahBundle?.revelationType || item.revelation;
    return formatRevelation(raw, labels);
  }, [surahBundle?.revelationType, item.revelation, labels]);

  const renderedPronunciation = surahBundle?.englishName || item.title?.de?.replace('Sure ', '') || '';
  const verses = surahBundle?.verses || [];
  const hasTranslation = translationLang !== 'ar' && verses.some((verse) => Boolean(verse.translation));

  return (
    <div className={`p-6 pb-40 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className={`p-3 rounded-2xl shadow-sm transition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`} title={labels.back}>
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button onClick={handleShare} className={`p-3 rounded-2xl transition-all ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-500'}`} title={labels.share}>
            <Share2 size={24} />
          </button>
          <button
            onClick={() => toggleFavorite('suren', item.id)}
            className={`p-3 rounded-2xl shadow-sm transition-all active:scale-90 ${favorites.suren?.includes(item.id) ? 'bg-red-50 text-red-500' : (isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-white text-gray-300')}`}
          >
            <Heart size={24} fill={favorites.suren?.includes(item.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className={`p-8 rounded-[3rem] shadow-xl space-y-8 border-2 ${isDarkMode ? 'bg-slate-800 border-green-900/20 shadow-slate-950/50' : 'bg-white border-green-50 shadow-green-900/5'}`}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center text-white text-3xl shadow-lg shadow-green-500/20">
            <BookOpen size={40} />
          </div>
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title[selectedLang]}</h2>
          <div className={`text-3xl font-arabic leading-relaxed ${isDarkMode ? 'text-green-300' : 'text-green-700'}`} dir="rtl">
            {surahBundle?.arabicName || item.arabic || '—'}
          </div>
          <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'}`}>
            SURE {item.id}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <div className={`px-4 py-2 rounded-full text-xs font-bold ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
              {labels.verses}: {surahBundle?.versesCount || item.verses}
            </div>
            {renderedRevelation && (
              <div className={`px-4 py-2 rounded-full text-xs font-bold ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
                {labels.revelation}: {renderedRevelation}
              </div>
            )}
          </div>
        </div>

        <div className={`p-5 rounded-[2rem] ${isDarkMode ? 'bg-slate-900/50' : 'bg-green-50/50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Languages size={18} className={isDarkMode ? 'text-green-300' : 'text-green-700'} />
            <div className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{labels.textLanguage}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRANSLATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTranslationLang(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-black transition-all ${translationLang === option.value
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : (isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-gray-600 border border-gray-200')}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          <div className={`p-5 rounded-[2rem] ${isDarkMode ? 'bg-slate-900/50' : 'bg-green-50/50'}`}>
            <div className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels.pronunciation}</div>
            <div className="text-lg font-bold">{renderedPronunciation}</div>
          </div>
          <div className={`p-5 rounded-[2rem] ${isDarkMode ? 'bg-slate-900/50' : 'bg-green-50/50'}`}>
            <div className={`text-xs font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels.explanation}</div>
            <div className="text-base leading-relaxed">{item.meaning[selectedLang]}</div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <ScrollText className={isDarkMode ? 'text-green-400' : 'text-green-600'} size={20} />
            <h3 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{labels.completeText}</h3>
          </div>

          {isLoadingSurah && (
            <div className={`p-8 rounded-[2rem] flex items-center justify-center gap-3 ${isDarkMode ? 'bg-slate-900/50 text-slate-300' : 'bg-gray-50 text-gray-600'}`}>
              <Loader2 className="animate-spin" size={20} />
              <span className="font-medium">{labels.loading}</span>
            </div>
          )}

          {loadError && !isLoadingSurah && (
            <div className={`p-5 rounded-[2rem] flex items-start gap-3 ${isDarkMode ? 'bg-red-950/30 text-red-200' : 'bg-red-50 text-red-700'}`}>
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span className="font-medium">{loadError}</span>
            </div>
          )}

          {!isLoadingSurah && surahBundle && (
            <>
              {translationLang !== 'ar' && surahBundle.translationEdition && (
                <div className={`px-4 py-3 rounded-2xl text-sm font-semibold ${isDarkMode ? 'bg-slate-900/50 text-slate-300' : 'bg-green-50 text-green-800'}`}>
                  {labels.translationSource}: {surahBundle.translationEdition}
                </div>
              )}

              {translationLang !== 'ar' && !hasTranslation && (
                <div className={`px-4 py-3 rounded-2xl text-sm font-semibold ${isDarkMode ? 'bg-yellow-950/30 text-yellow-200' : 'bg-yellow-50 text-yellow-800'}`}>
                  {labels.noTranslation}
                </div>
              )}

              <div className="space-y-4">
                {verses.map((verse) => (
                  <div key={verse.number || verse.numberInSurah} className={`p-5 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900/40 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${isDarkMode ? 'bg-slate-700 text-green-300' : 'bg-white text-green-700 shadow-sm'}`}>
                        {verse.numberInSurah}
                      </div>
                    </div>
                    <p className={`text-3xl leading-[3.4rem] text-right mb-4 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`} dir="rtl">
                      {verse.arabic}
                    </p>
                    {translationLang !== 'ar' && verse.translation && (
                      <div className={`pt-4 border-t ${isDarkMode ? 'border-slate-700 text-slate-200' : 'border-gray-200 text-gray-700'}`}>
                        <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels.translation}</div>
                        <p className="text-base leading-relaxed">{verse.translation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {surahBundle?.surahAudioUrl && !isLoadingSurah && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 z-30">
          <div className={`rounded-[2rem] border shadow-2xl p-4 ${isDarkMode ? 'bg-slate-900/95 border-slate-700 backdrop-blur' : 'bg-white/95 border-gray-200 backdrop-blur'}`}>
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                  isPlaying ? 'bg-red-500 shadow-red-500/20' : 'bg-green-500 shadow-green-500/20'
                } text-white`}
                title={labels.listen}
              >
                {isBuffering && !isPlaying ? (
                  <Loader2 className="animate-spin" size={26} />
                ) : isPlaying ? (
                  <Pause size={26} />
                ) : (
                  <Play size={26} className="ml-1" />
                )}
              </button>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-70">
                  <span className="flex items-center gap-1 truncate"><Volume2 size={12} /> {labels.playerTitle}</span>
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
        </div>
      )}
    </div>
  );
}
