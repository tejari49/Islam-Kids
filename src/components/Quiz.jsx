import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Flame,
  Loader2,
  MessageCircleMore,
  ScrollText,
  Sparkles,
  Star,
  Trophy,
  XCircle
} from 'lucide-react';
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

function countOccurrences(values) {
  return values.reduce((map, value) => {
    if (!value) return map;
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}

function splitSentences(text) {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function snippet(text, maxLength = 150) {
  if (!text) return '';
  const firstSentence = splitSentences(text)[0] || text;
  if (firstSentence.length <= maxLength) return firstSentence;
  return `${firstSentence.slice(0, maxLength).trim()}…`;
}

function secondarySnippet(text, maxLength = 150) {
  const sentences = splitSentences(text);
  const fallback = sentences[1] || sentences[0] || text || '';
  if (fallback.length <= maxLength) return fallback;
  return `${fallback.slice(0, maxLength).trim()}…`;
}

function questionCategoryMeta(categoryId, isDarkMode) {
  const base = {
    dua: {
      icon: BookOpen,
      light: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      dark: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
    },
    prayer: {
      icon: Sparkles,
      light: 'bg-sky-50 text-sky-700 border-sky-100',
      dark: 'bg-sky-500/10 text-sky-300 border-sky-500/20'
    },
    story: {
      icon: ScrollText,
      light: 'bg-violet-50 text-violet-700 border-violet-100',
      dark: 'bg-violet-500/10 text-violet-300 border-violet-500/20'
    },
    hadith: {
      icon: MessageCircleMore,
      light: 'bg-amber-50 text-amber-700 border-amber-100',
      dark: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
    }
  };

  const meta = base[categoryId] || base.dua;
  return {
    Icon: meta.icon,
    tone: isDarkMode ? meta.dark : meta.light
  };
}

const labels = {
  de: {
    preparing: 'Spannende Fragen werden vorbereitet…',
    question: 'FRAGE',
    mission: 'Quiz-Mission',
    great: 'Stark gemacht!',
    excellent: 'Fast perfekt!',
    nice: 'Gut gemacht!',
    keepGoing: 'Weiter so!',
    correctAnswers: 'richtig beantwortet',
    reward: 'Belohnung',
    streak: 'Serie',
    bestStreak: 'Beste Serie',
    playAgain: 'Neue Runde',
    finish: 'Zurück',
    correct: 'Richtig!',
    almost: 'Nicht ganz',
    xpEarned: 'Gesammelte EP',
    challengeSituation: 'Situation',
    challengeWords: 'Worte',
    challengeOrder: 'Reihenfolge',
    challengeLesson: 'Lernen',
    challengeKnowledge: 'Wissen',
    challengeBehavior: 'Alltag',
    duaSituation: 'Zu welcher Situation passt dieses Dua am besten?',
    duaWords: 'Welche Worte sagt man in dieser Situation?',
    prayerSay: 'Was sagt man in diesem Gebetsschritt?',
    prayerWhere: 'In welchem Gebetsschritt sagt man das?',
    prayerNext: 'Welcher Schritt kommt direkt danach?',
    prayerPose: 'Zu welchem Gebetsschritt passt diese Beschreibung?',
    storySummary: 'Welche Geschichte passt zu dieser Beschreibung?',
    storyLesson: 'In welcher Geschichte lernen wir das?',
    hadithScenario: 'Welcher Hadith passt am besten zu diesem Alltag?',
    hadithText: 'Welcher Hadith sagt das?',
    categoryDua: 'Dua',
    categoryPrayer: 'Gebet',
    categoryStory: 'Geschichte',
    categoryHadith: 'Hadith',
    helperMeaning: 'Bedeutung',
    helperWords: 'Worte',
    helperSituation: 'Situation',
    helperClue: 'Hinweis',
    helperStep: 'Gebetsschritt',
    helperPhrase: 'Formulierung',
    helperStory: 'Geschichte',
    helperEveryday: 'Alltag',
    readyText: 'Dieses Quiz fragt jetzt nach Inhalten, Reihenfolge, Bedeutung und Alltag – nicht mehr nach Symbolen.',
    noQuestions: 'Noch nicht genug Inhalte für das Quiz geladen.',
    nextQuestion: 'Nächste Frage',
    viewResults: 'Ergebnis ansehen',
    correctAnswerLabel: 'Richtige Antwort'
  },
  al: {
    preparing: 'Po përgatiten pyetje më interesante…',
    question: 'PYETJA',
    mission: 'Misioni i kuizit',
    great: 'Shumë bukur!',
    excellent: 'Pothuajse perfekt!',
    nice: 'Bravo!',
    keepGoing: 'Vazhdo kështu!',
    correctAnswers: 'përgjigje të sakta',
    reward: 'Shpërblimi',
    streak: 'Seria',
    bestStreak: 'Seria më e mirë',
    playAgain: 'Raund i ri',
    finish: 'Kthehu',
    correct: 'E saktë!',
    almost: 'Jo krejt',
    xpEarned: 'XP të fituara',
    challengeSituation: 'Situatë',
    challengeWords: 'Fjalët',
    challengeOrder: 'Renditja',
    challengeLesson: 'Mësimi',
    challengeKnowledge: 'Dituria',
    challengeBehavior: 'Përditshmëria',
    duaSituation: 'Për cilën situatë përshtatet më së miri kjo dua?',
    duaWords: 'Cilat fjalë thuhen në këtë situatë?',
    prayerSay: 'Çfarë thuhet në këtë hap të namazit?',
    prayerWhere: 'Në cilin hap të namazit thuhet kjo?',
    prayerNext: 'Cili hap vjen menjëherë pas tij?',
    prayerPose: 'Me cilin hap të namazit përputhet kjo përshkrim?',
    storySummary: 'Cila histori i përshtatet këtij përshkrimi?',
    storyLesson: 'Në cilën histori mësojmë këtë?',
    hadithScenario: 'Cili hadith i përshtatet më së miri kësaj situate të përditshme?',
    hadithText: 'Cili hadith e thotë këtë?',
    categoryDua: 'Dua',
    categoryPrayer: 'Namaz',
    categoryStory: 'Histori',
    categoryHadith: 'Hadith',
    helperMeaning: 'Kuptimi',
    helperWords: 'Fjalët',
    helperSituation: 'Situata',
    helperClue: 'Udhëzim',
    helperStep: 'Hapi i namazit',
    helperPhrase: 'Shprehja',
    helperStory: 'Historia',
    helperEveryday: 'Përditshmëria',
    readyText: 'Ky kuiz tani pyet për përmbajtje, renditje, kuptim dhe përditshmëri – jo më për simbole.',
    noQuestions: 'Ende nuk ka mjaft përmbajtje të ngarkuar për kuizin.',
    nextQuestion: 'Pyetja tjetër',
    viewResults: 'Shiko rezultatin',
    correctAnswerLabel: 'Përgjigjja e saktë'
  },
  tr: {
    preparing: 'Daha heyecanlı sorular hazırlanıyor…',
    question: 'SORU',
    mission: 'Quiz görevi',
    great: 'Harika iş!',
    excellent: 'Neredeyse mükemmel!',
    nice: 'Çok iyi!',
    keepGoing: 'Böyle devam et!',
    correctAnswers: 'doğru cevap',
    reward: 'Ödül',
    streak: 'Seri',
    bestStreak: 'En iyi seri',
    playAgain: 'Yeni tur',
    finish: 'Geri dön',
    correct: 'Doğru!',
    almost: 'Tam değil',
    xpEarned: 'Kazanılan XP',
    challengeSituation: 'Durum',
    challengeWords: 'Sözler',
    challengeOrder: 'Sıra',
    challengeLesson: 'Ders',
    challengeKnowledge: 'Bilgi',
    challengeBehavior: 'Günlük hayat',
    duaSituation: 'Bu dua en çok hangi duruma uygundur?',
    duaWords: 'Bu durumda hangi sözler söylenir?',
    prayerSay: 'Bu namaz adımında ne söylenir?',
    prayerWhere: 'Bu söz namazın hangi adımında söylenir?',
    prayerNext: 'Hemen ardından hangi adım gelir?',
    prayerPose: 'Bu açıklama hangi namaz adımına uyar?',
    storySummary: 'Bu açıklamaya hangi hikâye uyar?',
    storyLesson: 'Bu dersi hangi hikâyede öğreniyoruz?',
    hadithScenario: 'Bu günlük duruma en uygun hadis hangisi?',
    hadithText: 'Bunu hangi hadis söyler?',
    categoryDua: 'Dua',
    categoryPrayer: 'Namaz',
    categoryStory: 'Hikâye',
    categoryHadith: 'Hadis',
    helperMeaning: 'Anlamı',
    helperWords: 'Sözler',
    helperSituation: 'Durum',
    helperClue: 'İpucu',
    helperStep: 'Namaz adımı',
    helperPhrase: 'İfade',
    helperStory: 'Hikâye',
    helperEveryday: 'Günlük hayat',
    readyText: 'Bu quiz artık sembol eşleştirmek yerine içerik, sıra, anlam ve günlük hayat soruyor.',
    noQuestions: 'Quiz için henüz yeterli içerik yüklenmedi.',
    nextQuestion: 'Sonraki soru',
    viewResults: 'Sonucu gör',
    correctAnswerLabel: 'Doğru cevap'
  }
};

function buildBalancedRound(questionBank, roundSeed, totalQuestions = 8) {
  if (!questionBank.length) return [];

  const grouped = questionBank.reduce((acc, question) => {
    acc[question.categoryId] = acc[question.categoryId] || [];
    acc[question.categoryId].push(question);
    return acc;
  }, {});

  const picks = [];
  const usedIds = new Set();
  const categories = ['dua', 'prayer', 'story', 'hadith'];

  categories.forEach((category, index) => {
    const group = shuffleWithSeed(grouped[category] || [], roundSeed + (index + 1) * 97);
    group.slice(0, 2).forEach((question) => {
      if (!usedIds.has(question.id)) {
        picks.push(question);
        usedIds.add(question.id);
      }
    });
  });

  if (picks.length < totalQuestions) {
    shuffleWithSeed(questionBank, roundSeed + 999).forEach((question) => {
      if (picks.length >= totalQuestions) return;
      if (!usedIds.has(question.id)) {
        picks.push(question);
        usedIds.add(question.id);
      }
    });
  }

  return shuffleWithSeed(picks, roundSeed + 333).slice(0, totalQuestions);
}

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
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const questionBank = useMemo(() => {
    if (!duas.length || !hadiths.length || !stories.length) return [];

    const bank = [];
    const duaTitles = duas.map((dua) => getLangValue(dua.title, selectedLang));
    const duaTransliterations = duas.map((dua) => dua.transliteration);
    const duaTransliterationCounts = countOccurrences(duaTransliterations);
    const prayerTitles = prayerSteps.map((step) => getLangValue(step.title, selectedLang));
    const prayerSayings = prayerSteps.map((step) => step.transliteration);
    const prayerSayingCounts = countOccurrences(prayerSayings);
    const storyTitles = stories.map((story) => getLangValue(story.title, selectedLang));
    const hadithTitles = hadiths.map((hadith) => getLangValue(hadith.title, selectedLang));

    duas.forEach((dua, index) => {
      const title = getLangValue(dua.title, selectedLang);
      const meaning = getLangValue(dua.meaning, selectedLang);
      const transliteration = dua.transliteration;
      const arabic = dua.arabic;

      bank.push({
        id: `dua-situation-${dua.id}`,
        categoryId: 'dua',
        category: t.categoryDua,
        typeLabel: t.challengeSituation,
        prompt: t.duaSituation,
        helperLabel: t.helperMeaning,
        helper: `${arabic}\n${transliteration}\n\n${snippet(meaning, 150)}`,
        options: buildOptions(title, duaTitles, 100 + index),
        correctAnswer: title,
        explanation: `${title} — ${meaning}`
      });

      if ((duaTransliterationCounts.get(transliteration) || 0) === 1) {
        bank.push({
          id: `dua-words-${dua.id}`,
          categoryId: 'dua',
          category: t.categoryDua,
          typeLabel: t.challengeWords,
          prompt: t.duaWords,
          helperLabel: t.helperSituation,
          helper: title,
          options: buildOptions(transliteration, duaTransliterations.filter((value) => (duaTransliterationCounts.get(value) || 0) === 1), 200 + index),
          correctAnswer: transliteration,
          explanation: meaning
        });
      }
    });

    prayerSteps.forEach((step, index) => {
      const stepTitle = getLangValue(step.title, selectedLang);
      const stepText = getLangValue(step.text, selectedLang);
      const saying = step.transliteration;
      const poseHint = getLangValue(step.poseNotes, selectedLang)?.[0] || stepText;

      if ((prayerSayingCounts.get(saying) || 0) === 1) {
        bank.push({
          id: `prayer-say-${step.id}`,
          categoryId: 'prayer',
          category: t.categoryPrayer,
          typeLabel: t.challengeWords,
          prompt: t.prayerSay,
          helperLabel: t.helperStep,
          helper: stepTitle,
          options: buildOptions(saying, prayerSayings.filter((value) => (prayerSayingCounts.get(value) || 0) === 1), 300 + index),
          correctAnswer: saying,
          explanation: stepText
        });

        bank.push({
          id: `prayer-where-${step.id}`,
          categoryId: 'prayer',
          category: t.categoryPrayer,
          typeLabel: t.challengeKnowledge,
          prompt: t.prayerWhere,
          helperLabel: t.helperPhrase,
          helper: saying,
          options: buildOptions(stepTitle, prayerTitles, 400 + index),
          correctAnswer: stepTitle,
          explanation: stepText
        });
      }

      if (index < prayerSteps.length - 1) {
        const nextTitle = getLangValue(prayerSteps[index + 1].title, selectedLang);
        bank.push({
          id: `prayer-next-${step.id}`,
          categoryId: 'prayer',
          category: t.categoryPrayer,
          typeLabel: t.challengeOrder,
          prompt: t.prayerNext,
          helperLabel: t.helperStep,
          helper: stepTitle,
          options: buildOptions(nextTitle, prayerTitles.filter((value) => value !== stepTitle), 500 + index),
          correctAnswer: nextTitle,
          explanation: `${stepTitle} → ${nextTitle}`
        });
      }

      bank.push({
        id: `prayer-pose-${step.id}`,
        categoryId: 'prayer',
        category: t.categoryPrayer,
        typeLabel: t.challengeKnowledge,
        prompt: t.prayerPose,
        helperLabel: t.helperClue,
        helper: poseHint,
        options: buildOptions(stepTitle, prayerTitles, 600 + index),
        correctAnswer: stepTitle,
        explanation: stepText
      });
    });

    stories.forEach((story, index) => {
      const title = getLangValue(story.title, selectedLang);
      const content = getLangValue(story.content, selectedLang);
      const firstHint = snippet(content, 165);
      const lessonHint = secondarySnippet(content, 165);

      bank.push({
        id: `story-summary-${story.id}`,
        categoryId: 'story',
        category: t.categoryStory,
        typeLabel: t.challengeKnowledge,
        prompt: t.storySummary,
        helperLabel: t.helperStory,
        helper: firstHint,
        options: buildOptions(title, storyTitles, 700 + index),
        correctAnswer: title,
        explanation: lessonHint || firstHint
      });

      if (lessonHint && lessonHint !== firstHint) {
        bank.push({
          id: `story-lesson-${story.id}`,
          categoryId: 'story',
          category: t.categoryStory,
          typeLabel: t.challengeLesson,
          prompt: t.storyLesson,
          helperLabel: t.helperClue,
          helper: lessonHint,
          options: buildOptions(title, storyTitles, 800 + index),
          correctAnswer: title,
          explanation: firstHint
        });
      }
    });

    hadiths.forEach((hadith, index) => {
      const title = getLangValue(hadith.title, selectedLang);
      const text = getLangValue(hadith.text, selectedLang);
      const explanation = getLangValue(hadith.explanation, selectedLang);

      bank.push({
        id: `hadith-scenario-${hadith.id}`,
        categoryId: 'hadith',
        category: t.categoryHadith,
        typeLabel: t.challengeBehavior,
        prompt: t.hadithScenario,
        helperLabel: t.helperEveryday,
        helper: snippet(explanation, 170),
        options: buildOptions(title, hadithTitles, 900 + index),
        correctAnswer: title,
        explanation: text
      });

      bank.push({
        id: `hadith-text-${hadith.id}`,
        categoryId: 'hadith',
        category: t.categoryHadith,
        typeLabel: t.challengeKnowledge,
        prompt: t.hadithText,
        helperLabel: t.helperWords,
        helper: text,
        options: buildOptions(title, hadithTitles, 1000 + index),
        correctAnswer: title,
        explanation: explanation
      });
    });

    return bank.filter((question) => question.correctAnswer && question.options?.length >= 2);
  }, [duas, hadiths, stories, selectedLang, t]);

  const totalQuestions = Math.min(8, questionBank.length);
  const roundQuestions = useMemo(() => buildBalancedRound(questionBank, roundSeed + questionBank.length, totalQuestions), [questionBank, roundSeed, totalQuestions]);
  const currentQuestion = roundQuestions[questionIndex] || null;
  const progressPercent = totalQuestions ? (questionIndex / totalQuestions) * 100 : 0;
  const isLastQuestion = questionIndex + 1 >= totalQuestions;

  const handleOptionClick = (option) => {
    if (!currentQuestion || selectedOption !== null) return;

    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      const nextStreak = streak + 1;
      const reward = 20 + Math.min(10, (nextStreak - 1) * 2);
      setScore((prev) => prev + 1);
      setStreak(nextStreak);
      setBestStreak((prev) => Math.max(prev, nextStreak));
      setXpEarned((prev) => prev + reward);
      addXp(reward);
    } else {
      setStreak(0);
    }
  };

  const handleContinue = () => {
    if (selectedOption === null) return;

    if (isLastQuestion) {
      setShowResult(true);
      incrementStat('quizzesPlayed');
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionIndex(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setStreak(0);
    setBestStreak(0);
    setXpEarned(0);
    setRoundSeed((prev) => prev + 1);
  };

  const resultHeadline = score === totalQuestions ? t.excellent : score >= Math.ceil(totalQuestions * 0.7) ? t.great : score >= Math.ceil(totalQuestions * 0.4) ? t.nice : t.keepGoing;

  if (!questionBank.length && !showResult) {
    return (
      <div className={`p-6 flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin text-green-500 mb-4" size={48} />
        <p className="font-bold text-center">{t.noQuestions}</p>
      </div>
    );
  }

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
            {resultHeadline}
          </h2>
          <p className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            {score} / {totalQuestions} {t.correctAnswers}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
          <div className={`p-6 rounded-3xl border-2 transition-colors ${isDarkMode ? 'bg-slate-800 border-yellow-900/30' : 'bg-white border-yellow-100'}`}>
            <p className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-1">{t.reward}</p>
            <p className="text-4xl font-black text-green-500">+{xpEarned} XP</p>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{t.xpEarned}</p>
          </div>
          <div className={`p-6 rounded-3xl border-2 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            <p className={`text-sm font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-orange-300' : 'text-orange-500'}`}>{t.bestStreak}</p>
            <div className="flex items-center justify-center gap-2 text-4xl font-black text-orange-500">
              <Flame className="fill-orange-500" /> {bestStreak}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-4">
          <button onClick={resetQuiz} className="w-full bg-yellow-500 text-white font-black text-xl py-5 rounded-3xl shadow-lg hover:bg-yellow-600 active:scale-95 transition-all cursor-pointer">
            {t.playAgain}
          </button>
          <button onClick={() => setSelectedFeature(null)} className={`w-full font-bold text-xl py-5 rounded-3xl border-2 transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}>
            {t.finish}
          </button>
        </div>
      </div>
    );
  }

  const categoryMeta = questionCategoryMeta(currentQuestion.categoryId, isDarkMode);
  const CategoryIcon = categoryMeta.Icon;

  return (
    <div className={`p-3 sm:p-4 pb-6 flex flex-col min-h-screen transition-colors overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-3 gap-2">
        <button onClick={() => setSelectedFeature(null)} className={`p-2 rounded-full shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <ChevronLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
        </button>
        <div className={`font-black px-3 py-1 rounded-full text-[11px] tracking-widest transition-colors ${isDarkMode ? 'text-yellow-500 bg-yellow-900/20' : 'text-yellow-600 bg-yellow-100'}`}>
          {t.question} {questionIndex + 1} / {totalQuestions}
        </div>
        <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ${isDarkMode ? 'bg-orange-500/10 text-orange-300' : 'bg-orange-50 text-orange-600'}`}>
          <Flame size={12} className={streak > 0 ? 'fill-current' : ''} /> {streak}
        </div>
      </div>

      <div className={`mb-3 rounded-full h-2.5 overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white border border-gray-100'}`}>
        <div className="h-full rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 transition-all duration-500" style={{ width: `${Math.max(progressPercent, 8)}%` }} />
      </div>

      <div className={`mb-3 px-3 py-2 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-white border-gray-100 text-gray-600'}`}>
        <p className="text-xs leading-relaxed font-medium line-clamp-2">{t.readyText}</p>
      </div>

      <div className={`flex-1 flex flex-col text-center gap-3 p-4 sm:p-5 rounded-[2rem] shadow-xl border-2 transition-colors relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border-yellow-900/20 shadow-slate-950/50' : 'bg-white border-yellow-50'}`}>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${categoryMeta.tone}`}>
            <CategoryIcon size={12} /> {currentQuestion.category}
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}>
            <Sparkles size={12} /> {currentQuestion.typeLabel}
          </div>
        </div>

        <div>
          <p className={`text-[11px] font-black tracking-[0.22em] uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>{t.mission}</p>
          <h2 className={`text-lg sm:text-xl font-black leading-snug transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {currentQuestion.prompt}
          </h2>
        </div>

        {currentQuestion.helper && (
          <div className={`w-full px-3 py-3 rounded-2xl border text-left ${isDarkMode ? 'bg-slate-700/40 border-slate-700 text-slate-100' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
            <p className={`text-[10px] font-black tracking-[0.18em] uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
              {currentQuestion.helperLabel}
            </p>
            <p className="text-sm font-semibold leading-snug whitespace-pre-line">{currentQuestion.helper}</p>
          </div>
        )}

        <div className="grid grid-cols-1 w-full gap-2 mt-1">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option;
            const isTarget = isCorrect !== null && option === currentQuestion.correctAnswer;
            const isWrong = isCorrect === false && isSelected;

            return (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={selectedOption !== null}
                className={`w-full px-3 py-2.5 rounded-xl border-2 font-bold transition-all flex items-start gap-2 text-left text-sm leading-snug ${
                  isTarget ? 'bg-green-500 border-green-600 text-white shadow-md' :
                  isWrong ? 'bg-red-500 border-red-600 text-white' :
                  isDarkMode ? 'bg-slate-700/50 border-slate-700 text-slate-100 hover:bg-slate-700' :
                  'bg-gray-50 border-gray-100 text-gray-700 hover:border-yellow-200 hover:bg-yellow-50/50'
                }`}
              >
                <div className={`w-6 h-6 mt-0.5 rounded-full flex-shrink-0 flex items-center justify-center text-sm border ${isTarget || isWrong ? 'bg-white/20 border-white/40' : 'bg-white border-gray-200'}`}>
                  {isTarget ? <CheckCircle2 size={14} /> : isWrong ? <XCircle size={14} /> : ''}
                </div>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        {selectedOption !== null && (
          <div className={`absolute inset-3 sm:inset-4 rounded-[1.6rem] border p-4 flex flex-col justify-between text-left shadow-2xl animate-fade-in ${
            isCorrect
              ? isDarkMode
                ? 'bg-slate-900/96 border-green-500/30'
                : 'bg-white/98 border-green-200'
              : isDarkMode
                ? 'bg-slate-900/96 border-red-500/30'
                : 'bg-white/98 border-red-200'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-sm ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {isCorrect ? t.correct : t.almost}
                </div>
                <div className={`text-xs font-black ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                  {questionIndex + 1} / {totalQuestions}
                </div>
              </div>

              {!isCorrect && (
                <div>
                  <p className={`text-[11px] font-black tracking-[0.2em] uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                    {t.correctAnswerLabel}
                  </p>
                  <p className={`text-sm font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {currentQuestion.correctAnswer}
                  </p>
                </div>
              )}

              {currentQuestion.explanation && (
                <div>
                  <p className={`text-[11px] font-black tracking-[0.2em] uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                    {isCorrect ? t.correct : t.almost}
                  </p>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-100' : 'text-gray-700'}`}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleContinue}
              className={`mt-4 w-full rounded-2xl py-3 font-black text-base shadow-lg transition-all active:scale-[0.99] ${
                isCorrect ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isLastQuestion ? t.viewResults : t.nextQuestion}
                <ArrowRight size={18} />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
