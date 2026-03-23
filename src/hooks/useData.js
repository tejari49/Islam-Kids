import duasData from '../../content/duas.json';
import hadithsData from '../../content/hadiths.json';
import storiesData from '../../content/stories.json';
import surenData from '../../content/suren.json';

export function useData() {
  return {
    duas: duasData,
    hadiths: hadithsData,
    stories: storiesData,
    suren: surenData,
    loading: false,
  };
}
