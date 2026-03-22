import { useState, useEffect } from 'react';

export function useData() {
  const [duas, setDuas] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const [stories, setStories] = useState([]);
  const [suren, setSuren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [duasRes, hadithsRes, storiesRes, surenRes] = await Promise.all([
          fetch('data/duas.json'),
          fetch('data/hadiths.json'),
          fetch('data/stories.json'),
          fetch('data/suren.json')
        ]);

        const [duasData, hadithsData, storiesData, surenData] = await Promise.all([
          duasRes.json(),
          hadithsRes.json(),
          storiesRes.json(),
          surenRes.json()
        ]);

        setDuas(duasData);
        setHadiths(hadithsData);
        setStories(storiesData);
        setSuren(surenData);
      } catch (error) {
        console.error("Fehler beim Laden der Daten (JSON DB):", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return { duas, hadiths, stories, suren, loading };
}
