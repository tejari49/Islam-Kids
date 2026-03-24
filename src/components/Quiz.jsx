import React, { useMemo, useState } from 'react';
import { ChevronLeft, CheckCircle2, XCircle, Trophy, Star, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { prayerSteps } from '../data/prayerData';

function getLangValue(value, lang) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.de || Object.values(value)[0] || '';
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean).map((value) => value.trim()))];
}

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed(array, seed) {
  const items = [...array];
  const rand = mulberry32(seed || 1);
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function buildOptions(correct, pool, seed) {
  const others = shuffleWithSeed(uniqueStrings(pool).filter((item) => item !== correct), seed).slice(0, 3);
  return shuffleWithSeed([correct, ...others], seed + 17);
}

const labels = {
  de: {
    preparing: 'Bereite Fragen vor…',
    question: 'FRAGE',
    great: 'Super gemacht!',
    correctAnswers: 'richtig beantwortet',
    reward: 'Belohnung',
    playAgain: 'Nochmal spielen',
    finish: 'Beenden',
    correct: 'Richtig!',
    almost: 'Fast!',
    iconQuestionDua: 'Welches Dua passt zu diesem Symbol?',
    iconQuestionStory: 'Zu welcher Geschichte gehört dieses Symbol?',
    duaWhen: 'Welches Dua passt zu dieser Situation?',
    duaMeaning: 'Welche Erklärung passt am besten zu diesem Dua?',
    prayerSay: 'Was sagt man in diesem Gebetsschritt?',
    prayerWhere: 'In welchem Gebetsschritt sagt man das?',
    storySummary: 'Welche Geschichte passt zu dieser Beschreibung?',
    storyLesson: 'Was lernen wir aus dieser Geschichte?',
    hadithQuestion: 'Welcher Hadith passt am besten dazu?',
    categoryDua: 'Dua',
    categoryPrayer: 'Gebet',
    categoryStory: 'Geschichte',
    categoryHadith: 'Hadith'
  },
  al: {
    preparing: 'Po përgatiten pyetjet…',
    question: 'PYETJA',
    great: 'Shumë bukur!',
    correctAnswers: 'përgjigje të sakta',
    reward: 'Shpërblimi',
    playAgain: 'Luaj përsëri',
    finish: 'Mbyll',
    correct: 'E saktë!',
    almost: 'Afër!',
    iconQuestionDua: 'Cila dua i përshtatet këtij simboli?',
    iconQuestionStory: 'Me cilën histori lidhet ky simbol?',
    duaWhen: 'Cila dua i përshtatet kësaj situate?',
    duaMeaning: 'Cili shpjegim i përshtatet më mirë kësaj duaje?',
    prayerSay: 'Çfarë thuhet në këtë hap të namazit?',
    prayerWhere: 'Në cilin hap të namazit thuhet kjo?',
    storySummary: 'Cila histori i përshtatet këtij përshkrimi?',
    storyLesson: 'Çfarë mësojmë nga kjo histori?',
    hadithQuestion: 'Cili hadith i përshtatet më mirë kësaj?',
    categoryDua: 'Dua',
    categoryPrayer: 'Namaz',
    categoryStory: 'Histori',
    categoryHadith: 'Hadith'
  },
  tr: {
    preparing: 'Sorular hazırlanıyor…',
    question: 'SORU',
    great: 'Harika iş!',
    correctAnswers: 'doğru cevap',
    reward: 'Ödül',
    playAgain: 'Tekrar oyna',
    finish: 'Kapat',
    correct: 'Doğru!',
    almost: 'Yaklaştın!',
    iconQuestionDua: 'Bu sembole hangi dua uyar?',
    iconQuestionStory: 'Bu sembol hangi hikâyeye ait?',
    duaWhen: 'Bu duruma hangi dua uygundur?',
    duaMeaning: 'Bu duaya en uygun açıklama hangisi?',
    prayerSay: 'Bu namaz adımında ne söylenir?',
    prayerWhere: 'Bu ifade namazın hangi adımında söylenir?',
    storySummary: 'Bu açıklamaya hangi hikâye uyar?',
    storyLesson: 'Bu hikâyeden ne öğreniyoruz?',
    hadithQuestion: 'Buna en uygun hadis hangisi?',
    categoryDua: 'Dua',
    categoryPrayer: 'Namaz',
    categoryStory: 'Hikâye',
    categoryHadith: 'Hadis'
  }
};

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
  const t = labels[selectedLang] || labels.de;
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [roundSeed, setRoundSeed] = useState(1);

  const questionBank = useMemo(() => {
    if (!duas.length || !hadiths.length || !stories.length) return [];

    const bank = [];
    const featuredStories = stories.filter((story) => story.featured || story.summary || story.lesson).slice(0, 24);
    const duaTitles = duas.map((dua) => getLangValue(dua.title, selectedLang));
    const duaExplanations = duas.map((dua) => getLangValue(dua.explanation, selectedLang) || getLangValue(dua.meaning, selectedLang));
    const prayerTitles = prayerSteps.map((step) => getLangValue(step.title, selectedLang));
    const prayerSayings = prayerSteps.map((step) => step.transliteration || getLangValue(step.title, selectedLang));
    const storyTitles = featuredStories.map((story) => getLangValue(story.title, selectedLang));
    const storyLessons = featuredStories.map((story) => getLangValue(story.lesson, selectedLang));
    const hadithTitles = hadiths.map((hadith) => getLangValue(hadith.title, selectedLang));

    duas.forEach((dua, index) => {
      const title = getLangValue(dua.title, selectedLang);
      const whenText = getLangValue(dua.when, selectedLang);
      const explanation = getLangValue(dua.explanation, selectedLang) || getLangValue(dua.meaning, selectedLang);

      if (dua.icon) {
        bank.push({
          category: t.categoryDua,
          prompt: t.iconQuestionDua,
          visual: dua.icon,
          options: buildOptions(title, duaTitles, 100 + index),
          correctAnswer: title,
          explanation
        });
      }

      if (whenText) {
        bank.push({
          category: t.categoryDua,
          prompt: t.duaWhen,
          helper: whenText,
          options: buildOptions(title, duaTitles, 200 + index),
          correctAnswer: title,
          explanation
        });
      }

      if (title && explanation) {
        bank.push({
          category: t.categoryDua,
          prompt: `${t.duaMeaning}`,
          helper: title,
          options: buildOptions(explanation, duaExplanations, 300 + index),
          correctAnswer: explanation,
          explanation: whenText || explanation
        });
      }
    });

    prayerSteps.forEach((step, index) => {
      const stepTitle = getLangValue(step.title, selectedLang);
      const stepText = getLangValue(step.text, selectedLang);
      const saying = step.transliteration || stepTitle;

      bank.push({
        category: t.categoryPrayer,
        prompt: t.prayerSay,
        helper: stepTitle,
        options: buildOptions(saying, prayerSayings, 400 + index),
        correctAnswer: saying,
        explanation: stepText
      });

      bank.push({
        category: t.categoryPrayer,
        prompt: t.prayerWhere,
        helper: saying,
        options: buildOptions(stepTitle, prayerTitles, 500 + index),
        correctAnswer: stepTitle,
        explanation: stepText
      });
    });

    featuredStories.forEach((story, index) => {
      const title = getLangValue(story.title, selectedLang);
      const summary = getLangValue(story.summary, selectedLang) || getLangValue(story.content, selectedLang);
      const lesson = getLangValue(story.lesson, selectedLang);

      if (story.icon) {
        bank.push({
          category: t.categoryStory,
          prompt: t.iconQuestionStory,
          visual: story.icon,
          options: buildOptions(title, storyTitles, 600 + index),
          correctAnswer: title,
          explanation: summary
        });
      }

      if (summary) {
        bank.push({
          category: t.categoryStory,
          prompt: t.storySummary,
          helper: summary,
          options: buildOptions(title, storyTitles, 700 + index),
          correctAnswer: title,
          explanation: lesson || summary
        });
      }

      if (lesson) {
        bank.push({
          category: t.categoryStory,
          prompt: t.storyLesson,
          helper: title,
          options: buildOptions(lesson, storyLessons, 800 + index),
          correctAnswer: lesson,
          explanation: summary
        });
      }
    });

    hadiths.forEach((hadith, index) => {
      const title = getLangValue(hadith.title, selectedLang);
      const explanation = getLangValue(hadith.explanation, selectedLang);
      bank.push({
        category: t.categoryHadith,
        prompt: t.hadithQuestion,
        helper: explanation,
        options: buildOptions(title, hadithTitles, 900 + index),
        correctAnswer: title,
        explanation: getLangValue(hadith.text, selectedLang)
      });
    });

    return bank.filter((question) => question.correctAnswer && question.options?.length >= 2);
  }, [duas, hadiths, stories, selectedLang, t]);

  const totalQuestions = Math.min(5, questionBank.length);

  const roundQuestions = useMemo(() => {
    if (!questionBank.length) return [];
    return shuffleWithSeed(questionBank, roundSeed + questionBank.length).slice(0, totalQuestions);
  }, [questionBank, roundSeed, totalQuestions]);

  const currentQuestion = roundQuestions[questionIndex] || null;

  const handleOptionClick = (option) => {
    if (!currentQuestion || selectedOption !== null) return;

    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      addXp(20);
    }

    setTimeout(() => {
      if (questionIndex + 1 >= totalQuestions) {
        setShowResult(true);
        incrementStat('quizzesPlayed');
      } else {
        setQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      }
    }, 1700);
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionIndex(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setRoundSeed((prev) => prev + 1);
  };

  if (!currentQuestion && !showResult) {
    return (
      <div className={`p-6 flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin text-green-500 mb-4" size={48} />
        <p className="font-bold">{t.preparing}</p>
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
            {t.great}
          </h2>
          <p className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            {score} / {totalQuestions} {t.correctAnswers}
          </p>
        </div>

        <div className={`p-6 rounded-3xl border-2 w-full max-w-xs transition-colors ${isDarkMode ? 'bg-slate-800 border-yellow-900/30' : 'bg-white border-yellow-100'}`}>
          <p className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-1">{t.reward}</p>
          <p className="text-4xl font-black text-green-500">+{score * 20} EP</p>
        </div>

        <div className="flex flex-col w-full gap-4">
          <button 
            onClick={resetQuiz}
            className="w-full bg-yellow-500 text-white font-black text-xl py-5 rounded-3xl shadow-lg hover:bg-yellow-600 active:scale-95 transition-all cursor-pointer"
          >
            {t.playAgain}
          </button>
          <button 
            onClick={() => setSelectedFeature(null)}
            className={`w-full font-bold text-xl py-5 rounded-3xl border-2 transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
          >
            {t.finish}
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
          {t.question} {questionIndex + 1} / {totalQuestions}
        </div>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center text-center space-y-6 p-8 rounded-[3rem] shadow-xl border-2 transition-colors relative ${isDarkMode ? 'bg-slate-800 border-yellow-900/20 shadow-slate-950/50' : 'bg-white border-yellow-50'}`}>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isDarkMode ? 'bg-slate-700 text-yellow-300' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}>
          <Sparkles size={14} /> {currentQuestion.category}
        </div>

        {currentQuestion.visual && (
          <div className="text-7xl mb-2 animate-bounce-slow">
            {currentQuestion.visual}
          </div>
        )}
        
        <h2 className={`text-2xl font-black leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {currentQuestion.prompt}
        </h2>

        {currentQuestion.helper && (
          <div className={`w-full p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-700/40 border-slate-700 text-slate-200' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
            <p className="text-base font-semibold leading-relaxed">{currentQuestion.helper}</p>
          </div>
        )}

        <div className="grid grid-cols-1 w-full gap-3 mt-2">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option;
            const isTarget = isCorrect !== null && option === currentQuestion.correctAnswer;
            const isWrong = isCorrect === false && isSelected;

            return (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={selectedOption !== null}
                className={`w-full p-4 rounded-2xl border-2 font-bold transition-all flex items-center gap-3 text-left ${
                  isTarget ? 'bg-green-500 border-green-600 text-white translate-x-1 shadow-md' :
                  isWrong ? 'bg-red-500 border-red-600 text-white -translate-x-1' :
                  isDarkMode ? 'bg-slate-700/50 border-slate-700 text-slate-200 hover:bg-slate-700' : 
                  'bg-gray-50 border-gray-100 text-gray-700 hover:border-yellow-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${isTarget || isWrong ? 'bg-white/20 border-white/40' : 'bg-white border-gray-200'}`}>
                  {isTarget ? <CheckCircle2 size={18} /> : isWrong ? <XCircle size={18} /> : ''}
                </div>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        {selectedOption !== null && currentQuestion.explanation && (
          <div className={`w-full mt-2 p-4 rounded-2xl border animate-fade-in ${isCorrect ? (isDarkMode ? 'bg-green-900/20 border-green-900/30' : 'bg-green-50 border-green-100') : (isDarkMode ? 'bg-red-900/20 border-red-900/30' : 'bg-red-50 border-red-100')}`}>
            <p className={`font-black mb-1 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? t.correct : t.almost}
            </p>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>
      
      {selectedOption !== null && (
        <div className="mt-8 flex justify-center animate-fade-in">
           <div className={`px-6 py-3 rounded-2xl font-black text-lg flex items-center gap-2 shadow-lg ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
             {isCorrect ? t.correct : t.almost}
             {isCorrect && <ArrowRight />}
           </div>
        </div>
      )}
    </div>
  );
}
