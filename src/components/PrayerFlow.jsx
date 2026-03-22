import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Droplets, ArrowRight } from 'lucide-react';
import { wuduSteps, prayers, prayerSteps } from '../data/prayerData';

export default function PrayerFlow({ selectedLang, setSelectedFeature }) {
  const [step, setStep] = useState('select_prayer'); // select_prayer, ask_wudu, wudu_guide, prayer_guide
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (step === 'select_prayer') {
    return (
      <div className="p-6 pb-24 space-y-6 flex flex-col min-h-screen bg-gray-50">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setSelectedFeature(null)} className="p-2 bg-white rounded-full shadow-sm">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedLang === 'de' ? 'Beten lernen' : selectedLang === 'al' ? 'Mëso të falesh' : 'Namaz kılmayı öğren'}
          </h2>
        </div>

        <div className="space-y-4">
          {prayers.map((prayer) => (
            <button
              key={prayer.id}
              onClick={() => handlePrayerSelect(prayer)}
              className="w-full bg-white p-5 rounded-3xl shadow-sm border-2 border-indigo-100 flex items-center gap-4 hover:border-indigo-300 transition-all text-left"
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
        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Droplets size={64} className="text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          {selectedLang === 'de' ? 'Bist du sauber?' : selectedLang === 'al' ? 'A je i pastër?' : 'Temiz misin?'}
        </h2>
        <p className="text-gray-600 text-lg px-4">
          {selectedLang === 'de' ? 'Hast du schon Wudu (Gebetswaschung) gemacht?' : 
           selectedLang === 'al' ? 'A ke marrë abdes?' : 
           'Abdest aldın mı?'}
        </p>
        
        <div className="flex flex-col w-full px-4 gap-4 mt-8">
          <button 
            onClick={() => { setCurrentSlide(0); setStep('prayer_guide'); }}
            className="w-full bg-green-500 text-white font-bold text-xl py-4 rounded-2xl hover:bg-green-600 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={24} /> {selectedLang === 'de' ? 'Ja, ich bin bereit!' : selectedLang === 'al' ? 'Po, jam gati!' : 'Evet, hazırım!'}
          </button>
          
          <button 
            onClick={() => { setCurrentSlide(0); setStep('wudu_guide'); }}
            className="w-full bg-white text-blue-500 font-bold text-xl py-4 rounded-2xl border-2 border-blue-200 hover:bg-blue-50 active:scale-95 transition-all shadow-sm"
          >
            {selectedLang === 'de' ? 'Nein, zeig mir wie Wudu geht' : selectedLang === 'al' ? 'Jo, më trego si merret abdesi' : 'Hayır, bana abdesti göster'}
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
          <button onClick={() => setStep('ask_wudu')} className="p-2 bg-white rounded-full shadow-sm">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div className="font-bold text-blue-600 bg-blue-100 px-4 py-1 rounded-full">
            Schritt {currentSlide + 1} / {wuduSteps.length}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 bg-white p-8 rounded-3xl shadow-sm border-2 border-blue-100 relative">
          <div className="text-8xl mb-4 bg-blue-50 w-40 h-40 rounded-full flex items-center justify-center border-4 border-blue-100">
            {currentWuduStep.image}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{currentWuduStep.title[selectedLang]}</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
            {currentWuduStep.text[selectedLang]}
          </p>
        </div>

        <div className="flex justify-between items-center mt-8 gap-4">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-4 rounded-full ${currentSlide === 0 ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-800 shadow-md'}`}
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={() => nextSlide(wuduSteps.length, () => setStep('prayer_guide'))}
            className="flex-1 bg-blue-500 text-white font-bold text-xl py-4 rounded-2xl shadow-md hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            {currentSlide === wuduSteps.length - 1 ? (selectedLang === 'de' ? 'Beten starten' : selectedLang === 'al' ? 'Fillo namazin' : 'Namaza başla') : (selectedLang === 'de' ? 'Weiter' : selectedLang === 'al' ? 'Tjetra' : 'İleri')}
            {currentSlide === wuduSteps.length - 1 && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'prayer_guide') {
    const currentPrayerStep = prayerSteps[currentSlide];

    return (
      <div className="p-6 pb-24 flex flex-col min-h-screen bg-indigo-50">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setStep('select_prayer')} className="p-2 bg-white rounded-full shadow-sm">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div className="flex flex-col items-end">
             <div className="font-bold text-indigo-800 text-lg">{selectedPrayer?.name[selectedLang]}</div>
             <div className="font-bold text-indigo-500 bg-indigo-100 px-3 py-1 rounded-full text-xs">
               Schritt {currentSlide + 1} / {prayerSteps.length}
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 bg-white p-8 rounded-3xl shadow-sm border-2 border-indigo-100 relative">
          <div className="text-9xl mb-4 h-48 flex items-center justify-center">
            {currentPrayerStep.image}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{currentPrayerStep.title[selectedLang]}</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
            {currentPrayerStep.text[selectedLang]}
          </p>
        </div>

        <div className="flex justify-between items-center mt-8 gap-4">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-4 rounded-full ${currentSlide === 0 ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-800 shadow-md'}`}
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={() => nextSlide(prayerSteps.length, () => setStep('select_prayer'))}
            className="flex-1 bg-indigo-500 text-white font-bold text-xl py-4 rounded-2xl shadow-md hover:bg-indigo-600 flex items-center justify-center gap-2"
          >
            {currentSlide === prayerSteps.length - 1 ? (selectedLang === 'de' ? 'Gebet beenden' : selectedLang === 'al' ? 'Përfundo namazin' : 'Namazı bitir') : (selectedLang === 'de' ? 'Weiter' : selectedLang === 'al' ? 'Tjetra' : 'İleri')}
            {currentSlide === prayerSteps.length - 1 && <CheckCircle2 size={20} />}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
