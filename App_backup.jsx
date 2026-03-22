import React, { useState, useRef, useEffect } from 'react';
import { Home, BookOpen, ChevronLeft, Heart, Star, Moon, Library, Sparkles, Play, Pause, Loader2, MessageCircle } from 'lucide-react';

// --- DATEN: DUAS ---
const duas = [
  {
    id: 1,
    icon: "🍽️",
    title: { de: "Vor dem Essen", al: "Para ushqimit", tr: "Yemekten önce" },
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    transliteration: "Bismillah ir-Rahman ir-Rahim",
    meaning: {
      de: "Im Namen Allahs, des Allerbarmers, des Barmherzigen.",
      al: "Me emrin e Allahut, Mëshiruesit, Mëshirëbërësit.",
      tr: "Rahman ve Rahim olan Allah'ın adıyla."
    },
    ayah: "1:1"
  },
  {
    id: 2,
    icon: "🤲",
    title: { de: "Nach dem Essen", al: "Pas ushqimit", tr: "Yemekten sonra" },
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Alhamdulillahi rabbil 'alamin",
    meaning: {
      de: "Alles Lob gebührt Allah, dem Herrn der Welten.",
      al: "Falënderimi i takon Allahut, Zotit të botëve.",
      tr: "Hamd, âlemlerin Rabbi Allah'a mahsustur."
    },
    ayah: "1:2"
  },
  {
    id: 3,
    icon: "😴",
    title: { de: "Vor dem Schlafen", al: "Para gjumit", tr: "Uyumadan önce" },
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    transliteration: "Qul huwallahu ahad",
    meaning: {
      de: "Sprich: Er ist Allah, ein Einziger.",
      al: "Thuaj: Ai, Allahu është Një!",
      tr: "De ki: O, Allah'tır, tektir."
    },
    ayah: "112:1" 
  },
  {
    id: 4,
    icon: "☀️",
    title: { de: "Beim Aufwachen", al: "Zgjimi nga gjumi", tr: "Uyanırken" },
    arabic: "وَرَبَّكَ فَكَبِّرْ",
    transliteration: "Wa rabbaka fakabbir",
    meaning: {
      de: "Und deinen Herrn, Den preise als den Größten.",
      al: "Dhe Zotin tënd madhëroje!",
      tr: "Sadece Rabbini yücelt."
    },
    ayah: "74:3"
  },
  {
    id: 5,
    icon: "🤧",
    title: { de: "Beim Niesen", al: "Kur teshtin", tr: "Hapşırınca" },
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Alhamdulillahi rabbil 'alamin",
    meaning: {
      de: "Alles Lob gebührt Allah, dem Herrn der Welten.",
      al: "Falënderimi i takon Allahut, Zotit të botëve.",
      tr: "Hamd, âlemlerin Rabbi Allah'a mahsustur."
    },
    ayah: "1:2"
  },
  {
    id: 6,
    icon: "🚪",
    title: { de: "Verlassen des Hauses", al: "Dalja nga shtëpia", tr: "Evden çıkarken" },
    arabic: "إِنِّي تَوَكَّلْتُ عَلَى اللَّهِ رَبِّي وَرَبِّكُم ۚ مَّا مِن دَابَّةٍ إِلَّا هُوَ آخِذٌ بِنَاصِيَتِهَا ۚ إِنَّ رَبِّي عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
    transliteration: "Inni tawakkaltu 'alallahi rabbi wa rabbikum, ma min dabbatin illa huwa akhidhun binasiyatiha, inna rabbi 'ala siratin mustaqim.",
    meaning: {
      de: "Ich verlasse mich auf Allah, meinen und euren Herrn. Es gibt kein Lebewesen, das Er nicht an seinem Schopf fasst. Gewiss, mein Herr ist auf einem geraden Weg.",
      al: "Unë mbështetem tek Allahu, Zoti im dhe Zoti juaj. Nuk ka asnjë gjallesë që Ai të mos e mbajë prej balli. Vërtet, Zoti im është në rrugë të drejtë.",
      tr: "Ben, benim de Rabbim, sizin de Rabbiniz olan Allah'a dayandım. Hiçbir canlı yoktur ki, O onun perçeminden tutmuş olmasın. Şüphesiz Rabbim dosdoğru bir yoldadır."
    },
    ayah: "11:56"
  },
  {
    id: 7,
    icon: "🚗",
    title: { de: "Reise / Im Auto", al: "Gjatë udhëtimit", tr: "Araca binerken" },
    arabic: "لِتَسْتَوُوا عَلَىٰ ظُهُورِهِ ثُمَّ تَذْكُرُوا نِعْمَةَ رَبِّكُمْ إِذَا اسْتَوَيْتُمْ عَلَيْهِ وَتَقُولُوا سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    transliteration: "Litastawu 'ala dhuhoorihi thumma tadhkuru ni'mata rabbikum idhastawaytum 'alayhi wa taqoolu subhanalladhi sakh-khara lana hadha wa ma kunna lahu muqrinin.",
    meaning: {
      de: "Damit ihr auf ihren Rücken Platz nehmt und [...] sagt: Preis sei Dem, Der uns dies dienstbar gemacht hat, und wir hätten es nicht bezwingen können.",
      al: "Që të uleni në shpinën e tyre dhe [...] të thoni: I lavdëruar qoftë Ai që na e nënshtroi këtë, se ne nuk do të mund ta mposhtnim.",
      tr: "Onların sırtlarına binmeniz ve [...] şöyle demeniz için: Bunu bizim hizmetimize veren Allah'ı tenzih ederiz, yoksa biz buna güç yetiremezdik."
    },
    ayah: "43:13"
  },
  {
    id: 8,
    icon: "🚽",
    title: { de: "Schutz suchen", al: "Kërkimi i mbrojtjes", tr: "Allah'a sığınmak" },
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    transliteration: "Qul a'udhu birabbil falaq",
    meaning: {
      de: "Sprich: Ich nehme Zuflucht beim Herrn des Tagesanbruchs.",
      al: "Thuaj: Kërkoj mbrojtje te Zoti i agimit.",
      tr: "De ki: Sabahın Rabbine sığınırım."
    },
    ayah: "113:1"
  },
  {
    id: 9,
    icon: "❤️",
    title: { de: "Für die Eltern", al: "Për prindërit", tr: "Anne baba için" },
    arabic: "وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ مِنَ الرَّحْمَةِ وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Wakhfid lahuma janahadh-dhulli minar-rahmati wa qur-rabbirhamhuma kama rabbayani saghira.",
    meaning: {
      de: "Und senke für sie aus Barmherzigkeit den Flügel der Demut und sag: Mein Herr, erbarme Dich ihrer, wie sie mich aufgezogen haben, als ich klein war.",
      al: "Dhe lësho para tyre krahët e përuljes nga mëshira dhe thuaj: Zoti im, ki mëshirë për ta, ashtu siç u kujdesën për mua kur isha i vogël.",
      tr: "Onlara merhamet ederek tevazu kanadını indir ve de ki: Rabbim, küçüklüğümde beni yetiştirdikleri gibi sen de onlara merhamet et."
    },
    ayah: "17:24"
  },
  {
    id: 10,
    icon: "💧",
    title: { de: "Nach der Gebetswaschung", al: "Pas abdesit", tr: "Abdestten sonra" },
    arabic: "وَثِيَابَكَ فَطَهِّرْ",
    transliteration: "Wa thiyabaka fatahhir",
    meaning: {
      de: "Und deine Kleidung, die reinige.",
      al: "Dhe rrobat tua pastroji!",
      tr: "Elbiseni tertemiz tut."
    },
    ayah: "74:4"
  },
  {
    id: 11,
    icon: "📚",
    title: { de: "Für mehr Wissen", al: "Për më shumë dituri", tr: "İlim artırmak için" },
    arabic: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ ۗ وَلَا تَعْجَلْ بِالْقُرْآنِ مِن قَبْلِ أَن يُقْضَىٰ إِلَيْكَ وَحْيُهُ ۖ وَقُل رَّبِّ زِدْنِي عِلْمًا",
    transliteration: "Fata'alallahul malikul haqqu wa la ta'jal bilqur'ani min qabli an yuqda ilayka wahyuhu wa qur-rabbi zidni 'ilma.",
    meaning: {
      de: "Erhaben ist Allah, der wahre König. Und übereile dich nicht mit dem Koran... und sag: Mein Herr, mehre mein Wissen.",
      al: "I lartësuar është Allahu, Mbreti i Vërtetë. Dhe mos nxito me Kuranin... dhe thuaj: Zoti im, më shto diturinë!",
      tr: "Gerçek hükümdar olan Allah yücedir. Kur'an sana vahyedilmeden önce acele etme... ve de ki: Rabbim, ilmimi artır."
    },
    ayah: "20:114"
  },
  {
    id: 12,
    icon: "🎤",
    title: { de: "Für Mut & Sprechen", al: "Për guxim dhe të folur", tr: "Cesaret ve konuşmak" },
    arabic: "قَالَ رَبِّ اشْرَحْ لِي صَدْرِي",
    transliteration: "Qala rabbishrah li sadri.",
    meaning: {
      de: "Er sagte: Mein Herr, weite mir meine Brust.",
      al: "Ai tha: Zoti im, ma zgjero gjoksin tim.",
      tr: "O dedi ki: Rabbim, göğsümü genişlet."
    },
    ayah: "20:25"
  },
  {
    id: 13,
    icon: "🌍",
    title: { de: "Das Gute im Leben", al: "Të mirat në jetë", tr: "Dünya ve Ahiret iyiliği" },
    arabic: "وَمِنْهُم مَّن يَقُولُ رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Wa minhum may-yaqulu rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
    meaning: {
      de: "Unter ihnen gibt es manche, die sagen: Unser Herr, gib uns im Diesseits Gutes und im Jenseits Gutes und bewahre uns vor der Strafe des Feuers.",
      al: "Dhe prej tyre ka që thonë: Zoti ynë, na jep të mira në këtë botë dhe të mira në botën tjetër, dhe na ruaj nga dënimi i zjarrit.",
      tr: "Onlardan kimi de der ki: Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru."
    },
    ayah: "2:201"
  },
  {
    id: 14,
    icon: "🌧️",
    title: { de: "Bei Traurigkeit", al: "Në raste mërzie", tr: "Üzüntü anında" },
    arabic: "وَذَا النُّونِ إِذ ذَّهَبَ مُغَاضِبًا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ فَنَادَىٰ فِي الظُّلُمَاتِ أَن لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    transliteration: "Wa dhan-nuni idh-dhahaba mughadiban fadhanna an lan naqdira 'alayhi fanada fidh-dhulumati an la ilaha illa anta subhanaka inni kuntu minadh-dhalimin.",
    meaning: {
      de: "Und (gedenke) Yunus, als er erzürnt wegging und meinte, Wir hätten keine Macht über ihn. Da rief er in der Finsternis: Es gibt keinen Gott außer Dir. Preis sei Dir! Ich gehörte wahrlich zu den Ungerechten.",
      al: "Kujto Junusin, kur iku i zemëruar dhe mendoi se nuk do ta dënonim. Atëherë ai thirri në errësirë: Nuk ka zot tjetër përveç Teje! I lavdëruar qofsh! Unë me të vërtetë isha i padrejtë.",
      tr: "Yunus'u da hatırla. Hani o öfkelenerek gitmişti de bizim kendisini sıkıştırmayacağımızı sanmıştı. Sonra karanlıklar içinde: Senden başka ilah yoktur. Seni tenzih ederim. Ben gerçekten zalimlerden oldum, diye seslenmişti."
    },
    ayah: "21:87"
  },
  {
    id: 15,
    icon: "⏳",
    title: { de: "Für mehr Geduld", al: "Për më shumë durim", tr: "Daha fazla sabır için" },
    arabic: "وَلَمَّا بَرَزُوا لِجَالُوتَ وَجُنُودِهِ قَالُوا رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliteration: "Wa lamma barazu lijaluta wa junudihi qalu rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal qawmil kafirin.",
    meaning: {
      de: "Und als sie gegen Jalut und seine Truppen antraten, sagten sie: Unser Herr, übergieße uns mit Geduld, festige unsere Füße und verhilf uns zum Sieg über das ungläubige Volk.",
      al: "Dhe kur dolën përballë Xhalutit dhe ushtrisë së tij, ata thanë: Zoti ynë, na dhuro durim, na i forco këmbët tona dhe na ndihmo kundër popullit mosbesimtar.",
      tr: "Calut ve ordusuna karşı meydana çıktıklarında dediler ki: Rabbimiz! Üzerimize sabır yağdır, ayaklarımızı sağlamlaştır ve kafir kavme karşı bize yardım et."
    },
    ayah: "2:250"
  },
  {
    id: 16,
    icon: "🧍",
    title: { de: "Zu Beginn des Gebets", al: "Në fillim të namazit", tr: "Namaza başlarken" },
    arabic: "إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا ۖ وَمَا أَنَا مِنَ الْمُشْرِكِينَ",
    transliteration: "Inni wajjahtu wajhiya lilladhi fataras samawati wal arda hanifan wa ma ana minal mushrikin.",
    meaning: {
      de: "Ich richte mein Gesicht aufrichtig zu Dem, Der die Himmel und die Erde erschaffen hat...",
      al: "Unë e kam drejtuar fytyrën time nga Ai që ka krijuar qiejt dhe tokën...",
      tr: "Ben yüzümü tamamen, gökleri ve yeri yoktan var edene çevirdim..."
    },
    ayah: "6:79"
  },
  {
    id: 17,
    icon: "🔽",
    title: { de: "In der Verbeugung (Ruku)", al: "Në përkulje (Ruku)", tr: "Rükuda (Eğilirken)" },
    arabic: "فَسَبِّحْ بِاسْمِ رَبِّكَ الْعَظِيمِ",
    transliteration: "Fasabbih bismi rabbikal 'azim.",
    meaning: {
      de: "Darum preise den Namen deines allmächtigen Herrn.",
      al: "Prandaj lavdëroje emrin e Zotit tënd të Madhërishëm.",
      tr: "Öyleyse ulu Rabbinin adını tesbih et."
    },
    ayah: "56:74"
  },
  {
    id: 18,
    icon: "🛐",
    title: { de: "In der Niederwerfung (Sajdah)", al: "Në sexhde", tr: "Secdede" },
    arabic: "سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى",
    transliteration: "Sabbihisma rabbikal a'la.",
    meaning: {
      de: "Preise den Namen deines höchsten Herrn.",
      al: "Lavdëroje emrin e Zotit tënd, Më të Lartit.",
      tr: "Yüce Rabbinin adını tesbih et."
    },
    ayah: "87:1"
  },
  {
    id: 19,
    icon: "🧎",
    title: { de: "Im Gebet (Vergebung)", al: "Në namaz (Falje)", tr: "Namazda (Bağışlanma)" },
    arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    transliteration: "Rabbana ghfir li wa liwalidayya wa lilmu'minina yawma yaqumul hisab.",
    meaning: {
      de: "Unser Herr, vergib mir und meinen Eltern und den Gläubigen an dem Tag, an dem die Abrechnung stattfindet.",
      al: "Zoti ynë, më fal mua, prindërit e mi dhe besimtarët në ditën kur do të jepet llogaria.",
      tr: "Rabbimiz! Hesap kurulacağı gün beni, anamı, babamı ve müminleri bağışla."
    },
    ayah: "14:41"
  },
  {
    id: 20,
    icon: "🕊️",
    title: { de: "Am Ende des Gebets (Selam)", al: "Në fund të namazit (Selam)", tr: "Namazı bitirirken (Selam)" },
    arabic: "سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ",
    transliteration: "Salamun qawlam mir rabbir rahim.",
    meaning: {
      de: "'Frieden', als Wort von einem barmherzigen Herrn.",
      al: "'Paqe' - fjalë nga një Zot Mëshirëplotë.",
      tr: "Çok merhametli olan Rab'den onlara sözlü olarak 'Selam' vardır."
    },
    ayah: "36:58"
  }
];

// --- DATEN: HADITHE ---
const hadiths = [
  {
    id: 1,
    icon: "😊",
    title: { de: "Lächeln ist Sadaqah", al: "Buzëqeshja është Sadaka", tr: "Gülümsemek Sadakadır" },
    text: {
      de: "Ein Lächeln im Gesicht deines Mitmenschen ist wie eine Spende (Sadaqah).",
      al: "Të buzëqeshësh në fytyrën e vëllait tënd është lëmoshë (Sadaka).",
      tr: "Kardeşinin yüzüne gülümsemen senin için bir sadakadır."
    },
    explanation: {
      de: "Schon ein einfaches Lächeln wird von Allah belohnt, weil es andere glücklich macht! Es kostet nichts, bringt aber viel Freude.",
      al: "Edhe një buzëqeshje e thjeshtë shpërblehet nga Allahu, sepse i bën të tjerët të lumtur! Nuk kushton asgjë, por sjell shumë gëzim.",
      tr: "Basit bir gülümseme bile başkalarını mutlu ettiği için Allah tarafından ödüllendirilir! Hiçbir maliyeti yoktur ama çok neşe getirir."
    },
    source: "Tirmidhi"
  },
  {
    id: 2,
    icon: "🗣️",
    title: { de: "Gutes Sprechen", al: "Të folurit e mirë", tr: "Güzel Konuşmak" },
    text: {
      de: "Wer an Allah und den Jüngsten Tag glaubt, soll Gutes sprechen oder schweigen.",
      al: "Kush beson në Allahun dhe Ditën e Gjykimit, le të flasë mirë ose le të heshtë.",
      tr: "Allah'a ve ahiret gününe inanan ya hayır söylesin ya da sussun."
    },
    explanation: {
      de: "Worte können manchmal wehtun. Als Muslime sagen wir schöne, nette Dinge zu anderen. Wenn wir nichts Nettes zu sagen haben, ist es besser, leise zu sein.",
      al: "Fjalët ndonjëherë mund të lëndojnë. Si muslimanë, ne u themi gjëra të bukura dhe të këndshme të tjerëve. Nëse nuk kemi asgjë të bukur për të thënë, është më mirë të heshtim.",
      tr: "Kelimeler bazen incitebilir. Müslümanlar olarak başkalarına güzel, nazik şeyler söyleriz. Söyleyecek güzel bir şeyimiz yoksa sessiz kalmak daha iyidir."
    },
    source: "Bukhari & Muslim"
  },
  {
    id: 3,
    icon: "✨",
    title: { de: "Reinlichkeit", al: "Pastërtia", tr: "Temizlik" },
    text: {
      de: "Reinlichkeit ist die halbe Religion.",
      al: "Pastërtia është gjysma e besimit.",
      tr: "Temizlik imanın yarısıdır."
    },
    explanation: {
      de: "Allah liebt es, wenn wir sauber sind! Das bedeutet, dass wir uns waschen (Wudu), unsere Zähne putzen und auch unser Zimmer und unsere Umwelt ordentlich halten.",
      al: "Allahu e do kur ne jemi të pastër! Kjo do të thotë që ne lahemi (marrim abdes), pastrojmë dhëmbët tanë dhe gjithashtu mbajmë dhomën dhe mjedisin tonë të rregullt.",
      tr: "Allah temiz olmamızı sever! Bu, yıkandığımız (abdest), dişlerimizi fırçaladığımız ve ayrıca odamızı ve çevremizi düzenli tuttuğumuz anlamına gelir."
    },
    source: "Muslim"
  },
  {
    id: 4,
    icon: "🐈",
    title: { de: "Tiere gut behandeln", al: "Mirësia ndaj kafshëve", tr: "Hayvanlara iyi davranmak" },
    text: {
      de: "Eine Frau durfte ins Paradies eintreten, weil sie einem sehr durstigen Hund Wasser aus einem Brunnen gab.",
      al: "Një grua hyri në Xhenet sepse i dha ujë një qeni shumë të etur nga një pus.",
      tr: "Susuz kalmış bir köpeğe kuyudan su veren bir kadın Cennet'e girdi."
    },
    explanation: {
      de: "Islam bedeutet auch, Tiere mit viel Liebe und Respekt zu behandeln. Sie sind Allahs Geschöpfe. Wer gut zu Tieren ist, wird von Allah sehr belohnt!",
      al: "Islami do të thotë gjithashtu t'i trajtosh kafshët me shumë dashuri dhe respekt. Ato janë krijesa të Allahut. Kushdo që është i mirë me kafshët do të shpërblehet shumë nga Allahu!",
      tr: "İslam aynı zamanda hayvanlara bol sevgi ve saygıyla davranmak demektir. Onlar Allah'ın yaratıklarıdır. Hayvanlara iyi davranan kişi Allah tarafından çokça ödüllendirilecektir!"
    },
    source: "Bukhari"
  },
  {
    id: 5,
    icon: "🤝",
    title: { de: "Liebe für andere", al: "Dashuria për të tjerët", tr: "Başkaları için sevmek" },
    text: {
      de: "Keiner von euch glaubt wirklich, bis er für seinen Bruder (oder seine Schwester) das liebt, was er für sich selbst liebt.",
      al: "Asnjëri prej jush nuk beson vërtet derisa të dojë për vëllain (ose motrën) e tij atë që do për veten e tij.",
      tr: "Hiçbiriniz kendisi için sevdiğini kardeşi için de sevmedikçe tam iman etmiş olmaz."
    },
    explanation: {
      de: "Ein gutes Herz zu haben bedeutet, dass man anderen Menschen genauso viel Glück, Essen und Spielzeug gönnt, wie man selbst gerne hätte. Neid gibt es im Islam nicht.",
      al: "Të kesh një zemër të mirë do të thotë t'u dëshirosh njerëzve të tjerë po aq lumturi, ushqim dhe lodra sa do të doje për veten tënde. Zilia nuk ekziston në Islam.",
      tr: "İyi bir kalbe sahip olmak, başkaları için kendinize dilediğiniz kadar mutluluk, yiyecek ve oyuncak dilemek demektir. İslam'da kıskançlık yoktur."
    },
    source: "Bukhari & Muslim"
  }
];

// --- DATEN: GESCHICHTEN ---
const stories = [
  {
    id: 1,
    icon: "🌙",
    title: { de: "Wer war Prophet Muhammad?", al: "Kush ishte Profeti Muhamed?", tr: "Peygamberimiz Hz. Muhammed Kimdi?" },
    content: {
      de: "Unser Prophet hieß Muhammad (Friede sei mit ihm). Er war ein sehr ehrlicher, gerechter und freundlicher Mensch. Die Menschen in seiner Stadt nannten ihn 'Al-Amin', was 'der Vertrauenswürdige' bedeutet. Er liebte Kinder sehr und war immer nett zu Tieren. Allah wählte ihn aus, um den Menschen den Islam (den Weg des Friedens) zu bringen und ihnen zu zeigen, wie man ein gutes Herz hat.",
      al: "Profeti ynë quhej Muhamed (paqja dhe mëshira e Allahut qofshin mbi të). Ai ishte një njeri shumë i ndershëm dhe i sjellshëm. Njerëzit e quanin 'El-Emin' (i besueshmi). Ai i donte shumë fëmijët dhe ishte gjithmonë i mirë me kafshët. Allahu e zgjodhi atë për t'u sjellë njerëzve Islamin dhe për t'u treguar atyre se si të kenë një zemër të mirë.",
      tr: "Peygamberimizin adı Muhammed'dir (s.a.v.). O çok dürüst, adaletli ve kibar bir insandı. İnsanlar ona 'El-Emin' (Güvenilir) derlerdi. Çocukları çok severdi ve hayvanlara karşı her zaman merhametliydi. Allah onu insanlara İslam'ı getirmesi ve onlara nasıl iyi bir kalbe sahip olacaklarını göstermesi için seçti."
    }
  },
  {
    id: 2,
    icon: "⛵",
    title: { de: "Prophet Nuh und die Arche", al: "Profeti Nuh dhe Arka", tr: "Nuh Peygamber ve Gemi" },
    content: {
      de: "Prophet Nuh baute ein riesiges Schiff (die Arche), weil Allah es ihm befahl. Die Menschen lachten ihn aus, aber er blieb geduldig. Als die große Flut kam, waren nur Nuh, die Tiere (von jeder Art zwei) und die guten Menschen auf dem Schiff sicher. Das lehrt uns: Wer auf Allah vertraut und geduldig ist, wird immer beschützt!",
      al: "Profeti Nuh ndërtoi një anije gjigante (Arkën) sepse Allahu e urdhëroi. Njerëzit qeshnin me të, por ai mbeti i durueshëm. Kur erdhi përmbytja e madhe, vetëm Nuhu, kafshët (nga dy të secilit lloj) dhe njerëzit e mirë në anije ishin të sigurt. Kjo na mëson: Kush ka besim tek Allahu dhe është i durueshëm, është gjithmonë i mbrojtur!",
      tr: "Nuh Peygamber, Allah'ın emriyle devasa bir gemi inşa etti. İnsanlar onunla alay etti ama o sabırlı kaldı. Büyük tufan geldiğinde, sadece Nuh, hayvanlar (her türden iki tane) ve gemideki iyi insanlar güvendeydi. Bu bize şunu öğretir: Allah'a güvenen ve sabırlı olan her zaman korunur!"
    }
  },
  {
    id: 3,
    icon: "🕊️",
    title: { de: "Die Engel (Malaika)", al: "Engjëjt (Melaiket)", tr: "Melekler" },
    content: {
      de: "Engel sind unsichtbare Diener Allahs, erschaffen aus purem Licht. Sie essen nicht, trinken nicht und machen niemals Fehler. Jeder Mensch hat Schutzengel, die auf ihn aufpassen, und Engel, die unsere guten Taten aufschreiben. Der bekannteste Engel ist Jibril (Gabriel), der den Propheten den Koran brachte.",
      al: "Engjëjt janë shërbëtorë të padukshëm të Allahut, të krijuar nga drita e pastër. Ata nuk hanë, nuk pinë dhe nuk bëjnë kurrë gabime. Çdo njeri ka engjëj mbrojtës që kujdesen për të, dhe engjëj që shkruajnë veprat tona të mira. Engjëlli më i njohur është Xhibrili, i cili u solli Kuranin profetëve.",
      tr: "Melekler, Allah'ın saf nurdan yarattığı görünmez kullarıdır. Yemezler, içmezler ve asla hata yapmazlar. Her insanın onu koruyan melekleri ve iyiliklerini yazan melekleri vardır. En bilinen melek, peygamberlere Kuran'ı getiren Cebrail'dir (A.S.)."
    }
  },
  {
    id: 4,
    icon: "🚫🐷",
    title: { de: "Warum essen wir kein Schweinefleisch?", al: "Pse nuk hamë mish derri?", tr: "Neden domuz eti yemiyoruz?" },
    content: {
      de: "Allah hat uns im Koran gesagt, dass wir kein Schweinefleisch essen sollen. Schweine sind Tiere, die in der Natur alles fressen, auch Dinge, die nicht sauber sind. Allah hat uns Menschen sehr lieb und möchte unseren Körper beschützen. Deshalb sollen wir nur saubere und gesunde Dinge (Halal) essen. Wir gehorchen Allah, weil Er unser Schöpfer ist und am allerbesten weiß, was gut für uns ist!",
      al: "Allahu na ka thënë në Kuran të mos hamë mish derri. Derrat janë kafshë që hanë gjithçka, madje edhe papastërti. Allahu na do shumë dhe dëshiron të mbrojë trupin tonë. Prandaj ne duhet të hamë vetëm gjëra të pastra dhe të shëndetshme (Hallall). Ne i bindemi Allahut sepse Ai është Krijuesi ynë dhe e di më së miri se çfarë është e mirë për ne!",
      tr: "Allah Kuran'da bize domuz eti yemememizi söylemiştir. Domuzlar doğada kirli şeyler dahil her şeyi yiyen hayvanlardır. Allah bizi çok sever ve vücudumuzu korumak ister. Bu yüzden sadece temiz ve sağlıklı (Helal) şeyler yemeliyiz. Biz Allah'a itaat ederiz çünkü O bizim Yaratıcımızdır ve bizim için neyin iyi olduğunu en iyi O bilir!"
    }
  },
  {
    id: 5,
    icon: "🕌",
    title: { de: "Warum beten wir (Salah)?", al: "Pse falemi (Namazi)?", tr: "Neden namaz kılıyoruz?" },
    content: {
      de: "Beten ist wie eine ganz besondere Verabredung mit Allah. Wir Muslime beten fünfmal am Tag. Dabei waschen wir uns vorher sauber (Wudu). Im Gebet sagen wir Allah 'Danke' für alles Schöne: unsere Familie, unser Essen, dass wir sehen und spielen können. Wenn wir beten, wird unser Herz ganz ruhig und wir fühlen uns Allah sehr nah.",
      al: "Falja është si një takim shumë i veçantë me Allahun. Ne muslimanët falemi pesë herë në ditë. Para se të falemi, ne pastrohemi (Marrim abdes). Gjatë namazit ne i themi Allahut 'Faleminderit' për çdo gjë të bukur: familjen tonë, ushqimin, shikimin dhe mundësinë për të luajtur. Kur falemi, zemra jonë qetësohet dhe ndihemi shumë afër Allahut.",
      tr: "Namaz kılmak Allah ile olan çok özel bir buluşma gibidir. Biz Müslümanlar günde beş vakit namaz kılarız. Namazdan önce temizleniriz (Abdest alırız). Namazda Allah'a bize verdiği her güzel şey için (ailemiz, yemeğimiz, görebilmemiz ve oynayabilmemiz) 'Teşekkür ederim' deriz. Namaz kıldığımızda kalbimiz huzur bulur ve kendimizi Allah'a çok yakın hissederiz."
    }
  },
  {
    id: 6,
    icon: "📅",
    title: { de: "Warum fasten wir im Ramadan?", al: "Pse agjërojmë në Ramazan?", tr: "Ramazan'da neden oruç tutuyoruz?" },
    content: {
      de: "Im Monat Ramadan essen und trinken wir tagsüber nicht, bis die Sonne untergeht. Das nennt man Fasten. Allah hat uns das Fasten aufgetragen, damit wir lernen, geduldig zu sein. Wenn wir Hunger haben, erinnern wir uns an die armen Menschen, die nicht genug zu essen haben, und wir werden dankbarer für all das leckere Essen, das Allah uns gibt. Am Abend brechen wir das Fasten freudig mit unserer Familie beim Iftar!",
      al: "Në muajin e Ramazanit ne nuk hamë dhe nuk pimë gjatë ditës, derisa të perëndojë dielli. Kjo quhet agjërim. Allahu na ka urdhëruar të agjërojmë që të mësojmë të jemi të durueshëm. Kur jemi të uritur, kujtojmë njerëzit e varfër që nuk kanë mjaftueshëm për të ngrënë, dhe bëhemi më falënderues për ushqimin e shijshëm që na jep Allahu. Në mbrëmje, ne e prishim agjërimin me gëzim me familjen tonë në Iftar!",
      tr: "Ramazan ayında güneş batana kadar gün boyunca yemek yemez ve su içmeyiz. Buna oruç tutmak denir. Allah bize sabırlı olmayı öğrenmemiz için oruç tutmayı emretmiştir. Acıktığımızda, yeterince yiyeceği olmayan fakir insanları hatırlarız ve Allah'ın bize verdiği tüm lezzetli yiyecekler için daha çok şükrederiz. Akşamları orucumuzu ailemizle birlikte İftar'da sevinçle açarız!"
    }
  },
  {
    id: 7,
    icon: "✅❌",
    title: { de: "Was ist Halal und Haram?", al: "Çfarë është Hallall dhe Haram?", tr: "Helal ve Haram nedir?" },
    content: {
      de: "Als Muslime achten wir auf 'Halal' (erlaubt) und 'Haram' (verboten). Halal ist alles, was gut und gesund für uns ist, wie frisches Obst, ehrliches Teilen und nett zu anderen zu sein. Haram ist das, was uns oder anderen schadet, wie Lügen, Stehlen oder Dinge essen, die schlecht für unseren Körper sind. Allah hat uns diese Regeln aus großer Liebe gegeben, weil Er uns beschützen möchte. Wenn wir uns daran halten, werden wir glücklich und belohnt!",
      al: "Si muslimanë ne i kushtojmë rëndësi 'Hallallit' (e lejuar) dhe 'Haramit' (e ndaluar). Hallall është gjithçka që është e mirë dhe e shëndetshme për ne, si pemët e freskëta, të qenurit i sinqertë dhe i sjellshëm me të tjerët. Haram është ajo që na dëmton ne ose të tjerët, si gënjeshtra, vjedhja ose ngrënia e gjërave të dëmshme për trupin tonë. Allahu na i dha këto rregulla me shumë dashuri për të na mbrojtur. Nëse i ndjekim, do të jemi të lumtur dhe të shpërblyer!",
      tr: "Müslümanlar olarak 'Helal' (izin verilen) ve 'Haram' (yasaklanan) kavramlarına dikkat ederiz. Helal, taze meyveler yemek, dürüstçe paylaşmak ve başkalarına karşı nazik olmak gibi bizim için iyi ve sağlıklı olan her şeydir. Haram ise, yalan söylemek, çalmak veya vücudumuza zarar veren şeyler yemek gibi bize veya başkalarına zarar veren şeylerdir. Allah bizi korumak için büyük sevgisiyle bize bu kuralları vermiştir. Onlara uyarsak mutlu olur ve mükafatlandırılırız!"
    }
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLang, setSelectedLang] = useState('de');
  const [selectedDua, setSelectedDua] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedHadith, setSelectedHadith] = useState(null);
  
  // Audio Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const audioRef = useRef(null);

  // Audio resetten, wenn das Dua gewechselt wird
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsLoadingAudio(false);
    setCurrentAudioUrl(null);
  }, [selectedDua]);

  // Die Sprach-Zyklus-Funktion (Wechselt die Sprache direkt durch Antippen)
  const cycleLanguage = () => {
    const langs = ['de', 'al', 'tr'];
    const currentIndex = langs.indexOf(selectedLang);
    setSelectedLang(langs[(currentIndex + 1) % langs.length]);
  };

  const toggleAudio = async () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (currentAudioUrl) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Fehler beim Abspielen:", err);
      }
      return;
    }

    setIsLoadingAudio(true);
    
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${selectedDua.ayah}/ar.alafasy`);
      const data = await response.json();
      const urlToPlay = data.data.audio;

      setCurrentAudioUrl(urlToPlay);
      
      audioRef.current.src = urlToPlay;
      audioRef.current.load();
      
      await audioRef.current.play();
      setIsPlaying(true);

    } catch (error) {
      console.error("Fehler beim Laden des Audios:", error);
      alert("Audio konnte nicht geladen werden. Bitte überprüfe deine Internetverbindung.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const uiTexts = {
    de: { welcome: "Hallo! Lass uns lernen 🌟", duas: "Meine Duas", stories: "Geschichten", hadiths: "Hadithe", selectDua: "Wähle ein Dua aus:", selectStory: "Wähle eine Geschichte:", selectHadith: "Wähle einen Hadith:", listen: "Anhören", source: "Quelle", prophet: "Prophet", sleep: "Schlafen", parents: "Eltern" },
    al: { welcome: "Përshëndetje! Le të mësojmë 🌟", duas: "Duatë e mia", stories: "Tregime", hadiths: "Hadithe", selectDua: "Zgjidh një Dua:", selectStory: "Zgjidh një tregim:", selectHadith: "Zgjidh një Hadith:", listen: "Dëgjo", source: "Burimi", prophet: "Profeti", sleep: "Gjumi", parents: "Prindërit" },
    tr: { welcome: "Merhaba! Hadi öğrenelim 🌟", duas: "Dualarım", stories: "Hikayeler", hadiths: "Hadisler", selectDua: "Bir Dua seç:", selectStory: "Bir hikaye seç:", selectHadith: "Bir Hadis seç:", listen: "Dinle", source: "Kaynak", prophet: "Peygamber", sleep: "Uyku", parents: "Anne Baba" }
  };

  // Flaggen / Bezeichnungen für den Sprachschalter
  const langMap = {
    de: '🇩🇪 DE',
    al: '🇦🇱 AL',
    tr: '🇹🇷 TR'
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedDua(null);
    setSelectedStory(null);
    setSelectedHadith(null);
  };

  const renderHome = () => (
    <div className="p-6 pb-24 space-y-6">
      <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-6 rounded-3xl text-white shadow-lg text-center relative overflow-hidden">
        <Sparkles className="absolute top-2 right-2 opacity-20" size={48} />
        <h1 className="text-2xl font-bold mb-2 relative z-10">{uiTexts[selectedLang].welcome}</h1>
        <p className="text-green-50 opacity-90 relative z-10 font-medium">Bismillah ir-Rahman ir-Rahim</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleTabChange('duas')}
          className="bg-white p-6 rounded-3xl shadow-sm border-2 border-green-100 flex flex-col items-center justify-center gap-3 hover:bg-green-50 transition-colors"
        >
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <BookOpen size={32} />
          </div>
          <span className="font-bold text-gray-700 text-sm">{uiTexts[selectedLang].duas}</span>
        </button>

        <button 
          onClick={() => handleTabChange('hadiths')}
          className="bg-white p-6 rounded-3xl shadow-sm border-2 border-yellow-100 flex flex-col items-center justify-center gap-3 hover:bg-yellow-50 transition-colors"
        >
          <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
            <MessageCircle size={32} />
          </div>
          <span className="font-bold text-gray-700 text-sm">{uiTexts[selectedLang].hadiths}</span>
        </button>
      </div>

      <button 
        onClick={() => handleTabChange('stories')}
        className="w-full bg-white p-4 rounded-3xl shadow-sm border-2 border-purple-100 flex items-center justify-center gap-3 hover:bg-purple-50 transition-colors"
      >
        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
          <Library size={24} />
        </div>
        <span className="font-bold text-gray-700">{uiTexts[selectedLang].stories}</span>
      </button>

      {/* Quick Links (ehemals nur Deko) */}
      <div className="flex justify-around items-center pt-6">
        <button onClick={() => setSelectedStory(stories[0])} className="flex flex-col items-center gap-2 group">
          <div className="bg-yellow-50 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Star className="text-yellow-400" size={28} />
          </div>
          <span className="text-[10px] font-bold text-gray-400">{uiTexts[selectedLang].prophet}</span>
        </button>
        
        <button onClick={() => setSelectedDua(duas.find(d => d.id === 3))} className="flex flex-col items-center gap-2 group">
          <div className="bg-indigo-50 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Moon className="text-indigo-400" size={28} />
          </div>
          <span className="text-[10px] font-bold text-gray-400">{uiTexts[selectedLang].sleep}</span>
        </button>

        <button onClick={() => setSelectedDua(duas.find(d => d.id === 9))} className="flex flex-col items-center gap-2 group">
          <div className="bg-red-50 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Heart className="text-red-400" size={28} />
          </div>
          <span className="text-[10px] font-bold text-gray-400">{uiTexts[selectedLang].parents}</span>
        </button>
      </div>
    </div>
  );

  const renderDuasList = () => (
    <div className="p-6 pb-24 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{uiTexts[selectedLang].selectDua}</h2>
      {duas.map((dua) => (
        <button
          key={dua.id}
          onClick={() => setSelectedDua(dua)}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center gap-4 hover:border-green-300 transition-all text-left"
        >
          <div className="text-4xl">{dua.icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800">{dua.title[selectedLang]}</h3>
            <p className="text-sm text-gray-500 line-clamp-1">{dua.transliteration}</p>
          </div>
          <ChevronLeft className="text-gray-400 rotate-180 flex-shrink-0" />
        </button>
      ))}
    </div>
  );

  const renderHadithsList = () => (
    <div className="p-6 pb-24 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{uiTexts[selectedLang].selectHadith}</h2>
      {hadiths.map((hadith) => (
        <button
          key={hadith.id}
          onClick={() => setSelectedHadith(hadith)}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center gap-4 hover:border-yellow-300 transition-all text-left"
        >
          <div className="text-4xl bg-yellow-50 p-2 rounded-xl">{hadith.icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800">{hadith.title[selectedLang]}</h3>
            <p className="text-xs text-yellow-600 font-medium mt-1">{uiTexts[selectedLang].source}: {hadith.source}</p>
          </div>
          <ChevronLeft className="text-gray-400 rotate-180 flex-shrink-0" />
        </button>
      ))}
    </div>
  );

  const renderStoriesList = () => (
    <div className="p-6 pb-24 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{uiTexts[selectedLang].selectStory}</h2>
      {stories.map((story) => (
        <button
          key={story.id}
          onClick={() => setSelectedStory(story)}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center gap-4 hover:border-purple-300 transition-all text-left"
        >
          <div className="text-4xl bg-purple-50 p-3 rounded-xl">{story.icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 leading-tight">{story.title[selectedLang]}</h3>
          </div>
          <ChevronLeft className="text-gray-400 rotate-180 flex-shrink-0" />
        </button>
      ))}
    </div>
  );

  const renderDuaDetail = () => {
    if (!selectedDua) return null;
    return (
      <div className="p-6 pb-24 space-y-6 flex flex-col min-h-screen bg-gray-50 relative">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setSelectedDua(null)}
            className="flex items-center gap-2 text-gray-600 font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
          >
            <ChevronLeft size={20} /> Zurück
          </button>
          
          <button 
            onClick={toggleAudio}
            disabled={isLoadingAudio}
            className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-sm font-bold text-white transition-all transform active:scale-95 ${
              isLoadingAudio ? 'bg-gray-400' : isPlaying ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isLoadingAudio ? (
              <Loader2 size={20} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-1" />
            )}
            {uiTexts[selectedLang].listen || 'Anhören'}
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-green-100 text-center space-y-8 flex-1">
          <div className="text-6xl mb-4">{selectedDua.icon}</div>
          
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-100 pb-4">
            {selectedDua.title[selectedLang]}
          </h2>

          <div className="space-y-6 py-4">
            <p className="text-4xl font-arabic text-green-700 leading-relaxed" dir="rtl">
              {selectedDua.arabic}
            </p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Aussprache</p>
              <p className="text-lg font-medium text-gray-800">{selectedDua.transliteration}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-400 uppercase font-bold tracking-wider mb-1">Bedeutung</p>
              <p className="text-lg font-medium text-gray-800">{selectedDua.meaning[selectedLang]}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHadithDetail = () => {
    if (!selectedHadith) return null;
    return (
      <div className="p-6 pb-24 space-y-6 flex flex-col min-h-screen bg-gray-50">
        <button 
          onClick={() => setSelectedHadith(null)}
          className="flex items-center gap-2 text-gray-600 font-bold mb-4 bg-white self-start px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <ChevronLeft size={20} /> Zurück
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-yellow-100 text-center space-y-6 flex-1 relative overflow-hidden">
          <div className="text-7xl mb-2">{selectedHadith.icon}</div>
          
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-yellow-50 pb-4">
            {selectedHadith.title[selectedLang]}
          </h2>

          <div className="text-left bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
            <p className="text-xl text-gray-800 leading-relaxed font-bold italic">
              "{selectedHadith.text[selectedLang]}"
            </p>
            <p className="text-right text-sm text-yellow-600 mt-2 font-medium">
              – {selectedHadith.source}
            </p>
          </div>

          <div className="text-left bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-2">Was das bedeutet:</p>
            <p className="text-md text-gray-700 leading-relaxed font-medium">
              {selectedHadith.explanation[selectedLang]}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderStoryDetail = () => {
    if (!selectedStory) return null;
    return (
      <div className="p-6 pb-24 space-y-6 flex flex-col min-h-screen bg-gray-50">
        <button 
          onClick={() => setSelectedStory(null)}
          className="flex items-center gap-2 text-gray-600 font-bold mb-4 bg-white self-start px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <ChevronLeft size={20} /> Zurück
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-purple-100 text-center space-y-6 flex-1 relative overflow-hidden">
          <div className="text-7xl mb-2">{selectedStory.icon}</div>
          
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-50 pb-4">
            {selectedStory.title[selectedLang]}
          </h2>

          <div className="text-left bg-purple-50 p-6 rounded-2xl">
            <p className="text-lg text-gray-800 leading-relaxed font-medium">
              {selectedStory.content[selectedLang]}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      
      {/* Top Header mit Sprachschalter */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10 relative">
        <div className="w-16"></div> {/* Platzhalter, damit Titel zentriert bleibt */}
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
          IslamKids
        </h1>
        <button 
          onClick={cycleLanguage} 
          className="w-16 flex items-center justify-end bg-gray-50 px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow-sm border border-gray-200 active:scale-95 transition-transform"
          title="Sprache wechseln"
        >
          {langMap[selectedLang]}
        </button>
      </div>

      <div className="h-full overflow-y-auto">
        {activeTab === 'home' && !selectedDua && !selectedStory && !selectedHadith && renderHome()}
        {activeTab === 'duas' && !selectedDua && !selectedStory && !selectedHadith && renderDuasList()}
        {activeTab === 'hadiths' && !selectedDua && !selectedStory && !selectedHadith && renderHadithsList()}
        {activeTab === 'stories' && !selectedDua && !selectedStory && !selectedHadith && renderStoriesList()}
        
        {selectedDua && renderDuaDetail()}
        {selectedHadith && renderHadithDetail()}
        {selectedStory && renderStoryDetail()}
      </div>

      {/* 4-Item Bottom Navigation (Da "Settings" jetzt oben ist) */}
      {!selectedDua && !selectedStory && !selectedHadith && (
        <div className="fixed bottom-0 max-w-md w-full bg-white border-t border-gray-100 flex justify-between px-2 py-3 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
          <button 
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 ${activeTab === 'home' ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Home size={22} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('duas')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 ${activeTab === 'duas' ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BookOpen size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].duas}</span>
          </button>

          <button 
            onClick={() => handleTabChange('hadiths')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 ${activeTab === 'hadiths' ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MessageCircle size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].hadiths}</span>
          </button>

          <button 
            onClick={() => handleTabChange('stories')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-1/4 ${activeTab === 'stories' ? 'text-purple-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Library size={22} />
            <span className="text-[10px] font-bold">{uiTexts[selectedLang].stories}</span>
          </button>
        </div>
      )}
    </div>
  );
}