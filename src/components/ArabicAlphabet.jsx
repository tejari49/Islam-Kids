import React, { useMemo, useState } from 'react';
import { ChevronLeft, Volume2 } from 'lucide-react';
import { speakArabicText, stopSpeechPlayback } from '../utils/audio';

const LABELS = {
  de: {
    title: 'Arabisches Alphabet',
    subtitle: 'Tippe auf einen Buchstaben, um die Aussprache zu hören.',
    hint: 'Hörtraining',
    letters: 'Buchstaben'
  },
  al: {
    title: 'Alfabeti Arab',
    subtitle: 'Preke një shkronjë për ta dëgjuar shqiptimin.',
    hint: 'Trajnim dëgjimi',
    letters: 'Shkronja'
  },
  tr: {
    title: 'Arap Alfabesi',
    subtitle: 'Telaffuzu duymak için bir harfe dokun.',
    hint: 'Dinleme alıştırması',
    letters: 'Harf'
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

export default function ArabicAlphabet({ selectedLang, setSelectedFeature, isDarkMode }) {
  const labels = LABELS[selectedLang] || LABELS.de;
  const [activeLetter, setActiveLetter] = useState('');
  const letters = useMemo(() => LETTERS, []);

  const playLetter = (letter) => {
    setActiveLetter(letter.ar);
    speakArabicText(letter.ar, 0.7, {
      onEnd: () => setActiveLetter(''),
      onError: () => setActiveLetter('')
    });
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
