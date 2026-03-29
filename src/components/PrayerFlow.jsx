import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Droplets,
  ArrowRight,
  Play,
  Pause,
  Loader2,
  BadgeCheck,
  Volume2,
  Compass,
  LocateFixed,
  ExternalLink,
  ChevronDown,
  Mic,
  Square
} from 'lucide-react';
import { wuduSteps, prayers, prayerSteps } from '../data/prayerData';
import { fetchAyahQueue, joinAyahTexts } from '../utils/quranAudio';

const uiText = {
  de: {
    learnPrayer: 'Beten lernen',
    chooseLearner: 'Für wen ist die Gebetsanleitung?',
    chooseLearnerHint: 'Wähle die Figur aus, damit die Gebetsbilder für Jungen oder Mädchen angezeigt werden.',
    boy: 'Junge',
    girl: 'Mädchen',
    forBoy: 'Für einen Jungen',
    forGirl: 'Für ein Mädchen',
    choosePrayer: 'Wähle ein Gebet',
    changeLearner: 'Figur ändern',
    areYouReady: 'Bist du sauber?',
    haveWudu: 'Hast du schon Wudu gemacht?',
    qiblaCheck: 'Hast du die richtige Gebetsrichtung (Qibla)?',
    qiblaYes: 'Ja, Richtung passt',
    qiblaNo: 'Nein, zeig Kompass',
    qiblaTitle: 'Qibla-Kompass',
    qiblaHint: 'Halte das Handy flach und drehe dich, bis der Pfeil zur Qibla zeigt.',
    qiblaHeading: 'Deine Richtung',
    qiblaDirection: 'Qibla-Richtung',
    locationNeeded: 'Standort wird benötigt, um die Qibla zu berechnen.',
    requestCompass: 'Kompass aktivieren',
    openQiblaFinder: 'Qibla Finder öffnen',
    openMapsDirection: 'Richtung in Google Maps öffnen',
    qiblaAirline: 'Luftlinie nach Mekka',
    qiblaAligned: 'Perfekt ausgerichtet ✅',
    qiblaTurnLeft: 'Drehe dich nach links',
    qiblaTurnRight: 'Drehe dich nach rechts',
    qiblaTurnBy: 'um',
    qiblaAccuracy: 'Je nach Gerät kann der Kompass leicht abweichen.',
    yesReady: 'Ja, ich bin bereit!',
    showWudu: 'Nein, zeig mir Wudu',
    step: 'Schritt',
    next: 'Weiter',
    done: 'Fertig!',
    startPrayer: 'Beten starten',
    watchFor: 'Achte darauf',
    switchLearner: 'Wechseln',
    arabic: 'Arabisch',
    pronunciation: 'Aussprache',
    explanation: 'Erklärung',
    authenticAudio: 'Authentisches API-Audio',
    authenticAudioHint: 'Es wird nur echte Rezitation aus einer Quran-Audio-API abgespielt.',
    noAudio: 'Für diesen Gebetssatz ist aktuell kein verlässliches API-Audio hinterlegt.',
    ownAudio: 'Eigenes Audio',
    ownAudioHint: 'Du kannst jetzt eine eigene Aufnahme speichern und später wiedergeben.',
    startRecording: 'Aufnahme starten',
    stopRecording: 'Aufnahme stoppen',
    playOwnAudio: 'Eigene Aufnahme abspielen',
    pauseOwnAudio: 'Eigene Aufnahme pausieren',
    deleteOwnAudio: 'Aufnahme löschen',
    tapArabicHint: 'Tipp: Tippe auf den arabischen Text, um Audio abzuspielen/zu pausieren.',
    prayerFinished: 'MashaAllah, du hast die Gebetsanleitung abgeschlossen.'
  },
  al: {
    learnPrayer: 'Mëso të falesh',
    chooseLearner: 'Për kë është udhëzimi i namazit?',
    chooseLearnerHint: 'Zgjidh figurën që të shfaqen ilustrimet e namazit për djalë ose vajzë.',
    boy: 'Djalë',
    girl: 'Vajzë',
    forBoy: 'Për një djalë',
    forGirl: 'Për një vajzë',
    choosePrayer: 'Zgjidh namazin',
    changeLearner: 'Ndrysho figurën',
    areYouReady: 'A je i pastër?',
    haveWudu: 'A ke marrë abdes?',
    qiblaCheck: 'A e ke drejtimin e saktë të namazit (Kibla)?',
    qiblaYes: 'Po, drejtimi është i saktë',
    qiblaNo: 'Jo, më trego kompasin',
    qiblaTitle: 'Kompasi i Kiblës',
    qiblaHint: 'Mbaje telefonin drejt dhe rrotullohu derisa shigjeta të tregojë Kiblën.',
    qiblaHeading: 'Drejtimi yt',
    qiblaDirection: 'Drejtimi i Kiblës',
    locationNeeded: 'Nevojitet lokacioni për të llogaritur Kiblën.',
    requestCompass: 'Aktivizo kompasin',
    openQiblaFinder: 'Hap Qibla Finder',
    openMapsDirection: 'Hape drejtimin në Google Maps',
    qiblaAirline: 'Distanca ajrore për në Mekë',
    qiblaAligned: 'Drejtim i saktë ✅',
    qiblaTurnLeft: 'Rrotullohu majtas',
    qiblaTurnRight: 'Rrotullohu djathtas',
    qiblaTurnBy: 'për',
    qiblaAccuracy: 'Në varësi të pajisjes, kompasi mund të ketë devijim të vogël.',
    yesReady: 'Po, jam gati!',
    showWudu: 'Jo, më trego abdesin',
    step: 'Hapi',
    next: 'Tjetra',
    done: 'Gati!',
    startPrayer: 'Fillo namazin',
    watchFor: 'Kujdes te',
    switchLearner: 'Ndrysho',
    arabic: 'Arabisht',
    pronunciation: 'Shqiptimi',
    explanation: 'Shpjegimi',
    authenticAudio: 'Audio autentike nga API',
    authenticAudioHint: 'Këtu luhet vetëm recitim i vërtetë nga një API e Kuranit.',
    noAudio: 'Për këtë tekst të namazit nuk është lidhur ende audio e besueshme nga API.',
    ownAudio: 'Audio personale',
    ownAudioHint: 'Mund ta ruash një incizim personal dhe ta luash më vonë.',
    startRecording: 'Nis incizimin',
    stopRecording: 'Ndal incizimin',
    playOwnAudio: 'Luaj incizimin',
    pauseOwnAudio: 'Pauzo incizimin',
    deleteOwnAudio: 'Fshij incizimin',
    tapArabicHint: 'Këshillë: Prek tekstin arab për ta luajtur/ndalur audion.',
    prayerFinished: 'MashaAllah, e përfundove udhëzimin e namazit.'
  },
  tr: {
    learnPrayer: 'Namaz kılmayı öğren',
    chooseLearner: 'Namaz rehberi kimin için?',
    chooseLearnerHint: 'Namaz görsellerinin erkek ya da kız için gösterilmesi adına karakteri seç.',
    boy: 'Erkek',
    girl: 'Kız',
    forBoy: 'Bir erkek için',
    forGirl: 'Bir kız için',
    choosePrayer: 'Bir namaz seç',
    changeLearner: 'Karakteri değiştir',
    areYouReady: 'Temiz misin?',
    haveWudu: 'Abdest aldın mı?',
    qiblaCheck: 'Doğru kıble yönünü buldun mu?',
    qiblaYes: 'Evet, yön doğru',
    qiblaNo: 'Hayır, pusulayı göster',
    qiblaTitle: 'Kıble Pusulası',
    qiblaHint: 'Telefonu düz tut ve ok kıbleyi gösterene kadar dön.',
    qiblaHeading: 'Senin yönün',
    qiblaDirection: 'Kıble yönü',
    locationNeeded: 'Kıble hesabı için konum izni gerekiyor.',
    requestCompass: 'Pusulayı aç',
    openQiblaFinder: 'Qibla Finder aç',
    openMapsDirection: 'Yönü Google Maps\'te aç',
    qiblaAirline: 'Mekke’ye kuş uçuşu mesafe',
    qiblaAligned: 'Yön doğru ✅',
    qiblaTurnLeft: 'Sola dön',
    qiblaTurnRight: 'Sağa dön',
    qiblaTurnBy: 'kadar',
    qiblaAccuracy: 'Cihaza göre pusulada küçük sapmalar olabilir.',
    yesReady: 'Evet, hazırım!',
    showWudu: 'Hayır, abdesti göster',
    step: 'Adım',
    next: 'İleri',
    done: 'Bitti!',
    startPrayer: 'Namaza başla',
    watchFor: 'Bunlara dikkat et',
    switchLearner: 'Değiştir',
    arabic: 'Arapça',
    pronunciation: 'Okunuş',
    explanation: 'Açıklama',
    authenticAudio: 'Gerçek API sesi',
    authenticAudioHint: 'Burada sadece gerçek kıraat içeren Kur’an API sesi oynatılır.',
    noAudio: 'Bu namaz cümlesi için henüz güvenilir API sesi eklenmemiştir.',
    ownAudio: 'Kendi sesin',
    ownAudioHint: 'Kendi kaydını kaydedip istediğin zaman oynatabilirsin.',
    startRecording: 'Kaydı başlat',
    stopRecording: 'Kaydı durdur',
    playOwnAudio: 'Kayıt çal',
    pauseOwnAudio: 'Kaydı duraklat',
    deleteOwnAudio: 'Kaydı sil',
    tapArabicHint: 'İpucu: Oynat/duraklat için Arapça metne dokun.',
    prayerFinished: 'MashaAllah, namaz rehberini tamamladın.'
  }
};

const withBase = (path) => `${import.meta.env.BASE_URL}${path}`.replace(/(?<!:)\/\/+/g, '/');

const learnerCards = {
  boy: { image: withBase('images/prayer/choice-boy.png') },
  girl: { image: withBase('images/prayer/choice-girl.png') }
};

const KAABA_COORDS = { lat: 21.4225, lon: 39.8262 };

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function toDegrees(value) {
  return (value * 180) / Math.PI;
}

function normalizeAngle(value) {
  return ((value % 360) + 360) % 360;
}

function signedDeltaToTarget(target, current) {
  return ((target - current + 540) % 360) - 180;
}

function calculateQiblaBearing(latitude, longitude) {
  const lat1 = toRadians(latitude);
  const lon1 = toRadians(longitude);
  const lat2 = toRadians(KAABA_COORDS.lat);
  const lon2 = toRadians(KAABA_COORDS.lon);
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return normalizeAngle(toDegrees(Math.atan2(y, x)));
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function InfoCard({ title, children, isDarkMode, tone = 'slate' }) {
  const tones = {
    green: isDarkMode ? 'bg-green-900/10 border-green-900/30' : 'bg-green-50 border-green-100',
    blue: isDarkMode ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100',
    amber: isDarkMode ? 'bg-amber-900/10 border-amber-900/30' : 'bg-amber-50 border-amber-100',
    slate: isDarkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'
  };

  return (
    <div className={`p-4 rounded-2xl border transition-colors ${tones[tone] || tones.slate}`}>
      <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>{title}</p>
      {children}
    </div>
  );
}

export default function PrayerFlow({ selectedLang, setSelectedFeature, isDarkMode }) {
  const t = uiText[selectedLang] || uiText.de;
  const [step, setStep] = useState(() => {
    const savedLearner = localStorage.getItem('prayerLearner');
    return savedLearner ? 'select_prayer' : 'select_gender';
  });
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [selectedLearner, setSelectedLearner] = useState(() => localStorage.getItem('prayerLearner') || null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [showWatchFor, setShowWatchFor] = useState(false);
  const [showArabicTapHint, setShowArabicTapHint] = useState(true);
  const [currentStepAyahs, setCurrentStepAyahs] = useState([]);
  const [currentAudioQueue, setCurrentAudioQueue] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [qiblaBearing, setQiblaBearing] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [compassError, setCompassError] = useState('');
  const [needsCompassPermission, setNeedsCompassPermission] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordChunksRef = useRef([]);

  const currentStepData = prayerSteps[currentSlide];

  useEffect(() => {
    if (selectedLearner) {
      localStorage.setItem('prayerLearner', selectedLearner);
    }
  }, [selectedLearner]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
    setCurrentAudioQueue([]);
    setCurrentAudioIndex(0);
    setCurrentStepAyahs([]);
    setImageFailed(false);
    setIsPlaying(false);
    setIsLoadingAudio(false);
    setShowWatchFor(false);
    setShowArabicTapHint(true);
  }, [currentSlide, step, selectedLearner]);

  useEffect(() => {
    const key = `prayerCustomAudio:${currentStepData?.id || 'unknown'}`;
    const savedAudio = localStorage.getItem(key) || '';
    setCustomAudioUrl(savedAudio);
  }, [currentStepData?.id]);

  useEffect(() => {
    if (step !== 'qibla_compass') return undefined;

    let watchId = null;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setQiblaBearing(calculateQiblaBearing(latitude, longitude));
          setCurrentCoords({ latitude, longitude });
          setLocationError('');
        },
        () => {
          setLocationError(t.locationNeeded);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
      );
    } else {
      setLocationError(t.locationNeeded);
    }

    return () => {
      if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [step, t.locationNeeded]);

  useEffect(() => {
    if (step !== 'qibla_compass') return undefined;
    setNeedsCompassPermission(
      typeof window !== 'undefined'
      && typeof window.DeviceOrientationEvent !== 'undefined'
      && typeof window.DeviceOrientationEvent.requestPermission === 'function'
    );

    const onOrientation = (event) => {
      const alpha = typeof event.webkitCompassHeading === 'number' ? event.webkitCompassHeading : event.alpha;
      if (alpha == null) return;
      const heading = typeof event.webkitCompassHeading === 'number' ? alpha : normalizeAngle(360 - alpha);
      setDeviceHeading(heading);
      setCompassError('');
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', onOrientation, true);
    } else {
      setCompassError(t.qiblaAccuracy);
    }

    return () => {
      window.removeEventListener('deviceorientation', onOrientation, true);
    };
  }, [step, t.qiblaAccuracy]);

  useEffect(() => {
    let isCancelled = false;

    const loadAyahData = async () => {
      if (step !== 'prayer_guide' || !currentStepData?.audioAyahs?.length) {
        setCurrentStepAyahs([]);
        return;
      }

      try {
        const ayahs = await fetchAyahQueue(currentStepData.audioAyahs);
        if (!isCancelled) {
          setCurrentStepAyahs(ayahs);
          setCurrentAudioQueue(ayahs.map((ayah) => ayah.audio).filter(Boolean));
        }
      } catch (error) {
        console.error('Fehler beim Laden der Gebets-Ayat:', error);
        if (!isCancelled) {
          setCurrentStepAyahs([]);
          setCurrentAudioQueue([]);
        }
      }
    };

    loadAyahData();

    return () => {
      isCancelled = true;
    };
  }, [currentSlide, step, currentStepData]);

  const handleLearnerSelect = (learner) => {
    setSelectedLearner(learner);
    setSelectedPrayer(null);
    setCurrentSlide(0);
    setStep('select_prayer');
  };

  const handlePrayerSelect = (prayer) => {
    setSelectedPrayer(prayer);
    setCurrentSlide(0);
    setStep('ask_wudu');
  };

  const requestCompassPermission = async () => {
    try {
      if (typeof window !== 'undefined' && typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        const permissionState = await window.DeviceOrientationEvent.requestPermission();
        if (permissionState !== 'granted') {
          setCompassError(t.qiblaAccuracy);
        } else {
          setNeedsCompassPermission(false);
        }
      }
    } catch (error) {
      console.error('Kompass-Permission konnte nicht angefragt werden.', error);
      setCompassError(t.qiblaAccuracy);
    }
  };

  const nextSlide = (listLength, onFinish) => {
    if (currentSlide < listLength - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const hasAudio = Boolean(currentStepData?.audio || currentStepData?.ayah || currentStepData?.audioAyahs?.length);

  const loadQueueItem = async (urls, index) => {
    if (!audioRef.current || !urls[index]) return;
    setCurrentAudioIndex(index);
    audioRef.current.src = urls[index];
    audioRef.current.load();
    await audioRef.current.play();
    setIsPlaying(true);
  };

  const handleAudioEnded = async () => {
    if (currentAudioIndex < currentAudioQueue.length - 1) {
      try {
        await loadQueueItem(currentAudioQueue, currentAudioIndex + 1);
      } catch (error) {
        console.error('Fehler beim Fortsetzen des Gebets-Audios:', error);
        setIsPlaying(false);
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentAudioIndex(0);
  };

  const toggleAudio = async () => {
    if (!audioRef.current || !hasAudio) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      if (audioRef.current.src) {
        await audioRef.current.play();
        setIsPlaying(true);
        return;
      }

      setIsLoadingAudio(true);
      let audioUrls = [];

      if (currentStepData.audioAyahs?.length) {
        const ayahs = currentStepAyahs.length > 0 ? currentStepAyahs : await fetchAyahQueue(currentStepData.audioAyahs);
        setCurrentStepAyahs(ayahs);
        audioUrls = ayahs.map((ayah) => ayah.audio).filter(Boolean);
      } else if (currentStepData.ayah) {
        const ayahs = await fetchAyahQueue([currentStepData.ayah]);
        audioUrls = ayahs.map((ayah) => ayah.audio).filter(Boolean);
      } else if (currentStepData.audio) {
        audioUrls = [currentStepData.audio];
      }

      setCurrentAudioQueue(audioUrls);
      if (audioUrls.length > 0) {
        await loadQueueItem(audioUrls, 0);
      }
    } catch (error) {
      console.error('Gebets-Audio Fehler:', error);
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const toggleArabicAudio = async () => {
    setShowArabicTapHint(false);
    if (hasAudio) {
      await toggleAudio();
      return;
    }
    if (!audioRef.current || !customAudioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    audioRef.current.src = customAudioUrl;
    audioRef.current.load();
    await audioRef.current.play();
    setIsPlaying(true);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          recordChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = typeof reader.result === 'string' ? reader.result : '';
          if (!base64) return;
          const key = `prayerCustomAudio:${currentStepData?.id || 'unknown'}`;
          localStorage.setItem(key, base64);
          setCustomAudioUrl(base64);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Audioaufnahme konnte nicht gestartet werden.', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const removeCustomAudio = () => {
    const key = `prayerCustomAudio:${currentStepData?.id || 'unknown'}`;
    localStorage.removeItem(key);
    setCustomAudioUrl('');
  };

  if (step === 'select_gender') {
    return (
      <div className={`p-6 pb-24 space-y-6 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => setSelectedFeature(null)} className={`p-2 rounded-full shadow-sm transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>
            <ChevronLeft size={24} />
          </button>
          <h2 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {t.learnPrayer}
          </h2>
        </div>

        <div className={`p-6 rounded-[2rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100'}`}>
          <h3 className={`text-2xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.chooseLearner}</h3>
          <p className={`leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{t.chooseLearnerHint}</p>
        </div>

        <div className="grid gap-4">
          {(['boy', 'girl']).map((learner) => (
            <button
              key={learner}
              onClick={() => handleLearnerSelect(learner)}
              className={`w-full p-5 rounded-[2rem] shadow-sm border-2 text-left transition-all active:scale-[0.98] cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100 hover:border-indigo-300'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-24 h-24 rounded-[1.5rem] overflow-hidden border shadow-lg transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                  <img src={learnerCards[learner].image} alt={learner} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className={`text-2xl font-black transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {learner === 'boy' ? t.forBoy : t.forGirl}
                  </div>
                  <div className={`mt-2 text-sm transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {learner === 'boy' ? t.boy : t.girl}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'select_prayer') {
    return (
      <div className={`p-6 pb-24 space-y-6 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-4">
            <button onClick={() => setStep('select_gender')} className={`p-2 rounded-full shadow-sm transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>
              <ChevronLeft size={24} />
            </button>
            <h2 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t.choosePrayer}
            </h2>
          </div>
          <button
            onClick={() => setStep('select_gender')}
            className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-gray-600 border-gray-100'}`}
          >
            {t.changeLearner}
          </button>
        </div>

        <div className="grid gap-4">
          {prayers.map((prayer) => (
            <button
              key={prayer.id}
              onClick={() => handlePrayerSelect(prayer)}
              className={`w-full p-5 rounded-[2rem] border-2 text-left transition-all active:scale-[0.98] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100 hover:border-indigo-300'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${isDarkMode ? 'bg-slate-700' : 'bg-indigo-50'}`}>{prayer.icon}</div>
                <div className="flex-1">
                  <h3 className={`text-lg font-black transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{prayer.name[selectedLang]}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{prayer.rakats} Rakat</p>
                </div>
                <ChevronRight size={20} className={isDarkMode ? 'text-slate-500' : 'text-gray-300'} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'ask_wudu') {
    return (
      <div className={`p-6 pb-24 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-blue-50/50'}`}>
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 shadow-inner transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-blue-100'}`}>
          <Droplets size={64} className="text-blue-500" />
        </div>
        <h2 className={`text-3xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {t.areYouReady}
        </h2>
        <p className={`text-lg px-4 leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          {t.haveWudu}
        </p>

        <div className="flex flex-col w-full px-4 gap-4 mt-8">
          <button
            onClick={() => { setCurrentSlide(0); setStep('ask_qibla'); }}
            className="w-full bg-green-500 text-white font-bold text-xl py-5 rounded-3xl hover:bg-green-600 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
          >
            <CheckCircle2 size={24} /> {t.yesReady}
          </button>

          <button
            onClick={() => { setCurrentSlide(0); setStep('wudu_guide'); }}
            className={`w-full font-bold text-xl py-5 rounded-3xl border-2 transition-all shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800 text-blue-400 border-blue-900/30' : 'bg-white text-blue-500 border-blue-200 hover:bg-blue-50'}`}
          >
            {t.showWudu}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'ask_qibla') {
    return (
      <div className={`p-6 pb-24 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-blue-50/50'}`}>
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 shadow-inner transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-blue-100'}`}>
          <Compass size={64} className="text-indigo-500" />
        </div>
        <h2 className={`text-3xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {t.qiblaCheck}
        </h2>

        <div className="flex flex-col w-full px-4 gap-4 mt-8">
          <button
            onClick={() => { setCurrentSlide(0); setStep('prayer_guide'); }}
            className="w-full bg-green-500 text-white font-bold text-xl py-5 rounded-3xl hover:bg-green-600 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
          >
            <CheckCircle2 size={24} /> {t.qiblaYes}
          </button>

          <button
            onClick={() => setStep('qibla_compass')}
            className={`w-full font-bold text-xl py-5 rounded-3xl border-2 transition-all shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800 text-indigo-400 border-indigo-900/30' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          >
            {t.qiblaNo}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'qibla_compass') {
    const delta = qiblaBearing == null || deviceHeading == null
      ? null
      : normalizeAngle(qiblaBearing - deviceHeading);
    const signedDelta = qiblaBearing == null || deviceHeading == null
      ? null
      : signedDeltaToTarget(qiblaBearing, deviceHeading);
    const isAligned = signedDelta != null && Math.abs(signedDelta) <= 8;
    const turnInstruction = signedDelta == null
      ? '—'
      : isAligned
        ? t.qiblaAligned
        : `${signedDelta < 0 ? t.qiblaTurnLeft : t.qiblaTurnRight} ${Math.round(Math.abs(signedDelta))}° ${t.qiblaTurnBy}`;
    const airlineDistanceKm = currentCoords
      ? calculateDistanceKm(currentCoords.latitude, currentCoords.longitude, KAABA_COORDS.lat, KAABA_COORDS.lon)
      : null;
    const mapsDirectionUrl = currentCoords
      ? `https://www.google.com/maps/dir/?api=1&origin=${currentCoords.latitude},${currentCoords.longitude}&destination=${KAABA_COORDS.lat},${KAABA_COORDS.lon}&travelmode=walking`
      : `https://www.google.com/maps/search/?api=1&query=${KAABA_COORDS.lat},${KAABA_COORDS.lon}`;

    return (
      <div className={`p-6 pb-24 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-indigo-50'}`}>
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setStep('ask_qibla')} className={`p-2 rounded-full shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
          </button>
          <h2 className={`text-xl font-black transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.qiblaTitle}</h2>
        </div>

        <div className={`p-6 rounded-[2rem] border shadow-sm text-center space-y-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100'}`}>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{t.qiblaHint}</p>
          <div className={`p-3 rounded-xl text-sm font-black ${isAligned
            ? (isDarkMode ? 'bg-emerald-900/40 text-emerald-200' : 'bg-emerald-50 text-emerald-700')
            : (isDarkMode ? 'bg-indigo-900/40 text-indigo-200' : 'bg-indigo-50 text-indigo-700')}`}>
            {turnInstruction}
          </div>

          <div className="relative mx-auto w-56 h-56 rounded-full border-8 border-indigo-200 flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`transition-transform duration-300 ${isAligned ? 'text-emerald-600' : 'text-indigo-600'}`}
                style={{ transform: `rotate(${delta ?? 0}deg)` }}
              >
                <LocateFixed size={72} />
              </div>
            </div>
            <div className="absolute top-3 text-[10px] font-black tracking-wider text-indigo-600">QIBLA</div>
            <Compass size={28} className="text-slate-500" />
          </div>

          <div className={`grid grid-cols-2 gap-2 text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-900/60' : 'bg-indigo-50'}`}>
              {t.qiblaDirection}: {qiblaBearing == null ? '—' : `${Math.round(qiblaBearing)}°`}
            </div>
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-900/60' : 'bg-indigo-50'}`}>
              {t.qiblaHeading}: {deviceHeading == null ? '—' : `${Math.round(deviceHeading)}°`}
            </div>
          </div>

          <div className={`p-3 rounded-xl text-xs font-bold ${isDarkMode ? 'bg-slate-900/60 text-slate-200' : 'bg-indigo-50 text-gray-700'}`}>
            {t.qiblaAirline}: {airlineDistanceKm == null ? '—' : `${Math.round(airlineDistanceKm)} km`}
          </div>

          {!!locationError && <p className="text-xs text-red-500">{locationError}</p>}
          {!!compassError && <p className="text-xs text-amber-500">{compassError}</p>}
          <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{t.qiblaAccuracy}</p>

          {needsCompassPermission && (
            <button
              onClick={requestCompassPermission}
              className={`w-full py-3 rounded-2xl font-bold text-sm border transition-colors ${isDarkMode ? 'bg-slate-900 text-indigo-300 border-indigo-900/40' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}
            >
              {t.requestCompass}
            </button>
          )}

          <a
            href="https://qiblafinder.withgoogle.com/"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1 text-sm font-bold underline ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}
          >
            {t.openQiblaFinder} <ExternalLink size={14} />
          </a>

          <a
            href={mapsDirectionUrl}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1 text-sm font-bold underline ml-3 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}
          >
            {t.openMapsDirection} <ExternalLink size={14} />
          </a>
        </div>

        <button
          onClick={() => { setCurrentSlide(0); setStep('prayer_guide'); }}
          className="mt-6 w-full bg-green-500 text-white font-bold text-lg py-4 rounded-3xl hover:bg-green-600 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <ArrowRight size={20} /> {t.next}
        </button>
      </div>
    );
  }

  if (step === 'wudu_guide') {
    const currentWuduStep = wuduSteps[currentSlide];
    return (
      <div className={`p-6 pb-24 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-blue-50'}`}>
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setStep('ask_wudu')} className={`p-2 rounded-full shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
          </button>
          <div className={`font-bold px-4 py-1 rounded-full text-sm transition-colors ${isDarkMode ? 'text-blue-400 bg-blue-900/20' : 'text-blue-600 bg-blue-100'}`}>
            {currentSlide + 1} / {wuduSteps.length}
          </div>
        </div>

        <div className={`flex-1 flex flex-col items-center justify-center text-center space-y-8 p-8 rounded-[3rem] shadow-xl border-2 transition-colors relative ${isDarkMode ? 'bg-slate-800 border-blue-900/30 shadow-slate-950/50' : 'bg-white border-blue-100'}`}>
          <div className={`text-8xl mb-4 w-44 h-44 rounded-full flex items-center justify-center border-8 shadow-inner transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-900' : 'bg-blue-50 border-white'}`}>
            {currentWuduStep.image}
          </div>
          <h2 className={`text-3xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{currentWuduStep.title[selectedLang]}</h2>
          <p className={`text-lg leading-relaxed max-w-xs mx-auto transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {currentWuduStep.text[selectedLang]}
          </p>
        </div>

        <div className="flex justify-between items-center mt-8 gap-4">
          <button
            onClick={() => setCurrentSlide((c) => Math.max(0, c - 1))}
            disabled={currentSlide === 0}
            className={`p-5 rounded-3xl transition-all ${currentSlide === 0 ? (isDarkMode ? 'bg-slate-800 text-slate-700' : 'bg-gray-100 text-gray-300') : (isDarkMode ? 'bg-slate-800 text-white shadow-md active:scale-90 cursor-pointer' : 'bg-white text-gray-800 shadow-md active:scale-90 cursor-pointer')}`}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => nextSlide(wuduSteps.length, () => setStep('ask_qibla'))}
            className="flex-1 bg-blue-500 text-white font-bold text-xl py-5 rounded-3xl shadow-lg hover:bg-blue-600 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {currentSlide === wuduSteps.length - 1 ? t.startPrayer : t.next}
            {currentSlide === wuduSteps.length - 1 && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'prayer_guide') {
    const apiArabicText = joinAyahTexts(currentStepAyahs);
    const displayArabic = apiArabicText || currentStepData.arabic;
    const illustration = currentStepData.illustrations?.[selectedLearner];

    return (
      <div className={`p-6 pb-24 flex flex-col min-h-screen transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-indigo-50'}`}>
        <audio ref={audioRef} onEnded={handleAudioEnded} />

        <div className="flex justify-between items-center mb-6 gap-4">
          <button onClick={() => setStep('select_prayer')} className={`p-2 rounded-full shadow-sm cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <ChevronLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
          </button>
          <div className="flex flex-col items-end text-right">
            <div className={`font-bold text-lg leading-tight transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>{selectedPrayer?.name[selectedLang]}</div>
            <div className={`font-bold px-3 py-1 rounded-full text-[10px] mt-1 transition-colors ${isDarkMode ? 'bg-indigo-900/30 text-indigo-500' : 'bg-indigo-100 text-indigo-500'}`}>
              {t.step} {currentSlide + 1} / {prayerSteps.length}
            </div>
          </div>
        </div>

        <div className={`flex-1 flex flex-col items-center text-center space-y-5 p-6 rounded-[3rem] shadow-xl border-2 relative overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-800 border-indigo-900/30 shadow-slate-950/50' : 'bg-white border-indigo-100'}`}>
          {illustration && !imageFailed ? (
            <img
              key={`${selectedLearner}-${currentStepData.id}`}
              src={illustration}
              alt={currentStepData.title[selectedLang]}
              onError={() => setImageFailed(true)}
              className="h-72 w-full max-w-[20rem] object-contain mx-auto mt-1 drop-shadow-2xl transition-all duration-300"
            />
          ) : (
            <div className="text-8xl h-32 flex items-center justify-center mt-2">
              {currentStepData.image}
            </div>
          )}

          <div className="space-y-4 w-full">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${isDarkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
              <BadgeCheck size={14} /> {selectedLearner === 'girl' ? t.forGirl : t.forBoy}
            </div>

            <h2 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{currentStepData.title[selectedLang]}</h2>

            <InfoCard title={t.arabic} isDarkMode={isDarkMode} tone="green">
              <button
                onClick={toggleArabicAudio}
                className={`w-full text-3xl font-arabic leading-relaxed text-right cursor-pointer ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}
                dir="rtl"
              >
                {displayArabic}
              </button>
            </InfoCard>
            {showArabicTapHint && (
              <div className={`px-3 py-2 rounded-xl text-xs ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-indigo-50 text-indigo-700'}`}>
                {t.tapArabicHint}
              </div>
            )}

            {currentStepData.transliteration && (
              <InfoCard title={t.pronunciation} isDarkMode={isDarkMode} tone="blue">
                <p className={`text-base leading-relaxed font-semibold ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>
                  {currentStepData.transliteration}
                </p>
              </InfoCard>
            )}

            <InfoCard title={t.explanation} isDarkMode={isDarkMode} tone="amber">
              <p className={`text-base leading-relaxed font-medium ${isDarkMode ? 'text-slate-100' : 'text-gray-700'}`}>
                {currentStepData.text[selectedLang]}
              </p>
            </InfoCard>

            {!!currentStepData.poseNotes?.[selectedLang]?.length && (
              <div className={`text-left p-4 rounded-3xl border transition-colors ${isDarkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <button onClick={() => setShowWatchFor((prev) => !prev)} className="w-full flex items-center justify-between">
                  <div className={`font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t.watchFor}</div>
                  <ChevronDown size={18} className={`transition-transform ${showWatchFor ? 'rotate-180' : ''}`} />
                </button>
                {showWatchFor && (
                  <div className="space-y-2 mt-3">
                    {currentStepData.poseNotes[selectedLang].map((note, noteIndex) => (
                      <div key={`${currentStepData.id}-${noteIndex}`} className="flex items-start gap-2">
                        <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
                        <p className={`text-sm leading-relaxed transition-colors ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {hasAudio ? (
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className={isDarkMode ? 'text-emerald-300' : 'text-emerald-700'} />
                    <p className={`text-xs uppercase font-bold tracking-wider ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>{t.authenticAudio}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleAudio}
                      disabled={isLoadingAudio}
                      className={`p-5 rounded-3xl shadow-lg transition-all transform active:scale-90 flex items-center justify-center ${isLoadingAudio ? 'bg-gray-200 text-gray-500' : isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                      {isLoadingAudio ? <Loader2 className="animate-spin" size={24} /> : isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>
                  </div>
                </div>
                <p className={`text-xs mt-3 text-left ${isDarkMode ? 'text-emerald-200/80' : 'text-emerald-800/80'}`}>{t.authenticAudioHint}</p>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border text-left space-y-3 ${isDarkMode ? 'bg-slate-900/60 border-slate-700 text-slate-400' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                <p className="text-sm leading-relaxed">{t.noAudio}</p>
                <div className={`p-3 rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Mic size={16} />
                    <span className="text-sm font-bold">{t.ownAudio}</span>
                  </div>
                  <p className="text-xs mb-3">{t.ownAudioHint}</p>
                  <div className="flex flex-wrap gap-2">
                    {!isRecording ? (
                      <button onClick={startRecording} className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white">
                        {t.startRecording}
                      </button>
                    ) : (
                      <button onClick={stopRecording} className="px-3 py-2 rounded-xl text-xs font-bold bg-red-500 text-white flex items-center gap-1">
                        <Square size={12} /> {t.stopRecording}
                      </button>
                    )}
                    {customAudioUrl && (
                      <>
                        <button onClick={toggleArabicAudio} className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-500 text-white">
                          {isPlaying ? t.pauseOwnAudio : t.playOwnAudio}
                        </button>
                        <button onClick={removeCustomAudio} className={`px-3 py-2 rounded-xl text-xs font-bold ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          {t.deleteOwnAudio}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 gap-4">
          <button
            onClick={() => setCurrentSlide((c) => Math.max(0, c - 1))}
            disabled={currentSlide === 0}
            className={`p-5 rounded-3xl transition-all ${currentSlide === 0 ? (isDarkMode ? 'bg-slate-800 text-slate-700' : 'bg-gray-100 text-gray-300') : (isDarkMode ? 'bg-slate-800 text-white shadow-md active:scale-90 cursor-pointer' : 'bg-white text-gray-800 shadow-md active:scale-90 cursor-pointer')}`}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => nextSlide(prayerSteps.length, () => {
              alert(t.prayerFinished);
              setStep('select_prayer');
            })}
            className="flex-1 bg-indigo-500 text-white font-bold text-xl py-5 rounded-3xl shadow-lg hover:bg-indigo-600 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {currentSlide === prayerSteps.length - 1 ? t.done : t.next}
            {currentSlide === prayerSteps.length - 1 && <CheckCircle2 size={20} />}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
