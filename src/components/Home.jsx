import React from 'react';
import { Home as HomeIcon, BookOpen, MessageCircle, Library, Sparkles, Star, Moon, Heart } from 'lucide-react';
import { duas } from '../data/duas';
import { stories } from '../data/stories';

export default function Home({ selectedLang, uiTexts, handleTabChange, setSelectedDua, setSelectedStory }) {
  return (
    <div className="p-6 pb-24 space-y-6">
      <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-6 rounded-3xl text-white shadow-lg text-center relative overflow-hidden">
        <Sparkles className="absolute top-2 right-2 opacity-20" size={48} />
        <h1 className="text-2xl font-bold mb-2 relative z-10">{uiTexts[selectedLang].welcome}</h1>
        <p className="text-green-50 opacity-90 relative z-10 font-medium">Bismillah ir-Rahman ir-Rahim</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleTabChange('duas')}
          className="bg-white p-6 rounded-3xl shadow-sm border-2 border-green-100 flex flex-col items-center justify-center gap-3 hover:bg-green-50 transition-colors cursor-pointer"
        >
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <BookOpen size={32} />
          </div>
          <span className="font-bold text-gray-700 text-sm">{uiTexts[selectedLang].duas}</span>
        </button>

        <button 
          onClick={() => handleTabChange('hadiths')}
          className="bg-white p-6 rounded-3xl shadow-sm border-2 border-yellow-100 flex flex-col items-center justify-center gap-3 hover:bg-yellow-50 transition-colors cursor-pointer"
        >
          <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
            <MessageCircle size={32} />
          </div>
          <span className="font-bold text-gray-700 text-sm">{uiTexts[selectedLang].hadiths}</span>
        </button>
      </div>

      <button 
        onClick={() => handleTabChange('stories')}
        className="w-full bg-white p-4 rounded-3xl shadow-sm border-2 border-purple-100 flex items-center justify-center gap-3 hover:bg-purple-50 transition-colors cursor-pointer"
      >
        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
          <Library size={24} />
        </div>
        <span className="font-bold text-gray-700">{uiTexts[selectedLang].stories}</span>
      </button>

      {/* Quick Links */}
      <div className="flex justify-around items-center pt-6">
        <button onClick={() => setSelectedStory(stories[0])} className="flex flex-col items-center gap-2 group cursor-pointer">
          <div className="bg-yellow-50 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Star className="text-yellow-400" size={28} />
          </div>
          <span className="text-[10px] font-bold text-gray-400">{uiTexts[selectedLang].prophet}</span>
        </button>
        
        <button onClick={() => setSelectedDua(duas.find(d => d.id === 3))} className="flex flex-col items-center gap-2 group cursor-pointer">
          <div className="bg-indigo-50 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Moon className="text-indigo-400" size={28} />
          </div>
          <span className="text-[10px] font-bold text-gray-400">{uiTexts[selectedLang].sleep}</span>
        </button>

        <button onClick={() => setSelectedDua(duas.find(d => d.id === 9))} className="flex flex-col items-center gap-2 group cursor-pointer">
          <div className="bg-red-50 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Heart className="text-red-400" size={28} />
          </div>
          <span className="text-[10px] font-bold text-gray-400">{uiTexts[selectedLang].parents}</span>
        </button>
      </div>
    </div>
  );
}
