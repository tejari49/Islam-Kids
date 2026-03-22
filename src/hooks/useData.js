import { useState, useEffect } from 'react';

export function useData() {
  const [duas, setDuas] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        
        const [duasRes, hadithsRes, storiesRes] = await Promise.all([
          fetch(`${baseUrl}data/duas.json`),
          fetch(`${baseUrl}data/hadiths.json`),
          fetch(`${baseUrl}data/stories.json`)
        ]);

        const [duasData, hadithsData, storiesData] = await Promise.all([
          duasRes.json(),
          hadithsRes.json(),
          storiesRes.json()
        ]);

        setDuas(duasData);
        setHadiths(hadithsData);
        setStories(storiesData);
      } catch (error) {
        console.error("Fehler beim Laden der Daten (JSON DB):", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return { duas, hadiths, stories, loading };
}
