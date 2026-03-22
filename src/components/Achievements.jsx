import React from 'react';
import { ChevronLeft, Trophy, Star, BookOpen, Brain, Zap, CheckCircle2 } from 'lucide-react';

export default function Achievements({ selectedLang, setSelectedFeature, isDarkMode, stats }) {
  const level = Math.floor(stats.xp / 100) + 1;
  const currentLevelXp = stats.xp % 100;

  const BADGES = [
    { 
      id: 'beginner', 
      icon: '🌱', 
      title: { de: "Erste Schritte", al: "Hapat e parë", tr: "İlk Adımlar" }, 
      desc: { de: "Gehe auf Level 2", al: "Arri nivelin 2", tr: "2. Seviyeye ulaş" },
      check: level >= 2 
    },
    { 
      id: 'quiz_master', 
      icon: '🧠', 
      title: { de: "Quiz-Meister", al: "Mjeshtër i Kuizit", tr: "Bilgi Ustası" }, 
      desc: { de: "Spiele 5 Quizzes", al: "Luaj 5 kuize", tr: "5 Bilgi Yarışı oyna" },
      check: stats.quizzesPlayed >= 5 
    },
    { 
      id: 'reader', 
      icon: '📖', 
      title: { de: "Bücherwurm", al: "Lexues i zellshëm", tr: "Kitap Kurdu" }, 
      desc: { de: "Lies 10 Inhalte", al: "Lexo 10 përmbajtje", tr: "10 içerik oku" },
      check: stats.itemsRead >= 10 
    },
    { 
      id: 'scholar', 
      icon: '🎓', 
      title: { de: "Gelehrter", al: "Dijetar", tr: "Alim" }, 
      desc: { de: "Erreiche Level 5", al: "Arri nivelin 5", tr: "5. Seviyeye ulaş" },
      check: level >= 5 
    },
    { 
      id: 'super_reader', 
      icon: '🌟', 
      title: { de: "Super-Leser", al: "Super Lexues", tr: "Süper Okuyucu" }, 
      desc: { de: "Lies 50 Inhalte", al: "Lexo 50 përmbajtje", tr: "50 içerik oku" },
      check: stats.itemsRead >= 50 
    },
    { 
      id: 'marathon', 
      icon: '🏆', 
      title: { de: "Dauerbrenner", al: "Maratonomaku", tr: "Maratoncu" }, 
      desc: { de: "Spiele 20 Quizzes", al: "Luaj 20 kuize", tr: "20 Bilgi Yarışı oyna" },
      check: stats.quizzesPlayed >= 20 
    },
  ];

  return (
    <div className={`p-6 pb-24 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setSelectedFeature(null)} className={`p-2 rounded-full shadow-sm transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>
          <ChevronLeft size={24} />
        </button>
        <h2 className={`text-2xl font-black transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {selectedLang === 'de' ? 'Deine Erfolge' : selectedLang === 'al' ? 'Sukseset e tua' : 'Başarıların'}
        </h2>
      </div>

      {/* Profile Header Card */}
      <div className={`p-8 rounded-[3rem] border-2 shadow-xl mb-8 relative overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-800 border-yellow-900/30 shadow-slate-950/50' : 'bg-white border-yellow-100'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg border-4 border-white">
              🦁
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
              <Star size={16} fill="white" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className={`text-3xl font-black transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Level {level}</h3>
            <p className="text-yellow-600 font-bold uppercase tracking-widest text-xs">Kleiner Löwe</p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-black text-slate-400 uppercase">
              <span>Fortschritt</span>
              <span>{currentLevelXp}/100 EP</span>
            </div>
            <div className={`h-4 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-sm transition-all duration-1000"
                style={{ width: `${currentLevelXp}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 w-full gap-2 mt-4 pt-4 border-t border-slate-700/10">
            <div className="flex flex-col items-center">
              <Zap size={20} className="text-yellow-500 mb-1" />
              <span className="text-lg font-black">{stats.xp}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Gesamt EP</span>
            </div>
            <div className="flex flex-col items-center">
              <Brain size={20} className="text-blue-500 mb-1" />
              <span className="text-lg font-black">{stats.quizzesPlayed}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Quizzes</span>
            </div>
            <div className="flex flex-col items-center">
              <BookOpen size={20} className="text-green-500 mb-1" />
              <span className="text-lg font-black">{stats.itemsRead}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Gelesen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h4 className={`text-sm font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
          Abzeichen ({BADGES.filter(b => b.check).length}/{BADGES.length})
        </h4>
        
        <div className="grid grid-cols-1 gap-3">
          {BADGES.map((badge) => (
            <div 
              key={badge.id}
              className={`p-4 rounded-3xl border-2 flex items-center gap-4 transition-all ${
                badge.check 
                  ? (isDarkMode ? 'bg-slate-800 border-green-900/30' : 'bg-white border-green-100 shadow-sm') 
                  : (isDarkMode ? 'bg-slate-800/40 border-slate-700 opacity-60 grayscale' : 'bg-gray-100 border-gray-200 opacity-60 grayscale')
              }`}
            >
              <div className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${badge.check ? 'bg-yellow-50' : 'bg-gray-200'}`}>
                {badge.icon}
              </div>
              <div className="flex-1 text-left">
                <h5 className={`font-black text-lg leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {badge.title[selectedLang]}
                </h5>
                <p className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {badge.desc[selectedLang]}
                </p>
              </div>
              {badge.check ? (
                <CheckCircle2 size={24} className="text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
