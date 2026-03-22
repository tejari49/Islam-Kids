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

export const prayerSteps = [
  { 
    id: 1, 
    image: "🧍", 
    illustration: "/images/prayer/takbir.png",
    title: { de: "Qiyam & Takbir", al: "Kijami & Tekbiri", tr: "Kıyam ve Tekbir" }, 
    arabic: "اللهُ أَكْبَر",
    transliteration: "Allahu Akbar",
    text: { 
      de: "Stehe aufrecht in Richtung Mekka und sage 'Allahu Akbar'. Allah ist der Größte.", 
      al: "Qëndro drejt drejt Mekës dhe thuaj 'Allahu Ekber'. Allahu është më i madhi.", 
      tr: "Mekke'ye doğru dik dur ve 'Allahu Ekber' de. Allah en büyüktür." 
    }
  },
  { 
    id: 2, 
    image: "📖", 
    illustration: "/images/prayer/qiyam.png",
    title: { de: "Al-Fatiha lesen", al: "Leximi i Fatihasë", tr: "Fatiha'yı okumak" }, 
    ayah: "1", // Surah 1 (Al-Fatiha)
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ... الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Bismillaahir Rahmaanir Raheem. Alhamdu lillaahi Rabbil 'aalameen...",
    text: { 
      de: "Lege die Hände auf die Brust und rezitiere die Eröffnungssure des Korans.", 
      al: "Vendos duart në gjoks dhe lexo suren hapëse të Kur'anit.", 
      tr: "Ellerini göğsüne koy ve Kur'an'ın açılış suresini oku." 
    }
  },
  { 
    id: 3, 
    image: "🙇", 
    illustration: "/images/prayer/ruku.png",
    title: { de: "Ruku (Verbeugung)", al: "Rukuja (Përkulja)", tr: "Rüku (Eğilmek)" }, 
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيم",
    transliteration: "Subhana Rabbiyal Azim (3x)",
    text: { 
      de: "Verbeuge dich und preise Allah: 'Gepriesen sei mein Herr, der Gewaltige'.", 
      al: "Përkulu dhe lëvdo Allahun: 'I lavdëruar qoftë Zoti im, i Madhërishmi'.", 
      tr: "Eğil ve Allah'ı tesbih et: 'Yüce Rabbim noksan sıfatlardan uzaktır'." 
    }
  },
  { 
    id: 4, 
    image: "🧍", 
    illustration: "/images/prayer/qiyam.png",
    title: { de: "Wieder aufstehen", al: "Ngritja përsëri", tr: "Tekrar doğrulmak" }, 
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَه",
    transliteration: "Sami 'Allahu liman hamidah",
    text: { 
      de: "Stehe wieder auf und sage: 'Allah hört den, der Ihn lobt'.", 
      al: "Ngrihu përsëri dhe thuaj: 'Allahu e dëgjon atë që e lavdëron'.", 
      tr: "Tekrar doğrul ve 'Allah kendisine hamd edeni işitir' de." 
    }
  },
  { 
    id: 5, 
    image: "🧎", 
    illustration: "/images/prayer/sujud.png",
    title: { de: "Sujud (Niederwerfung)", al: "Sexhdeja (Përulja)", tr: "Secde (Yere kapanmak)" }, 
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    transliteration: "Subhana Rabbiyal A'la (3x)",
    text: { 
      de: "Gehe in die Niederwerfung und sage: 'Gepriesen sei mein Herr, der Höchste'.", 
      al: "Shko në sexhde dhe thuaj: 'I lavdëruar qoftë Zoti im, i Larti'.", 
      tr: "Secdeye git ve 'En yüce olan Rabbim noksan sıfatlardan uzaktır' de." 
    }
  },
  { 
    id: 6, 
    image: "🧎‍♂️", 
    illustration: "/images/prayer/sitting.png",
    title: { de: "Sitzen (At-tahiyyat)", al: "Ulja (Ettehijatu)", tr: "Oturmak (Ettehiyyatü)" }, 
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَات...",
    transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat...",
    text: { 
      de: "Setze dich aufrecht hin, bezeuge deinen Glauben und beende das Gebet mit dem Friedensgruß.", 
      al: "Ulu drejt, dëshmo besimin tënd dhe përfundo namazin me selamin e paqes.", 
      tr: "Otur, kelime-i şehadet getir ve namazı selam vererek bitir." 
    }
  }
];
