import React, { useEffect, useMemo, useState } from 'react';
import { Search, Heart, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import { fetchSurahMetaList } from '../utils/quranAudio';

export default function SurenList({ suren, onSelect, selectedLang, isDarkMode, favorites, toggleFavorite }) {
  const [search, setSearch] = useState('');
  const [resolvedSuren, setResolvedSuren] = useState(suren);
  const [isRefreshingMeta, setIsRefreshingMeta] = useState(false);

  useEffect(() => {
    setResolvedSuren(suren);
  }, [suren]);

  useEffect(() => {
    let cancelled = false;

    const hydrateSurahs = async () => {
      setIsRefreshingMeta(true);
      try {
        const apiMeta = await fetchSurahMetaList();
        if (cancelled || !apiMeta?.length) return;

        const apiMap = new Map(apiMeta.map((entry) => [entry.id, entry]));
        setResolvedSuren((current) => current.map((item) => {
          const apiItem = apiMap.get(item.id);
          if (!apiItem) return item;

          return {
            ...item,
            arabic: apiItem.arabic || item.arabic,
            verses: apiItem.verses || item.verses,
            revelation: apiItem.revelation || item.revelation
          };
        }));
      } catch (error) {
        console.error('Suren-Metadaten konnten nicht aktualisiert werden.', error);
      } finally {
        if (!cancelled) {
          setIsRefreshingMeta(false);
        }
      }
    };

    hydrateSurahs();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => resolvedSuren.filter((item) =>
    item.title[selectedLang].toLowerCase().includes(search.toLowerCase()) ||
    (item.arabic && item.arabic.includes(search))
  ), [resolvedSuren, search, selectedLang]);

  const labels = {
    de: { title: 'Alle Suren', search: 'Suchen...', type: 'Qur’an-Sure', verses: 'Verse' },
    al: { title: 'Të gjitha Suret', search: 'Kërko...', type: 'Sure e Kuranit', verses: 'Ajete' },
    tr: { title: 'Tüm Sureler', search: 'Ara...', type: 'Kur’an suresi', verses: 'Ayet' }
  };

  const currentLabels = labels[selectedLang] || labels.de;

  return (
    <div className={`p-6 pb-24 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-500 rounded-2xl text-white shadow-lg shadow-green-500/20">
            <BookOpen size={28} />
          </div>
          <h1 className="text-2xl font-black">{currentLabels.title}</h1>
        </div>
        {isRefreshingMeta && <Loader2 className="animate-spin text-green-500" size={20} />}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={currentLabels.search}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={`w-full pl-12 pr-4 py-4 rounded-3xl border-2 transition-all outline-none focus:ring-4 focus:ring-green-500/10 ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500' : 'bg-white border-green-50 focus:border-green-200'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
          className={`flex items-center gap-3 p-4 rounded-3xl border-2 transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-green-900/40' : 'bg-white border-green-50 hover:border-green-100 shadow-sm'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black ${isDarkMode ? 'bg-slate-700 text-green-400' : 'bg-green-50 text-green-600'}`}>
              {item.id}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base mb-0.5 truncate">{item.title[selectedLang]}</h3>
              <p className={`text-xl font-arabic leading-tight truncate ${isDarkMode ? 'text-green-300' : 'text-green-700'}`} dir="rtl">
                {item.arabic || '—'}
              </p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                {currentLabels.type} · {currentLabels.verses}: {item.verses}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(event) => { event.stopPropagation(); toggleFavorite('suren', item.id); }}
                className={`p-2 rounded-xl transition-all ${favorites.suren?.includes(item.id) ? 'bg-red-50 text-red-500' : (isDarkMode ? 'text-slate-600' : 'text-gray-200 hover:text-red-300')}`}
              >
                <Heart size={22} fill={favorites.suren?.includes(item.id) ? 'currentColor' : 'none'} />
              </button>
              <ChevronRight size={20} className={isDarkMode ? 'text-slate-600' : 'text-gray-300'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
