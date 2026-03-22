import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { stories } from '../data/stories';

export default function StoriesList({ selectedLang, uiTexts, setSelectedStory }) {
  return (
    <div className="p-6 pb-24 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{uiTexts[selectedLang].selectStory}</h2>
      {stories.map((story) => (
        <button
          key={story.id}
          onClick={() => setSelectedStory(story)}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center gap-4 hover:border-purple-300 transition-all text-left cursor-pointer"
        >
          <div className="text-4xl bg-purple-50 p-3 rounded-xl">{story.icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 leading-tight">{story.title[selectedLang]}</h3>
          </div>
          <ChevronLeft className="text-gray-400 rotate-180 flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}
