import React from 'react';
import { ChevronLeft, Heart, BookOpen, Sparkles } from 'lucide-react';

const labels = {
  de: {
    back: 'Zurück',
    summary: 'Kurz erklärt',
    background: 'Hintergrund',
    story: 'Die Geschichte',
    lesson: 'Was wir lernen'
  },
  al: {
    back: 'Mbrapsht',
    summary: 'Shkurt',
    background: 'Sfondi',
    story: 'Historia',
    lesson: 'Çfarë mësojmë'
  },
  tr: {
    back: 'Geri',
    summary: 'Kısa açıklama',
    background: 'Arka plan',
    story: 'Hikâye',
    lesson: 'Ne öğreniyoruz'
  }
};

function getLangValue(value, lang) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.de || Object.values(value)[0] || '';
}

function SectionCard({ title, text, icon, isDarkMode, tone = 'slate' }) {
  const tones = {
    purple: isDarkMode ? 'bg-purple-900/10 border-purple-900/30' : 'bg-purple-50 border-purple-100',
    blue: isDarkMode ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100',
    amber: isDarkMode ? 'bg-amber-900/10 border-amber-900/30' : 'bg-amber-50 border-amber-100',
    slate: isDarkMode ? 'bg-slate-700/30 border-slate-700' : 'bg-gray-50 border-gray-100'
  };

  if (!text) return null;

  return (
    <div className={`text-left p-5 rounded-2xl border transition-colors ${tones[tone] || tones.slate}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className={`text-sm uppercase font-bold tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{title}</p>
      </div>
      <p className={`text-base leading-relaxed font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
        {text}
      </p>
    </div>
  );
}

export default function StoryDetail({ 
  selectedStory, 
  selectedLang, 
  setSelectedStory, 
  isDarkMode, 
  toggleFavorite, 
  isFavorite,
  incrementStat 
}) {
  const hasIncremented = React.useRef(false);
  const t = labels[selectedLang] || labels.de;

  React.useEffect(() => {
    if (selectedStory && !hasIncremented.current) {
      incrementStat('itemsRead');
      hasIncremented.current = true;
    }
  }, [selectedStory, incrementStat]);

  React.useEffect(() => {
    hasIncremented.current = false;
  }, [selectedStory?.id]);

  if (!selectedStory) return null;

  const summary = getLangValue(selectedStory.summary, selectedLang);
  const background = getLangValue(selectedStory.background, selectedLang);
  const storyText = getLangValue(selectedStory.story, selectedLang) || getLangValue(selectedStory.content, selectedLang);
  const lesson = getLangValue(selectedStory.lesson, selectedLang);

  return (
    <div className={`p-6 pb-24 space-y-6 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <button 
        onClick={() => setSelectedStory(null)}
        className={`flex flex-row items-center gap-2 font-bold mb-2 self-start px-4 py-2 rounded-full shadow-sm border transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
      >
        <ChevronLeft size={20} /> {t.back}
      </button>

      <div className={`rounded-3xl p-6 shadow-sm border-2 space-y-5 flex-1 relative overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-800 border-purple-900/30 shadow-slate-950/50' : 'bg-white border-purple-100'}`}>
        <button 
          onClick={() => toggleFavorite('stories', selectedStory.id)}
          className={`absolute top-5 right-5 p-2 rounded-full transition-all active:scale-125 ${isFavorite ? 'text-red-500 bg-red-50/10' : isDarkMode ? 'text-slate-600 hover:text-slate-400' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <Heart size={26} className={isFavorite ? 'fill-red-500' : ''} />
        </button>

        <div className="pr-10">
          <div className="text-6xl mb-3">{selectedStory.icon}</div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {selectedStory.featured && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700 border border-purple-100'}`}>
                <Sparkles size={12} /> {selectedLang === 'de' ? 'Mehr Kontext' : selectedLang === 'al' ? 'Më shumë kontekst' : 'Daha fazla içerik'}
              </span>
            )}
          </div>
          <h2 className={`text-2xl font-black leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {selectedStory.title[selectedLang]}
          </h2>
        </div>

        <SectionCard
          title={t.summary}
          text={summary || getLangValue(selectedStory.content, selectedLang)}
          icon={<Sparkles size={16} className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} />}
          isDarkMode={isDarkMode}
          tone="purple"
        />

        <SectionCard
          title={t.background}
          text={background}
          icon={<BookOpen size={16} className={isDarkMode ? 'text-blue-300' : 'text-blue-600'} />}
          isDarkMode={isDarkMode}
          tone="blue"
        />

        <SectionCard
          title={t.story}
          text={storyText}
          icon={<BookOpen size={16} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'} />}
          isDarkMode={isDarkMode}
          tone="slate"
        />

        <SectionCard
          title={t.lesson}
          text={lesson}
          icon={<Sparkles size={16} className={isDarkMode ? 'text-amber-300' : 'text-amber-600'} />}
          isDarkMode={isDarkMode}
          tone="amber"
        />
      </div>
    </div>
  );
}
