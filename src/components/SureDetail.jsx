import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, Heart, BookOpen, Share2, Play, Pause, Loader2, Volume2, AlertCircle, ScrollText, Languages, ChevronDown } from 'lucide-react';
import { fetchAyahQueue, fetchSurahBundle } from '../utils/quranAudio';

const LABELS = {
  de: {
    back: 'Zurück',
    share: 'Teilen',
    listen: 'Anhören',
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
    playerTitle: 'Rezitation der Sure (Aya für Aya)',
    copied: 'Link kopiert',
    showFullText: 'Volltext anzeigen',
    hideFullText: 'Volltext ausblenden',
    marqueeOn: 'Laufschrift an',
    marqueeOff: 'Laufschrift aus',
    wordHighlight: 'Wort-Highlight aktiv',
    currentAyah: 'Aktuelle Aya',
    showAyah: 'Aya anzeigen',
    hideAyah: 'Aya ausblenden',
    tapArabicHint: 'Tipp: Auf arabischen Text tippen, um Audio zu starten/pausieren.',
    translationPreview: 'Kurze Übersetzung'
  },
  al: {
    back: 'Mbrapa',
    share: 'Shpërndo',
    listen: 'Dëgjo',
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
    playerTitle: 'Recitim i sures (ajet pas ajeti)',
    copied: 'Lidhja u kopjua',
    showFullText: 'Shfaq tekstin e plotë',
    hideFullText: 'Fshih tekstin e plotë',
    marqueeOn: 'Tekst rrjedhës aktiv',
    marqueeOff: 'Tekst rrjedhës joaktiv',
    wordHighlight: 'Theksimi i fjalës aktiv',
    currentAyah: 'Ajeti aktual',
    showAyah: 'Shfaq ajetin',
    hideAyah: 'Fshih ajetin',
    tapArabicHint: 'Këshillë: Prek tekstin arabisht për ta luajtur/ndalur audion.',
    translationPreview: 'Përkthim i shkurtër'
  },
  tr: {
    back: 'Geri',
    share: 'Paylaş',
    listen: 'Dinle',
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
    playerTitle: 'Sure kıraati (ayet ayet)',
    copied: 'Bağlantı kopyalandı',
    showFullText: 'Tam metni göster',
    hideFullText: 'Tam metni gizle',
    marqueeOn: 'Kayan yazı açık',
    marqueeOff: 'Kayan yazı kapalı',
    wordHighlight: 'Kelime vurgulama aktif',
    currentAyah: 'Aktif ayet',
    showAyah: 'Ayeti göster',
    hideAyah: 'Ayeti gizle',
    tapArabicHint: 'İpucu: Oynat/duraklat için Arapça metne dokun.',
    translationPreview: 'Kısa çeviri'
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

function tokenizeArabicText(text = '') {
  return text
    .split(/(\s+)/)
    .filter((token) => token.length > 0)
    .map((token) => ({ text: token, isSpace: /^\s+$/.test(token) }));
}

export default function SureDetail({ item, onBack, selectedLang, isDarkMode, favorites, toggleFavorite, incrementStat, appSettings }) {
  const labels = LABELS[selectedLang] || LABELS.de;
  const [translationLang, setTranslationLang] = useState(() => {
    if (appSettings?.showTranslationDefault === false) return 'ar';
    return ['de', 'al', 'tr'].includes(selectedLang) ? selectedLang : 'de';
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [surahBundle, setSurahBundle] = useState(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioQueue, setAudioQueue] = useState([]);
  const [showFullText, setShowFullText] = useState(true);
  const [marqueeEnabled, setMarqueeEnabled] = useState(false);
  const [expandedAyahNumber, setExpandedAyahNumber] = useState(null);
  const [showTapHint, setShowTapHint] = useState(true);

  const audioRef = useRef(null);
  const hasIncremented = useRef(false);
  const audioQueueRef = useRef([]);
  const currentAyahIndexRef = useRef(0);
  const versesRef = useRef([]);

  const verses = useMemo(() => surahBundle?.verses || [], [surahBundle?.verses]);

  useEffect(() => {
    audioQueueRef.current = audioQueue;
  }, [audioQueue]);

  useEffect(() => {
    currentAyahIndexRef.current = currentAyahIndex;
  }, [currentAyahIndex]);

  useEffect(() => {
    versesRef.current = verses;
  }, [verses]);

  useEffect(() => {
    if (['de', 'al', 'tr'].includes(selectedLang)) {
      setTranslationLang(appSettings?.showTranslationDefault === false ? 'ar' : selectedLang);
    }
  }, [selectedLang, appSettings?.showTranslationDefault]);

  useEffect(() => {
    if (!hasIncremented.current) {
      incrementStat('itemsRead');
      hasIncremented.current = true;
    }
  }, [incrementStat]);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const setAudioData = () => setDuration(audio.duration || 0);
    const setAudioTime = () => setCurrentTime(audio.currentTime || 0);
    const setBuffering = () => setIsBuffering(true);
    const clearBuffering = () => setIsBuffering(false);

    const updateWordHighlight = () => {
      const verse = versesRef.current[currentAyahIndexRef.current];
      if (!verse?.arabic) {
        setCurrentWordIndex(-1);
        return;
      }
      const words = tokenizeArabicText(verse.arabic).filter((token) => !token.isSpace);
      const localDuration = audio.duration || 0;
      const localTime = audio.currentTime || 0;
      if (!words.length || !localDuration) {
        setCurrentWordIndex(-1);
        return;
      }
      const progress = Math.min(Math.max(localTime / localDuration, 0), 0.999999);
      setCurrentWordIndex(Math.floor(progress * words.length));
    };

    const onEnded = async () => {
      const queue = audioQueueRef.current;
      const currentIndex = currentAyahIndexRef.current;

      if (currentIndex < queue.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextUrl = queue[nextIndex];
        if (!nextUrl) {
          setIsPlaying(false);
          return;
        }
        setCurrentAyahIndex(nextIndex);
        setCurrentWordIndex(0);
        audio.src = nextUrl;
        audio.load();
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Nächste Aya konnte nicht abgespielt werden.', error);
          setIsPlaying(false);
          setCurrentWordIndex(-1);
        }
        return;
      }
      setIsPlaying(false);
      setCurrentWordIndex(-1);
      setCurrentTime(0);
      setCurrentAyahIndex(0);
      audio.currentTime = 0;
    };

    const onPause = () => setIsPlaying(false);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('timeupdate', updateWordHighlight);
    audio.addEventListener('waiting', setBuffering);
    audio.addEventListener('playing', clearBuffering);
    audio.addEventListener('canplay', clearBuffering);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('timeupdate', updateWordHighlight);
      audio.removeEventListener('waiting', setBuffering);
      audio.removeEventListener('playing', clearBuffering);
      audio.removeEventListener('canplay', clearBuffering);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSurah = async () => {
      setIsLoadingSurah(true);
      setLoadError('');

      try {
        const data = await fetchSurahBundle(item.id, translationLang);
        if (!cancelled) {
          setSurahBundle(data);
          setAudioQueue([]);
          setCurrentAyahIndex(0);
          setCurrentWordIndex(-1);
          setCurrentTime(0);
          setDuration(0);
          setExpandedAyahNumber(null);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeAttribute('src');
            audioRef.current.load();
          }
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

  const loadAudioQueue = async () => {
    if (!verses.length) return [];
    const ayahRefs = verses.map((verse) => verse.ayahRef).filter(Boolean);
    if (!ayahRefs.length) return [];

    setIsLoadingAudio(true);
    try {
      const ayahs = await fetchAyahQueue(ayahRefs);
      const urls = ayahs.map((ayah) => ayah.audio).filter(Boolean);
      setAudioQueue(urls);
      return urls;
    } catch (error) {
      console.error('Sure-Audio konnte nicht als Aya-Queue geladen werden.', error);
      return [];
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const startAyah = async (index, queue = audioQueue) => {
    if (!audioRef.current || !queue[index]) return;
    setCurrentAyahIndex(index);
    setCurrentWordIndex(0);
    setCurrentTime(0);
    audioRef.current.src = queue[index];
    audioRef.current.load();
    await audioRef.current.play();
    setIsPlaying(true);
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      const queue = audioQueue.length ? audioQueue : await loadAudioQueue();
      if (!queue.length) return;

      if (audioRef.current.src) {
        await audioRef.current.play();
      } else {
        await startAyah(currentAyahIndex, queue);
      }
      setIsPlaying(true);
    } catch (error) {
      console.error('Audio konnte nicht abgespielt werden.', error);
      setIsPlaying(false);
    }
  };

  const toggleAyahPlayback = async (index) => {
    setShowTapHint(false);
    if (!audioRef.current) return;

    try {
      if (isPlaying && currentAyahIndex === index) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      const queue = audioQueue.length ? audioQueue : await loadAudioQueue();
      if (!queue.length || !queue[index]) return;
      await startAyah(index, queue);
    } catch (error) {
      console.error('Aya konnte nicht abgespielt werden.', error);
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
  const hasTranslation = translationLang !== 'ar' && verses.some((verse) => Boolean(verse.translation));
  const toggleAyahExpanded = (ayahNumber) => {
    setExpandedAyahNumber((prev) => (prev === ayahNumber ? null : ayahNumber));
  };

  useEffect(() => {
    if (!isPlaying || appSettings?.autoOpenCurrentAyah === false) return;
    const currentAyah = verses[currentAyahIndex]?.numberInSurah;
    if (currentAyah) {
      setExpandedAyahNumber(currentAyah);
    }
  }, [isPlaying, currentAyahIndex, verses, appSettings?.autoOpenCurrentAyah]);

  useEffect(() => {
    if (!appSettings?.autoPlaySurah || isPlaying || !surahBundle || isLoadingSurah) return;
    togglePlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appSettings?.autoPlaySurah, surahBundle, isLoadingSurah]);

  return (
    <div className={`p-4 pb-36 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-5">
        <button onClick={onBack} className={`p-2.5 rounded-2xl shadow-sm transition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`} title={labels.back}>
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button onClick={handleShare} className={`p-2.5 rounded-2xl transition-all ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-500'}`} title={labels.share}>
            <Share2 size={20} />
          </button>
          <button
            onClick={() => toggleFavorite('suren', item.id)}
            className={`p-2.5 rounded-2xl shadow-sm transition-all active:scale-90 ${favorites.suren?.includes(item.id) ? 'bg-red-50 text-red-500' : (isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-white text-gray-300')}`}
          >
            <Heart size={20} fill={favorites.suren?.includes(item.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className={`p-5 rounded-[2rem] shadow-xl space-y-5 border ${isDarkMode ? 'bg-slate-800 border-green-900/20 shadow-slate-950/50' : 'bg-white border-green-50 shadow-green-900/5'}`}>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
            <BookOpen size={28} />
          </div>
          <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.title[selectedLang]}</h2>
          <div className={`text-2xl font-arabic leading-relaxed ${isDarkMode ? 'text-green-300' : 'text-green-700'}`} dir="rtl">
            {surahBundle?.arabicName || item.arabic || '—'}
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <div className={`px-3 py-1.5 rounded-full font-bold ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
              {labels.verses}: {surahBundle?.versesCount || item.verses}
            </div>
            {renderedRevelation && (
              <div className={`px-3 py-1.5 rounded-full font-bold ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
                {labels.revelation}: {renderedRevelation}
              </div>
            )}
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-green-50/50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Languages size={16} className={isDarkMode ? 'text-green-300' : 'text-green-700'} />
            <div className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{labels.textLanguage}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRANSLATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTranslationLang(option.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${translationLang === option.value
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : (isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-gray-600 border border-gray-200')}`}
              >
                {option.label}
              </button>
            ))}
            <button
              onClick={() => setMarqueeEnabled((prev) => !prev)}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${marqueeEnabled
                ? 'bg-indigo-500 text-white'
                : (isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-gray-600 border border-gray-200')}`}
            >
              {marqueeEnabled ? labels.marqueeOn : labels.marqueeOff}
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-green-50/50'}`}>
            <div className={`text-[11px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels.pronunciation}</div>
            <div className="text-base font-bold">{renderedPronunciation}</div>
          </div>
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-green-50/50'}`}>
            <div className={`text-[11px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels.explanation}</div>
            <div className="text-sm leading-relaxed">{item.meaning[selectedLang]}</div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowFullText((prev) => !prev)}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
          >
            <span className="flex items-center gap-2 font-black text-sm">
              <ScrollText size={16} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
              {labels.completeText}
            </span>
            <span className="flex items-center gap-2 text-xs font-bold">
              {showFullText ? labels.hideFullText : labels.showFullText}
              <ChevronDown size={16} className={`transition-transform ${showFullText ? 'rotate-180' : ''}`} />
            </span>
          </button>

          {isLoadingSurah && (
            <div className={`p-6 rounded-2xl flex items-center justify-center gap-3 ${isDarkMode ? 'bg-slate-900/50 text-slate-300' : 'bg-gray-50 text-gray-600'}`}>
              <Loader2 className="animate-spin" size={18} />
              <span className="text-sm font-medium">{labels.loading}</span>
            </div>
          )}

          {loadError && !isLoadingSurah && (
            <div className={`p-4 rounded-2xl flex items-start gap-3 ${isDarkMode ? 'bg-red-950/30 text-red-200' : 'bg-red-50 text-red-700'}`}>
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span className="text-sm font-medium">{loadError}</span>
            </div>
          )}
          {showTapHint && (
            <div className={`px-4 py-2 rounded-xl text-xs font-semibold ${isDarkMode ? 'bg-slate-900/50 text-slate-300' : 'bg-indigo-50 text-indigo-700'}`}>
              {labels.tapArabicHint}
            </div>
          )}

          {!isLoadingSurah && surahBundle && showFullText && (
            <>
              {translationLang !== 'ar' && surahBundle.translationEdition && (
                <div className={`px-4 py-2 rounded-xl text-xs font-semibold ${isDarkMode ? 'bg-slate-900/50 text-slate-300' : 'bg-green-50 text-green-800'}`}>
                  {labels.translationSource}: {surahBundle.translationEdition}
                </div>
              )}

              {translationLang !== 'ar' && !hasTranslation && (
                <div className={`px-4 py-2 rounded-xl text-xs font-semibold ${isDarkMode ? 'bg-yellow-950/30 text-yellow-200' : 'bg-yellow-50 text-yellow-800'}`}>
                  {labels.noTranslation}
                </div>
              )}

              <div className="space-y-3">
                {verses.map((verse, index) => {
                  const isCurrentAyah = index === currentAyahIndex && isPlaying;
                  const isExpanded = expandedAyahNumber === verse.numberInSurah;
                  const tokens = tokenizeArabicText(verse.arabic);
                  let highlightedWordCounter = -1;

                  return (
                    <div
                      key={verse.number || verse.numberInSurah}
                      className={`p-4 rounded-2xl border transition-colors ${isCurrentAyah
                        ? (isDarkMode ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200')
                        : (isDarkMode ? 'bg-slate-900/40 border-slate-700' : 'bg-gray-50 border-gray-100')}`}
                    >
                      <button
                        onClick={() => toggleAyahExpanded(verse.numberInSurah)}
                        className={`w-full flex items-center justify-between gap-2 mb-2 rounded-xl p-2 transition-colors ${isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-white'}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${isDarkMode ? 'bg-slate-700 text-green-300' : 'bg-white text-green-700 shadow-sm'}`}>
                          {verse.numberInSurah}
                        </div>
                        <div className="flex items-center gap-2">
                          {isCurrentAyah && (
                            <span className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                              {labels.currentAyah}
                            </span>
                          )}
                          <span className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            {isExpanded ? labels.hideAyah : labels.showAyah}
                          </span>
                          <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {isExpanded && (
                        <>
                          {marqueeEnabled ? (
                            <button onClick={() => toggleAyahPlayback(index)} className={`surah-marquee-track w-full text-right cursor-pointer ${isDarkMode ? 'text-green-300' : 'text-green-700'}`} dir="rtl">
                              <div className="surah-marquee-content font-arabic text-2xl">
                                {verse.arabic}
                              </div>
                            </button>
                          ) : (
                            <button onClick={() => toggleAyahPlayback(index)} className={`w-full text-2xl leading-[2.8rem] text-right mb-3 font-arabic cursor-pointer ${isDarkMode ? 'text-green-300' : 'text-green-700'}`} dir="rtl">
                              {tokens.map((token, tokenIndex) => {
                                if (token.isSpace) {
                                  return <span key={`${token.text}-${tokenIndex}`}>{token.text}</span>;
                                }

                                highlightedWordCounter += 1;
                                const isWordHighlighted = isCurrentAyah && highlightedWordCounter === currentWordIndex;
                                return (
                                  <span
                                    key={`${token.text}-${tokenIndex}`}
                                    className={isWordHighlighted ? 'bg-yellow-300/80 text-slate-900 rounded px-0.5 transition-colors' : ''}
                                  >
                                    {token.text}
                                  </span>
                                );
                              })}
                            </button>
                          )}

                          {translationLang !== 'ar' && verse.translation && (
                            <div className={`pt-3 border-t ${isDarkMode ? 'border-slate-700 text-slate-200' : 'border-gray-200 text-gray-700'}`}>
                              <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels.translation}</div>
                              <p className="text-sm leading-relaxed">{verse.translation}</p>
                            </div>
                          )}
                        </>
                      )}
                      {!isExpanded && (
                        <div className={`text-xs pl-2 space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          <div>…</div>
                          {translationLang !== 'ar' && verse.translation && (
                            <div className={`text-[11px] rounded-lg px-2 py-1 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-gray-600'}`}>
                              <span className="font-black uppercase tracking-wide">{labels.translationPreview}: </span>
                              <span>{verse.translation.slice(0, 120)}{verse.translation.length > 120 ? '…' : ''}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {surahBundle && !isLoadingSurah && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 z-30">
          <div className={`rounded-[1.5rem] border shadow-2xl p-3 ${isDarkMode ? 'bg-slate-900/95 border-slate-700 backdrop-blur' : 'bg-white/95 border-gray-200 backdrop-blur'}`}>
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                  isPlaying ? 'bg-red-500 shadow-red-500/20' : 'bg-green-500 shadow-green-500/20'
                } text-white`}
                title={labels.listen}
                disabled={isLoadingAudio}
              >
                {(isBuffering || isLoadingAudio) && !isPlaying ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : isPlaying ? (
                  <Pause size={22} />
                ) : (
                  <Play size={22} className="ml-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex justify-between items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-70">
                  <span className="flex items-center gap-1 truncate"><Volume2 size={12} /> {labels.playerTitle}</span>
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] opacity-70 font-bold">
                  <span>{labels.wordHighlight}</span>
                  <span>{currentAyahIndex + 1}/{verses.length || 0}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-1.5 rounded-full bg-gray-200 accent-green-500 cursor-pointer appearance-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
