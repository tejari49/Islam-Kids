import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Heart, Clock, Loader2, GraduationCap, Trophy } from 'lucide-react';

export default function Home({ 
  selectedLang, 
  handleTabChange, 
  setSelectedDua, 
  setSelectedStory,
  setSelectedHadith,
  setSelectedFeature,
  openTrainerForSurah,
  duas, 
  hadiths, 
  stories, 
  suren,
  isDarkMode, 
  favorites,
  stats,
  userLocation,
  setUserLocation
}) {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [locationInput, setLocationInput] = useState({ city: userLocation.city, country: userLocation.country });
  const [locationError, setLocationError] = useState('');

  // Use useMemo to pick daily items based on the date
  const dailyIndices = useMemo(() => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = ((hash << 5) - hash) + today.charCodeAt(i);
        hash |= 0;
    }
    const absHash = Math.abs(hash);
     return {
       dua: absHash % (duas.length || 1),
       hadith: absHash % (hadiths.length || 1),
       story: absHash % (stories.length || 1),
       sure: absHash % (suren.length || 1)
     };
   }, [duas.length, hadiths.length, stories.length, suren.length]);
 
   const dailyDua = duas[dailyIndices.dua];
   const dailyHadith = hadiths[dailyIndices.hadith];
   const dailyStory = stories[dailyIndices.story];
   const dailySure = suren[dailyIndices.sure];

  useEffect(() => {
    setLocationInput({ city: userLocation.city || '', country: userLocation.country || '' });
  }, [userLocation.city, userLocation.country]);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoadingPrayers(true);
      setLocationError('');
      try {
        const today = new Intl.DateTimeFormat('en-GB').format(new Date()).replace(/\//g, '-');
        let url;
        if (userLocation.latitude != null && userLocation.longitude != null) {
          url = `https://api.aladhan.com/v1/timings/${today}?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&method=${userLocation.method || 2}`;
        } else {
          url = `https://api.aladhan.com/v1/timingsByCity/${today}?city=${encodeURIComponent(userLocation.city)}&country=${encodeURIComponent(userLocation.country || '')}&method=${userLocation.method || 2}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        if (data.data?.timings) {
          const formattedTimings = Object.fromEntries(
            Object.entries(data.data.timings).map(([name, value]) => [name, value.split(' ')[0]])
          );
          setPrayerTimes(formattedTimings);
        } else {
          setLocationError(selectedLang === 'de' ? 'Gebetszeiten konnten für diesen Ort nicht geladen werden.' : 'Prayer times could not be loaded.');
        }
      } catch (error) {
        console.error("Fehler beim Laden der Gebetszeiten:", error);
        setLocationError(selectedLang === 'de' ? 'Gebetszeiten konnten nicht geladen werden.' : 'Prayer times could not be loaded.');
      } finally {
        setLoadingPrayers(false);
      }
    };
    fetchPrayerTimes();
  }, [selectedLang, userLocation]);

  const reverseGeocode = async (latitude, longitude) => {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=de`
    );
    const data = await response.json();
    return {
      city: data.city || data.locality || data.principalSubdivision || 'Mein Standort',
      country: data.countryName || ''
    };
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation wird von deinem Browser nicht unterstützt.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoadingPrayers(true);
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const resolvedLocation = await reverseGeocode(latitude, longitude);

          setUserLocation({
            latitude,
            longitude,
            city: resolvedLocation.city,
            country: resolvedLocation.country,
            method: 2,
            source: 'gps'
          });
          setShowLocationSettings(false);
        } catch (error) {
          console.error("Reverse-Geocoding Fehler:", error);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: "Mein Standort",
            country: "",
            method: 2,
            source: 'gps'
          });
        } finally {
          setLoadingPrayers(false);
        }
      },
      (error) => {
        console.error("Geolocation Fehler:", error);
        if (error.code === error.PERMISSION_DENIED) {
          alert("Bitte erlaube den GPS-Zugriff in deinem Browser, damit die Gebetszeiten für deinen Standort berechnet werden.");
        } else {
          alert("Standort konnte nicht ermittelt werden.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const saveManualLocation = () => {
    if (locationInput.city.trim()) {
      setUserLocation({
        ...userLocation,
        city: locationInput.city,
        country: locationInput.country,
        latitude: null,
        longitude: null,
        source: 'manual'
      });
      setShowLocationSettings(false);
    }
  };

  const favoriteItems = [
    ...(favorites.duas || []).map(id => ({ ...duas.find(d => d.id === id), type: 'duas' })),
     ...(favorites.hadiths || []).map(id => ({ ...hadiths.find(h => h.id === id), type: 'hadiths' })),
     ...(favorites.stories || []).map(id => ({ ...stories.find(s => s.id === id), type: 'stories' })),
     ...(favorites.suren || []).map(id => ({ ...suren.find(s => s.id === id), type: 'suren' }))
   ].filter(item => item && item.id);

  return (
    <div className={`p-6 pb-24 space-y-8 transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      
      {/* 🚀 NEU: Praxis & Games Sektion ganz oben */}
      <section className="space-y-4">
        <h2 className={`text-xl font-black flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <GraduationCap className="text-green-500" />
          {selectedLang === 'de' ? 'Deine tägliche Praxis' : selectedLang === 'al' ? 'Praksa jote' : 'Günlük Pratik'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setSelectedFeature('prayer')}
            className={`col-span-2 group relative overflow-hidden p-6 rounded-[2.5rem] border-2 flex items-center gap-6 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-500 border-indigo-400 text-white'}`}
          >
            <div className={`text-5xl p-4 rounded-3xl transition-colors ${isDarkMode ? 'bg-indigo-900/40' : 'bg-white/20'}`}>🕋</div>
            <div className="text-left">
              <h3 className="font-extrabold text-2xl leading-tight">
                {selectedLang === 'de' ? 'Beten lernen' : selectedLang === 'al' ? 'Mëso Namazin' : 'Namaz Kıl'}
              </h3>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-100'}`}>
                {selectedLang === 'de' ? 'Schritt für Schritt Anleitung' : 'Udhëzues hap pas hapi'}
              </p>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Start</div>
          </button>

          <button 
            onClick={() => setSelectedFeature('quiz')}
            className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.95] shadow-md ${isDarkMode ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-white border-yellow-100'}`}
          >
            <div className="text-4xl">🧠</div>
            <h3 className={`font-black text-sm transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {selectedLang === 'de' ? 'Wissens-Quiz' : selectedLang === 'al' ? 'Kuizi' : 'Bilgi Yarışı'}
            </h3>
            <span className="text-[10px] font-black text-yellow-500 bg-yellow-50 border border-yellow-100 px-2 py-0.5 rounded-full uppercase">XP +20</span>
          </button>

          <button 
            onClick={() => setSelectedFeature('trainer')}
            className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.95] shadow-md ${isDarkMode ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-white border-emerald-100'}`}
          >
            <div className="text-4xl">📖</div>
            <h3 className={`font-black text-sm transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {selectedLang === 'de' ? 'Suren lernen' : selectedLang === 'al' ? 'Mëso Sura' : 'Sure Ezberle'}
            </h3>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">XP +50</span>
          </button>

          <button 
            onClick={() => setSelectedFeature('alphabet')}
            className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.95] shadow-md ${isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-white border-blue-100'}`}
          >
            <div className="text-4xl">🔤</div>
            <h3 className={`font-black text-sm transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {selectedLang === 'de' ? 'Arabisches Alphabet' : selectedLang === 'al' ? 'Alfabeti Arab' : 'Arap Alfabesi'}
            </h3>
            <span className="text-[10px] font-black text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase">28 Harf</span>
          </button>

          <button 
            onClick={() => setSelectedFeature('achievements')}
            className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.95] shadow-md ${isDarkMode ? 'bg-orange-900/20 border-orange-500/30' : 'bg-white border-orange-100'}`}
          >
            <div className="text-4xl">🏆</div>
            <h3 className={`font-black text-sm transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {selectedLang === 'de' ? 'Erfolge' : selectedLang === 'al' ? 'Sukseset' : 'Başarılar'}
            </h3>
            <span className="text-[10px] font-black text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full uppercase">Level {stats.xp >= 0 ? Math.floor(stats.xp / 100) + 1 : 1}</span>
          </button>
        </div>
      </section>

      {/* 🕋 Gebetszeiten Sektion */}
      <section className={`p-6 rounded-[2.5rem] border-2 transition-colors relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border-emerald-900/30 shadow-emerald-950/20' : 'bg-white border-emerald-50 shadow-sm'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-black flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <Clock className="text-emerald-500" />
            {selectedLang === 'de' ? 'Gebetszeiten' : selectedLang === 'al' ? 'Kohët e Namazit' : 'Namaz Vakitleri'}
          </h2>
          <button 
            onClick={() => setShowLocationSettings(!showLocationSettings)}
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all hover:scale-105 active:scale-95 flex items-center gap-1 ${isDarkMode ? 'bg-slate-700 text-slate-400 hover:text-emerald-400' : 'bg-gray-100 text-gray-500 hover:text-emerald-600'}`}
          >
            {userLocation.city || "Standort"} 📍
          </button>
        </div>

        {showLocationSettings && (
          <div className={`mb-6 p-4 rounded-3xl border-2 animate-in fade-in slide-in-from-top-4 ${isDarkMode ? 'bg-slate-900/50 border-emerald-900/20' : 'bg-emerald-50/20 border-emerald-100'}`}>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  placeholder={selectedLang === 'de' ? "Stadt (z.B. Berlin)" : "Qyteti"}
                  value={locationInput.city}
                  onChange={(e) => setLocationInput({ ...locationInput, city: e.target.value })}
                  className={`px-4 py-2 rounded-xl border-2 outline-none focus:border-emerald-500 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100'}`}
                />
                <input 
                  type="text" 
                  placeholder={selectedLang === 'de' ? "Land (optional)" : "Shteti"}
                  value={locationInput.country}
                  onChange={(e) => setLocationInput({ ...locationInput, country: e.target.value })}
                  className={`px-4 py-2 rounded-xl border-2 outline-none focus:border-emerald-500 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100'}`}
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={saveManualLocation}
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                >
                  {selectedLang === 'de' ? "Speichern" : "Ruaj"}
                </button>
                <button 
                  onClick={detectLocation}
                  className={`flex-1 py-2 rounded-xl font-bold border-2 transition-colors ${isDarkMode ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'}`}
                >
                  {selectedLang === 'de' ? "GPS Ortung" : "GPS"}
                </button>
              </div>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {selectedLang === 'de'
                  ? 'Mit GPS werden dein aktueller Ort und passende Gebetszeiten automatisch geladen. Bitte erlaube die Standortfreigabe im Browser.'
                  : 'Allow browser location access to use GPS-based prayer times.'}
              </p>
            </div>
          </div>
        )}

        {loadingPrayers ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-emerald-500" />
          </div>
        ) : (
          <>
            {locationError && (
              <p className={`mb-4 text-sm font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                {locationError}
              </p>
            )}
            <div className="grid grid-cols-5 gap-2">
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => (
                <div key={name} className={`flex flex-col items-center p-3 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-700/50 border-emerald-900/20' : 'bg-emerald-50/30 border-emerald-50'}`}>
                  <span className={`text-[10px] font-black uppercase mb-1 transition-colors ${isDarkMode ? 'text-emerald-400/60' : 'text-emerald-600'}`}>{name}</span>
                  <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-emerald-900'}`}>{prayerTimes?.[name] || '--:--'}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ❤️ Favoriten Sektion */}
      {favoriteItems.length > 0 && (
        <section className="space-y-4">
          <h2 className={`text-xl font-black flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <Heart className="text-red-500 fill-red-500" />
            {selectedLang === 'de' ? 'Deine Favoriten' : 'Të preferuarat'}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {favoriteItems.map((item) => (
              <button 
                key={`${item.type}-${item.id}`}
                onClick={() => {
                  if (item.type === 'duas') setSelectedDua(item);
                  else if (item.type === 'hadiths') setSelectedHadith(item);
                  else if (item.type === 'stories') setSelectedStory(item);
                  else if (item.type === 'suren') openTrainerForSurah(item);
                }}
                className={`flex-shrink-0 w-32 p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
              >
                <div className="text-3xl">{item.icon}</div>
                <span className={`text-xs font-bold text-center line-clamp-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  {item.title[selectedLang]}
                </span>
                <span className="text-[10px] font-black uppercase opacity-40 text-gray-500">
                  {item.type.slice(0, -1)}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 🌟 Tägliche Inspiration */}
      <section className="space-y-4">
        <h2 className={`text-xl font-black flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <Calendar className="text-blue-500" />
          {selectedLang === 'de' ? 'Täglich für dich' : 'Për ty sot'}
        </h2>
        
        <div className="space-y-4">
          {dailyDua && (
            <button 
              onClick={() => setSelectedDua(dailyDua)}
              className={`w-full p-6 rounded-[2.5rem] border-2 flex items-center gap-5 transition-all hover:scale-[1.01] active:scale-[0.98] shadow-sm ${isDarkMode ? 'bg-slate-800 border-green-900/30 shadow-slate-950/30' : 'bg-white border-green-50'}`}
            >
              <div className="text-5xl">🤲</div>
              <div className="text-left flex-1">
                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Dua des Tages</p>
                <h3 className={`font-bold text-xl leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{dailyDua.title[selectedLang]}</h3>
              </div>
            </button>
          )}

          {dailyHadith && (
            <button 
              onClick={() => setSelectedHadith(dailyHadith)}
              className={`w-full p-6 rounded-[2.5rem] border-2 flex items-center gap-5 transition-all hover:scale-[1.01] active:scale-[0.98] shadow-sm ${isDarkMode ? 'bg-slate-800 border-yellow-900/30 shadow-slate-950/30' : 'bg-white border-yellow-50'}`}
            >
              <div className="text-5xl">✨</div>
              <div className="text-left flex-1">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Täglicher Hadith</p>
                <h3 className={`font-bold text-xl leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{dailyHadith.title[selectedLang]}</h3>
              </div>
            </button>
          )}

          {dailyStory && (
            <button 
              onClick={() => setSelectedStory(dailyStory)}
              className={`w-full p-6 rounded-[2.5rem] border-2 flex items-center gap-5 transition-all hover:scale-[1.01] active:scale-[0.98] shadow-sm ${isDarkMode ? 'bg-slate-800 border-purple-900/30 shadow-slate-950/30' : 'bg-white border-purple-50'}`}
            >
              <div className="text-5xl">📚</div>
              <div className="text-left flex-1">
                <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">Story des Tages</p>
                <h3 className={`font-bold text-xl leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{dailyStory.title[selectedLang]}</h3>
              </div>
            </button>
          )}

          {dailySure && (
            <button 
              onClick={() => openTrainerForSurah(dailySure)}
              className={`w-full p-6 rounded-[2.5rem] border-2 flex items-center gap-5 transition-all hover:scale-[1.01] active:scale-[0.98] shadow-sm ${isDarkMode ? 'bg-slate-800 border-green-900/30 shadow-slate-950/30' : 'bg-white border-green-50'}`}
            >
              <div className="text-5xl">📖</div>
              <div className="text-left flex-1">
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Sure des Tages</p>
                <h3 className={`font-bold text-xl leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{dailySure.title[selectedLang]}</h3>
              </div>
            </button>
          )}
        </div>
      </section>

    </div>
  );
}
