import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Droplets, ArrowRight, Play, Pause, Loader2, FastForward } from 'lucide-react';
import { wuduSteps, prayers, prayerSteps } from '../data/prayerData';

export default function PrayerFlow({ selectedLang, setSelectedFeature }) {
  const [step, setStep] = useState('select_prayer'); // select_prayer, ask_wudu, wudu_guide, prayer_guide
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset audio when slide changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsLoadingAudio(false);
  }, [currentSlide, step]);

  const toggleAudio = async () => {
    const currentStepData = prayerSteps[currentSlide];
    if (!currentStepData || (!currentStepData.ayah && !currentStepData.audio)) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current.src) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsLoadingAudio(true);
    try {
      let audioUrl = currentStepData.audio;
      
      if (currentStepData.ayah) {
        const response = await fetch(`https://api.alquran.cloud/v1/ayah/${currentStepData.ayah}/ar.alafasy`);
        const data = await response.json();
        audioUrl = data.data.audio;
      }

      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.playbackRate = playbackRate;
        await audioRef.current.play();
        setIsPlaying(true);
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
      <div className="p-6 pb-24 space-y-6 flex flex-col min-h-screen bg-gray-50">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setSelectedFeature(null)} className="p-2 bg-white rounded-full shadow-sm cursor-pointer">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedLang === 'de' ? 'Beten lernen' : selectedLang === 'al' ? 'Mëso të falesh' : 'Namaz kılmayı öğren'}
          </h2>
        </div>

        <div className="grid gap-4">
          {prayers.map((prayer) => (
            <button
              key={prayer.id}
              onClick={() => handlePrayerSelect(prayer)}
              className="w-full bg-white p-5 rounded-3xl shadow-sm border-2 border-indigo-100 flex items-center gap-4 hover:border-indigo-300 active:scale-[0.98] transition-all text-left cursor-pointer"
            >
              <div className="text-4xl bg-indigo-50 p-3 rounded-2xl">{prayer.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-800">{prayer.name[selectedLang]}</h3>
                <p className="text-sm text-indigo-500 font-bold">{prayer.rakats} Rakat</p>
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
      <div className="p-6 pb-24 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 bg-blue-50/50">
        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <Droplets size={64} className="text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          {selectedLang === 'de' ? 'Bist du sauber?' : selectedLang === 'al' ? 'A je i pastër?' : 'Temiz misin?'}
        </h2>
        <p className="text-gray-600 text-lg px-4 leading-relaxed">
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
            className="w-full bg-white text-blue-500 font-bold text-xl py-5 rounded-3xl border-2 border-blue-200 hover:bg-blue-50 active:scale-95 transition-all shadow-sm cursor-pointer"
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
      <div className="p-6 pb-24 flex flex-col min-h-screen bg-blue-50">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setStep('ask_wudu')} className="p-2 bg-white rounded-full shadow-sm cursor-pointer">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div className="font-bold text-blue-600 bg-blue-100 px-4 py-1 rounded-full text-sm">
            {currentSlide + 1} / {wuduSteps.length}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 bg-white p-8 rounded-[3rem] shadow-xl border-2 border-blue-100 relative">
          <div className="text-8xl mb-4 bg-blue-50 w-44 h-44 rounded-full flex items-center justify-center border-8 border-white shadow-inner">
            {currentWuduStep.image}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{currentWuduStep.title[selectedLang]}</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
            {currentWuduStep.text[selectedLang]}
          </p>
        </div>

        <div className="flex justify-between items-center mt-8 gap-4">
          <button 
            onClick={() => setCurrentSlide(c => Math.max(0, c - 1))}
            disabled={currentSlide === 0}
            className={`p-5 rounded-3xl transition-all ${currentSlide === 0 ? 'bg-gray-100 text-gray-300' : 'bg-white text-gray-800 shadow-md active:scale-90 cursor-pointer'}`}
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
    const hasAudio = currentStep.ayah || currentStep.audio;

    return (
      <div className="p-6 pb-24 flex flex-col min-h-screen bg-indigo-50">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setStep('select_prayer')} className="p-2 bg-white rounded-full shadow-sm cursor-pointer">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div className="flex flex-col items-end">
             <div className="font-bold text-indigo-800 text-lg leading-tight">{selectedPrayer?.name[selectedLang]}</div>
             <div className="font-bold text-indigo-500 bg-indigo-100 px-3 py-1 rounded-full text-[10px] mt-1">
               Schritt {currentSlide + 1} / {prayerSteps.length}
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-start text-center space-y-6 bg-white p-6 rounded-[3rem] shadow-xl border-2 border-indigo-100 relative overflow-hidden">
          <div className="text-8xl h-32 flex items-center justify-center mt-2">
            {currentStep.image}
          </div>
          
          <div className="space-y-4 w-full">
            <h2 className="text-2xl font-bold text-gray-800">{currentStep.title[selectedLang]}</h2>
            
            <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 space-y-4">
              <p className="text-4xl font-arabic text-green-700 leading-normal" dir="rtl">{currentStep.arabic}</p>
              <p className="text-sm font-medium text-green-600/70 italic">{currentStep.transliteration}</p>
            </div>

            <p className="text-md text-gray-600 leading-relaxed px-2">
              {currentStep.text[selectedLang]}
            </p>
          </div>

          {/* Audio Controls */}
          {hasAudio && (
            <div className="flex items-center gap-4 mt-auto pb-4">
               <button 
                onClick={changeSpeed}
                className="p-3 bg-gray-100 rounded-2xl text-gray-600 font-bold text-xs flex flex-col items-center gap-1 active:scale-95 transition-all"
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
            className={`p-5 rounded-3xl transition-all ${currentSlide === 0 ? 'bg-gray-100 text-gray-300' : 'bg-white text-gray-800 shadow-md active:scale-90 cursor-pointer'}`}
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
