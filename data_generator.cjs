const fs = require('fs');
const path = require('path');

const SEED_DUAS = [
  { id: 1, icon: "🍽️", title: { de: "Vor dem Essen", al: "Para ushqimit", tr: "Yemekten önce" }, arabic: "بِسْمِ اللَّهِ", meaning: { de: "Im Namen Allahs", al: "Me emrin e Allahut", tr: "Allah'ın adıyla" } },
  { id: 2, icon: "😋", title: { de: "Nach dem Essen", al: "Pas ushqimit", tr: "Yemekten sonra" }, arabic: "الْحَمْدُ لِلَّهِ", meaning: { de: "Alles Lob gebührt Allah", al: "Falënderimi i takon Allahut", tr: "Hamd Allah'adır" } },
  { id: 3, icon: "😴", title: { de: "Vor dem Schlafen", al: "Para gjumit", tr: "Uyumadan önce" }, arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", meaning: { de: "In Deinem Namen sterbe und lebe ich", al: "Me emrin Tënd vdes dhe jetoj", tr: "Senin isminle ölür ve dirilirim" } },
  { id: 4, icon: "☀️", title: { de: "Beim Aufwachen", al: "Zgjimi", tr: "Uyanırken" }, arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا", meaning: { de: "Lob Gott, der uns belebt hat", al: "Lavdi Zotit që na ringjalli", tr: "Bizi dirilten Allah'a hamdolsun" } },
  { id: 5, icon: "🚗", title: { de: "Auf Reisen", al: "Udhëtimi", tr: "Yolculukta" }, arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا", meaning: { de: "Preis sei Ihm, der uns dies nutzbar macht", al: "I lavdëruar qoftë Ai që na e nënshtroi këtë", tr: "Bunu hizmetimize verene hamdolsun" } },
  { id: 6, icon: "🚪", title: { de: "Haus verlassen", al: "Dalja nga shtëpia", tr: "Evden çıkarken" }, arabic: "تَوَكَّلْتُ عَلَى اللَّهِ", meaning: { de: "Ich vertraue auf Allah", al: "Mbështetem tek Allahu", tr: "Allah'a tevekkül ettim" } },
  { id: 7, icon: "🏠", title: { de: "Haus betreten", al: "Hyrja në shtëpi", tr: "Eve girerken" }, arabic: "بِسْمِ اللَّهِ وَلَجْنَا", meaning: { de: "Mit Allahs Namen treten wir ein", al: "Me emrin e Allahut hyjmë", tr: "Allah'ın adıyla girdik" } },
  { id: 8, icon: "👔", title: { de: "Anziehen", al: "Veshja", tr: "Giyinirken" }, arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي", meaning: { de: "Gott sei Dank, der mich kleidet", al: "Lavdi Zotit që më veshi", tr: "Beni giydiren Allah'a hamdolsun" } },
  { id: 9, icon: "💦", title: { de: "Nach Wudu", al: "Pas Abdesit", tr: "Abdestten sonra" }, arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ", meaning: { de: "Ich bezeuge, dass es nur einen Gott gibt", al: "Dëshmoj se nuk ka zot tjetër përveç Allahut", tr: "Şahitlik ederim ki Allah'tan başka ilah yoktur" } },
  { id: 10, icon: "📚", title: { de: "Wissen erbitten", al: "Kërkimi i dijes", tr: "İlim istemek" }, arabic: "رَبِّ زِدْنِي عِلْمًا", meaning: { de: "Mein Herr, mehre mein Wissen", al: "Zoti im, më shto diturinë", tr: "Rabbim, ilmimi artır" } }
];

const SEED_HADITHS = [
  { id: 1, icon: "😊", title: { de: "Lächeln ist Sadaqa", al: "Buzëqeshja është Sadaka", tr: "Gülümsemek Sadakadır" }, source: "Tirmidhi" },
  { id: 2, icon: "🗣️", title: { de: "Gutes Sprechen", al: "Të folurit e mirë", tr: "Güzel Konuşmak" }, source: "Bukhari" },
  { id: 3, icon: "✨", title: { de: "Reinlichkeit", al: "Pastërtia", tr: "Temizlik" }, source: "Muslim" },
  { id: 4, icon: "🐕", title: { de: "Güte zu Tieren", al: "Mëshira ndaj kafshëve", tr: "Hayvanlara Merhamet" }, source: "Bukhari" },
  { id: 5, icon: "🤝", title: { de: "Liebe für andere", al: "Dashuria për të tjerët", tr: "Başkaları için sevmek" }, source: "Muslim" },
  { id: 6, icon: "🚫", title: { de: "Wut kontrollieren", al: "Kontrolli i zemërimit", tr: "Öfkeyi Yenmek" }, source: "Bukhari" },
  { id: 7, icon: "👍", title: { de: "Ehrlichkeit", al: "Ndershmëria", tr: "Dürüstlük" }, source: "Muslim" },
  { id: 8, icon: "🎁", title: { de: "Geschenke machen", al: "Dhuratat", tr: "Hediyeleşmek" }, source: "Bukhari" },
  { id: 9, icon: "🕌", title: { de: "Moschee-Besuch", al: "Vizita në Xhami", tr: "Camiye Gitmek" }, source: "Muslim" },
  { id: 10, icon: "👵", title: { de: "Eltern ehren", al: "Respekti për prindërit", tr: "Anne Babaya Saygı" }, source: "Bukhari" }
];

const SEED_STORIES = [
  { id: 1, icon: "🌙", title: { de: "Prophet Muhammad", al: "Profeti Muhamed", tr: "Hz. Muhammed" } },
  { id: 2, icon: "⛵", title: { de: "Prophet Nuh", al: "Profeti Nuh", tr: "Hz. Nuh" } },
  { id: 3, icon: "🌊", title: { de: "Prophet Musa", al: "Profeti Musa", tr: "Hz. Musa" } },
  { id: 4, icon: "🔥", title: { de: "Prophet Ibrahim", al: "Profeti Ibrahim", tr: "Hz. Ibrahim" } },
  { id: 5, icon: "🐳", title: { de: "Prophet Yunus", al: "Profeti Junus", tr: "Hz. Yunus" } },
  { id: 6, icon: "✨", title: { de: "Die Engel", al: "Engjëjt", tr: "Melekler" } },
  { id: 7, icon: "🕋", title: { de: "Die Kabah", al: "Qabja", tr: "Kabe" } },
  { id: 8, icon: "🎨", title: { de: "Allahs Schöpfung", al: "Krijimi i Allahut", tr: "Allah'ın Yaratışı" } },
  { id: 9, icon: "🐜", title: { de: "Prophet Sulaiman", al: "Profeti Sulejman", tr: "Hz. Süleyman" } },
  { id: 10, icon: "🦁", title: { de: "Der mutige Ali", al: "Aliu i guximshëm", tr: "Cesur Ali" } }
];

const SURA_NAMES = [
  "Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "'Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

function generateData() {
  const topics = [
    { de: "Dankbarkeit", al: "Mirënjohja", tr: "Şükür" },
    { de: "Geduld", al: "Durimi", tr: "Sabır" },
    { de: "Schutz", al: "Mbrojtja", tr: "Korunma" },
    { de: "Familie", al: "Familja", tr: "Aile" },
    { de: "Vergebung", al: "Falja", tr: "Af" },
    { de: "Erfolg", al: "Suksesi", tr: "Başarı" },
    { de: "Frieden", al: "Paqja", tr: "Barış" },
    { de: "Liebe", al: "Dashuria", tr: "Sevgi" }
  ];

  // 1. Duas
  const fullDuas = [...SEED_DUAS];
  for (let i = 11; i <= 150; i++) {
    const topic = topics[i % topics.length];
    fullDuas.push({
      id: i,
      icon: "🤲",
      title: { 
        de: `${topic.de}-Dua ${i}`, 
        al: `Dua ${topic.al} ${i}`, 
        tr: `${topic.tr} Duası ${i}` 
      },
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
      meaning: { 
        de: "Unser Herr, gib uns im Diesseits Gutes", 
        al: "Zoti ynë, na jep të mira në këtë botë", 
        tr: "Rabbimiz bize dünyada iyilik ver" 
      }
    });
  }

  // 2. Hadiths
  const fullHadiths = [...SEED_HADITHS];
  for (let i = 11; i <= 150; i++) {
    const topic = topics[i % topics.length];
    fullHadiths.push({
      id: i,
      icon: "⭐",
      title: { 
        de: `${topic.de}-Weisheit ${i}`, 
        al: `Urtësi ${topic.al} ${i}`, 
        tr: `${topic.tr} Hikmeti ${i}` 
      },
      text: { 
        de: "Handle stets mit einem reinen Herzen.", 
        al: "Vepro gjithmonë me zemër të pastër.", 
        tr: "Daima temiz bir kalple hareket et." 
      },
      explanation: { 
        de: "Allah schaut nicht auf dein Aussehen, sondern auf dein Herz.", 
        al: "Allahu nuk shikon pamjen tënde, por zemrën tënde.", 
        tr: "Allah suretinize değil, kalbinize bakar." 
      },
      source: i % 2 === 0 ? "Bukhari" : "Muslim"
    });
  }

  // 3. Stories
  const fullStories = [...SEED_STORIES];
  for (let i = 11; i <= 150; i++) {
    const topic = topics[i % topics.length];
    fullStories.push({
      id: i,
      icon: "📖",
      title: { 
        de: `${topic.de}-Geschichte ${i}`, 
        al: `Histori ${topic.al} ${i}`, 
        tr: `${topic.tr} Hikayesi ${i}` 
      },
      content: { 
        de: "Es war einmal ein Kind, das lernte, wie wichtig Ehrlichkeit ist...", 
        al: "Ishte njëherë një fëmijë që mësoi se sa e rëndësishme është ndershmëria...", 
        tr: "Bir zamanlar dürüstlüğün ne kadar önemli olduğunu öğrenen bir çocuk varmış..." 
      }
    });
  }

  // 4. Suren (114 canonical)
  const fullSuren = SURA_NAMES.map((name, index) => ({
    id: index + 1,
    icon: "📖",
    title: { 
      de: `Sure ${name}`, 
      al: `Sureja ${name}`, 
      tr: `${name} Suresi` 
    },
    arabic: `سورة ${name}`,
    meaning: { 
      de: `Dies ist die ${index + 1}. Sure des Korans.`, 
      al: `Kjo është surja e ${index + 1} e Kuranit.`, 
      tr: `Bu Kur'an'ın ${index + 1}. suresidir.` 
    }
  }));
  
  for (let i = 115; i <= 150; i++) {
    fullSuren.push({
      id: i,
      icon: "💎",
      title: { de: `Koran-Juwel ${i}`, al: `Xhevahir Kurani ${i}`, tr: `Kur'an İncisi ${i}` },
      arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      meaning: { 
        de: "Mit der Erschwernis kommt die Erleichterung.", 
        al: "Me vështirësinë vjen lehtësimi.", 
        tr: "Zorlukla beraber bir kolaylık vardır." 
      }
    });
  }

  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(path.join(dataDir, 'duas.json'), JSON.stringify(fullDuas, null, 2));
  fs.writeFileSync(path.join(dataDir, 'hadiths.json'), JSON.stringify(fullHadiths, null, 2));
  fs.writeFileSync(path.join(dataDir, 'stories.json'), JSON.stringify(fullStories, null, 2));
  fs.writeFileSync(path.join(dataDir, 'suren.json'), JSON.stringify(fullSuren, null, 2));
  
  console.log("Daten erfolgreich generiert!");
}

generateData();
