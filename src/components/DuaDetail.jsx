import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, Play, Pause, Loader2, Heart, Languages } from 'lucide-react';
import { fetchAyahQueue, fetchAyahTranslationQueue, joinAyahTexts } from '../utils/quranAudio';
import { canUseSpeechSynthesis, speakArabicText, stopSpeechPlayback, toggleSpeechPause } from '../utils/audio';

const detailLabels = {
  de: {
    back: 'Zurück',
    partialDua: 'Dua-Auszug',
    fullPlayback: 'Vollständige Wiedergabe',
    fullPlaybackHint: 'Hier wird die vollständige Aya bzw. die komplette Audio-Wiedergabe angezeigt.',
    excerptHint: 'Das ist der kurze Dua-Teil, der Kindern zum Lernen gezeigt wird.',
    audioInfo: 'Das Audio spielt die vollständige Quran-Aya aus der API-Datenbank.',
    pronunciation: 'Aussprache',
    translation: 'Übersetzung',
    meaning: 'Bedeutung',
    meaningHint: 'Kurz erklärt',
    source: 'Quelle',
    translationFallback: 'Für diese Sprache wurde keine vollständige API-Übersetzung gefunden. Es wird die gespeicherte Dua-Bedeutung angezeigt.',
    spokenWord: 'Mitlaufendes Wort-Highlight aktiv'
  },
  al: {
    back: 'Mbrapsht',
    partialDua: 'Pjesa e duasë',
    fullPlayback: 'Leximi i plotë',
    fullPlaybackHint: 'Këtu shfaqet ajeti i plotë ose i gjithë teksti që luhet në audio.',
    excerptHint: 'Kjo është pjesa e shkurtër e duasë për t’u mësuar më lehtë nga fëmijët.',
    audioInfo: 'Audio luan ajetin e plotë nga databaza e Kuranit.',
    pronunciation: 'Shqiptimi',
    translation: 'Përkthimi',
    meaning: 'Kuptimi',
    meaningHint: 'Shpjegim i shkurtër',
    source: 'Burimi',
    translationFallback: 'Për këtë gjuhë nuk u gjet një përkthim i plotë nga API. Po shfaqet kuptimi i ruajtur i duasë.',
    spokenWord: 'Fjala që po lexohet theksohet'
  },
  tr: {
    back: 'Geri',
    partialDua: 'Dua özeti',
    fullPlayback: 'Tam okunan metin',
    fullPlaybackHint: 'Burada sesle okunan tam ayet ya da tam metin gösterilir.',
    excerptHint: 'Bu, çocukların öğrenmesi için gösterilen kısa dua kısmıdır.',
    audioInfo: 'Ses, API veritabanındaki tam Kur’an ayetini oynatır.',
    pronunciation: 'Okunuş',
    translation: 'Tercüme',
    meaning: 'Anlamı',
    meaningHint: 'Kısa açıklama',
    source: 'Kaynak',
    translationFallback: 'Bu dil için tam API tercümesi bulunamadı. Kayıtlı dua anlamı gösteriliyor.',
    spokenWord: 'Konuşulan kelime vurgulanıyor'
  }
};

function tokenizeArabicText(text = '') {
  return text
    .split(/(\s+)/)
    .filter((token) => token.length > 0)
    .map((token) => ({
      text: token,
      isSpace: /^\s+$/.test(token)
    }));
}

function normalizeComparableText(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, '')
    .replace(/[^؀-ۿ0-9A-Za-z]+/g, '');
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
  const audioAyahRefs = selectedDua?.audioAyahs?.length ? selectedDua.audioAyahs : (selectedDua?.ayah ? [selectedDua.ayah] : []);
  const audioAyahRefKey = audioAyahRefs.join('|');
  const apiArabicText = joinAyahTexts(audioAyahs);
  const apiTranslationText = joinAyahTexts(translationAyahs);
  const showsFullAyahText = Boolean(apiArabicText);
  const displayArabic = showsFullAyahText ? apiArabicText : selectedDua?.arabic;
  const displayTranslation = apiTranslationText || selectedDua?.meaning?.[selectedLang] || '';
  const labels = detailLabels[selectedLang] || detailLabels.de;
  const hasTextMismatch = showsFullAyahText && normalizeComparableText(apiArabicText) !== normalizeComparableText(selectedDua?.arabic || '');
  const showSeparateMeaning = Boolean(apiTranslationText) && Boolean(selectedDua?.meaning?.[selectedLang]) && apiTranslationText.trim() !== selectedDua.meaning[selectedLang].trim();

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
    stopSpeechPlayback();
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
    const currentRefs = audioAyahRefKey ? audioAyahRefKey.split('|').filter(Boolean) : [];

    const loadAyahData = async () => {
      if (currentRefs.length === 0) {
        setAudioAyahs([]);
        setCurrentAudioQueue([]);
        setTranslationAyahs([]);
        setTranslationEdition('');
        return;
      }

      try {
        const [ayahs, translations] = await Promise.all([
          fetchAyahQueue(currentRefs),
          fetchAyahTranslationQueue(currentRefs, selectedLang)
        ]);

        if (!isCancelled) {
          setAudioAyahs(ayahs);
          setCurrentAudioQueue(ayahs.map((ayah) => ayah.audio));
          setTranslationAyahs(translations);
          setTranslationEdition(translations.find((entry) => entry.edition)?.edition || '');
        }
      } catch (error) {
        console.error('Fehler beim Laden der Aya-Daten:', error);
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
  }, [audioAyahRefKey, selectedLang]);

  const currentAyahText = audioAyahs[currentAudioIndex]?.text || displayArabic || '';

  const currentAyahWordCount = useMemo(() => {
    return tokenizeArabicText(currentAyahText).filter((token) => !token.isSpace).length;
  }, [currentAyahText]);

  const updateWordHighlight = () => {
    if (!audioRef.current) {
      setCurrentWordIndex(-1);
      return;
    }

    const duration = audioRef.current.duration || 0;
    const currentTime = audioRef.current.currentTime || 0;

    if (!duration || !currentAyahWordCount) {
      setCurrentWordIndex(-1);
      return;
    }

    const progress = Math.min(Math.max(currentTime / duration, 0), 0.999999);
    const nextWordIndex = Math.min(
      currentAyahWordCount - 1,
      Math.floor(progress * currentAyahWordCount)
    );

    setCurrentWordIndex(nextWordIndex);
  };

  const loadQueueItem = async (urls, index) => {
    if (!audioRef.current || !urls[index]) return;

    setCurrentWordIndex(0);
    setCurrentAudioIndex(index);
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
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      toggleSpeechPause(true);
      setIsPlaying(false);
      return;
    }

    if (toggleSpeechPause(false)) {
      setIsPlaying(true);
      return;
    }

    if (currentAudioQueue.length > 0) {
      try {
        if (audioRef.current.src) {
          await audioRef.current.play();
        } else {
          await loadQueueItem(currentAudioQueue, 0);
        }
        setIsPlaying(true);
      } catch (err) {
        console.error('Fehler beim Abspielen:', err);
      }
      return;
    }

    if (audioAyahRefs.length > 0) {
      setIsLoadingAudio(true);

      try {
        const ayahs = await fetchAyahQueue(audioAyahRefs);
        const translations = await fetchAyahTranslationQueue(audioAyahRefs, selectedLang);
        const responses = ayahs.map((ayah) => ayah.audio);

        setAudioAyahs(ayahs);
        setTranslationAyahs(translations);
        setTranslationEdition(translations.find((entry) => entry.edition)?.edition || '');
        setCurrentAudioQueue(responses);
        await loadQueueItem(responses, 0);
      } catch (error) {
        console.error('Fehler beim Laden des Audios:', error);
        alert('Audio konnte nicht geladen werden. Bitte überprüfe deine Internetverbindung.');
      } finally {
        setIsLoadingAudio(false);
      }
      return;
    }

    if (canUseSpeechSynthesis()) {
      try {
        speakArabicText(selectedDua?.arabic, 0.9, {
          onStart: () => {
            setCurrentWordIndex(0);
            setIsPlaying(true);
          },
          onEnd: () => {
            setCurrentWordIndex(-1);
            setIsPlaying(false);
          },
          onError: (error) => {
            console.error('Sprachausgabe Fehler:', error);
            setCurrentWordIndex(-1);
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.error('Sprachausgabe konnte nicht gestartet werden:', error);
      }
    }
  };

  const renderHighlightedArabic = () => {
    const ayahGroups = audioAyahs.length > 0 ? audioAyahs : [{ text: displayArabic }];

    return ayahGroups.map((ayah, ayahIndex) => {
      const tokens = tokenizeArabicText(ayah.text || '');
      let wordCounter = -1;

      return (
        <span key={`${ayah.ayahRef || 'dua'}-${ayahIndex}`} className="inline">
          {tokens.map((token, tokenIndex) => {
            if (token.isSpace) {
              return <span key={`space-${ayahIndex}-${tokenIndex}`}>{token.text}</span>;
            }

            wordCounter += 1;
            const isCurrentWord = ayahIndex === currentAudioIndex && wordCounter === currentWordIndex && isPlaying;
            const isCompletedWord = ayahIndex < currentAudioIndex || (ayahIndex === currentAudioIndex && wordCounter < currentWordIndex);

            return (
              <span
                key={`word-${ayahIndex}-${tokenIndex}`}
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
          })}
          {ayahIndex < ayahGroups.length - 1 && <span className="mx-2"> </span>}
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

      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setSelectedDua(null)}
          className={`flex flex-row items-center gap-2 font-bold px-4 py-2 rounded-full shadow-sm border transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
        >
          <ChevronLeft size={20} /> {labels.back}
        </button>
        {(audioAyahRefs.length > 0 || canUseSpeechSynthesis()) && (
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
          <div className={`p-5 rounded-2xl border text-left transition-colors ${isDarkMode ? 'bg-green-900/10 border-green-900/30' : 'bg-green-50 border-green-100'}`}>
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <p className={`text-xs uppercase font-bold tracking-wider ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                {labels.fullPlayback}
              </p>
              {isPlaying && (
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-slate-700 text-amber-300' : 'bg-white text-amber-700 border border-amber-100'}`}>
                  <Languages size={12} />
                  {labels.spokenWord}
                </div>
              )}
            </div>

            <p className={`text-4xl font-arabic leading-relaxed text-right transition-colors ${isDarkMode ? 'text-green-400' : 'text-green-700'}`} dir="rtl">
              {renderHighlightedArabic()}
            </p>

            <p className={`text-xs mt-4 ${isDarkMode ? 'text-green-200/80' : 'text-green-800/80'}`}>
              {labels.fullPlaybackHint}
            </p>
          </div>

          <div className={`p-4 rounded-xl border text-left transition-colors ${isDarkMode ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
            <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-blue-300/80' : 'text-blue-500'}`}>{labels.translation}</p>
            <p className={`text-lg font-medium leading-relaxed ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>
              {displayTranslation}
            </p>
            {!apiTranslationText && showsFullAyahText && (
              <p className={`text-xs mt-3 ${isDarkMode ? 'text-blue-200/75' : 'text-blue-700/80'}`}>
                {labels.translationFallback}
              </p>
            )}
            {translationEdition && (
              <p className={`text-[11px] mt-3 font-semibold ${isDarkMode ? 'text-blue-200/60' : 'text-blue-700/70'}`}>
                {translationEdition}
              </p>
            )}
          </div>

          {selectedDua.transliteration && (
            <div className={`p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{labels.pronunciation}</p>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{selectedDua.transliteration}</p>
            </div>
          )}

          {showSeparateMeaning && (
            <div className={`p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-indigo-900/10 border-indigo-900/30' : 'bg-indigo-50 border-indigo-100'}`}>
              <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-indigo-300/80' : 'text-indigo-500'}`}>{labels.meaning}</p>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{selectedDua.meaning[selectedLang]}</p>
              <p className={`text-xs mt-3 ${isDarkMode ? 'text-indigo-200/70' : 'text-indigo-700/75'}`}>{labels.meaningHint}</p>
            </div>
          )}

          {hasTextMismatch && (
            <div className={`p-4 rounded-xl border text-left transition-colors ${isDarkMode ? 'bg-amber-900/10 border-amber-800/40' : 'bg-amber-50 border-amber-100'}`}>
              <p className={`text-xs uppercase font-bold tracking-wider mb-2 ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                {labels.partialDua}
              </p>
              <p className={`text-2xl font-arabic leading-relaxed text-right ${isDarkMode ? 'text-amber-100' : 'text-amber-900'}`} dir="rtl">
                {selectedDua.arabic}
              </p>
              <p className={`text-base mt-4 font-medium ${isDarkMode ? 'text-amber-50' : 'text-amber-900'}`}>
                {selectedDua.meaning[selectedLang]}
              </p>
              <p className={`text-xs mt-3 ${isDarkMode ? 'text-amber-200/80' : 'text-amber-800/80'}`}>
                {labels.excerptHint} {labels.audioInfo}
              </p>
            </div>
          )}
          
          {!showSeparateMeaning && !displayTranslation && selectedDua.meaning?.[selectedLang] && (
            <div className={`p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
              <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-blue-400/60' : 'text-blue-400'}`}>{labels.meaning}</p>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{selectedDua.meaning[selectedLang]}</p>
            </div>
          )}

          {selectedDua.source && (
            <div className={`p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-emerald-400/60' : 'text-emerald-500'}`}>{labels.source}</p>
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{selectedDua.source}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
