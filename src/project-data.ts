export type Step = string | {
  text: string;
  /** Shown when the student presses the "?" next to the step. */
  hint: string;
  link?: { label: string; url: string };
};

export const stepText = (step: Step): string => (typeof step === "string" ? step : step.text);

export type Level = {
  key: "easy" | "medium" | "hard";
  label: string;
  kicker: string;
  points: number;
  task: string;
  steps: Step[];
  deliverable: string;
};

export type Project = {
  number: number;
  title: string;
  intro: string;
  tools: string;
  ai: string;
  canvasId: number;
  group?: boolean;
  scenario?: string;
  submission?: string;
  photoGuide?: boolean;
  /** How the grade is made up; shown as its own section after the parts. Blank lines separate paragraphs. */
  assessment?: string;
  levels: Level[];
};

export const defaultProjects: Project[] = [
  {
    number: 6,
    title: "Prófílmynd í Innu og Canvas",
    intro: "Taktu selfie á símann þinn, settu hana sem prófílmynd í Innu og Canvas og sýndu með skjámyndum að það tókst. Hluti 1 nægir; Hlutar 2 og 3 eru valfrjáls viðbót.",
    tools: "Síminn þinn, framanverð myndavélin dugar · Inna og Canvas í vafra eða síma · Word eða Google Docs til að setja skjámyndir í PDF",
    ai: "AI 0: Ekki setja mynd af andlitinu þínu eða skjámyndir úr reikningum í AI. Venjulegur skurður og birtustilling í símanum eru leyfð.",
    canvasId: 27490,
    photoGuide: true,
    submission: "Skilaðu einni PDF-skrá. Hluti 1: tvær skjámyndir, ein úr Innu og ein úr Canvas, þar sem nýja prófílmyndin sést. Hluti 2, ef þú gerir hann: fyrsta og seinni selfie-myndin ásamt tveimur setningum um hvað þú lagaðir. Hluti 3, ef þú gerir hann: 4–6 setningar um andlitið á bak við verkið. Settu allt í eitt Word- eða Google Docs-skjal, merktu hlutana og vistaðu sem PDF. Skerðu burt kennitölu, netfang, einkunnir og upplýsingar um annað fólk. Skilin fara bara til kennara.",
    levels: [
      { key: "easy", label: "Grunnur", kicker: "Byrjaðu hér", points: 6, task: "Taktu selfie og settu hana sem prófílmynd í Innu og Canvas.", steps: ["Taktu selfie með símanum. Snúðu þér að glugga eða ljósi svo birtan komi framan á þig, ekki fyrir aftan þig. Hafðu höfuð og herðar á myndinni og einfaldan bakgrunn, t.d. vegg.", "Skoðaðu myndina. Sést andlitið skýrt? Ef ekki, taktu aðra. Það er í lagi að skera hana til í símanum. Engar síur.", "Settu myndina sem prófílmynd í Innu og svo í Canvas. Leiðbeiningar með skjámyndum eru hér fyrir neðan, skref fyrir skref.", "Endurhladdu báðum síðum og athugaðu að myndin sé enn þar. Taktu skjámynd af hverri síðu, settu þær í Word eða Google Docs og vistaðu sem PDF."], deliverable: "Ein PDF með tveimur skjámyndum þar sem sama myndin af þér sést í Innu og Canvas. Metið er að þetta tókst, ekki hvernig þú lítur út eða hvers konar síma þú ert með." },
      { key: "medium", label: "Viðbót", kicker: "Taktu betri mynd", points: 2, task: "Taktu nýja selfie þar sem þú lagar tvennt og útskýrðu hvað breyttist.", steps: ["Skoðaðu fyrstu myndina og veldu tvennt til að laga, t.d. birtu, bakgrunn, sjónarhorn eða fjarlægð. Haltu símanum í augnhæð, ekki neðan frá.", "Taktu nýja mynd og settu báðar hlið við hlið í skjalið. Skrifaðu eina setningu um hverja breytingu.", "Notaðu betri myndina í Innu og Canvas og uppfærðu skjámyndirnar í Hluta 1."], deliverable: "Fyrsta og seinni myndin ásamt tveimur setningum um breytingarnar. Engar fegrunarsíur eða AI-breytingar á andliti." },
      { key: "hard", label: "Viðbót", kicker: "Andlit og traust", points: 2, task: "Skrifaðu 4–6 setningar um hvers vegna það skiptir máli að viðskiptavinur sjái hver vinnur verkið.", steps: ["Hugsaðu um fyrirtæki eða iðnaðarmann sem þú treystir. Sást þú hver stóð á bak við verkið? Hvaða áhrif hafði það?", "Skrifaðu dæmi úr þinni iðngrein: hvað breytist þegar viðskiptavinur sér bæði verkið og andlitið á þeim sem vann það?", "Bættu við einni setningu um að mynd ein og sér sannar ekki að vinnan sé góð. Traust byggist líka á gæðum, ábyrgð og skýrum samskiptum."], deliverable: "4–6 setningar með raunhæfu dæmi og einum fyrirvara um hvað prófílmynd getur ekki sannað." },
    ],
  },
  {
    number: 5,
    title: "Myndaskýrsla og PDF",
    intro: "Sýndu hvað var skoðað eða lagað þannig að viðskiptavinur skilji verkið án munnlegrar útskýringar.",
    tools: "Sími eða myndavél · myndmerking · Word, Docs eða glærur · PDF",
    ai: "AI 0 — Ekki hlaða myndum af fólki eða vinnustað í AI.",
    canvasId: 24135,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Búðu til stutta og læsilega myndaskýrslu.", steps: ["Veldu 3 öruggar og leyfilegar myndir.", "Raðaðu þeim í rökrétta röð.", "Skrifaðu 1–2 setninga myndatexta við hverja mynd.", "Flyttu skjalið út sem PDF og opnaðu það til að prófa."], deliverable: "Ein PDF-skrá með 3 myndum, myndatextum og lýsandi skráarheiti." },
      { key: "medium", label: "Miðlungs", kicker: "Skýrari sönnun", points: 2, task: "Gerðu mikilvægu atriðin auðveld að finna.", steps: ["Bættu örvum, hringjum eða númerum við að minnsta kosti 2 myndir.", "Settu stuttan titil og dagsetningu á skýrsluna.", "Athugaðu að engar persónuupplýsingar sjáist."], deliverable: "Uppfærð PDF þar sem merkingar benda skýrt á það sem þú ert að útskýra." },
      { key: "hard", label: "Erfitt", kicker: "Fagleg afhending", points: 2, task: "Láttu skýrsluna segja heila sögu um verkið.", steps: ["Notaðu 4–5 myndir sem sýna yfirlit, smáatriði og niðurstöðu.", "Skrifaðu stutta niðurstöðu: hvað var gert og hvað þarf að gerast næst.", "Biddu annan nemanda að lesa skýrsluna án útskýringar og lagfærðu eitt óskýrt atriði."], deliverable: "Loka-PDF ásamt einni setningu í Canvas um breytinguna sem þú gerðir eftir prófun." },
    ],
  },
  {
    number: 8,
    title: "Fagleg samskipti",
    intro: "Viðskiptavinur sendir óskýra beiðni. Svaraðu kurteislega, fáðu upplýsingarnar sem vantar og forðastu óraunhæf loforð.",
    tools: "Canvas textaskil eða tölvupóstsdrög · PDF eða annað tilbúið viðhengi",
    ai: "AI 1 — AI má hjálpa við málfar, en ekki setja inn nöfn, netföng eða persónuupplýsingar.",
    canvasId: 24136,
    scenario: "Þetta er tilbúin æfing. Þú ert nemi hjá þjónustufyrirtæki og átt að semja svar, ekki senda raunverulegan tölvupóst. Jón skrifar: „Sæl/l. Getið þið sett upp hillur hjá mér? Ég er með eitthvað efni og þarf þetta fljótt. Hvað kostar þetta og getið þið komið í vikunni? Kveðja, Jón.“ Þú veist ekki fjölda, mál, efni, aðstæður eða staðsetningu. Ekki búa til verð eða lofa komu áður en þetta liggur fyrir.",
    submission: "Skilaðu einni PDF-skrá: Hluti 1 er tölvupóstsdrögin. Ef þú gerir Hluta 2 skaltu bæta gátlistanum við sem næstu síðu. Hluti 3 er lokaútgáfa svarsins og tvær línur um endurgjöf og breytingu. Merktu hlutana skýrt. Ekki senda póst til raunverulegs viðskiptavinar.",
    levels: [
      { key: "easy", label: "Grunnur", kicker: "Byrjaðu hér", points: 6, task: "Lestu erindi Jóns hér að ofan og skrifaðu faglegt svar, um 80–150 orð.", steps: ["Settu skýra efnislínu um hillurnar.", "Notaðu ávarp og staðfestu hvað þú skilur úr erindinu.", "Spyrðu 2–3 afmarkaðra spurninga sem hjálpa þér að áætla verkið, t.d. um mál, efni og staðsetningu.", "Útskýrðu næsta skref eftir að Jón svarar. Ekki lofa verði eða tíma. Ljúktu með kveðju."], deliverable: "Tölvupóstsdrög með efnislínu, ávarpi, skýrum spurningum, næsta skrefi og kveðju." },
      { key: "medium", label: "Viðbót", kicker: "Gagnlegt viðhengi", points: 2, task: "Búðu til einnar síðu gátlista fyrir vettvangsskoðun.", steps: ["Skráðu 3–5 atriði sem þarf að mæla eða staðfesta áður en hægt er að gera tilboð.", "Notaðu lýsandi heiti, t.d. Gatlisti_hillur.pdf. Ekki búa til tilboðsverð.", "Nefndu gátlistann í tölvupóstinum og útskýrðu hvernig Jón getur notað hann."], deliverable: "Tölvupóstsdrögin og gátlistinn á næstu síðu í sama PDF-skjali." },
      { key: "hard", label: "Erfitt", kicker: "Viðskiptavinapróf", points: 2, task: "Prófaðu hvort annar aðili geti brugðist rétt við.", steps: ["Fáðu jafningja til að lesa svarið sem viðskiptavinur.", "Skráðu eitt sem var óskýrt eða vantaði.", "Bættu svarið án þess að lofa verði eða tíma sem þú getur ekki staðið við."], deliverable: "Lokaútgáfa og tvær stuttar línur: hvað var óskýrt og hvað breyttist." },
    ],
  },
  {
    number: 7,
    title: "Hannaðu snjallt vinnurými",
    intro: "Hópverkefni sem dregur saman allt úr Verk 3–6: grunnmynd, rafrás, myndaskýrsla og prófílmynd. Hópurinn velur rými, hannar það sem verkstæði, verðleggur búnaðinn á netinu og skilar verkinu á þrjá vegu: PDF-skýrslu, snyrtilegri zip-möppu og kynningu sem er flutt mánudaginn 21. september.",
    tools: "Teikniforritið úr Verk 3 eða rúðustrikað blað · Excel eða Google Sheets · Falstad (falstad.com/circuit) · Word eða Google Docs fyrir PDF · PowerPoint, Google Slides eða Canva fyrir kynningu · zip-þjöppun í Windows eða Mac · vefverslanir: byko.is, husa.is, bauhaus.is, elko.is, ikea.is",
    ai: "AI 1 — AI má hjálpa við orðalag og eina afmarkaða spurningu um rásina í Hluta 3. Tölur, verð og rásin sjálf þurfa að vera ykkar eigin og sannreynd.",
    canvasId: 24134,
    group: true,
    scenario: "Hópurinn fær autt rými og á að gera það að nothæfu verkstæði. Hóparnir, fjórir til fimm í hverjum, eru ákveðnir af kennara og birtir í Canvas. Í hverjum hópi eru nemendur úr fleiri en einni iðngrein, svo verkstæðið er almennt: það á að nýtast pípara, smið og rafvirkja jafnt. Veljið eitt rými:\nA · Lítil stofa, 4 × 5 m, ein hurð og einn gluggi. Hentar fyrir viðgerðarborð og lager.\nB · Bílskúr, 6 × 8 m, bílskúrshurð og ein gönguhurð, enginn gluggi. Pláss fyrir stóra vél eða bíl.\nC · Langt herbergi, 3 × 9 m, hurð á enda og tveir gluggar á langvegg. Gott fyrir vinnulínu með mörgum stöðvum.\nTímalína: verkefnið opnar mánudaginn 14. september og þá er kennslustundin, 100 mínútur, ætluð í sjálfa vinnuna. Skiptið verkum strax og klárið grunnmynd, innkaupalista og rás þann dag; það sem eftir stendur er frágangur. Þriðjudaginn 15. september fara allir hópar til Halla í stofu 312 í myndatöku. Skil og kynningar eru mánudaginn 21. september og eftir kynningarnar fyllir hver og einn út jafningjamat í Canvas.",
    submission: "Einn úr hópnum skilar þremur skrám í Canvas, og hver þeirra á að sýna allt verk hópsins:\n1 · PDF-skýrsla, uppsett eins og myndaskýrslan í Verk 5 og eins og fagmaður myndi afhenda viðskiptavini: forsíða með hópmynd og nöfnum, ábyrgðartafla, grunnmynd, innkaupalisti með samtölum og skjámynd af rásinni, með myndatexta við hverja mynd. Hlutar 2 og 3 bætast við sem síður í sömu PDF.\n2 · Zip-skrá með öllum vinnuskjölum hópsins í snyrtilegum möppum með lýsandi heitum.\n3 · Kynningin, sem PowerPoint-, Keynote- eða PDF-skrá, eða hlekkur á Google Slides eða Canva.\nSetjið hlekk á reiknisskjalið, opið fyrir alla með hlekk, í athugasemd við skilin. Skilið fyrir kynninguna 21. september. Jafningjamatinu skilar hver og einn sérstaklega í Canvas eftir kynningarnar.",
    assessment: "Einkunnin fyrir Verk 7 er í tveimur jöfnum hlutum. Helmingurinn er hópeinkunn fyrir skilin og kynninguna, Hlutar 1–3, allt að 10 stig, og hún er sú sama fyrir alla í hópnum. Hinn helmingurinn er einkunn kennara fyrir hvern og einn: hvernig kennarar sáu þig vinna í tímum meðan á verkefninu stóð, hvort þú tókst þátt, hjálpaðir til og kláraðir það sem þú barst ábyrgð á.\nJafningjamatið og sjálfsmatið eru skylda fyrir alla og eru ykkar rödd í seinni helmingnum. Þar segið þið kennurum hvað hver og einn gerði, líka það sem kennarar sáu ekki. Þið fyllið það út í Canvas, í „Jafningjamat Verk 7“, eftir kynningarnar mánudaginn 21. september. Það gefur 0 stig sjálft, en verkinu er ekki lokið fyrr en það er komið inn.",
    levels: [
      { key: "easy", label: "Grunnur", kicker: "Byrjaðu hér", points: 6, task: "Setjið saman eina lausn sem sýnir hópinn, rýmið, kostnaðinn og rafrásina, skilið henni á þrjá vegu og kynnið hana.", steps: [
        { text: "Skráið nöfn allra í hópnum og hver ber ábyrgð á hverju: grunnmynd, innkaupalisti, rás, skýrsla, zip-mappa og kynning.", hint: "Gerið þetta fyrstu tíu mínúturnar mánudaginn 14. september. Einföld tafla með tveimur dálkum, nafn og ábyrgð, dugar. Allir mega vinna í öllu, en einn ber ábyrgð á að hver hluti klárist. Hópaskiptingin er í Canvas." },
        { text: "Veljið rými A, B eða C og teiknið grunnmynd með málum, hurð, glugga, vinnuborði, hillu og gönguleið.", hint: "Sama aðferð og í Verk 3. Notið sama forrit og þá, eða teiknið á rúðustrikað blað og takið mynd. Setjið mál á alla veggi og að minnsta kosti tvo hluti. Gönguleið þarf að vera minnst 1 m breið.", link: { label: "Verk 3 · Stafræn grunnmynd í Canvas", url: "https://canvas.tskoli.is/courses/1907/assignments/24132" } },
        { text: "Finnið verð á netinu á öllum átta hlutunum í innkaupalistanum og skráið í reiknisskjal: hlutur, verslun, hlekkur, verð, fjöldi og samtala.", hint: "Innkaupalistinn: vinnuborð, hillueining, LED-vinnuljós, fjöltengi eða framlengingarkefli, verkfæratafla með krókum, slökkvitæki, sjúkrakassi og vinnustóll. Leitið á byko.is, husa.is, bauhaus.is, elko.is eða ikea.is. Afritið hlekkinn á vöruna svo kennari geti sannreynt verðið." },
        { text: "Reiknið flatarmál rýmisins og heildarkostnað með 10% viðbót fyrir ófyrirséð.", hint: "Flatarmál = lengd × breidd. Samtala = SUM af verðdálkinum. Viðbót = samtala × 0,1. Heild = samtala + viðbót. Sýnið allar þrjár tölurnar í skýrslunni." },
        { text: "Smíðið merkiljósarás í Falstad: 9 V rafhlaða, rofi, viðnám og LED sem logar þegar rofinn er á. Takið skjámynd þar sem ljósið logar.", hint: "Þetta er ljósið við hurðina sem sýnir að vél sé í gangi eða verkstæðið upptekið. Sama rás og í Verk 4. Byrjið með 470 Ω viðnám; ef LED-ið brennur yfir í herminum er viðnámið of lítið.", link: { label: "Verk 4 · Stafræn rafrás í Canvas", url: "https://canvas.tskoli.is/courses/1907/assignments/24133" } },
        { text: "Farið öll til Halla í stofu 312 þriðjudaginn 15. september í myndatöku. Hver og einn setur sína mynd sem prófílmynd bæði í Innu og Canvas, og hópmyndin fer á forsíðu skýrslunnar.", hint: "Leiðbeiningarnar með skjámyndum úr Verk 6 gilda enn: Stillingar → Breyta mynd í Innu og Reikningur → Stillingar í Canvas. Nýja myndin kemur í stað selfie-myndarinnar á báðum stöðum.", link: { label: "Verk 6 · Prófílmynd, leiðbeiningar með skjámyndum", url: "https://ellertsmari.github.io/faguVerkefni/?verk=6" } },
        { text: "Setjið allt í eina PDF-skýrslu með myndatexta við hverja mynd, uppsetta eins og fagmaður myndi afhenda viðskiptavini.", hint: "Sama snið og í Verk 5. Röð: forsíða með hópmynd, nöfnum og dagsetningu, ábyrgðartafla, grunnmynd, innkaupalisti með samtölum, skjámynd af rásinni. Ein til tvær setningar undir hverri mynd, sama leturgerð í gegn, blaðsíðutal. Opnið PDF-skrána áður en þið skilið.", link: { label: "Verk 5 · Myndaskýrsla og PDF", url: "https://ellertsmari.github.io/faguVerkefni/?verk=5" } },
        { text: "Safnið öllum vinnuskjölum hópsins í eina zip-skrá með snyrtilegum möppum og lýsandi heitum á öllum skrám og möppum.", hint: "Dæmi: Hopur3_Verk7.zip með möppunum 01_Skyrsla, 02_Grunnmynd, 03_Innkaupalisti, 04_Rafras, 05_Myndir og 06_Kynning. Skráarheiti eiga að segja hvað er í skránni, t.d. Grunnmynd_rymi_B.png, ekki IMG_4821.jpg eða Skjal1_final_final.docx. Engar tómar möppur og engin tvítök. Windows: veljið möppuna, hægrismellið og veljið Þjappa í ZIP-skrá. Mac: hægrismellið og veljið Compress." },
        { text: "Búið til kynningu sem sýnir allt verkið og flytjið hana á 3–4 mínútum mánudaginn 21. september. Allir í hópnum tala og geta svarað spurningu.", hint: "PowerPoint, Google Slides, Canva eða Keynote, að eigin vali. Skiptið kynningunni í fjóra hluta: rýmið, kostnaðurinn, rásin, hvað við lærðum. Ein mynd og fáar setningar á hverri glæru, ekki upplestur. Æfið einu sinni með tíma. Kynningin er metin í tíma." },
        { text: "Fyllið út jafningjamat og sjálfsmat í Canvas eftir kynningarnar mánudaginn 21. september. Hver og einn gerir þetta fyrir sig.", hint: "Opnið „Jafningjamat Verk 7“ í Canvas. Þið metið ykkur sjálf og alla í hópnum og rökstyðjið stutt: hvað gerði hver og einn? Þetta er ykkar rödd í einkunn kennara, sjá Einkunnagjöf hér fyrir neðan. Aðeins kennarar sjá svörin." },
      ], deliverable: "Þrjár skrár sem allar sýna allt verk hópsins: PDF-skýrsla með hópmynd, ábyrgðartöflu, grunnmynd með málum, innkaupalista með átta verðum og heild með 10% viðbót og skjámynd af logandi LED-rás; zip-skrá með snyrtilegum möppum; og kynningin sem er flutt 21. september. Hlekkur á reiknisskjalið í athugasemd. Allir með nýja prófílmynd í Innu og Canvas og jafningjamat skilað." },
      { key: "medium", label: "Viðbót", kicker: "Prófið lausnina", points: 2, task: "Sýnið að tölurnar og rásin þoli breytingar og yfirferð.", steps: [
        { text: "Notið formúlur í reiknisskjalinu þannig að samtala, viðbót og heild uppfærist sjálfkrafa þegar eitt verð eða einn fjöldi breytist.", hint: "Prófið: breytið verði á einum hlut og takið skjámynd fyrir og eftir. Ef þið þurfið að reikna í höndunum vantar formúlu." },
        { text: "Merkið spennugjafa, rofa, viðnám og LED á rásarmyndinni og skráið gildin.", hint: "Í Falstad má hægrismella á íhlut og velja Edit til að sjá gildi. Skrifið þau á myndina eða undir henni." },
        { text: "Skráið eina villu eða breytingu sem hópurinn fann við prófun og hvað var gert við hana.", hint: "Dæmi: gönguleiðin var of þröng, verð breyttist milli daga, LED-ið logaði ekki því rofinn var opinn. Tvær til þrjár setningar duga." },
      ], deliverable: "Skjámyndir fyrir og eftir verðbreytingu, merkt rásarmynd með gildum og ein skráð lagfæring, sem viðbótarsíður í sömu PDF og sem skrár í zip-möppunni." },
      { key: "hard", label: "Viðbót", kicker: "Sannprófun og rökstuðningur", points: 2, task: "Sannreynið AI-svar og rökstyðjið val á búnaði.", steps: [
        { text: "Spyrjið AI eina afmarkaða spurningu um rásina, t.d. hvaða viðnám hentar tilteknu LED-i við 9 V, og vistið spurningu og svar.", hint: "Notið Copilot með skólareikningi. Engin nöfn eða persónuupplýsingar í spurningunni. Skjámynd af spurningu og svari fer í skýrsluna." },
        { text: "Sannreynið svarið í Falstad og skrifið tvær setningar um hvað stóðst og hvað ekki.", hint: "Setjið gildið sem AI gaf í herminn. Logar ljósið? Er straumurinn eðlilegur, um 10–20 mA? Skrifið niðurstöðuna, líka ef AI hafði rétt fyrir sér." },
        { text: "Finnið annan valkost í annarri verslun fyrir tvo hluti á innkaupalistanum og skrifið eina setningu um hvorn: hvers vegna völduð þið þann sem þið völduð?", hint: "Berið saman verð, gæði, ábyrgð og hvort varan sé til á lager. Ódýrast er ekki alltaf best; slökkvitæki þarf til dæmis að vera viðurkennt. Setjið báða hlekkina í reiknisskjalið." },
      ], deliverable: "Skjámynd af AI-spurningu og svari, tveggja setninga sannprófun og samanburður á tveimur hlutum með rökstuðningi, í PDF og zip-möppu." },
    ],
  },
  {
    number: 9,
    title: "AI-notkun og sannprófun",
    intro: "AI svarar hratt en getur haft rangt fyrir sér. Prófaðu svar, finndu veikleika og taktu sjálfstæða afstöðu.",
    tools: "Microsoft Copilot með skólareikningi · reiknivél · opinber eða traust heimild",
    ai: "AI 2 — AI er krafist, en persónugreinanleg gögn eru bönnuð og allar niðurstöður þarf að sannreyna.",
    canvasId: 24137,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Spyrðu AI um eitt afmarkað hagnýtt verkefni.", steps: ["Notaðu tilbúið eða afpersónugreint dæmi.", "Vistaðu spurninguna og svarið.", "Merktu tvær fullyrðingar sem þarf að athuga.", "Sannreyndu aðra með útreikningi, prófun eða traustri heimild."], deliverable: "Prompt, AI-svar og ein sýnileg sannprófun með heimild eða útreikningi." },
      { key: "medium", label: "Miðlungs", kicker: "Tvöföld athugun", points: 2, task: "Sannreyndu báðar mikilvægu fullyrðingarnar.", steps: ["Notaðu óháða aðferð fyrir seinni fullyrðinguna.", "Skráðu heimildarslóð, útreikning eða prófunarniðurstöðu.", "Segðu hvað í AI-svarinu þarf að laga."], deliverable: "Tvær skýrt merktar sannprófanir og leiðrétt útgáfa af niðurstöðunni." },
      { key: "hard", label: "Erfitt", kicker: "Betri spurning", points: 2, task: "Bættu spurninguna og berðu niðurstöðurnar saman.", steps: ["Endurskrifaðu promptið með skýrari forsendum.", "Berðu saman fyrra og seinna svarið.", "Veldu: treysta, laga eða hafna — og rökstyddu ákvörðunina."], deliverable: "Bæði promptin, stuttur samanburður og rökstudd lokaákvörðun." },
    ],
  },
  {
    number: 10,
    title: "Vefveiðar og stafrænt öryggi",
    intro: "Greindu tilbúin svikaskilaboð án þess að opna grunsamlega hlekki og settu upp öruggt viðbragðsferli.",
    tools: "Sýnidæmin í Canvas · vafri án þess að opna grunsamlegar slóðir",
    ai: "AI 0 — Ekki setja grunsamleg skilaboð eða raunveruleg gögn í AI.",
    canvasId: 24138,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Finndu viðvörunarmerkin í sýnidæmunum.", steps: ["Merktu að minnsta kosti 5 viðvörunarmerki.", "Tengdu hvert merki við sendanda, slóð, þrýsting eða gagnabeiðni.", "Flokkaðu hvert sýni: líklegt, óvíst eða svik.", "Skrifaðu 4 örugg skref sem þú myndir taka."], deliverable: "Merkt greining á sýnunum og fjögurra skrefa viðbragðsferli." },
      { key: "medium", label: "Miðlungs", kicker: "Verndaðu aðganginn", points: 2, task: "Útskýrðu hvernig góður aðgangur dregur úr tjóni.", steps: ["Búðu til tilbúna sterka aðgangssetningu — ekki raunverulegt lykilorð.", "Útskýrðu 2FA með eigin orðum.", "Segðu hvað þú gerir ef þú slóst þegar inn lykilorð."], deliverable: "Dæmi um tilbúna aðgangssetningu og þrjár stuttar öryggisskýringar." },
      { key: "hard", label: "Erfitt", kicker: "Öryggisspjald", points: 2, task: "Gerðu leiðbeiningar sem samstarfsfólk getur notað.", steps: ["Settu viðvörunarmerkin og viðbragðsferlið á eina síðu.", "Bættu við öruggri staðfestingu eftir annarri samskiptaleið.", "Prófaðu spjaldið á jafningja og lagfærðu eitt atriði."], deliverable: "Einnar síðu öryggisspjald sem PDF eða mynd, ásamt einni skráðri lagfæringu." },
    ],
  },
  {
    number: 11,
    title: "Tilboð, tímaskrá og PDF",
    intro: "Búðu til skriflegt tilboð þar sem efni, vinna, forsendur, VSK og heildarverð stemma.",
    tools: "Excel eða Sheets · tilboðssniðmát · PDF · tímaskrá",
    ai: "AI 1 — AI má hjálpa við orðalag forsendna; tölur og formúlur þarf að sannprófa sjálfstætt.",
    canvasId: 24139,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Fylltu út grunninn að tilboði sem hægt er að yfirfara.", steps: ["Skráðu verkumfang, efni, magn, verð og vinnustundir.", "Notaðu formúlur fyrir samtölur.", "Sýndu heild án og með VSK.", "Settu rétta dagsetningu og flyttu út sem PDF."], deliverable: "Útfyllt reikniskjal og ein PDF-skrá með efni, vinnu og réttum samtölum." },
      { key: "medium", label: "Miðlungs", kicker: "Tölurnar stemma", points: 2, task: "Tengdu vinnukostnaðinn við tímaskrá.", steps: ["Búðu til einfalda tímaskrá.", "Láttu vinnustundir og tímagjald passa við tilboðið.", "Skráðu 2 forsendur og eitt sem er ekki innifalið."], deliverable: "Tímaskrá og uppfært tilboð þar sem vinnuliðurinn stemmir og forsendur sjást." },
      { key: "hard", label: "Erfitt", kicker: "Breytingapróf", points: 2, task: "Sýndu að skjalið þoli breytingu án handreiknings.", steps: ["Breyttu einu magni eða einu verði.", "Athugaðu að samtölur og VSK uppfærist sjálfkrafa.", "Yfirfarðu nafn, dagsetningu, gildistíma og allar upphæðir."], deliverable: "Loka-PDF og skjámynd af formúlu eða breytingaprófi sem sýnir að útreikningar uppfærast." },
    ],
  },
  {
    number: 12,
    title: "Einföld 3D-hönnun",
    intro: "Hannaðu festihlut, merkiplötu eða millistykki sem leysir eitt mælanlegt vandamál í verkstæði.",
    tools: "Tinkercad 3D, Onshape Education eða annað samþykkt CAD-verkfæri",
    ai: "AI 1 — AI má hjálpa við verkfæraaðgerðir; líkanið þarf sjálft að standast mælanlegar kröfur.",
    canvasId: 24140,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Byggðu einfalt hagnýtt líkan með nákvæmum stærðum.", steps: ["Skrifaðu 3 mælanlegar kröfur.", "Notaðu að minnsta kosti 3 form eða aðgerðir.", "Haltu líkaninu innan 150 × 150 × 150 mm og veggþykkt í minnst 3 mm.", "Taktu skjámynd þar sem málsetningar sjást."], deliverable: "Skjámynd af líkaninu með sýnilegum málum og stutt lýsing á notkun þess." },
      { key: "medium", label: "Miðlungs", kicker: "Notanlegt líkan", points: 2, task: "Bættu við smáatriði sem styður raunverulega notkun.", steps: ["Bættu við gati, texta eða samsetningu.", "Athugaðu að breytingin eyðileggi ekki grunnformið.", "Flyttu út STL/OBJ eða búðu til deilanlegan hlekk."], deliverable: "STL/OBJ-skrá eða deilanlegur hlekkur ásamt uppfærðri skjámynd." },
      { key: "hard", label: "Erfitt", kicker: "Passar þetta?", points: 2, task: "Prófaðu líkanið gegn eigin kröfum.", steps: ["Mældu líkanið gegn öllum 3 kröfunum.", "Útskýrðu eina takmörkun eða mögulega bilun.", "Gerðu eina breytingu sem bætir styrk, passun eða framleiðanleika."], deliverable: "Stutt prófunartafla með 3 kröfum og lokaútgáfa sem sýnir eina rökstudda breytingu." },
    ],
  },
  {
    number: 13,
    title: "Ferilskrá og stafrænn vinnumappi",
    intro: "Sýndu á einni síðu hver þú ert sem nemi og veldu sönnunargögn sem sýna hvað þú getur.",
    tools: "Word, Google Docs eða Canva · PDF · verkefnamappa",
    ai: "AI 1 — AI má hjálpa við orðalag; engin viðkvæm gögn í AI og allt í ferilskránni þarf að vera satt.",
    canvasId: 24142,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Búðu til skýra og sanna einnar síðu ferilskrá.", steps: ["Settu nafn, tengiliðaupplýsingar sem þú mátt deila, nám og viðeigandi reynslu.", "Veldu 4–6 hæfniatriði sem tengjast iðngreininni.", "Notaðu læsilega uppsetningu og samræmt málfar.", "Flyttu út sem PDF og opnaðu skrána."], deliverable: "Einnar síðu ferilskrá sem PDF með faglegu skráarheiti." },
      { key: "medium", label: "Miðlungs", kicker: "Sýndu sönnun", points: 2, task: "Veldu verk sem sýna ólíka hæfni.", steps: ["Veldu 3 verkefni úr áfanganum.", "Skráðu heiti og eina setningu um hvað hvert verk sannar.", "Bættu við mynd, skjámynd eða virkum hlekk þar sem það á við."], deliverable: "Þriggja verka vinnumappalisti með stuttri skýringu og sönnun fyrir hvert verk." },
      { key: "hard", label: "Erfitt", kicker: "Sækja um", points: 2, task: "Tengdu gögnin við raunhæft tækifæri.", steps: ["Skrifaðu stutt umsóknarskilaboð fyrir tilbúið nema- eða sumarstarf.", "Fáðu jafningja til að lesa ferilskrána sem atvinnurekandi.", "Skráðu og framkvæmdu 2 breytingar eftir yfirferðina."], deliverable: "Umsóknarskilaboð, loka-PDF og tvær línur um breytingarnar sem þú gerðir." },
    ],
  },
].sort((a, b) => a.number - b.number) as Project[];
