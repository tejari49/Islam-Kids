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
    output: 'Arabische Schreibweise'
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
    output: 'Shkrimi arabisht'
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
    output: 'Arapça yazı'
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
  const letters = useMemo(() => LETTERS, []);

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
