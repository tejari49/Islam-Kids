import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, BookOpen, MessageCircle, Library, Moon, Sun, Trophy, Sparkles, Settings, History, CheckCircle2 } from 'lucide-react';
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
import SurenList from './components/SurenList';
import SureDetail from './components/SureDetail';
import { useData } from './hooks/useData';

const CHANGELOG_HISTORY = [
  {
    version: '2026-03-26-daily-progress-v1',
    date: '2026-03-26',
    items: {
      de: [
        'Neues Tagesziel-System: täglicher Lernfortschritt mit automatischem Tages-Reset.',
        'Neue Einstellungen: Auto-Play, Auto-Fokus auf aktuelle Aya, Standard-Übersetzung und Kinder-Modus.',
        'Suren-Ansicht verbessert: strikter Accordion-Modus (nur eine Aya gleichzeitig geöffnet).',
        'Changelog-Historie eingebaut: beim Start einmalig + Verlauf in den Einstellungen.',
        'Deploy stabilisiert über vorgebautes dist-Artefakt (ohne CI-Build-Crash).'
      ],
      al: [
        'Sistem i ri i objektivit ditor: progres ditor me reset automatik çdo ditë.',
        'U shtuan cilësime të reja: Auto-Play, fokus automatik te ajeti aktual, përkthimi standard dhe mënyra për fëmijë.',
        'Pamja e sures u përmirësua: modalitet strict accordion (vetëm një ajet i hapur).',
        'U shtua historiku i ndryshimeve: shfaqje një herë në nisje + listë në cilësime.',
        'Deploy u stabilizua me dist të ndërtuar paraprakisht (pa crash në CI build).'
      ],
      tr: [
        'Yeni günlük hedef sistemi: otomatik günlük sıfırlama ile öğrenme takibi.',
        'Yeni ayarlar eklendi: Otomatik oynatma, aktif ayete otomatik odak, varsayılan çeviri ve çocuk modu.',
        'Sure görünümü geliştirildi: strict accordion modu (aynı anda sadece bir ayet açık).',
        'Sürüm geçmişi eklendi: açılışta bir kez gösterim + ayarlarda geçmiş listesi.',
        'Deploy, önceden oluşturulmuş dist ile stabilize edildi (CI build çökmesi olmadan).'
      ]
    }
  },
  {
    version: '2026-03-24-quiz-redesign-v2',
    date: '2026-03-24',
    items: {
      de: [
        'Quiz komplett neu gestaltet.',
        'Duas neu geordnet mit einheitlicher Struktur.',
        'Vollständiger Koran mit vollständigen Suren integriert.'
      ],
      al: [
        'Kuizi u ridizenjua plotësisht.',
        'Duatë u riorganizuan me strukturë të njëjtë.',
        'Kurani i plotë me sure të plota u integrua.'
      ],
      tr: [
        'Quiz tamamen yenilendi.',
        'Dualar tek tip yapıya getirildi.',
        'Tam surelerle birlikte Kur’an entegrasyonu eklendi.'
      ]
    }
  }
];
const CHANGELOG_VERSION = CHANGELOG_HISTORY[0].version;

const changelogModalTexts = {
  de: { title: 'Neu in dieser Version', subtitle: 'Beim ersten Start siehst du kurz, was verbessert wurde.', close: 'Verstanden' },
  al: { title: 'E re në këtë version', subtitle: 'Në hapjen e parë shfaqet shkurt çfarë është përmirësuar.', close: 'Në rregull' },
  tr: { title: 'Bu sürümde yeniler', subtitle: 'İlk açılışta nelerin geliştirildiğini kısaca görürsün.', close: 'Tamam' }
};


export default function App() {
  const getTodayKey = () => new Date().toISOString().slice(0, 10);
  const { duas, hadiths, stories, suren, loading } = useData();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLang, setSelectedLang] = useState('de');
  const [selectedDua, setSelectedDua] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedHadith, setSelectedHadith] = useState(null);
  const [selectedSure, setSelectedSure] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showChangelog, setShowChangelog] = useState(() => localStorage.getItem('seenChangelogVersion') !== CHANGELOG_VERSION);
  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      autoPlaySurah: false,
      autoOpenCurrentAyah: true,
      showTranslationDefault: true,
      kidsMode: false,
      dailyGoalEnabled: true,
      dailyGoalTarget: 3
    };
  });
  const [fontScale, setFontScale] = useState(() => {
    const saved = Number(localStorage.getItem('fontScalePercent'));
    if (Number.isFinite(saved) && saved >= 85 && saved <= 120) {
      return saved;
    }
    return 100;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : { duas: [], hadiths: [], stories: [], suren: [] };
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('stats');
    return saved ? JSON.parse(saved) : { xp: 0, quizzesPlayed: 0, itemsRead: 0 };
  });
  const [dailyProgress, setDailyProgress] = useState(() => {
    const saved = localStorage.getItem('dailyProgress');
    const today = getTodayKey();
    if (!saved) return { date: today, done: 0 };
    const parsed = JSON.parse(saved);
    if (parsed?.date !== today) return { date: today, done: 0 };
    return { date: parsed.date, done: Number(parsed.done) || 0 };
  });

  const [userLocation, setUserLocation] = useState(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : { city: 'Berlin', country: 'Germany', method: 2 };
  });

  const updateLocation = React.useCallback((newLocation) => {
    setUserLocation(newLocation);
  }, []);


  useEffect(() => {
    localStorage.setItem('userLocation', JSON.stringify(userLocation));
  }, [userLocation]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('fontScalePercent', String(fontScale));
    document.documentElement.style.fontSize = `${fontScale}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress));
  }, [dailyProgress]);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
  }, [appSettings]);

  const addXp = React.useCallback((amount) => {
    setStats((prev) => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const incrementStat = React.useCallback((key) => {
    setStats((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    if (key === 'itemsRead') {
      const today = getTodayKey();
      setDailyProgress((prev) => {
        if (prev.date !== today) {
          return { date: today, done: 1 };
        }
        return { ...prev, done: prev.done + 1 };
      });
    }
  }, []);

  const toggleFavorite = React.useCallback((type, id) => {
    setFavorites((prev) => {
      const current = prev[type] || [];
      const exists = current.includes(id);
      return {
        ...prev,
        [type]: exists ? current.filter((itemId) => itemId !== id) : [...current, id]
      };
    });
  }, []);

  const uiTexts = {
    de: { welcome: 'Hallo! Lass uns lernen 🌟', duas: 'Duas', stories: 'Stories', hadiths: 'Hadithe', suren: 'Suren', selectDua: 'Wähle ein Dua aus:', selectStory: 'Wähle eine Geschichte:', selectHadith: 'Wähle einen Hadith:', listen: 'Anhören', source: 'Quelle', prophet: 'Prophet', sleep: 'Schlafen', parents: 'Eltern', level: 'Level', xp: 'EP' },
    al: { welcome: 'Përshëndetje! Le të mësojmë 🌟', duas: 'Duatë', stories: 'Tregime', hadiths: 'Hadithe', suren: 'Suret', selectDua: 'Zgjidh një Dua:', selectStory: 'Zgjidh një tregim:', selectHadith: 'Zgjidh një Hadith:', listen: 'Dëgjo', source: 'Burimi', prophet: 'Profeti', sleep: 'Gjumi', parents: 'Prindërit', level: 'Niveli', xp: 'XP' },
    tr: { welcome: 'Merhaba! Hadi öğrenelim 🌟', duas: 'Dualar', stories: 'Hikayeler', hadiths: 'Hadisler', suren: 'Sureler', selectDua: 'Bir Dua seç:', selectStory: 'Bir hikaye seç:', selectHadith: 'Bir Hadis seç:', listen: 'Dinle', source: 'Kaynak', prophet: 'Peygamber', sleep: 'Uyku', parents: 'Anne Baba', level: 'Seviye', xp: 'XP' }
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

  const increaseFont = () => {
    setFontScale((prev) => Math.min(prev + 5, 120));
  };

  const decreaseFont = () => {
    setFontScale((prev) => Math.max(prev - 5, 85));
  };

  const toggleSetting = (key) => {
    setAppSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearSelections = React.useCallback(() => {
    setSelectedDua(null);
    setSelectedStory(null);
    setSelectedHadith(null);
    setSelectedSure(null);
    setSelectedFeature(null);
  }, []);

  const openDua = React.useCallback((dua) => {
    setSelectedStory(null);
    setSelectedHadith(null);
    setSelectedSure(null);
    setSelectedFeature(null);
    setSelectedDua(dua);
  }, []);

  const openStory = React.useCallback((story) => {
    setSelectedDua(null);
    setSelectedHadith(null);
    setSelectedSure(null);
    setSelectedFeature(null);
    setSelectedStory(story);
  }, []);

  const openHadith = React.useCallback((hadith) => {
    setSelectedDua(null);
    setSelectedStory(null);
    setSelectedSure(null);
    setSelectedFeature(null);
    setSelectedHadith(hadith);
  }, []);

  const openSure = React.useCallback((sure) => {
    setSelectedDua(null);
    setSelectedStory(null);
    setSelectedHadith(null);
    setSelectedFeature(null);
    setSelectedSure(sure);
  }, []);

  const handleTabChange = React.useCallback((tab) => {
    setActiveTab(tab);
    clearSelections();
  }, [clearSelections]);

  const level = Math.floor(stats.xp / 100) + 1;
  const currentLevelXp = stats.xp % 100;
  const dailyTarget = Math.max(1, Number(appSettings.dailyGoalTarget) || 3);
  const todayKey = getTodayKey();
  const todayDone = dailyProgress.date === todayKey ? dailyProgress.done : 0;
  const dailyPercent = Math.min(100, Math.round((todayDone / dailyTarget) * 100));
  const changelog = changelogModalTexts[selectedLang] || changelogModalTexts.de;
  const latestChangelogItems = CHANGELOG_HISTORY[0].items[selectedLang] || CHANGELOG_HISTORY[0].items.de;

  const closeChangelog = () => {
    localStorage.setItem('seenChangelogVersion', CHANGELOG_VERSION);
    setShowChangelog(false);
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen font-sans relative overflow-hidden transition-colors duration-300 ${appSettings.kidsMode ? 'text-[1.04em]' : ''} ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`p-4 shadow-sm flex flex-col z-10 relative transition-colors ${isDarkMode ? 'bg-slate-800 border-b border-slate-700' : 'bg-white'}`}>
        <div className="flex flex-row items-center justify-between w-full mb-3">
          <div className="flex items-center gap-1">
            <button
              onClick={decreaseFont}
              className={`w-8 h-8 rounded-full transition-all font-black active:scale-95 ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}
              title="Schrift kleiner"
            >
              A
            </button>
            <button
              onClick={increaseFont}
              className={`w-9 h-9 rounded-full transition-all font-black text-lg active:scale-95 ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-800'}`}
              title="Schrift größer"
            >
              A
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              title={isDarkMode ? 'Tag-Modus' : 'Nacht-Modus'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setSelectedFeature(selectedFeature === 'settings' ? null : 'settings')}
              className={`p-2 rounded-full transition-all ${selectedFeature === 'settings'
                ? 'bg-emerald-500 text-white'
                : (isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700')}`}
              title="Einstellungen"
            >
              <Settings size={20} />
            </button>
          </div>

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
        {appSettings.dailyGoalEnabled && (
          <div className={`mt-2 px-2 py-2 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-emerald-50/60 border-emerald-100'}`}>
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span>Tagesziel</span>
              <span>{todayDone}/{dailyTarget}</span>
            </div>
            <div className={`mt-1 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
              <div className="h-full bg-gradient-to-r from-emerald-400 to-green-600 transition-all" style={{ width: `${dailyPercent}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="h-[calc(100vh-170px)] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isDarkMode ? 'border-slate-700 border-t-green-500' : 'border-green-200 border-t-green-500'}`}></div>
            <p className="text-gray-500 font-medium">Lade Inhalte...</p>
          </div>
        ) : (
          <>
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
                suren={suren}
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
                suren={suren}
              />
            )}
            {selectedFeature === 'achievements' && (
              <Achievements 
                selectedLang={selectedLang}
                setSelectedFeature={setSelectedFeature}
                isDarkMode={isDarkMode}
                stats={stats}
                favorites={favorites}
              />
            )}
            {selectedFeature === 'settings' && (
              <div className={`p-6 pb-24 min-h-screen space-y-5 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                    <Settings size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Einstellungen</h2>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Dashboard für Funktionen & Verhalten</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    ['autoPlaySurah', 'Automatische Suren-Wiedergabe'],
                    ['autoOpenCurrentAyah', 'Aktuelle Aya automatisch öffnen'],
                    ['showTranslationDefault', 'Übersetzung standardmäßig anzeigen'],
                    ['kidsMode', 'Kinder-Modus (größere Buttons)'],
                    ['dailyGoalEnabled', 'Tagesziel anzeigen']
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => toggleSetting(key)}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                    >
                      <span className="text-sm font-bold text-left">{label}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-black ${appSettings[key]
                        ? 'bg-emerald-500 text-white'
                        : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600')}`}>
                        {appSettings[key] ? 'AN' : 'AUS'}
                      </span>
                    </button>
                  ))}
                </div>
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                  <h3 className="text-sm font-black mb-3">Tagesziel (Lesen)</h3>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setAppSettings((prev) => ({ ...prev, dailyGoalTarget: Math.max(1, (Number(prev.dailyGoalTarget) || 3) - 1) }))}
                      className={`px-3 py-2 rounded-xl font-black ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}
                    >
                      -
                    </button>
                    <div className="text-center">
                      <div className="text-lg font-black">{dailyTarget}</div>
                      <div className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Inhalte pro Tag</div>
                    </div>
                    <button
                      onClick={() => setAppSettings((prev) => ({ ...prev, dailyGoalTarget: Math.min(20, (Number(prev.dailyGoalTarget) || 3) + 1) }))}
                      className={`px-3 py-2 rounded-xl font-black ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <History size={16} />
                    <h3 className="text-sm font-black uppercase tracking-wide">Changelog Verlauf</h3>
                  </div>
                  <div className="space-y-3">
                    {CHANGELOG_HISTORY.map((entry) => {
                      const items = entry.items[selectedLang] || entry.items.de;
                      return (
                        <div key={entry.version} className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black">{entry.version}</span>
                            <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{entry.date}</span>
                          </div>
                          <ul className="space-y-1">
                            {items.map((item) => (
                              <li key={item} className="text-xs flex items-start gap-2">
                                <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {!selectedFeature && (
              <>
                {activeTab === 'home' && !selectedDua && !selectedStory && !selectedHadith && !selectedSure && (
                  <Home
                    selectedLang={selectedLang}
                    uiTexts={uiTexts}
                    handleTabChange={handleTabChange}
                    setSelectedDua={openDua}
                    setSelectedStory={openStory}
                    setSelectedHadith={openHadith}
                    setSelectedSure={openSure}
                    setSelectedFeature={setSelectedFeature}
                    duas={duas}
                    hadiths={hadiths}
                    stories={stories}
                    suren={suren}
                    isDarkMode={isDarkMode}
                    favorites={favorites}
                    stats={stats}
                    userLocation={userLocation}
                    setUserLocation={updateLocation}
                  />
                )}
                {activeTab === 'duas' && !selectedDua && !selectedStory && !selectedHadith && (
                  <DuasList 
                    selectedLang={selectedLang} 
                    uiTexts={uiTexts} 
                    setSelectedDua={openDua}
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
                    setSelectedHadith={openHadith}
                    hadiths={hadiths} 
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                  />
                )}
                {activeTab === 'stories' && !selectedDua && !selectedStory && !selectedHadith && !selectedSure && (
                  <StoriesList 
                    selectedLang={selectedLang} 
                    uiTexts={uiTexts} 
                    setSelectedStory={openStory}
                    stories={stories} 
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                  />
                )}
                {activeTab === 'suren' && !selectedDua && !selectedStory && !selectedHadith && !selectedSure && (
                  <SurenList 
                    selectedLang={selectedLang} 
                    setSelectedSure={openSure}
                    suren={suren} 
                    isDarkMode={isDarkMode}
                    onSelect={openSure}
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
                {selectedSure && (
                  <SureDetail 
                    item={selectedSure} 
                    selectedLang={selectedLang} 
                    onBack={() => setSelectedSure(null)} 
                    isDarkMode={isDarkMode}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                    incrementStat={incrementStat}
                    appSettings={appSettings}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      {!selectedDua && !selectedStory && !selectedHadith && !selectedSure && !selectedFeature && (
        <div className={`fixed bottom-0 max-w-md w-full border-t flex justify-between px-2 py-3 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
          <button 
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/5 cursor-pointer ${activeTab === 'home' ? 'text-green-500' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <HomeIcon size={22} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('duas')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/5 cursor-pointer ${activeTab === 'duas' ? 'text-green-500' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BookOpen size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].duas}</span>
          </button>

          <button 
            onClick={() => handleTabChange('suren')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/5 cursor-pointer ${activeTab === 'suren' ? 'text-green-600' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BookOpen size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].suren}</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('hadiths')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/5 cursor-pointer ${activeTab === 'hadiths' ? 'text-yellow-500' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MessageCircle size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].hadiths}</span>
          </button>

          <button 
            onClick={() => handleTabChange('stories')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/5 cursor-pointer ${activeTab === 'stories' ? 'text-purple-500' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Library size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].stories}</span>
          </button>
        </div>
      )}

      {showChangelog && (
        <div className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className={`w-full rounded-[2rem] border-2 p-6 shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black leading-tight">{changelog.title}</h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{changelog.subtitle}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {latestChangelogItems.map((item) => (
                <div key={item} className={`flex items-start gap-3 p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>{item}</p>
                </div>
              ))}
            </div>

            <button
              onClick={closeChangelog}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black transition-colors"
            >
              {changelog.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
