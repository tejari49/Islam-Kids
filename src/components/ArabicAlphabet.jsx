import React, { useMemo, useState } from 'react';
import { ChevronLeft, Volume2 } from 'lucide-react';
import { speakArabicText, stopSpeechPlayback } from '../utils/audio';

const LABELS = {
  de: {
    title: 'Arabisches Alphabet',
    subtitle: 'Tippe auf einen Buchstaben, um die Aussprache zu hören.',
    hint: 'Hörtraining',
    letters: 'Buchstaben',
    writeTitle: 'Wort auf Arabisch',
    writeHint: 'Schreibe ein Wort in Lateinschrift und lasse es arabisch darstellen.',
    inputPlaceholder: 'z. B. salam, allah, quran …',
    convert: 'In Arabisch umwandeln',
    output: 'Arabische Schreibweise',
    formsTitle: 'Buchstabenformen',
    formsHint: 'Je nach Position ändert sich die Form eines Buchstabens.',
    formsIsolated: 'Allein',
    formsInitial: 'Anfang',
    formsMedial: 'Mitte',
    formsFinal: 'Ende',
    practiceTitle: 'Schreibübung',
    practiceHint: 'Tippe die arabische Form des gezeigten Buchstabens.',
    practiceTarget: 'Ziel',
    practicePlaceholder: 'Arabischen Buchstaben eingeben …',
    practiceCheck: 'Prüfen',
    practiceNext: 'Nächster Buchstabe',
    practiceCorrect: 'Richtig! Sehr gut ✨',
    practiceWrong: 'Fast! Versuche es nochmal.'
  },
  al: {
    title: 'Alfabeti Arab',
    subtitle: 'Preke një shkronjë për ta dëgjuar shqiptimin.',
    hint: 'Trajnim dëgjimi',
    letters: 'Shkronja',
    writeTitle: 'Fjalë në arabisht',
    writeHint: 'Shkruaj një fjalë me shkronja latine dhe shfaqe me shkrim arab.',
    inputPlaceholder: 'p.sh. salam, allah, quran …',
    convert: 'Ktheje në arabisht',
    output: 'Shkrimi arabisht',
    formsTitle: 'Format e shkronjave',
    formsHint: 'Forma e shkronjës ndryshon sipas pozicionit.',
    formsIsolated: 'E vetme',
    formsInitial: 'Fillim',
    formsMedial: 'Mes',
    formsFinal: 'Fund',
    practiceTitle: 'Ushtrim shkrimi',
    practiceHint: 'Shkruaj formën arabe të shkronjës së treguar.',
    practiceTarget: 'Qëllimi',
    practicePlaceholder: 'Shkruaj shkronjën arabe …',
    practiceCheck: 'Kontrollo',
    practiceNext: 'Shkronja tjetër',
    practiceCorrect: 'Saktë! Shumë mirë ✨',
    practiceWrong: 'Afër! Provo edhe një herë.'
  },
  tr: {
    title: 'Arap Alfabesi',
    subtitle: 'Telaffuzu duymak için bir harfe dokun.',
    hint: 'Dinleme alıştırması',
    letters: 'Harf',
    writeTitle: 'Arapça yazım',
    writeHint: 'Latin harflerle bir kelime yaz, Arapça yazımını göster.',
    inputPlaceholder: 'ör. salam, allah, quran …',
    convert: 'Arapçaya çevir',
    output: 'Arapça yazı',
    formsTitle: 'Harf biçimleri',
    formsHint: 'Harfin şekli konuma göre değişir.',
    formsIsolated: 'Tek başına',
    formsInitial: 'Başta',
    formsMedial: 'Ortada',
    formsFinal: 'Sonda',
    practiceTitle: 'Yazma alıştırması',
    practiceHint: 'Gösterilen harfin Arapça biçimini yaz.',
    practiceTarget: 'Hedef',
    practicePlaceholder: 'Arapça harfi yaz …',
    practiceCheck: 'Kontrol et',
    practiceNext: 'Sonraki harf',
    practiceCorrect: 'Doğru! Harika ✨',
    practiceWrong: 'Yaklaştın! Tekrar dene.'
  }
};

const LETTERS = [
  { ar: 'ا', translit: 'Alif' }, { ar: 'ب', translit: 'Ba' }, { ar: 'ت', translit: 'Ta' }, { ar: 'ث', translit: 'Tha' },
  { ar: 'ج', translit: 'Jim' }, { ar: 'ح', translit: 'Ha' }, { ar: 'خ', translit: 'Kha' }, { ar: 'د', translit: 'Dal' },
  { ar: 'ذ', translit: 'Dhal' }, { ar: 'ر', translit: 'Ra' }, { ar: 'ز', translit: 'Zay' }, { ar: 'س', translit: 'Sin' },
  { ar: 'ش', translit: 'Shin' }, { ar: 'ص', translit: 'Sad' }, { ar: 'ض', translit: 'Dad' }, { ar: 'ط', translit: 'Taʼ' },
  { ar: 'ظ', translit: 'Zaʼ' }, { ar: 'ع', translit: 'Ayn' }, { ar: 'غ', translit: 'Ghayn' }, { ar: 'ف', translit: 'Fa' },
  { ar: 'ق', translit: 'Qaf' }, { ar: 'ك', translit: 'Kaf' }, { ar: 'ل', translit: 'Lam' }, { ar: 'م', translit: 'Mim' },
  { ar: 'ن', translit: 'Nun' }, { ar: 'ه', translit: 'Haʼ' }, { ar: 'و', translit: 'Waw' }, { ar: 'ي', translit: 'Ya' }
];

const LETTER_FORMS = {
  ا: { initial: 'ا', medial: 'ـا', final: 'ـا' },
  ب: { initial: 'بـ', medial: 'ـبـ', final: 'ـب' },
  ت: { initial: 'تـ', medial: 'ـتـ', final: 'ـت' },
  ث: { initial: 'ثـ', medial: 'ـثـ', final: 'ـث' },
  ج: { initial: 'جـ', medial: 'ـجـ', final: 'ـج' },
  ح: { initial: 'حـ', medial: 'ـحـ', final: 'ـح' },
  خ: { initial: 'خـ', medial: 'ـخـ', final: 'ـخ' },
  د: { initial: 'د', medial: 'ـد', final: 'ـد' },
  ذ: { initial: 'ذ', medial: 'ـذ', final: 'ـذ' },
  ر: { initial: 'ر', medial: 'ـر', final: 'ـر' },
  ز: { initial: 'ز', medial: 'ـز', final: 'ـز' },
  س: { initial: 'سـ', medial: 'ـسـ', final: 'ـس' },
  ش: { initial: 'شـ', medial: 'ـشـ', final: 'ـش' },
  ص: { initial: 'صـ', medial: 'ـصـ', final: 'ـص' },
  ض: { initial: 'ضـ', medial: 'ـضـ', final: 'ـض' },
  ط: { initial: 'طـ', medial: 'ـطـ', final: 'ـط' },
  ظ: { initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' },
  ع: { initial: 'عـ', medial: 'ـعـ', final: 'ـع' },
  غ: { initial: 'غـ', medial: 'ـغـ', final: 'ـغ' },
  ف: { initial: 'فـ', medial: 'ـفـ', final: 'ـف' },
  ق: { initial: 'قـ', medial: 'ـقـ', final: 'ـق' },
  ك: { initial: 'كـ', medial: 'ـكـ', final: 'ـك' },
  ل: { initial: 'لـ', medial: 'ـلـ', final: 'ـل' },
  م: { initial: 'مـ', medial: 'ـمـ', final: 'ـم' },
  ن: { initial: 'نـ', medial: 'ـنـ', final: 'ـن' },
  ه: { initial: 'هـ', medial: 'ـهـ', final: 'ـه' },
  و: { initial: 'و', medial: 'ـو', final: 'ـو' },
  ي: { initial: 'يـ', medial: 'ـيـ', final: 'ـي' }
};

const WORD_MAP = {
  allah: 'اللّٰه',
  salam: 'سَلَام',
  islam: 'إِسْلَام',
  iman: 'إِيمَان',
  quran: 'قُرْآن',
  koran: 'قُرْآن',
  bismillah: 'بِسْمِ ٱللّٰهِ',
  dua: 'دُعَاء',
  sabr: 'صَبْر',
  shukr: 'شُكْر',
  masjid: 'مَسْجِد',
  nur: 'نُور'
};

const CHAR_MAP = {
  a: 'ا', b: 'ب', c: 'ك', d: 'د', e: 'ي', f: 'ف', g: 'ج', h: 'ه', i: 'ي',
  j: 'ج', k: 'ك', l: 'ل', m: 'م', n: 'ن', o: 'و', p: 'ب', q: 'ق', r: 'ر',
  s: 'س', t: 'ت', u: 'و', v: 'ف', w: 'و', x: 'كس', y: 'ي', z: 'ز'
};

function transliterateWord(word = '') {
  const normalized = word.toLowerCase().trim();
  if (!normalized) return '';
  if (WORD_MAP[normalized]) return WORD_MAP[normalized];
  return normalized.split('').map((char) => CHAR_MAP[char] || char).join('');
}

export default function ArabicAlphabet({ selectedLang, setSelectedFeature, isDarkMode }) {
  const labels = LABELS[selectedLang] || LABELS.de;
  const [activeLetter, setActiveLetter] = useState('');
  const [latinInput, setLatinInput] = useState('');
  const [arabicOutput, setArabicOutput] = useState('');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceResult, setPracticeResult] = useState('');
  const letters = useMemo(() => LETTERS, []);
  const practiceLetter = letters[practiceIndex % letters.length];

  const playLetter = (letter) => {
    setActiveLetter(letter.ar);
    speakArabicText(letter.ar, 0.7, {
      onEnd: () => setActiveLetter(''),
      onError: () => setActiveLetter('')
    });
  };

  const convertToArabic = () => {
    const tokens = latinInput.split(/\s+/).filter(Boolean);
    const converted = tokens.map(transliterateWord).join(' ');
    setArabicOutput(converted);
  };

  const checkPractice = () => {
    const expected = practiceLetter?.ar || '';
    if (practiceInput.trim() === expected) {
      setPracticeResult('correct');
      setPracticeInput('');
      return;
    }
    setPracticeResult('wrong');
  };

  const nextPractice = () => {
    setPracticeResult('');
    setPracticeInput('');
    setPracticeIndex((prev) => (prev + 1) % letters.length);
  };

  return (
    <div className={`p-6 pb-24 min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => { stopSpeechPlayback(); setSelectedFeature(null); }}
          className={`p-2 rounded-full shadow-sm ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-700'}`}
        >
          <ChevronLeft size={22} />
        </button>
        <div>
          <h2 className="text-2xl font-black">{labels.title}</h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{labels.subtitle}</p>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border mb-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="text-xs font-black uppercase tracking-widest text-emerald-500">{labels.hint}</div>
        <div className="text-sm mt-1">{labels.letters}: {letters.length}</div>
      </div>

      <div className={`p-4 rounded-2xl border mb-4 space-y-3 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-indigo-500">{labels.writeTitle}</div>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{labels.writeHint}</p>
        </div>
        <input
          value={latinInput}
          onChange={(event) => setLatinInput(event.target.value)}
          placeholder={labels.inputPlaceholder}
          className={`w-full px-3 py-2 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
        />
        <button onClick={convertToArabic} className="w-full py-2.5 rounded-xl bg-indigo-500 text-white font-bold">
          {labels.convert}
        </button>
        {arabicOutput && (
          <button
            onClick={() => speakArabicText(arabicOutput, 0.7)}
            className={`w-full p-3 rounded-xl border text-right ${isDarkMode ? 'bg-slate-900 border-slate-700 text-green-300' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}
            dir="rtl"
          >
            <div className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-1">{labels.output}</div>
            <div className="text-2xl font-arabic">{arabicOutput}</div>
          </button>
        )}
      </div>

      <div className={`p-4 rounded-2xl border mb-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="text-xs font-black uppercase tracking-widest text-fuchsia-500">{labels.formsTitle}</div>
        <p className={`text-xs mt-1 mb-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{labels.formsHint}</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className={`rounded-xl p-2 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="text-[10px] opacity-70">{labels.formsIsolated}</div>
            <div className="text-2xl font-arabic" dir="rtl">{activeLetter || practiceLetter.ar}</div>
          </div>
          <div className={`rounded-xl p-2 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="text-[10px] opacity-70">{labels.formsInitial}</div>
            <div className="text-2xl font-arabic" dir="rtl">{LETTER_FORMS[activeLetter || practiceLetter.ar]?.initial}</div>
          </div>
          <div className={`rounded-xl p-2 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="text-[10px] opacity-70">{labels.formsMedial}</div>
            <div className="text-2xl font-arabic" dir="rtl">{LETTER_FORMS[activeLetter || practiceLetter.ar]?.medial}</div>
          </div>
          <div className={`rounded-xl p-2 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="text-[10px] opacity-70">{labels.formsFinal}</div>
            <div className="text-2xl font-arabic" dir="rtl">{LETTER_FORMS[activeLetter || practiceLetter.ar]?.final}</div>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border mb-4 space-y-3 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="text-xs font-black uppercase tracking-widest text-amber-500">{labels.practiceTitle}</div>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{labels.practiceHint}</p>
        <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
          <div className="text-[11px] opacity-70">{labels.practiceTarget}</div>
          <div className="text-lg font-semibold">{practiceLetter.translit}</div>
          <div className="text-2xl font-arabic" dir="rtl">{practiceLetter.ar}</div>
        </div>
        <input
          value={practiceInput}
          onChange={(event) => setPracticeInput(event.target.value)}
          placeholder={labels.practicePlaceholder}
          className={`w-full px-3 py-2 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
          dir="rtl"
        />
        <div className="grid grid-cols-2 gap-2">
          <button onClick={checkPractice} className="py-2.5 rounded-xl bg-amber-500 text-white font-bold">{labels.practiceCheck}</button>
          <button onClick={nextPractice} className={`py-2.5 rounded-xl border font-bold ${isDarkMode ? 'border-slate-600 text-slate-100' : 'border-gray-300 text-gray-700'}`}>{labels.practiceNext}</button>
        </div>
        {practiceResult === 'correct' && <div className="text-sm text-emerald-500 font-semibold">{labels.practiceCorrect}</div>}
        {practiceResult === 'wrong' && <div className="text-sm text-rose-500 font-semibold">{labels.practiceWrong}</div>}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {letters.map((letter) => (
          <button
            key={letter.ar}
            onClick={() => playLetter(letter)}
            className={`p-4 rounded-2xl border text-center transition-all active:scale-95 ${
              activeLetter === letter.ar
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg'
                : (isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-800')
            }`}
          >
            <div className="text-3xl font-arabic mb-1" dir="rtl">{letter.ar}</div>
            <div className="text-[10px] font-bold opacity-80 truncate">{letter.translit}</div>
            <div className="mt-2 flex items-center justify-center"><Volume2 size={14} /></div>
          </button>
        ))}
      </div>
    </div>
  );
}
