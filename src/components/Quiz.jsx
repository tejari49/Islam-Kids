import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, Trophy, Star, ArrowRight, Loader2 } from 'lucide-react';

export default function Quiz({ 
  selectedLang, 
  setSelectedFeature, 
  isDarkMode, 
  duas, 
  hadiths, 
  stories, 
  addXp,
  incrementStat 
}) {
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const generateQuestion = useMemo(() => {
    return () => {
      // Safety check for empty data
      if (!duas.length || !hadiths.length || !stories.length) return null;

      const types = ['dua', 'hadith', 'story'];
      const type = types[Math.floor(Math.random() * types.length)];
      let data = type === 'dua' ? duas : type === 'hadith' ? hadiths : stories;
      
      if (data.length === 0) data = duas;
      if (data.length === 0) return null;

      const item = data[Math.floor(Math.random() * data.length)];
      if (!item) return null;

      const others = data.filter(i => i.id !== item.id).sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [item, ...others].sort(() => 0.5 - Math.random());
      
      let questionText = "";
      if (type === 'dua') {
        questionText = selectedLang === 'de' ? "Welches Dua hat dieses Symbol?" : 
                       selectedLang === 'al' ? "Cila Dua ka këtë simbol?" : "Bu sembol hangi duaya ait?";
      } else if (type === 'hadith') {
        questionText = selectedLang === 'de' ? "Welcher Hadith passt zu diesem Thema?" : 
                       selectedLang === 'al' ? "Cili Hadith i përshtatet kësaj teme?" : "Bu konuya hangi hadis uygundur?";
      } else {
        questionText = selectedLang === 'de' ? "Aus welcher Geschichte ist dieses Symbol?" : 
                       selectedLang === 'al' ? "Nga cila histori është ky simbol?" : "Bu sembol hangi hikayeden?";
      }

      return {
        type,
        item,
        questionText,
        options,
        correctId: item.id
      };
    };
  }, [duas, hadiths, stories, selectedLang]);

  // Use state but initialize it only when data is ready
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    if (!currentQuestion) {
      const q = generateQuestion();
      if (q) setCurrentQuestion(q);
    }
  }, [currentQuestion, generateQuestion]);

  const handleOptionClick = (optionId) => {
    if (selectedOption !== null || !currentQuestion) return;
    
    setSelectedOption(optionId);
    const correct = optionId === currentQuestion.correctId;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
      addXp(20);
    }
    
    setTimeout(() => {
      if (questionsAnswered + 1 >= 5) {
        setShowResult(true);
        incrementStat('quizzesPlayed');
      } else {
        setQuestionsAnswered(q => q + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setCurrentQuestion(generateQuestion());
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentQuestion(generateQuestion());
  };

  if (!currentQuestion && !showResult) {
    return (
      <div className={`p-6 flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin text-green-500 mb-4" size={48} />
        <p className="font-bold">Bereite Fragen vor...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className={`p-6 pb-24 flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-yellow-50/30'}`}>
        <div className="relative">
          <Trophy size={100} className="text-yellow-500 animate-bounce" />
          <Star size={30} className="absolute -top-2 -right-2 text-yellow-400 fill-yellow-400 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h2 className={`text-4xl font-black transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {selectedLang === 'de' ? 'Super gemacht!' : selectedLang === 'al' ? 'Pune e shkelqyer!' : 'Harika iş!'}
          </h2>
          <p className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            {score} / 5 {selectedLang === 'de' ? 'richtig beantwortet' : selectedLang === 'al' ? 'përgjigje të sakta' : 'doğru cevap'}
          </p>
        </div>

        <div className={`p-6 rounded-3xl border-2 w-full max-w-xs transition-colors ${isDarkMode ? 'bg-slate-800 border-yellow-900/30' : 'bg-white border-yellow-100'}`}>
          <p className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-1">Belohnung</p>
          <p className="text-4xl font-black text-green-500">+{score * 20} EP</p>
        </div>

        <div className="flex flex-col w-full gap-4">
          <button 
            onClick={resetQuiz}
            className="w-full bg-yellow-500 text-white font-black text-xl py-5 rounded-3xl shadow-lg hover:bg-yellow-600 active:scale-95 transition-all cursor-pointer"
          >
            {selectedLang === 'de' ? 'Nochmal spielen' : selectedLang === 'al' ? 'Luaj përsëri' : 'Tekrar oyna'}
          </button>
          <button 
            onClick={() => setSelectedFeature(null)}
            className={`w-full font-bold text-xl py-5 rounded-3xl border-2 transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
          >
            {selectedLang === 'de' ? 'Beenden' : selectedLang === 'al' ? 'Mbyll' : 'Kapat'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 pb-24 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setSelectedFeature(null)} className={`p-2 rounded-full shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
        </button>
        <div className={`font-black px-4 py-1 rounded-full text-xs tracking-widest transition-colors ${isDarkMode ? 'text-yellow-500 bg-yellow-900/20' : 'text-yellow-600 bg-yellow-100'}`}>
          FRAGE {questionsAnswered + 1} / 5
        </div>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center text-center space-y-8 p-8 rounded-[3rem] shadow-xl border-2 transition-colors relative ${isDarkMode ? 'bg-slate-800 border-yellow-900/20 shadow-slate-950/50' : 'bg-white border-yellow-50'}`}>
        <div className="text-8xl mb-2 animate-bounce-slow">
          {currentQuestion.item.icon}
        </div>
        
        <h2 className={`text-2xl font-black leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {currentQuestion.questionText}
        </h2>

        <div className="grid grid-cols-1 w-full gap-3 mt-4">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isTarget = isCorrect !== null && option.id === currentQuestion.correctId;
            const isWrong = isCorrect === false && isSelected;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={selectedOption !== null}
                className={`w-full p-4 rounded-2xl border-2 font-bold transition-all flex items-center gap-3 text-left ${
                  isTarget ? 'bg-green-500 border-green-600 text-white translate-x-1 shadow-md' :
                  isWrong ? 'bg-red-500 border-red-600 text-white -translate-x-1 shake' :
                  isDarkMode ? 'bg-slate-700/50 border-slate-700 text-slate-200 hover:bg-slate-700' : 
                  'bg-gray-50 border-gray-100 text-gray-700 hover:border-yellow-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${isTarget || isWrong ? 'bg-white/20 border-white/40' : 'bg-white border-gray-200'}`}>
                  {isTarget ? <CheckCircle2 size={18} /> : isWrong ? <XCircle size={18} /> : ''}
                </div>
                <span className="flex-1 truncate">{option.title[selectedLang]}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {selectedOption !== null && (
        <div className="mt-8 flex justify-center animate-fade-in">
           <div className={`px-6 py-3 rounded-2xl font-black text-lg flex items-center gap-2 shadow-lg ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
             {isCorrect ? (selectedLang === 'de' ? 'Richtig!' : 'E saktë!') : (selectedLang === 'de' ? 'Ooh, fast!' : 'Pothuajse!')}
             {isCorrect && <ArrowRight />}
           </div>
        </div>
      )}
    </div>
  );
}
