import { useState, useEffect } from 'react';
import { duas as localDuas } from '../data/duas';
import { hadiths as localHadiths } from '../data/hadiths';
import { stories as localStories } from '../data/stories';

export function useData() {
  const [duas, setDuas] = useState([]);
  const [hadiths, setHadiths] = useState([]);
  const [stories, setStories] = useState([]);
  const [suren, setSuren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const surenRes = await fetch('data/suren.json');
        const surenData = await surenRes.json();

        setDuas(localDuas);
        setHadiths(localHadiths);
        setStories(localStories);
        setSuren(surenData);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);

        setDuas(localDuas);
        setHadiths(localHadiths);
        setStories(localStories);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return { duas, hadiths, stories, suren, loading };
}
