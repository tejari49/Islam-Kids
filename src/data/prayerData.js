export const wuduSteps = [
  { id: 1, image: "💭", title: { de: "Niyyah (Absicht)", al: "Nijeti (Qëllimi)", tr: "Niyet" }, text: { de: "Fasse die Absicht im Herzen und sage 'Bismillah' (Im Namen Allahs).", al: "Bëj nijetin në zemër dhe thuaj 'Bismilah' (Me emrin e Allahut).", tr: "Kalbinden niyet et ve 'Bismillah' (Allah'ın adıyla) de." } },
  { id: 2, image: "🤲", title: { de: "Hände waschen", al: "Larja e duarve", tr: "Elleri yıkamak" }, text: { de: "Wasche deine Hände drei Mal bis zu den Handgelenken. Vergiss nicht zwischen den Fingern!", al: "Laji duart tri herë deri në kyçe. Mos harro mes gishtave!", tr: "Ellerini bileklerine kadar üç kez yıka. Parmak aralarını unutma!" } },
  { id: 3, image: "👄", title: { de: "Mund ausspülen", al: "Shpëlarja e gojës", tr: "Ağzı çalkalamak" }, text: { de: "Nimm Wasser mit der rechten Hand, spüle deinen Mund drei Mal aus.", al: "Merr ujë me dorën e djathtë, shpëlaje gojën tri herë.", tr: "Sağ elinle su alarak ağzını üç kez çalkala." } },
  { id: 4, image: "👃", title: { de: "Nase ausspülen", al: "Shpëlarja e hundës", tr: "Burnu temizlemek" }, text: { de: "Ziehe drei Mal Wasser in die Nase und schnäuze es mit der linken Hand wieder aus.", al: "Thith ujë në hundë tri herë dhe fryje jashtë me dorën e majtë.", tr: "Burnuna üç kez su çek ve sol elinle sümkürerek temizle." } },
  { id: 5, image: "🙂", title: { de: "Gesicht waschen", al: "Larja e fytyrës", tr: "Yüzü yıkamak" }, text: { de: "Wasche dein ganzes Gesicht drei Mal. Von der Stirn bis zum Kinn.", al: "Laje të gjithë fytyrën tri herë. Nga balli deri te mjekra.", tr: "Tüm yüzünü üç kez yıka. Alnından çenene kadar." } },
  { id: 6, image: "💪", title: { de: "Arme waschen", al: "Larja e krahëve", tr: "Kolları yıkamak" }, text: { de: "Wasche deinen rechten Arm drei Mal bis über den Ellbogen. Danach den linken Arm drei Mal.", al: "Laje krahun e djathtë tri herë deri mbi bërryl. Më pas krahun e majtë tri herë.", tr: "Sağ kolunu dirseklerinle birlikte üç kez yıka. Sonra sol kolunu üç kez yıka." } },
  { id: 7, image: "💆", title: { de: "Kopf & Ohren streichen", al: "Fërkimi i kokës dhe veshëve", tr: "Baş ve kulakları mesh etmek" }, text: { de: "Streiche mit nassen Händen einmal über deinen ganzen Kopf und reinige danach deine Ohren.", al: "Kalo duart e lagura një herë mbi gjithë kokën dhe më pas pastro veshët.", tr: "Islak ellerinle başını bir kez mesh et ve ardından kulaklarını temizle." } },
  { id: 8, image: "🦶", title: { de: "Füße waschen", al: "Larja e këmbëve", tr: "Ayakları yıkamak" }, text: { de: "Wasche deinen rechten Fuß drei Mal bis über die Knöchel. Vergiss nicht zwischen den Zehen! Danach den linken Fuß drei Mal.", al: "Laje këmbën e djathtë tri herë deri mbi kyçe. Mos harro mes gishtave të këmbës! Më pas këmbën e majtë tri herë.", tr: "Sağ ayağını topuklarla birlikte üç kez yıka. Ayak parmaklarının arasını unutma! Sonra sol ayağını üç kez yıka." } }
];

export const prayers = [
  { id: 'fajr', name: { de: "Fajr (Morgen)", al: "Sabahu (Mëngjes)", tr: "Sabah Namazı" }, rakats: 2, icon: "🌅" },
  { id: 'dhuhr', name: { de: "Dhuhr (Mittag)", al: "Dreka (Mesditë)", tr: "Öğle Namazı" }, rakats: 4, icon: "☀️" },
  { id: 'asr', name: { de: "Asr (Nachmittag)", al: "Ikindia (Pasdite)", tr: "İkindi Namazı" }, rakats: 4, icon: "🌤️" },
  { id: 'maghrib', name: { de: "Maghrib (Abend)", al: "Akshami (Mbrëmje)", tr: "Akşam Namazı" }, rakats: 3, icon: "🌇" },
  { id: 'isha', name: { de: "Isha (Nacht)", al: "Jacia (Natë)", tr: "Yatsı Namazı" }, rakats: 4, icon: "🌌" }
];

const withBase = (path) => `${import.meta.env.BASE_URL}${path}`.replace(/(?<!:)\/\/+/g, '/');

const illustrationSet = (name) => ({
  boy: withBase(`images/prayer/boy/${name}.png`),
  girl: withBase(`images/prayer/girl/${name}.png`)
});

export const prayerSteps = [
  {
    id: 1,
    image: "🙌",
    illustrations: illustrationSet('takbir'),
    title: { de: 'Takbir al-Ihram', al: 'Tekbiri fillestar', tr: 'İftitah Tekbiri' },
    arabic: 'اللّٰهُ أَكْبَر',
    transliteration: 'Allahu Akbar',
    text: {
      de: 'Starte das Gebet im Stehen und hebe beide Hände zum Takbir.',
      al: 'Fillo namazin në këmbë dhe ngriji të dy duart për tekbir.',
      tr: 'Namaza ayakta başla ve tekbir için iki elini kaldır.'
    },
    poseNotes: {
      de: ['Füße parallel und etwa schulterbreit.', 'Hände bis zu Ohren oder Schultern anheben.', 'Finger locker zusammen, Handflächen nach vorne.', 'Blick ruhig nach unten zum Gebetsplatz.'],
      al: ['Këmbët paralel dhe afërsisht sa gjerësia e shpatullave.', 'Duart ngrihen deri te veshët ose shpatullat.', 'Gishtat butë bashkë, pëllëmbët përpara.', 'Shikimi i qetë poshtë në vendin e sexhdes.'],
      tr: ['Ayaklar paralel ve yaklaşık omuz genişliğinde.', 'Eller kulaklara veya omuzlara kadar kaldırılır.', 'Parmaklar rahatça bitişik, avuç içleri öne bakar.', 'Bakış secde yerine doğru sakindir.']
    }
  },
  {
    id: 2,
    image: '📖',
    illustrations: illustrationSet('qiyam'),
    title: { de: 'Qiyam und Al-Fatiha', al: 'Kijami dhe El-Fatiha', tr: 'Kıyam ve Fatiha' },
    audioAyahs: ['1:1', '1:2', '1:3', '1:4', '1:5', '1:6', '1:7'],
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ... الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Bismillaahir Rahmaanir Raheem ... Alhamdu lillaahi Rabbil aalameen',
    text: {
      de: 'Stehe ruhig und rezitiere Al-Fatiha in der stehenden Haltung.',
      al: 'Qëndro i qetë dhe lexo El-Fatihanë në këmbë.',
      tr: 'Sakin şekilde ayakta dur ve kıyamda Fatiha’yı oku.'
    },
    poseNotes: {
      de: ['Rechte Hand liegt über der linken auf Brust oder Oberbauch.', 'Schultern entspannt, Rücken gerade.', 'Füße bleiben ruhig auf dem Boden.', 'Blick bleibt auf den Platz der Niederwerfung gerichtet.'],
      al: ['Dora e djathtë mbi të majtën në gjoks ose sipër barkut.', 'Shpatullat të qeta, shpina drejt.', 'Këmbët qëndrojnë të palëvizshme në tokë.', 'Shikimi mbetet te vendi i sexhdes.'],
      tr: ['Sağ el sol elin üzerine göğüste veya üst karında durur.', 'Omuzlar rahat, sırt düzdür.', 'Ayaklar yerde sakin kalır.', 'Bakış secde yerine yönelir.']
    }
  },
  {
    id: 3,
    image: '🙇',
    illustrations: illustrationSet('ruku'),
    title: { de: 'Ruku', al: 'Rukuja', tr: 'Rükû' },
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيم',
    transliteration: 'Subhana Rabbiyal Azim',
    text: {
      de: 'Beuge dich in den Ruku und preise Allah.',
      al: 'Përkulu në ruku dhe lartëso Allahun.',
      tr: 'Rükûya eğil ve Allah’ı tesbih et.'
    },
    poseNotes: {
      de: ['Rücken möglichst gerade und nahezu waagrecht.', 'Hände fest auf die Knie, Finger leicht gespreizt.', 'Kopf in einer Linie mit dem Rücken.', 'Beine stabil, Blick schräg nach unten.'],
      al: ['Shpina sa më drejt dhe pothuajse horizontale.', 'Duart fort mbi gjunjë, gishtat pak të hapur.', 'Koka në një vijë me shpinën.', 'Këmbët të qëndrueshme, shikimi pjerrtas poshtë.'],
      tr: ['Sırt mümkün olduğunca düz ve neredeyse yatay.', 'Eller dizlere yerleşir, parmaklar hafif açık.', 'Baş sırtla aynı hizada olur.', 'Bacaklar sabit, bakış çapraz aşağıdadır.']
    }
  },
  {
    id: 4,
    image: '🧍',
    illustrations: illustrationSet('qawmah'),
    title: { de: 'Qawmah', al: 'Kthimi në këmbë', tr: 'Kavme' },
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
    transliteration: 'Sami Allahu liman hamidah',
    text: {
      de: 'Richte dich vollständig auf und lobe Allah nach dem Ruku.',
      al: 'Drejtohu plotësisht dhe lëvdo Allahun pas rukusë.',
      tr: 'Rükûdan sonra tamamen doğrul ve Allah’a hamd et.'
    },
    poseNotes: {
      de: ['Wieder ganz gerade stehen.', 'Arme locker an den Seiten.', 'Brust geöffnet, Schultern ruhig.', 'Blick wieder zum Niederwerfungsplatz senken.'],
      al: ['Qëndro sërish plotësisht drejt.', 'Krahët lirshëm anash.', 'Gjoksi i hapur, shpatullat të qeta.', 'Shikimi sërish poshtë në vendin e sexhdes.'],
      tr: ['Tekrar tamamen dik dur.', 'Kollar yanlarda rahat dursun.', 'Göğüs açık, omuzlar sakin.', 'Bakış yine secde yerine insin.']
    }
  },
  {
    id: 5,
    image: '🛐',
    illustrations: illustrationSet('sujud-first'),
    title: { de: 'Erste Sujud', al: 'Sexhdja e parë', tr: 'Birinci Secde' },
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    transliteration: "Subhana Rabbiyal A'la",
    text: {
      de: 'Gehe in die Niederwerfung und preise deinen höchsten Herrn.',
      al: 'Shko në sexhde dhe lartëso Zotin tënd më të Lartin.',
      tr: 'Secdeye git ve en yüce Rabbini tesbih et.'
    },
    poseNotes: {
      de: ['Stirn und Nase liegen auf dem Boden.', 'Beide Hände flach neben dem Kopf.', 'Ellbogen bleiben angehoben und nicht breit am Boden.', 'Zehen sind aufgestellt und zeigen zur Qibla.'],
      al: ['Balli dhe hunda prekin tokën.', 'Të dy duart shtrirë pranë kokës.', 'Bërrylat të ngritur dhe jo të hapur në tokë.', 'Gishtat e këmbëve të mbështetur dhe drejt Kibles.'],
      tr: ['Alın ve burun yere değsin.', 'İki el başın yanında düz dursun.', 'Dirsekler yerde yayılmadan kalkık kalsın.', 'Ayak parmakları kıbleye dönük olsun.']
    }
  },
  {
    id: 6,
    image: '🧎',
    illustrations: illustrationSet('jalsa'),
    title: { de: 'Sitzen zwischen den Sujud', al: 'Ulja mes dy sexhdeve', tr: 'İki secde arası oturuş' },
    arabic: 'رَبِّ اغْفِرْ لِي',
    transliteration: 'Rabbighfir li',
    text: {
      de: 'Setze dich kurz aufrecht zwischen den beiden Niederwerfungen.',
      al: 'Ulu shkurt drejt mes dy sexhdeve.',
      tr: 'İki secde arasında kısa ve dik otur.'
    },
    poseNotes: {
      de: ['Oberkörper aufrecht.', 'Hände entspannt auf die Oberschenkel.', 'Gewicht ruhig im Sitzen, Füße geordnet.', 'Blick nach unten, ohne zu spielen oder zu wackeln.'],
      al: ['Pjesa e sipërme e trupit drejt.', 'Duart qetë mbi kofshë.', 'Pesha e qetë në ulje, këmbët të rregulluara.', 'Shikimi poshtë pa luajtur apo lëkundur trupin.'],
      tr: ['Üst beden dik olsun.', 'Eller rahatça uylukların üstünde dursun.', 'Otururken denge sakin, ayaklar düzenli.', 'Bakış aşağıda, oynama veya sallanma yok.']
    }
  },
  {
    id: 7,
    image: '🛐',
    illustrations: illustrationSet('sujud-second'),
    title: { de: 'Zweite Sujud', al: 'Sexhdja e dytë', tr: 'İkinci Secde' },
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    transliteration: "Subhana Rabbiyal A'la",
    text: {
      de: 'Mache die zweite Niederwerfung genauso ruhig und sauber.',
      al: 'Bëje sexhden e dytë po aq qetë dhe saktë.',
      tr: 'İkinci secdeyi de aynı sakinlik ve düzgünlükle yap.'
    },
    poseNotes: {
      de: ['Wieder mit Stirn und Nase auf den Boden.', 'Handflächen bleiben neben dem Kopf.', 'Zehen sind aufgestellt und nach vorne gerichtet.', 'Bleibe für den Dhikr einen Moment ruhig.'],
      al: ['Sërish me ballin dhe hundën në tokë.', 'Pëllëmbët mbeten pranë kokës.', 'Gishtat e këmbëve të mbështetur dhe përpara.', 'Qëndro pak i qetë për dhikrin.'],
      tr: ['Yine alın ve burun yere gelir.', 'Avuç içleri başın yanında kalır.', 'Ayak parmakları dik ve öne dönük olur.', 'Tesbih için kısa bir an sakin kal.']
    }
  },
  {
    id: 8,
    image: '🪑',
    illustrations: illustrationSet('tashahhud'),
    title: { de: 'Tashahhud', al: 'Ettehijatu', tr: 'Tahiyyat' },
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
    transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat',
    text: {
      de: 'Sitze für At-Tahiyyat und sprich das Bekenntnis des Gebets.',
      al: 'Ulu për Ettehijatin dhe thuaj dëshminë e namazit.',
      tr: 'Tahiyyat için otur ve namazdaki şehadeti oku.'
    },
    poseNotes: {
      de: ['Sitze aufrecht und ruhig.', 'Hände liegen auf den Oberschenkeln.', 'Rechter Zeigefinger kann beim Tashahhud erhoben werden.', 'Blick bleibt nach vorne unten gerichtet.'],
      al: ['Ulu drejt dhe qetë.', 'Duart mbi kofshë.', 'Gishti tregues i djathtë mund të ngrihet në Ettehijat.', 'Shikimi mbetet përpara-poshtë.'],
      tr: ['Dik ve sakin otur.', 'Eller uylukların üstünde dursun.', 'Tahiyyatta sağ işaret parmağı kaldırılabilir.', 'Bakış öne ve aşağıya yönelir.']
    }
  },
  {
    id: 9,
    image: '👋',
    illustrations: illustrationSet('salam'),
    title: { de: 'Salam', al: 'Selami', tr: 'Selam' },
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    transliteration: 'As-salamu alaikum wa rahmatullah',
    text: {
      de: 'Beende das Gebet mit dem Friedensgruß nach rechts und links.',
      al: 'Përfundo namazin me selam djathtas dhe majtas.',
      tr: 'Namazı sağa ve sola selam vererek bitir.'
    },
    poseNotes: {
      de: ['Bleibe im Sitzen stabil.', 'Drehe den Kopf sanft zur Seite.', 'Schultern bleiben tief und entspannt.', 'Beende ruhig und ohne Hast.'],
      al: ['Qëndro i qëndrueshëm në ulje.', 'Ktheje kokën butë anash.', 'Shpatullat mbeten poshtë dhe të qeta.', 'Përfundo qetë pa nxitim.'],
      tr: ['Oturuşta dengeli kal.', 'Başını yumuşakça yana çevir.', 'Omuzlar aşağıda ve rahat kalsın.', 'Namazı acele etmeden tamamla.']
    }
  }
];
