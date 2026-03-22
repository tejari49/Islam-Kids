import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, BookOpen, MessageCircle, Library, Moon, Sun, Heart, Trophy, GraduationCap } from 'lucide-react';
import Home from './components/Home';
import DuasList from './components/DuasList';
import DuaDetail from './components/DuaDetail';
import HadithsList from './components/HadithsList';
import HadithDetail from './components/HadithDetail';
import StoriesList from './components/StoriesList';
import StoryDetail from './components/StoryDetail';
import PrayerFlow from './components/PrayerFlow';
import Quiz from './components/Quiz';
import QuranTrainer from './components/QuranTrainer';
import Achievements from './components/Achievements';

import { useData } from './hooks/useData';

export default function App() {
  const { duas, hadiths, stories, loading } = useData();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLang, setSelectedLang] = useState('de');
  const [selectedDua, setSelectedDua] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedHadith, setSelectedHadith] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  // New States for Phase 1 & 2
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : { duas: [], hadiths: [], stories: [] };
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('stats');
    return saved ? JSON.parse(saved) : { xp: 0, quizzesPlayed: 0, itemsRead: 0 };
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  const addXp = (amount) => {
    setStats(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const incrementStat = (key) => {
    setStats(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const toggleFavorite = (type, id) => {
    setFavorites(prev => {
      const current = prev[type] || [];
      const exists = current.includes(id);
      return {
        ...prev,
        [type]: exists ? current.filter(itemId => itemId !== id) : [...current, id]
      };
    });
  };

  const uiTexts = {
    de: { welcome: "Hallo! Lass uns lernen 🌟", duas: "Meine Duas", stories: "Geschichten", hadiths: "Hadithe", selectDua: "Wähle ein Dua aus:", selectStory: "Wähle eine Geschichte:", selectHadith: "Wähle einen Hadith:", listen: "Anhören", source: "Quelle", prophet: "Prophet", sleep: "Schlafen", parents: "Eltern", level: "Level", xp: "EP" },
    al: { welcome: "Përshëndetje! Le të mësojmë 🌟", duas: "Duatë e mia", stories: "Tregime", hadiths: "Hadithe", selectDua: "Zgjidh një Dua:", selectStory: "Zgjidh një tregim:", selectHadith: "Zgjidh një Hadith:", listen: "Dëgjo", source: "Burimi", prophet: "Profeti", sleep: "Gjumi", parents: "Prindërit", level: "Niveli", xp: "XP" },
    tr: { welcome: "Merhaba! Hadi öğrenelim 🌟", duas: "Dualarım", stories: "Hikayeler", hadiths: "Hadisler", selectDua: "Bir Dua seç:", selectStory: "Bir hikaye seç:", selectHadith: "Bir Hadis seç:", listen: "Dinle", source: "Kaynak", prophet: "Peygamber", sleep: "Uyku", parents: "Anne Baba", level: "Seviye", xp: "XP" }
  };

  const langMap = {
    de: '🇩🇪 DE',
    al: '🇦🇱 AL',
    tr: '🇹🇷 TR'
  };

  const cycleLanguage = () => {
    const langs = ['de', 'al', 'tr'];
    const currentIndex = langs.indexOf(selectedLang);
    setSelectedLang(langs[(currentIndex + 1) % langs.length]);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedDua(null);
    setSelectedStory(null);
    setSelectedHadith(null);
    setSelectedFeature(null);
  };

  // Level Logic
  const level = Math.floor(stats.xp / 100) + 1;
  const currentLevelXp = stats.xp % 100;

  return (
    <div className={`max-w-md mx-auto min-h-screen font-sans relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Top Header */}
      <div className={`p-4 shadow-sm flex flex-col z-10 relative transition-colors ${isDarkMode ? 'bg-slate-800 border-b border-slate-700' : 'bg-white'}`}>
        <div className="flex flex-row items-center justify-between w-full mb-3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            title={isDarkMode ? 'Tag-Modus' : 'Nacht-Modus'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
            IslamKids
          </h1>
          <button 
            onClick={cycleLanguage} 
            className={`w-16 flex items-center justify-end px-3 py-1 rounded-full text-sm font-bold shadow-sm border active:scale-95 transition-transform cursor-pointer ${isDarkMode ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            title="Sprache wechseln"
          >
            {langMap[selectedLang]}
          </button>
        </div>

        {/* Level & XP Bar */}
        <div className="flex items-center gap-3 px-1">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter transition-colors ${isDarkMode ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-50 text-yellow-600'}`}>
            <Trophy size={12} />
            {uiTexts[selectedLang].level} {level}
          </div>
          <div className={`flex-1 h-3 rounded-full overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 rounded-full"
              style={{ width: `${currentLevelXp}%` }}
            ></div>
          </div>
          <div className="text-[10px] font-black text-slate-400">{currentLevelXp}/100 {uiTexts[selectedLang].xp}</div>
        </div>
      </div>

      <div className="h-[calc(100vh-160px)] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isDarkMode ? 'border-slate-700 border-t-green-500' : 'border-green-200 border-t-green-500'}`}></div>
            <p className="text-gray-500 font-medium">Lade Inhalte...</p>
          </div>
        ) : (
          <>
            {/* Spezielle Features haben Vorrang */}
            {selectedFeature === 'prayer' && (
              <PrayerFlow selectedLang={selectedLang} setSelectedFeature={setSelectedFeature} isDarkMode={isDarkMode} />
            )}
            {selectedFeature === 'quiz' && (
              <Quiz 
                selectedLang={selectedLang} 
                setSelectedFeature={setSelectedFeature} 
                isDarkMode={isDarkMode} 
                duas={duas} 
                hadiths={hadiths} 
                stories={stories} 
                addXp={addXp}
                incrementStat={incrementStat}
              />
            )}
            {selectedFeature === 'trainer' && (
              <QuranTrainer 
                selectedLang={selectedLang} 
                setSelectedFeature={setSelectedFeature} 
                isDarkMode={isDarkMode} 
                addXp={addXp}
              />
            )}
            {selectedFeature === 'achievements' && (
              <Achievements 
                selectedLang={selectedLang} 
                setSelectedFeature={setSelectedFeature} 
                isDarkMode={isDarkMode} 
                stats={stats}
              />
            )}

            {!selectedFeature && (
              <>
                {activeTab === 'home' && !selectedDua && !selectedStory && !selectedHadith && (
                  <Home 
                    selectedLang={selectedLang} 
                    uiTexts={uiTexts} 
                    handleTabChange={handleTabChange} 
                    setSelectedDua={setSelectedDua} 
                    setSelectedStory={setSelectedStory}
                    setSelectedHadith={setSelectedHadith}
                    setSelectedFeature={setSelectedFeature}
                    duas={duas}
                    hadiths={hadiths}
                    stories={stories}
                    isDarkMode={isDarkMode}
                    favorites={favorites}
                    stats={stats}
                  />
                )}
                {activeTab === 'duas' && !selectedDua && !selectedStory && !selectedHadith && (
                  <DuasList 
                    selectedLang={selectedLang} 
                    uiTexts={uiTexts} 
                    setSelectedDua={setSelectedDua} 
                    duas={duas} 
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                  />
                )}
                {activeTab === 'hadiths' && !selectedDua && !selectedStory && !selectedHadith && (
                  <HadithsList 
                    selectedLang={selectedLang} 
                    uiTexts={uiTexts} 
                    setSelectedHadith={setSelectedHadith} 
                    hadiths={hadiths} 
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                  />
                )}
                {activeTab === 'stories' && !selectedDua && !selectedStory && !selectedHadith && (
                  <StoriesList 
                    selectedLang={selectedLang} 
                    uiTexts={uiTexts} 
                    setSelectedStory={setSelectedStory} 
                    stories={stories} 
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                  />
                )}
                
                {selectedDua && (
                  <DuaDetail 
                    selectedDua={selectedDua} 
                    selectedLang={selectedLang} 
                    uiTexts={uiTexts} 
                    setSelectedDua={setSelectedDua} 
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    isFavorite={favorites.duas.includes(selectedDua.id)}
                    incrementStat={incrementStat}
                  />
                )}
                {selectedHadith && (
                  <HadithDetail 
                    selectedHadith={selectedHadith} 
                    selectedLang={selectedLang} 
                    setSelectedHadith={setSelectedHadith} 
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    isFavorite={favorites.hadiths.includes(selectedHadith.id)}
                    incrementStat={incrementStat}
                  />
                )}
                {selectedStory && (
                  <StoryDetail 
                    selectedStory={selectedStory} 
                    selectedLang={selectedLang} 
                    setSelectedStory={setSelectedStory} 
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    isFavorite={favorites.stories.includes(selectedStory.id)}
                    incrementStat={incrementStat}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      {!selectedDua && !selectedStory && !selectedHadith && !selectedFeature && (
        <div className={`fixed bottom-0 max-w-md w-full border-t flex justify-between px-2 py-3 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
          <button 
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 cursor-pointer ${activeTab === 'home' ? 'text-green-500' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <HomeIcon size={22} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('duas')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 cursor-pointer ${activeTab === 'duas' ? 'text-green-500' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BookOpen size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].duas}</span>
          </button>

          <button 
            onClick={() => handleTabChange('hadiths')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 cursor-pointer ${activeTab === 'hadiths' ? 'text-yellow-500' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MessageCircle size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].hadiths}</span>
          </button>

          <button 
            onClick={() => handleTabChange('stories')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 cursor-pointer ${activeTab === 'stories' ? 'text-purple-500' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Library size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].stories}</span>
          </button>
        </div>
      )}
    </div>
  );
}
