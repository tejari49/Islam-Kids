import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Play, Pause, Loader2, Heart, Volume2, BookOpenText } from 'lucide-react';
import { fetchAyahQueue, fetchAyahTranslationQueue, joinAyahTexts } from '../utils/quranAudio';

const detailLabels = {
  de: {
    back: 'Zurück',
    arabic: 'Arabisch',
    pronunciation: 'Aussprache',
    explanation: 'Erklärung',
    when: 'Wann sage ich das?',
    fullAudio: 'Komplette Audio-Wiedergabe',
    fullAudioHint: 'Hier wird nur echtes API-Audio mit echter Rezitation verwendet.',
    translation: 'Übersetzung der vollständigen Aya',
    source: 'Quelle',
    audioMissing: 'Für diese Sprache wurde keine API-Übersetzung geladen. Es wird die gespeicherte Erklärung gezeigt.',
    excerptNote: 'Kurze Lernfassung für Kinder',
    wordHighlight: 'Wort-Highlight aktiv'
  },
  al: {
    back: 'Mbrapsht',
    arabic: 'Arabisht',
    pronunciation: 'Shqiptimi',
    explanation: 'Shpjegimi',
    when: 'Kur thuhet kjo?',
    fullAudio: 'Leximi i plotë me audio',
    fullAudioHint: 'Këtu përdoret vetëm audio autentike nga API me recitim të vërtetë.',
    translation: 'Përkthimi i ajetit të plotë',
    source: 'Burimi',
    audioMissing: 'Për këtë gjuhë nuk u ngarkua përkthim nga API. Po shfaqet shpjegimi i ruajtur.',
    excerptNote: 'Version i shkurtër për fëmijë',
    wordHighlight: 'Fjala që po lexohet theksohet'
  },
  tr: {
    back: 'Geri',
    arabic: 'Arapça',
    pronunciation: 'Okunuş',
    explanation: 'Açıklama',
    when: 'Bunu ne zaman söylerim?',
    fullAudio: 'Tam sesli okuma',
    fullAudioHint: 'Burada sadece gerçek kıraat içeren API sesi kullanılır.',
    translation: 'Tam ayetin çevirisi',
    source: 'Kaynak',
    audioMissing: 'Bu dil için API çevirisi yüklenemedi. Kayıtlı açıklama gösteriliyor.',
    excerptNote: 'Çocuklar için kısa öğrenme metni',
    wordHighlight: 'Okunan kelime vurgulanıyor'
  }
};

function tokenizeArabicText(text = '') {
  return text
    .split(/(\s+)/)
    .filter((token) => token.length > 0)
    .map((token) => ({ text: token, isSpace: /^\s+$/.test(token) }));
}

function getLangValue(value, lang) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.de || Object.values(value)[0] || '';
}

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
  const [currentAudioQueue, setCurrentAudioQueue] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioAyahs, setAudioAyahs] = useState([]);
  const [translationAyahs, setTranslationAyahs] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [translationEdition, setTranslationEdition] = useState('');
  const audioRef = useRef(null);
  const hasIncremented = useRef(false);
  const labels = detailLabels[selectedLang] || detailLabels.de;

  const audioAyahRefs = selectedDua?.audioAyahs?.length
    ? selectedDua.audioAyahs
    : (selectedDua?.ayah ? [selectedDua.ayah] : []);

  const audioAyahRefKey = audioAyahRefs.join('|');
  const apiArabicText = joinAyahTexts(audioAyahs);
  const apiTranslationText = joinAyahTexts(translationAyahs);
  const hasAuthenticAudio = audioAyahRefs.length > 0;
  const pronunciation = getLangValue(selectedDua?.pronunciation, selectedLang) || getLangValue(selectedDua?.transliteration, selectedLang);
  const explanation = getLangValue(selectedDua?.explanation, selectedLang) || getLangValue(selectedDua?.meaning, selectedLang);
  const whenText = getLangValue(selectedDua?.when, selectedLang);
  const hasExpandedAudioText = Boolean(apiArabicText) && apiArabicText.trim() !== (selectedDua?.arabic || '').trim();

  useEffect(() => {
    hasIncremented.current = false;
  }, [selectedDua?.id]);

  useEffect(() => {
    if (selectedDua && !hasIncremented.current) {
      incrementStat('itemsRead');
      hasIncremented.current = true;
    }
  }, [selectedDua, incrementStat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
    setIsPlaying(false);
    setIsLoadingAudio(false);
    setCurrentAudioQueue([]);
    setCurrentAudioIndex(0);
    setAudioAyahs([]);
    setTranslationAyahs([]);
    setCurrentWordIndex(-1);
    setTranslationEdition('');
  }, [selectedDua]);

  useEffect(() => {
    let isCancelled = false;

    const loadAyahData = async () => {
      if (!hasAuthenticAudio) {
        setAudioAyahs([]);
        setCurrentAudioQueue([]);
        setTranslationAyahs([]);
        setTranslationEdition('');
        return;
      }

      const currentRefs = audioAyahRefKey.split('|').filter(Boolean);

      try {
        const [ayahs, translations] = await Promise.all([
          fetchAyahQueue(currentRefs),
          fetchAyahTranslationQueue(currentRefs, selectedLang)
        ]);

        if (!isCancelled) {
          setAudioAyahs(ayahs);
          setCurrentAudioQueue(ayahs.map((ayah) => ayah.audio).filter(Boolean));
          setTranslationAyahs(translations);
          setTranslationEdition(translations.find((entry) => entry.edition)?.edition || '');
        }
      } catch (error) {
        console.error('Fehler beim Laden der Dua-Audio-Daten:', error);
        if (!isCancelled) {
          setAudioAyahs([]);
          setCurrentAudioQueue([]);
          setTranslationAyahs([]);
          setTranslationEdition('');
        }
      }
    };

    loadAyahData();

    return () => {
      isCancelled = true;
    };
  }, [hasAuthenticAudio, selectedLang, selectedDua?.id, audioAyahRefKey]);

  const updateWordHighlight = () => {
    if (!audioRef.current || !audioAyahs[currentAudioIndex]?.text) {
      setCurrentWordIndex(-1);
      return;
    }

    const duration = audioRef.current.duration || 0;
    const currentTime = audioRef.current.currentTime || 0;
    const words = tokenizeArabicText(audioAyahs[currentAudioIndex].text).filter((token) => !token.isSpace);

    if (!duration || !words.length) {
      setCurrentWordIndex(-1);
      return;
    }

    const progress = Math.min(Math.max(currentTime / duration, 0), 0.999999);
    setCurrentWordIndex(Math.floor(progress * words.length));
  };

  const loadQueueItem = async (urls, index) => {
    if (!audioRef.current || !urls[index]) return;

    setCurrentAudioIndex(index);
    setCurrentWordIndex(0);
    audioRef.current.src = urls[index];
    audioRef.current.load();
    await audioRef.current.play();
    setIsPlaying(true);
  };

  const handleAudioEnded = async () => {
    if (currentAudioIndex < currentAudioQueue.length - 1) {
      try {
        await loadQueueItem(currentAudioQueue, currentAudioIndex + 1);
      } catch (error) {
        console.error('Fehler beim Abspielen der nächsten Aya:', error);
        setIsPlaying(false);
        setCurrentWordIndex(-1);
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentAudioIndex(0);
    setCurrentWordIndex(-1);
  };

  const toggleAudio = async () => {
    if (!audioRef.current || !hasAuthenticAudio) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (currentAudioQueue.length === 0) {
      setIsLoadingAudio(true);
      try {
        const [ayahs, translations] = await Promise.all([
          fetchAyahQueue(audioAyahRefs),
          fetchAyahTranslationQueue(audioAyahRefs, selectedLang)
        ]);
        const urls = ayahs.map((ayah) => ayah.audio).filter(Boolean);
        setAudioAyahs(ayahs);
        setTranslationAyahs(translations);
        setTranslationEdition(translations.find((entry) => entry.edition)?.edition || '');
        setCurrentAudioQueue(urls);
        await loadQueueItem(urls, 0);
      } catch (error) {
        console.error('Fehler beim Laden des Dua-Audios:', error);
      } finally {
        setIsLoadingAudio(false);
      }
      return;
    }

    try {
      if (audioRef.current.src) {
        await audioRef.current.play();
      } else {
        await loadQueueItem(currentAudioQueue, 0);
      }
      setIsPlaying(true);
    } catch (error) {
      console.error('Fehler beim Abspielen des Dua-Audios:', error);
      setIsPlaying(false);
    }
  };

  const renderHighlightedArabic = (text = '') => {
    const tokens = tokenizeArabicText(text);
    let wordCounter = -1;

    return tokens.map((token, tokenIndex) => {
      if (token.isSpace) {
        return <span key={`space-${tokenIndex}`}>{token.text}</span>;
      }

      wordCounter += 1;
      const isCurrentWord = wordCounter === currentWordIndex && isPlaying;
      const isCompletedWord = wordCounter < currentWordIndex;

      return (
        <span
          key={`word-${tokenIndex}`}
          className={`inline-block mx-[0.08em] px-1 py-0.5 rounded-xl transition-all duration-150 ${
            isCurrentWord
              ? (isDarkMode ? 'bg-amber-300 text-slate-950 shadow-lg scale-105' : 'bg-amber-200 text-green-950 shadow-sm scale-105')
              : isCompletedWord
                ? (isDarkMode ? 'text-green-200/85 bg-white/5' : 'text-green-800/80 bg-green-100/60')
                : ''
          }`}
        >
          {token.text}
        </span>
      );
    });
  };

  if (!selectedDua) return null;

  return (
    <div className={`p-6 pb-24 space-y-6 flex flex-col min-h-screen relative transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onTimeUpdate={updateWordHighlight}
        onLoadedMetadata={updateWordHighlight}
      />

      <div className="flex justify-between items-center mb-2 gap-3">
        <button 
          onClick={() => setSelectedDua(null)}
          className={`flex flex-row items-center gap-2 font-bold px-4 py-2 rounded-full shadow-sm border transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
        >
          <ChevronLeft size={20} /> {labels.back}
        </button>

        {hasAuthenticAudio && (
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

      <div className={`rounded-3xl p-6 shadow-sm border-2 space-y-5 flex-1 relative transition-colors ${isDarkMode ? 'bg-slate-800 border-green-900/30 shadow-slate-950/50' : 'bg-white border-green-100'}`}>
        <button 
          onClick={() => toggleFavorite('duas', selectedDua.id)}
          className={`absolute top-5 right-5 p-2 rounded-full transition-all active:scale-125 ${isFavorite ? 'text-red-500 bg-red-50/10' : isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <Heart size={26} className={isFavorite ? 'fill-red-500' : ''} />
        </button>

        <div className="pr-10">
          <div className="text-5xl mb-3">{selectedDua.icon}</div>
          <h2 className={`text-2xl font-black leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {selectedDua.title[selectedLang]}
          </h2>
        </div>

        <div className={`p-5 rounded-3xl border transition-colors ${isDarkMode ? 'bg-green-900/10 border-green-900/30' : 'bg-green-50 border-green-100'}`}>
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <p className={`text-xs uppercase font-bold tracking-wider ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
              {labels.arabic}
            </p>
            {hasExpandedAudioText && (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-slate-700 text-green-300' : 'bg-white text-green-700 border border-green-100'}`}>
                {labels.excerptNote}
              </span>
            )}
          </div>
          <p className={`text-4xl font-arabic leading-relaxed text-right ${isDarkMode ? 'text-green-400' : 'text-green-700'}`} dir="rtl">
            {selectedDua.arabic}
          </p>
        </div>

        {pronunciation && (
          <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-100'}`}>
            <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>{labels.pronunciation}</p>
            <p className={`text-lg font-semibold leading-relaxed ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>{pronunciation}</p>
          </div>
        )}

        <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
          <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{labels.explanation}</p>
          <p className={`text-lg font-semibold leading-relaxed ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>
            {getLangValue(selectedDua.meaning, selectedLang)}
          </p>
          {explanation && explanation !== getLangValue(selectedDua.meaning, selectedLang) && (
            <p className={`text-sm mt-3 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {explanation}
            </p>
          )}
        </div>

        {whenText && (
          <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-amber-900/10 border-amber-900/30' : 'bg-amber-50 border-amber-100'}`}>
            <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>{labels.when}</p>
            <p className={`text-base leading-relaxed font-medium ${isDarkMode ? 'text-slate-100' : 'text-gray-700'}`}>{whenText}</p>
          </div>
        )}

        {hasAuthenticAudio && (
          <div className={`p-5 rounded-3xl border transition-colors ${isDarkMode ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className={isDarkMode ? 'text-emerald-300' : 'text-emerald-700'} />
                <p className={`text-xs uppercase font-bold tracking-wider ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>{labels.fullAudio}</p>
              </div>
              {isPlaying && (
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-slate-700 text-amber-300' : 'bg-white text-amber-700 border border-amber-100'}`}>
                  <BookOpenText size={12} />
                  {labels.wordHighlight}
                </div>
              )}
            </div>

            <p className={`text-3xl font-arabic leading-relaxed text-right ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`} dir="rtl">
              {audioAyahs.length > 0 ? renderHighlightedArabic(apiArabicText) : selectedDua.arabic}
            </p>

            <p className={`text-xs mt-4 ${isDarkMode ? 'text-emerald-200/80' : 'text-emerald-800/80'}`}>
              {labels.fullAudioHint}
            </p>

            <div className={`mt-4 p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-700' : 'bg-white border-emerald-100'}`}>
              <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>{labels.translation}</p>
              <p className={`text-base leading-relaxed font-medium ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>
                {apiTranslationText || explanation}
              </p>
              {!apiTranslationText && (
                <p className={`text-xs mt-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {labels.audioMissing}
                </p>
              )}
              {translationEdition && (
                <p className={`text-[11px] mt-3 font-semibold ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                  {translationEdition}
                </p>
              )}
            </div>
          </div>
        )}
        
        {selectedDua.source && (
          <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>{labels.source}</p>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{selectedDua.source}</p>
          </div>
        )}
      </div>
    </div>
  );
}
