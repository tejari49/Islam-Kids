export async function fetchAyahBundle(ayahRef) {
  const response = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahRef}/ar.alafasy`);

  if (!response.ok) {
    throw new Error(`Aya ${ayahRef} konnte nicht geladen werden (HTTP ${response.status}).`);
  }

  const data = await response.json();

  if (!data?.data?.audio) {
    throw new Error(`Kein Audio für Aya ${ayahRef} gefunden.`);
  }

  return {
    ayahRef,
    audio: data.data.audio,
    text: data.data.text,
    surahName: data.data.surah?.englishName || '',
    numberInSurah: data.data.numberInSurah || null
  };
}

export async function fetchAyahQueue(ayahRefs = []) {
  return Promise.all(ayahRefs.map((ayahRef) => fetchAyahBundle(ayahRef)));
}

export function joinAyahTexts(ayahs = []) {
  return ayahs.map((ayah) => ayah.text).filter(Boolean).join(' ');
}
