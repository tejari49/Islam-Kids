import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Droplets, ArrowRight, Play, Pause, Loader2, FastForward } from 'lucide-react';
import { wuduSteps, prayers, prayerSteps } from '../data/prayerData';
import { fetchAyahQueue, joinAyahTexts } from '../utils/quranAudio';

export default function PrayerFlow({ selectedLang, setSelectedFeature, isDarkMode }) {
  const [step, setStep] = useState('select_prayer'); // select_prayer, ask_wudu, wudu_guide, prayer_guide
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  
  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentStepAyahs, setCurrentStepAyahs] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset audio when slide changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setImageFailed(false);
    setIsPlaying(false);
    setIsLoadingAudio(false);
  }, [currentSlide, step]);

  useEffect(() => {
    let isCancelled = false;
    const currentStepData = prayerSteps[currentSlide];

    const loadAyahData = async () => {
      if (step !== 'prayer_guide' || !currentStepData?.audioAyahs?.length) {
        setCurrentStepAyahs([]);
        return;
      }

      try {
        const ayahs = await fetchAyahQueue(currentStepData.audioAyahs);
        if (!isCancelled) {
          setCurrentStepAyahs(ayahs);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Gebets-Ayat:", error);
        if (!isCancelled) {
          setCurrentStepAyahs([]);
        }
      }
    };

    loadAyahData();

    return () => {
      isCancelled = true;
    };
  }, [currentSlide, step]);

  const toggleAudio = async () => {
    const currentStepData = prayerSteps[currentSlide];
    if (!currentStepData || (!currentStepData.ayah && !currentStepData.audio && !currentStepData.audioAyahs)) return;

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

    if (audioRef.current.src) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    if ((!currentStepData.audio && !currentStepData.ayah && !currentStepData.audioAyahs) && canUseSpeechSynthesis()) {
      speakArabicText(currentStepData.arabic, playbackRate, {
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onError: (error) => {
          console.error("Speech audio error:", error);
          setIsPlaying(false);
        }
      });
      return;
    }

    setIsLoadingAudio(true);
    try {
      let audioUrls = currentStepData.audio ? [currentStepData.audio] : [];

      if (currentStepData.audioAyahs?.length) {
        const ayahs = currentStepAyahs.length > 0 ? currentStepAyahs : await fetchAyahQueue(currentStepData.audioAyahs);
        setCurrentStepAyahs(ayahs);
        audioUrls = ayahs.map((ayah) => ayah.audio);
      } else if (currentStepData.ayah) {
        const ayah = await fetchAyahQueue([currentStepData.ayah]);
        audioUrls = ayah.map((item) => item.audio);
      }

      if (audioUrls.length > 0) {
        audioRef.current.src = audioUrls[0];
        audioRef.current.playbackRate = playbackRate;

        if (audioUrls.length > 1) {
          let nextIndex = 1;
          audioRef.current.onended = async () => {
            if (nextIndex < audioUrls.length) {
              audioRef.current.src = audioUrls[nextIndex];
              audioRef.current.playbackRate = playbackRate;
              nextIndex += 1;
              await audioRef.current.play();
              return;
            }
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
          };
        } else {
          audioRef.current.onended = () => {
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
          };
        }

        await audioRef.current.play();
        setIsPlaying(true);
      } else if (canUseSpeechSynthesis()) {
        speakArabicText(currentStepData.arabic, playbackRate, {
          onStart: () => setIsPlaying(true),
          onEnd: () => setIsPlaying(false),
          onError: (error) => {
            console.error("Speech audio error:", error);
            setIsPlaying(false);
          }
        });
      }
    } catch (error) {
      console.error("Audio error:", error);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const changeSpeed = () => {
    const speeds = [1.0, 0.75, 0.5];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackRate(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handlePrayerSelect = (prayer) => {
    setSelectedPrayer(prayer);
    setStep('ask_wudu');
  };

  const nextSlide = (listLength, onFinish) => {
    if (currentSlide < listLength - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  if (step === 'select_prayer') {
    return (
      <div className={`p-6 pb-24 space-y-6 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setSelectedFeature(null)} className={`p-2 rounded-full shadow-sm transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>
            <ChevronLeft size={24} />
          </button>
          <h2 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {selectedLang === 'de' ? 'Beten lernen' : selectedLang === 'al' ? 'Mëso të falesh' : 'Namaz kılmayı öğren'}
          </h2>
        </div>

        <div className="grid gap-4">
          {prayers.map((prayer) => (
            <button
              key={prayer.id}
              onClick={() => handlePrayerSelect(prayer)}
              className={`w-full p-5 rounded-3xl shadow-sm border-2 flex items-center gap-4 transition-all active:scale-[0.98] text-left cursor-pointer ${isDarkMode ? 'bg-slate-800 border-indigo-900/30' : 'bg-white border-indigo-100 hover:border-indigo-300'}`}
            >
              <div className={`text-4xl p-3 rounded-2xl transition-colors ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>{prayer.icon}</div>
              <div className="flex-1">
                <h3 className={`font-bold text-xl transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{prayer.name[selectedLang]}</h3>
                <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>{prayer.rakats} Rakat</p>
              </div>
              <ChevronRight className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'ask_wudu') {
    return (
      <div className={`p-6 pb-24 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-blue-50/50'}`}>
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 shadow-inner transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-blue-100'}`}>
          <Droplets size={64} className="text-blue-500" />
        </div>
        <h2 className={`text-3xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {selectedLang === 'de' ? 'Bist du sauber?' : selectedLang === 'al' ? 'A je i pastër?' : 'Temiz misin?'}
        </h2>
        <p className={`text-lg px-4 leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          {selectedLang === 'de' ? 'Hast du schon Wudu (Gebetswaschung) gemacht?' : 
           selectedLang === 'al' ? 'A ke marrë abdes?' : 
           'Abdest aldın mı?'}
        </p>
        
        <div className="flex flex-col w-full px-4 gap-4 mt-8">
          <button 
            onClick={() => { setCurrentSlide(0); setStep('prayer_guide'); }}
            className="w-full bg-green-500 text-white font-bold text-xl py-5 rounded-3xl hover:bg-green-600 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
          >
            <CheckCircle2 size={24} /> {selectedLang === 'de' ? 'Ja, ich bin bereit!' : selectedLang === 'al' ? 'Po, jam gati!' : 'Evet, hazırım!'}
          </button>
          
          <button 
            onClick={() => { setCurrentSlide(0); setStep('wudu_guide'); }}
            className={`w-full font-bold text-xl py-5 rounded-3xl border-2 transition-all shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800 text-blue-400 border-blue-900/30' : 'bg-white text-blue-500 border-blue-200 hover:bg-blue-50'}`}
          >
            {selectedLang === 'de' ? 'Nein, zeig mir Wudu' : selectedLang === 'al' ? 'Jo, më trego abdesin' : 'Hayır, abdesti göster'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'wudu_guide') {
    const currentWuduStep = wuduSteps[currentSlide];
    return (
      <div className={`p-6 pb-24 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-blue-50'}`}>
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setStep('ask_wudu')} className={`p-2 rounded-full shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
          </button>
          <div className={`font-bold px-4 py-1 rounded-full text-sm transition-colors ${isDarkMode ? 'text-blue-400 bg-blue-900/20' : 'text-blue-600 bg-blue-100'}`}>
            {currentSlide + 1} / {wuduSteps.length}
          </div>
        </div>

        <div className={`flex-1 flex flex-col items-center justify-center text-center space-y-8 p-8 rounded-[3rem] shadow-xl border-2 transition-colors relative ${isDarkMode ? 'bg-slate-800 border-blue-900/30 shadow-slate-950/50' : 'bg-white border-blue-100'}`}>
          <div className={`text-8xl mb-4 w-44 h-44 rounded-full flex items-center justify-center border-8 shadow-inner transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-900' : 'bg-blue-50 border-white'}`}>
            {currentWuduStep.image}
          </div>
          <h2 className={`text-3xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{currentWuduStep.title[selectedLang]}</h2>
          <p className={`text-lg leading-relaxed max-w-xs mx-auto transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {currentWuduStep.text[selectedLang]}
          </p>
        </div>

        <div className="flex justify-between items-center mt-8 gap-4">
          <button 
            onClick={() => setCurrentSlide(c => Math.max(0, c - 1))}
            disabled={currentSlide === 0}
            className={`p-5 rounded-3xl transition-all ${currentSlide === 0 ? (isDarkMode ? 'bg-slate-800 text-slate-700' : 'bg-gray-100 text-gray-300') : (isDarkMode ? 'bg-slate-800 text-white shadow-md active:scale-90 cursor-pointer' : 'bg-white text-gray-800 shadow-md active:scale-90 cursor-pointer')}`}
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={() => nextSlide(wuduSteps.length, () => setStep('prayer_guide'))}
            className="flex-1 bg-blue-500 text-white font-bold text-xl py-5 rounded-3xl shadow-lg hover:bg-blue-600 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {currentSlide === wuduSteps.length - 1 ? (selectedLang === 'de' ? 'Beten starten' : selectedLang === 'al' ? 'Fillo namazin' : 'Namaza başla') : (selectedLang === 'de' ? 'Weiter' : selectedLang === 'al' ? 'Tjetra' : 'İleri')}
            {currentSlide === wuduSteps.length - 1 && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'prayer_guide') {
    const currentStep = prayerSteps[currentSlide];
    const apiArabicText = joinAyahTexts(currentStepAyahs);
    const displayArabic = apiArabicText || currentStep.arabic;
    const hasAudio = currentStep.ayah || currentStep.audio || currentStep.audioAyahs;

    return (
      <div className={`p-6 pb-24 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-indigo-50'}`}>
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setStep('select_prayer')} className={`p-2 rounded-full shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
          </button>
          <div className="flex flex-col items-end">
             <div className={`font-bold text-lg leading-tight transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>{selectedPrayer?.name[selectedLang]}</div>
             <div className={`font-bold px-3 py-1 rounded-full text-[10px] mt-1 transition-colors ${isDarkMode ? 'bg-indigo-900/30 text-indigo-500' : 'bg-indigo-100 text-indigo-500'}`}>
               Schritt {currentSlide + 1} / {prayerSteps.length}
             </div>
          </div>
        </div>

        <div className={`flex-1 flex flex-col items-center justify-start text-center space-y-6 p-6 rounded-[3rem] shadow-xl border-2 relative overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-800 border-indigo-900/30 shadow-slate-950/50' : 'bg-white border-indigo-100'}`}>
          {currentStep.illustration && !imageFailed ? (
            <img 
              key={currentStep.id}
              src={currentStep.illustration} 
              alt={currentStep.title[selectedLang]}
              onError={() => setImageFailed(true)}
              className="h-48 w-48 object-contain mx-auto mt-2 drop-shadow-2xl transition-all duration-300 animate-fade-in"
            />
          ) : (
            <div className="text-8xl h-32 flex items-center justify-center mt-2">
              {currentStep.image}
            </div>
          )}
          
          <div className="space-y-4 w-full">
            <h2 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{currentStep.title[selectedLang]}</h2>
            
            <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${isDarkMode ? 'bg-green-900/10 border-green-900/20' : 'bg-green-50/50 border-green-100'}`}>
              <p className={`text-4xl font-arabic leading-normal transition-colors ${isDarkMode ? 'text-green-400' : 'text-green-700'}`} dir="rtl">{displayArabic}</p>
              {!apiArabicText && (
                <p className={`text-sm font-medium italic transition-colors ${isDarkMode ? 'text-green-500/50' : 'text-green-600/70'}`}>{currentStep.transliteration}</p>
              )}
            </div>

            <p className={`text-md leading-relaxed px-2 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {currentStep.text[selectedLang]}
            </p>
          </div>

          {/* Audio Controls */}
          {hasAudio && (
            <div className="flex items-center gap-4 mt-auto pb-4">
               <button 
                onClick={changeSpeed}
                className={`p-3 rounded-2xl font-bold text-xs flex flex-col items-center gap-1 active:scale-95 transition-all ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}
              >
                <FastForward size={16} />
                {playbackRate}x
              </button>

              <button 
                onClick={toggleAudio}
                disabled={isLoadingAudio}
                className={`p-6 rounded-3xl shadow-lg transition-all transform active:scale-90 flex items-center justify-center ${
                  isLoadingAudio ? 'bg-gray-200' : isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isLoadingAudio ? <Loader2 className="animate-spin" size={28} /> : isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6 gap-4">
          <button 
            onClick={() => setCurrentSlide(c => Math.max(0, c - 1))}
            disabled={currentSlide === 0}
            className={`p-5 rounded-3xl transition-all ${currentSlide === 0 ? (isDarkMode ? 'bg-slate-800 text-slate-700' : 'bg-gray-100 text-gray-300') : (isDarkMode ? 'bg-slate-800 text-white shadow-md active:scale-90 cursor-pointer' : 'bg-white text-gray-800 shadow-md active:scale-90 cursor-pointer')}`}
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={() => nextSlide(prayerSteps.length, () => setStep('select_prayer'))}
            className="flex-1 bg-indigo-500 text-white font-bold text-xl py-5 rounded-3xl shadow-lg hover:bg-indigo-600 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {currentSlide === prayerSteps.length - 1 ? (selectedLang === 'de' ? 'Fertig!' : selectedLang === 'al' ? 'Gati!' : 'Bitti!') : (selectedLang === 'de' ? 'Weiter' : selectedLang === 'al' ? 'Tjetra' : 'İleri')}
            {currentSlide === prayerSteps.length - 1 && <CheckCircle2 size={20} />}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
