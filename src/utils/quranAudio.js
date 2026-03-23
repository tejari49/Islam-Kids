const TRANSLATION_EDITIONS = {
  de: ['de.aburida', 'de.bubenheim', 'de.zaidan'],
  al: ['sq.ahmeti', 'sq.mehdiu', 'sq.nahi'],
  tr: ['tr.diyanet', 'tr.yildirim', 'tr.ates']
};

async function fetchEditionAyah(ayahRef, edition) {
  const response = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahRef}/${edition}`);

  if (!response.ok) {
    throw new Error(`Aya ${ayahRef} konnte für Edition ${edition} nicht geladen werden (HTTP ${response.status}).`);
  }

  const data = await response.json();

  if (!data?.data) {
    throw new Error(`Keine Daten für Aya ${ayahRef} und Edition ${edition} gefunden.`);
  }

  return data.data;
}

export async function fetchAyahBundle(ayahRef) {
  const data = await fetchEditionAyah(ayahRef, 'ar.alafasy');

  if (!data?.audio) {
    throw new Error(`Kein Audio für Aya ${ayahRef} gefunden.`);
  }

  return {
    ayahRef,
    audio: data.audio,
    text: data.text,
    surahName: data.surah?.englishName || '',
    numberInSurah: data.numberInSurah || null
  };
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
