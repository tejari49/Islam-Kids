import React, { useState } from 'react';
import { Home as HomeIcon, BookOpen, MessageCircle, Library } from 'lucide-react';
import Home from './components/Home';
import DuasList from './components/DuasList';
import DuaDetail from './components/DuaDetail';
import HadithsList from './components/HadithsList';
import HadithDetail from './components/HadithDetail';
import StoriesList from './components/StoriesList';
import StoryDetail from './components/StoryDetail';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLang, setSelectedLang] = useState('de');
  const [selectedDua, setSelectedDua] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedHadith, setSelectedHadith] = useState(null);

  const uiTexts = {
    de: { welcome: "Hallo! Lass uns lernen 🌟", duas: "Meine Duas", stories: "Geschichten", hadiths: "Hadithe", selectDua: "Wähle ein Dua aus:", selectStory: "Wähle eine Geschichte:", selectHadith: "Wähle einen Hadith:", listen: "Anhören", source: "Quelle", prophet: "Prophet", sleep: "Schlafen", parents: "Eltern" },
    al: { welcome: "Përshëndetje! Le të mësojmë 🌟", duas: "Duatë e mia", stories: "Tregime", hadiths: "Hadithe", selectDua: "Zgjidh një Dua:", selectStory: "Zgjidh një tregim:", selectHadith: "Zgjidh një Hadith:", listen: "Dëgjo", source: "Burimi", prophet: "Profeti", sleep: "Gjumi", parents: "Prindërit" },
    tr: { welcome: "Merhaba! Hadi öğrenelim 🌟", duas: "Dualarım", stories: "Hikayeler", hadiths: "Hadisler", selectDua: "Bir Dua seç:", selectStory: "Bir hikaye seç:", selectHadith: "Bir Hadis seç:", listen: "Dinle", source: "Kaynak", prophet: "Peygamber", sleep: "Uyku", parents: "Anne Baba" }
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
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-white p-4 shadow-sm flex flex-row items-center justify-between z-10 relative">
        <div className="w-16"></div>
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
          IslamKids
        </h1>
        <button 
          onClick={cycleLanguage} 
          className="w-16 flex items-center justify-end bg-gray-50 px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow-sm border border-gray-200 active:scale-95 transition-transform cursor-pointer"
          title="Sprache wechseln"
        >
          {langMap[selectedLang]}
        </button>
      </div>

      <div className="h-full overflow-y-auto">
        {activeTab === 'home' && !selectedDua && !selectedStory && !selectedHadith && (
          <Home 
            selectedLang={selectedLang} 
            uiTexts={uiTexts} 
            handleTabChange={handleTabChange} 
            setSelectedDua={setSelectedDua} 
            setSelectedStory={setSelectedStory} 
          />
        )}
        {activeTab === 'duas' && !selectedDua && !selectedStory && !selectedHadith && (
          <DuasList selectedLang={selectedLang} uiTexts={uiTexts} setSelectedDua={setSelectedDua} />
        )}
        {activeTab === 'hadiths' && !selectedDua && !selectedStory && !selectedHadith && (
          <HadithsList selectedLang={selectedLang} uiTexts={uiTexts} setSelectedHadith={setSelectedHadith} />
        )}
        {activeTab === 'stories' && !selectedDua && !selectedStory && !selectedHadith && (
          <StoriesList selectedLang={selectedLang} uiTexts={uiTexts} setSelectedStory={setSelectedStory} />
        )}
        
        {selectedDua && <DuaDetail selectedDua={selectedDua} selectedLang={selectedLang} uiTexts={uiTexts} setSelectedDua={setSelectedDua} />}
        {selectedHadith && <HadithDetail selectedHadith={selectedHadith} selectedLang={selectedLang} setSelectedHadith={setSelectedHadith} />}
        {selectedStory && <StoryDetail selectedStory={selectedStory} selectedLang={selectedLang} setSelectedStory={setSelectedStory} />}
      </div>

      {/* Bottom Navigation */}
      {!selectedDua && !selectedStory && !selectedHadith && (
        <div className="fixed bottom-0 max-w-md w-full bg-white border-t border-gray-100 flex justify-between px-2 py-3 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
          <button 
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 cursor-pointer ${activeTab === 'home' ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <HomeIcon size={22} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('duas')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 cursor-pointer ${activeTab === 'duas' ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BookOpen size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].duas}</span>
          </button>

          <button 
            onClick={() => handleTabChange('hadiths')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 cursor-pointer ${activeTab === 'hadiths' ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MessageCircle size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].hadiths}</span>
          </button>

          <button 
            onClick={() => handleTabChange('stories')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 cursor-pointer ${activeTab === 'stories' ? 'text-purple-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Library size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].stories}</span>
          </button>
        </div>
      )}
    </div>
  );
}
