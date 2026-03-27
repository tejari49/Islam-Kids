const TRANSLATION_EDITIONS = {
  de: ['de.bubenheim', 'de.aburida', 'de.zaidan'],
  al: ['sq.ahmeti', 'sq.mehdiu', 'sq.nahi'],
  tr: ['tr.diyanet', 'tr.yildirim', 'tr.ates'],
  ar: []
};

const API_BASE = 'https://api.alquran.cloud/v1';
const QURAN_API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1';
const SURAH_AUDIO_BITRATE = 128;
const SURAH_AUDIO_EDITION = 'ar.alafasy';
const CORS_PROXY_BASE = 'https://corsproxy.io/?';
const SURAH_CACHE_TTL = 1000 * 60 * 60 * 24 * 7;
const SURAH_META_CACHE_TTL = 1000 * 60 * 60 * 24 * 30;
const CACHE_VERSION = '2026-03-27-audio-proxy-fallback-v3';

const QURAN_API_LANGUAGE = {
  de: 'German',
  al: 'Albanian',
  tr: 'Turkish',
  ar: 'Arabic'
};

const QURAN_API_PREFERENCES = {
  ar: ['ara-qurankhaledhosn', 'ara-quransimple', 'ara-qurandoori', 'ara-quranuthmani', 'ara-quranindopak'],
  de: ['deu-frankbubenheima', 'deu-asfbubenheimand', 'deu-aburidamuhammad', 'deu-adeltheodorkhou', 'deu-amirzaidan'],
  al: ['sqi-ahmeti', 'sqi-mehdiu', 'sqi-nahi', 'alb-'],
  tr: ['tur-diyanet', 'tur-elmalili', 'tur-ynozturk', 'tur-ates']
};

function getStorageItem(key, ttl) {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > ttl) {
      window.localStorage.removeItem(key);
      return null;
    }

    return parsed.data ?? null;
  } catch (error) {
    console.warn(`Cache ${key} konnte nicht gelesen werden.`, error);
    return null;
  }
}

function setStorageItem(key, data) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (error) {
    console.warn(`Cache ${key} konnte nicht gespeichert werden.`, error);
  }
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API-Anfrage fehlgeschlagen (${response.status}) für ${url}`);
  }

  const payload = await response.json();

  if (payload?.code && payload.code !== 200) {
    throw new Error(payload?.data || payload?.status || `Ungültige API-Antwort für ${url}`);
  }

  return payload?.data ?? payload;
}

async function fetchJsonWithFallback(urls = []) {
  let lastError = null;

  for (const url of urls) {
    if (!url) continue;
    try {
      return await fetchJson(url);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Keine gültige URL für Quran-Daten gefunden.');
}

async function fetchEditionAyah(ayahRef, edition) {
  return fetchJson(`${API_BASE}/ayah/${ayahRef}/${edition}`);
}

function buildSurahAudioUrl(surahId, edition = SURAH_AUDIO_EDITION, bitrate = SURAH_AUDIO_BITRATE) {
  return `https://cdn.islamic.network/quran/audio-surah/${bitrate}/${edition}/${surahId}.mp3`;
}

function getCacheKey(prefix, ...parts) {
  return `${CACHE_VERSION}:${prefix}:${parts.join(':')}`;
}

function isCorsBlockedAudioUrl(url = '') {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('cdn.islamic.network');
  } catch (error) {
    return true;
  }
}

function withCorsProxy(url = '') {
  if (!url) return '';
  return `${CORS_PROXY_BASE}${encodeURIComponent(url)}`;
}

function pickPlayableAudioUrl(candidates = []) {
  const valid = candidates.filter(Boolean);
  const nonBlocked = valid.find((url) => !isCorsBlockedAudioUrl(url));
  if (nonBlocked) return nonBlocked;
  if (!valid.length) return '';
  return withCorsProxy(valid[0]);
}

function normalizeEditionEntries(payload) {
  const entries = Object.values(payload || {}).filter(Boolean).map((entry) => ({
    ...entry,
    name: entry?.name || '',
    language: entry?.language || '',
    direction: entry?.direction || '',
    author: entry?.author || '',
    link: entry?.link || '',
    linkmin: entry?.linkmin || ''
  }));

  return entries;
}

async function fetchQuranApiEditions() {
  const cacheKey = getCacheKey('quran-api-editions');
  const cached = getStorageItem(cacheKey, SURAH_META_CACHE_TTL);
  if (cached?.length) {
    return cached;
  }

  const payload = await fetchJsonWithFallback([
    `${QURAN_API_BASE}/editions.min.json`,
    `${QURAN_API_BASE}/editions.json`
  ]);

  const normalized = normalizeEditionEntries(payload);
  setStorageItem(cacheKey, normalized);
  return normalized;
}

function selectPreferredEdition(editions = [], lang = 'de') {
  const targetLanguage = QURAN_API_LANGUAGE[lang] || QURAN_API_LANGUAGE.de;
  const preferredNameParts = QURAN_API_PREFERENCES[lang] || [];

  const matchesLanguage = editions.filter((entry) => entry.language === targetLanguage);
  const withoutLatin = matchesLanguage.filter((entry) => !entry.name.endsWith('-la') && !entry.name.endsWith('-lad'));
  const filtered = lang === 'ar'
    ? withoutLatin.filter((entry) => entry.direction === 'rtl')
    : withoutLatin.filter((entry) => entry.direction !== 'rtl');

  const pool = filtered.length ? filtered : withoutLatin.length ? withoutLatin : matchesLanguage;
  if (!pool.length) {
    return null;
  }

  for (const preferredName of preferredNameParts) {
    const match = pool.find((entry) => entry.name.includes(preferredName));
    if (match) return match;
  }

  return pool[0];
}

function buildChapterUrls(edition, surahId) {
  const urls = [];

  if (edition?.linkmin) {
    urls.push(edition.linkmin.replace(/\.min\.json$/, `/${surahId}.min.json`));
  }

  if (edition?.link) {
    urls.push(edition.link.replace(/\.json$/, `/${surahId}.json`));
  }

  return urls;
}

function getCandidateContainers(payload) {
  const containers = [
    payload?.chapter,
    payload?.surah,
    payload?.data?.chapter,
    payload?.data?.surah,
    payload?.data,
    payload
  ].filter(Boolean);

  const withVerses = containers.find((entry) => Array.isArray(entry?.verses) || Array.isArray(entry?.ayahs) || Array.isArray(entry?.items));
  if (withVerses) {
    return withVerses;
  }

  return containers[0] || {};
}

function normalizeVerse(verse, index) {
  const numberInSurah = Number(
    verse?.numberInSurah
      ?? verse?.verse_number
      ?? verse?.number
      ?? verse?.verse
      ?? verse?.id
      ?? index + 1
  );

  return {
    numberInSurah,
    text: verse?.text ?? verse?.content ?? verse?.translation ?? verse?.verse ?? '',
    globalNumber: verse?.number ?? verse?.id ?? null,
    juz: verse?.juz ?? null,
    page: verse?.page ?? null,
    verseKey: verse?.verse_key ?? verse?.verseKey ?? null
  };
}

function normalizeChapterPayload(payload) {
  const container = getCandidateContainers(payload);
  const versesRaw = container?.verses || container?.ayahs || container?.items || [];
  const verses = versesRaw.map(normalizeVerse).filter((verse) => verse.numberInSurah && verse.text);

  return {
    id: container?.id ?? container?.number ?? payload?.id ?? payload?.number ?? null,
    arabicName: container?.name_arabic ?? container?.arabicName ?? container?.name ?? '',
    transliteration: container?.transliteration ?? container?.name_simple ?? container?.englishName ?? container?.name ?? '',
    translatedName: container?.translation ?? container?.translatedName ?? container?.englishNameTranslation ?? '',
    revelationType: container?.type ?? container?.revelationType ?? container?.origin ?? '',
    versesCount: Number(container?.total_verses ?? container?.versesCount ?? container?.numberOfAyahs ?? verses.length ?? 0),
    verses
  };
}

function mergeSurahVerses(surahId, arabicChapter, translationChapter) {
  const translationByNumber = new Map((translationChapter?.verses || []).map((verse) => [verse.numberInSurah, verse.text]));

  return (arabicChapter?.verses || []).map((verse) => ({
    number: verse.globalNumber,
    numberInSurah: verse.numberInSurah,
    juz: verse.juz,
    page: verse.page,
    arabic: verse.text,
    translation: translationByNumber.get(verse.numberInSurah) || '',
    audio: '',
    ayahRef: `${surahId}:${verse.numberInSurah}`
  }));
}

function normalizeMetaList(payload) {
  const containers = [payload?.chapters, payload?.surahs, payload?.data?.chapters, payload?.data?.surahs, payload].filter(Boolean);
  const list = containers.find(Array.isArray) || [];

  return list.map((item, index) => ({
    id: Number(item?.id ?? item?.number ?? index + 1),
    arabic: item?.name_arabic ?? item?.arabicName ?? item?.name ?? '',
    englishName: item?.transliteration ?? item?.name_simple ?? item?.englishName ?? '',
    englishMeaning: item?.translation ?? item?.translatedName ?? item?.englishNameTranslation ?? '',
    verses: Number(item?.total_verses ?? item?.versesCount ?? item?.numberOfAyahs ?? 0),
    revelation: item?.type ?? item?.revelationType ?? item?.origin ?? ''
  })).filter((entry) => entry.id);
}

export async function fetchAyahBundle(ayahRef) {
  const [surahPart, ayahPart] = String(ayahRef).split(':');
  const surahNumber = Number(surahPart);
  const ayahNumber = Number(ayahPart);
  const everyAyahFallback = Number.isFinite(surahNumber) && Number.isFinite(ayahNumber)
    ? `https://verses.quran.com/Alafasy/mp3/${String(surahNumber).padStart(3, '0')}${String(ayahNumber).padStart(3, '0')}.mp3`
    : '';

  try {
    const data = await fetchEditionAyah(ayahRef, SURAH_AUDIO_EDITION);
    const preferredAudio = pickPlayableAudioUrl([
      everyAyahFallback,
      data?.audioSecondary?.[0],
      data?.audioSecondary?.[1],
      data?.audio
    ]);

    return {
      ayahRef,
      audio: preferredAudio || everyAyahFallback,
      text: data?.text || '',
      surahName: data?.surah?.englishName || '',
      numberInSurah: data?.numberInSurah || ayahNumber || null
    };
  } catch (error) {
    if (!everyAyahFallback) {
      throw error;
    }
    return {
      ayahRef,
      audio: everyAyahFallback,
      text: '',
      surahName: '',
      numberInSurah: ayahNumber || null
    };
  }
}

export async function fetchAyahQueue(ayahRefs = []) {
  return Promise.all(ayahRefs.map((ayahRef) => fetchAyahBundle(ayahRef)));
}

export async function fetchAyahTranslationBundle(ayahRef, lang = 'de') {
  const editions = TRANSLATION_EDITIONS[lang] || [];

  for (const edition of editions) {
    try {
      const data = await fetchEditionAyah(ayahRef, edition);
      if (data?.text) {
        return {
          ayahRef,
          text: data.text,
          edition: data.edition?.englishName || data.edition?.name || edition
        };
      }
    } catch (error) {
      console.warn(`Übersetzung ${edition} für Aya ${ayahRef} konnte nicht geladen werden.`, error);
    }
  }

  return {
    ayahRef,
    text: '',
    edition: ''
  };
}

export async function fetchAyahTranslationQueue(ayahRefs = [], lang = 'de') {
  return Promise.all(ayahRefs.map((ayahRef) => fetchAyahTranslationBundle(ayahRef, lang)));
}

export function joinAyahTexts(ayahs = []) {
  return ayahs.map((ayah) => ayah.text).filter(Boolean).join(' ');
}

export async function fetchSurahMetaList() {
  const cacheKey = getCacheKey('quran-surah-meta-list');
  const cached = getStorageItem(cacheKey, SURAH_META_CACHE_TTL);
  if (cached) {
    return cached;
  }

  try {
    const payload = await fetchJsonWithFallback([
      `${QURAN_API_BASE}/info.min.json`,
      `${QURAN_API_BASE}/info.json`
    ]);
    const normalized = normalizeMetaList(payload);
    setStorageItem(cacheKey, normalized);
    return normalized;
  } catch (error) {
    console.warn('Quran-Info aus quran-api konnte nicht geladen werden.', error);
    return [];
  }
}

export async function fetchSurahBundle(surahId, lang = 'de') {
  const cacheKey = getCacheKey('quran-surah-bundle', surahId, lang);
  const cached = getStorageItem(cacheKey, SURAH_CACHE_TTL);
  if (cached) {
    return cached;
  }

  let bundle = null;
  try {
    const editions = await fetchQuranApiEditions();
    const arabicEdition = selectPreferredEdition(editions, 'ar');
    const translationEdition = lang === 'ar' ? null : selectPreferredEdition(editions, lang);

    if (!arabicEdition) {
      throw new Error('Keine arabische Quran-Edition aus quran-api gefunden.');
    }

    const [arabicPayload, translationPayload] = await Promise.all([
      fetchJsonWithFallback(buildChapterUrls(arabicEdition, surahId)),
      translationEdition ? fetchJsonWithFallback(buildChapterUrls(translationEdition, surahId)).catch((error) => {
        console.warn(`Suren-Übersetzung ${translationEdition.name} für Sure ${surahId} konnte nicht geladen werden.`, error);
        return null;
      }) : Promise.resolve(null)
    ]);

    const arabicChapter = normalizeChapterPayload(arabicPayload);
    const translationChapter = translationPayload ? normalizeChapterPayload(translationPayload) : null;

    if (!arabicChapter?.verses?.length) {
      throw new Error(`Sure ${surahId} konnte nicht vollständig aus quran-api geladen werden.`);
    }

    bundle = {
      id: surahId,
      arabicName: arabicChapter.arabicName || '',
      englishName: arabicChapter.transliteration || '',
      englishMeaning: arabicChapter.translatedName || '',
      revelationType: arabicChapter.revelationType || '',
      versesCount: arabicChapter.versesCount || arabicChapter.verses.length,
      translationEdition: translationEdition ? `${translationEdition.author || translationEdition.name}` : '',
      surahAudioUrl: buildSurahAudioUrl(surahId),
      verses: mergeSurahVerses(surahId, arabicChapter, translationChapter)
    };
  } catch (error) {
    console.warn(`quran-api Fallback für Sure ${surahId} wird verwendet.`, error);
    const arabicEdition = 'quran-uthmani';
    const translationEdition = lang === 'ar' ? null : (TRANSLATION_EDITIONS[lang]?.[0] || TRANSLATION_EDITIONS.de[0]);
    const editions = translationEdition ? `${arabicEdition},${translationEdition}` : arabicEdition;
    const payload = await fetchJson(`${API_BASE}/surah/${surahId}/editions/${editions}`);
    const entries = Array.isArray(payload) ? payload : [payload];
    const arabicData = entries.find((entry) => entry?.edition?.language === 'ar') || entries[0];
    const translationData = entries.find((entry) => entry?.edition?.language !== 'ar') || null;

    bundle = {
      id: surahId,
      arabicName: arabicData?.name || '',
      englishName: arabicData?.englishName || '',
      englishMeaning: arabicData?.englishNameTranslation || '',
      revelationType: arabicData?.revelationType || '',
      versesCount: arabicData?.numberOfAyahs || (arabicData?.ayahs?.length ?? 0),
      translationEdition: translationData?.edition?.englishName || '',
      surahAudioUrl: buildSurahAudioUrl(surahId),
      verses: (arabicData?.ayahs || []).map((ayah, index) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        juz: ayah.juz,
        page: ayah.page,
        arabic: ayah.text,
        translation: translationData?.ayahs?.[index]?.text || '',
        audio: '',
        ayahRef: `${surahId}:${ayah.numberInSurah}`
      }))
    };
  }

  setStorageItem(cacheKey, bundle);
  return bundle;
}

export { TRANSLATION_EDITIONS, SURAH_AUDIO_EDITION, SURAH_AUDIO_BITRATE, buildSurahAudioUrl, withCorsProxy, isCorsBlockedAudioUrl };
