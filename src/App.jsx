import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, BookOpen, MessageCircle, Library, Moon, Sun, Trophy, Sparkles } from 'lucide-react';
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

const CHANGELOG_VERSION = '2026-03-24-quiz-redesign-v2';

const changelogTexts = {
  de: {
    title: 'Neu in dieser Version',
    subtitle: 'Beim ersten Start siehst du kurz, was verbessert wurde.',
    close: 'Verstanden',
    items: [
      'Quiz komplett neu gestaltet: keine verwirrenden Symbol-Fragen mehr, sondern abwechslungsreiche Aufgaben zu Bedeutung, Reihenfolge, Alltag, Gebetsschritten und Geschichten.',
      'Duas neu geordnet: überall dieselbe Reihenfolge mit Arabisch, Aussprache, Erklärung und „Wann sage ich das?“.',
      'Audio bereinigt: keine Browser-KI-Stimme mehr als Fallback, sondern nur noch echte API-Rezitation dort, wo sie verlässlich vorhanden ist.',
      'Geschichten ergänzt und ausgebaut: mehr Hintergrund, längere Erklärungen und klarere Lehren für Kinder.',
      'Darstellung aufgeräumt: bessere Übersicht, weniger Durcheinander und klarere Karten.',
      'Vollständiger Koran eingebaut: ganze Suren werden jetzt vollständig aus dem GitHub-Projekt fawazahmed0/quran-api geladen – mit Arabisch und vollständiger Übersetzung.',
      'Surah-Ansicht verbessert: fester Audio-Player unten, damit der Abspielknopf immer sichtbar bleibt.'
    ]
  },
  al: {
    title: 'E re në këtë version',
    subtitle: 'Në hapjen e parë shfaqet shkurt çfarë është përmirësuar.',
    close: 'Në rregull',
    items: [
      'Kuizi u ridizenjua plotësisht: nuk ka më pyetje ngatërruese me simbole, por detyra më të larmishme për kuptimin, renditjen, përditshmërinë, hapat e namazit dhe historitë.',
      'Duatë janë riorganizuar: kudo e njëjta renditje me arabishten, shqiptimin, shpjegimin dhe “Kur thuhet kjo?”.',
      'Audio është pastruar: nuk përdoret më zëri artificial i shfletuesit si rezervë, por vetëm recitim i vërtetë nga API aty ku është i besueshëm.',
      'Historitë janë shtuar dhe zgjeruar: më shumë sfond, më shumë përmbajtje dhe mësime më të qarta për fëmijë.',
      'Pamja është rregulluar: më shumë qartësi, më pak rrëmujë dhe karta më të kuptueshme.',
      'Kurani i plotë është integruar: suret e plota ngarkohen tani nga projekti GitHub fawazahmed0/quran-api me arabisht dhe përkthim të plotë.',
      'Pamja e sures u përmirësua: butoni i dëgjimit qëndron poshtë gjithmonë i dukshëm.'
    ]
  },
  tr: {
    title: 'Bu sürümde yeniler',
    subtitle: 'İlk açılışta nelerin geliştirildiğini kısaca görürsün.',
    close: 'Tamam',
    items: [
      'Quiz tamamen yenilendi: artık kafa karıştıran sembol soruları yok; bunun yerine anlam, sıra, günlük hayat, namaz adımları ve hikâyelerle ilgili daha çeşitli görevler var.',
      'Dualar yeniden düzenlendi: her yerde aynı sıra ile Arapça, okunuş, açıklama ve “Bunu ne zaman söylerim?” gösteriliyor.',
      'Ses temizlendi: tarayıcıdaki yapay okuma yedeği kaldırıldı; yalnızca güvenilir yerlerde gerçek API kıraati kullanılıyor.',
      'Hikâyeler genişletildi ve yenileri eklendi: daha fazla arka plan, daha çok içerik ve çocuklar için daha açık dersler.',
      'Görünüm düzenlendi: daha net kartlar, daha az karışıklık ve daha iyi akış.',
      'Tam Kur’an entegre edildi: surelerin tamamı artık GitHub projesi fawazahmed0/quran-api üzerinden Arapça ve tam çeviriyle yükleniyor.',
      'Sure görünümü iyileştirildi: oynatma düğmesi artık altta sabit ve sürekli görünür.'
    ]
  }
};

export default function App() {
  const { duas, hadiths, stories, suren, loading } = useData();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLang, setSelectedLang] = useState('de');
  const [selectedDua, setSelectedDua] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedHadith, setSelectedHadith] = useState(null);
  const [selectedSure, setSelectedSure] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showChangelog, setShowChangelog] = useState(() => localStorage.getItem('seenChangelogVersion') !== CHANGELOG_VERSION);
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

  const addXp = React.useCallback((amount) => {
    setStats((prev) => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const incrementStat = React.useCallback((key) => {
    setStats((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
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
  const changelog = changelogTexts[selectedLang] || changelogTexts.de;

  const closeChangelog = () => {
    localStorage.setItem('seenChangelogVersion', CHANGELOG_VERSION);
    setShowChangelog(false);
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen font-sans relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
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
              {changelog.items.map((item) => (
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
