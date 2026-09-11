export type Step = string | {
  text: string;
  /** Starts a new section of the checklist with this title. */
  phase?: string;
  /** Shown when the student presses "Hjálp" next to the step. */
  hint?: string;
  /** Requirements listed under the step text, always visible. */
  list?: string[];
  /** Shown inline under the step, outside the hint. */
  link?: { label: string; url: string };
};

export const stepText = (step: Step): string => (typeof step === "string" ? step : step.text);

export type RubricBand = { grade: string; title: string; text: string };

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
  overview?: { label: string; value: string }[];
  reflectionUrl?: string;
  checklistVersion?: string;
  scenario?: string;
  submission?: string;
  photoGuide?: boolean;
  /** Quality bands for a single-part project graded 0–10 (Verk 7). */
  rubric?: RubricBand[];
  /** Boxes under the rubric showing how the final grade is split, e.g. 50% group and 50% teacher (Verk 7). */
  gradeSplit?: RubricBand[];
  /** Paragraphs under the grade split. Line breaks separate paragraphs. */
  assessment?: string;
  /** Three parts worth 6 + 2 + 2, or one part when the project is graded by quality. */
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
    title: "Verkstæði frá grunni",
    intro: "Hannið verkstæði fyrir pípara, smið og rafvirkja. Notið það sem þið lærðuð í Verk 3–6: grunnmynd, innkaupalista, merkiljósarás og myndaskýrslu. Allir taka þátt og allir tala í kynningunni.",
    tools: "Teikniforritið úr Verk 3 eða rúðustrikað blað · Excel eða Google Sheets · Falstad · Word eða Google Docs · PowerPoint, Keynote, Google Slides eða Canva",
    ai: "AI 1 — AI má hjálpa við orðalag. Tölur, verð, rökstuðningur og rásin þurfa að vera ykkar eigin. Viljið þið nota AI í meira, spyrjið kennara.",
    canvasId: 24134,
    group: true,
    checklistVersion: "2026-09-12",
    reflectionUrl: "https://canvas.tskoli.is/courses/1907/assignments/30396",
    overview: [
      { label: "Hópur", value: "4–5 nemendur · listi í Canvas" },
      { label: "Vinnudagur", value: "15. sept. · 100 mín." },
      { label: "Skráaskil", value: "Í lok vinnudags · í síðasta lagi 21. sept. kl. 23:59" },
      { label: "Kynning", value: "22. sept. · 10–15 mín. á hóp" },
      { label: "Jafningjamat", value: "23. sept. · kl. 23:59" },
    ],
    scenario: "Veljið eitt rými. Verkstæðið á að nýtast öllum þremur iðngreinunum.\nA · Lítil stofa, 4 × 5 m, ein hurð og einn gluggi.\nB · Bílskúr, 6 × 8 m, bílskúrshurð og ein gönguhurð, enginn gluggi.\nC · Langt herbergi, 3 × 9 m, hurð á enda og tveir gluggar á langvegg.",
    submission: "Einn úr hópnum skilar þremur skrám saman í Canvas, helst í lok vinnudagsins 15. september og í síðasta lagi mánudaginn 21. september kl. 23:59:\n1 · HopurX_Verk7_skyrsla.pdf — forsíða með hópmynd, nöfnum og dagsetningu; ábyrgðartafla; grunnmynd og flatarmál; innkaupalisti með samtölum; skjámynd af rásinni; rökstuðningur. Myndatexti við hverja mynd.\n2 · HopurX_Verk7_vinnuskjol.zip — öll vinnuskjöl í lýsandi möppum: skýrsluskjal, grunnmynd, reiknisskjal, vistuð rás, myndir og glærur.\n3 · HopurX_Verk7_kynning.pptx eða .key — glærusýningin sem skrá. Úr Google Slides: Skrá → Hlaða niður → Microsoft PowerPoint (.pptx). Úr Canva: Deila → Sækja / Download → Microsoft PowerPoint (.pptx). Ekki PDF og engir hlekkir. Opnið útfluttu glærurnar og athugið að myndir og texti birtist rétt.\nGátlistarnir í vinnuáætluninni hér fyrir ofan segja nákvæmlega hvað á að vera í hverri skrá.",
    rubric: [
      { grade: "1–2", title: "Nánast ekkert", text: "Lítið er matshæft; megnið af verkefninu vantar." },
      { grade: "3–4", title: "Hluta vantar", text: "Mikilvæg skil eða skref vantar, eða verulegar villur eru í niðurstöðum." },
      { grade: "5–6", title: "Allt skilað", text: "Öll þrjú skil komin og kynning flutt þar sem allir tala. Öll skylduatriði til staðar, niðurstöður að mestu réttar og frágangur nægilegur." },
      { grade: "7–8", title: "Vel unnið", text: "Mál, útreikningar og rás eru rétt. Skrár eru skipulagðar, skýrslan læsileg og myndir skýrar. Allir tala skýrt um sinn hluta og kynningin er innan tíma." },
      { grade: "9–10", title: "Framúrskarandi", text: "Öll skylduatriði eru unnin af nákvæmni. Rökstuðningurinn útskýrir val á skipulagi og búnaði, hópurinn sannreynir verð og útreikninga og sýnir prófaða rás. Skýrsla, vinnuskjöl og kynning segja sömu skýru söguna. Ekki þarf fleiri íhluti eða hreyfingar í glærum." },
    ],
    gradeSplit: [
      { grade: "50%", title: "Hópeinkunn", text: "Skilin og kynningin samkvæmt viðmiðunum hér fyrir ofan. Sama hópeinkunn fyrir alla í hópnum." },
      { grade: "50%", title: "Einkunn kennara fyrir þig", text: "Mæting, þátttaka, ábyrgð og sýnilegt framlag. Kennarar nota athuganir úr tímum og rökstutt jafningjamat og sjálfsmat." },
    ],
    assessment: "Lokaeinkunn = helmingur hópeinkunnar + helmingur einkunnar kennara. Dæmi: hópeinkunn 8 og einstaklingsmat 6 gefa lokaeinkunn 7. Tveir í sama hópi geta fengið ólíka einkunn.\nJafningjamat og sjálfsmat er skylda, sjá síðasta skref vinnuáætlunarinnar. Svörin eru merkt nafni og aðeins kennarar sjá þau. Þau styðja einstaklingsmat kennara; þau gefa ekki sjálfstæð stig.",
    levels: [
      { key: "easy", label: "Vinnuáætlun og gátlistar", kicker: "Sjö áfangar · hakið við jafnóðum", points: 10, task: "Skilið PDF-skýrslu, zip-möppu með vinnuskjölum og glærusýningu um verkstæðið ykkar og kynnið það fyrir bekknum. Áfangar 4–6 eru gátlistar yfir það sem þarf að vera í hverri skrá.", steps: [
        { phase: "1 · Byrjið saman", text: "Finnið hópinn ykkar á verkefnasíðunni í Canvas og veljið rými A, B eða C.", hint: "Hópaskiptingin er undir Hópar á verkefnasíðunni í Canvas. Ekkert rými er auðveldara en annað; veljið það sem hópurinn sér skýrast fyrir sér." },
        { text: "Búið til sameiginlega vinnumöppu og prófið að allir í hópnum geti opnað og vistað þar.", hint: "Notið skólaaðganginn, t.d. OneDrive eða Google Drive. Allar skrár hópsins fara í þessa möppu og zip-mappan verður búin til úr henni." },
        { text: "Fyllið út ábyrgðartöflu: hver ber ábyrgð á grunnmynd, innkaupalista, rás, rökstuðningi, skýrslu, zip-möppu og kynningu. Veljið einn til að skila.", hint: "Tveggja dálka tafla, nafn og ábyrgð, dugar. Allir mega hjálpa til við alla hluta; ábyrgð þýðir að einhver sér til þess að hlutinn klárist. Taflan fer í skýrsluna." },
        { phase: "2 · Vinnið hlutana samtímis", text: "Teiknið grunnmynd af rýminu í réttum hlutföllum. Hún þarf að sýna:", list: ["mál á öllum veggjum", "hurðir og glugga eins og rýminu er lýst. Rými B hefur engan glugga", "vinnuborð og hillueiningu", "að minnsta kosti tvo aðra hluti af innkaupalistanum, t.d. verkfæratöflu og vinnustól", "gönguleið sem er að minnsta kosti 1 m breið"], hint: "Notið teikniforritið úr Verk 3 eða rúðustrikað blað og takið skýra mynd af blaðinu. Grunnmynd, verðleit og rás geta ólíkir hópfélagar unnið á sama tíma.", link: { label: "Verk 3 · Stafræn grunnmynd", url: "https://canvas.tskoli.is/courses/1907/assignments/24132" } },
        { text: "Finnið verð á átta hlutum og skráið í reiknisskjal með dálkunum hlutur, verslun, vöruhlekkur, einingarverð, fjöldi og línusamtala:", list: ["vinnuborð", "hillueining", "LED-vinnuljós", "fjöltengi eða framlengingarkefli", "verkfæratafla með krókum", "slökkvitæki", "sjúkrakassi", "vinnustóll"], hint: "Leitið t.d. á byko.is, husa.is, bauhaus.is, elko.is eða ikea.is. Vöruhlekkurinn er heimildin fyrir verðinu. Reiknisskjalið þarf að vera skrá í zip-möppunni; úr Google Sheets: Skrá → Hlaða niður → Excel." },
        { text: "Reiknið flatarmál = lengd × breidd og notið formúlur í reiknisskjalinu: línusamtala = einingarverð × fjöldi; vörusamtala = SUM af línusamtölum; ófyrirséð = vörusamtala × 10%; heildarkostnaður = vörusamtala + ófyrirséð.", hint: "Prófið formúlurnar með því að breyta fjölda á einum hlut. Línusamtala og heild eiga að uppfærast sjálfkrafa. Stillið síðan réttan fjölda aftur." },
        { text: "Smíðið merkiljósarás í Falstad: 9 V rafhlaða, rofi, viðnám og LED. Prófið að ljósið kvikni og slokkni með rofanum. Takið skjámynd með logandi LED, merktum íhlutum og gildum og vistið rásina sem skrá.", hint: "Sama rás og í Verk 4. Byrjið með 470 Ω. Í Falstad: File → Export as Text og vistið textann í .txt-skrá í vinnumöppunni. Opnið hana aftur með File → Import from Text til að prófa.", link: { label: "Verk 4 · Stafræn rafrás", url: "https://canvas.tskoli.is/courses/1907/assignments/24133" } },
        { text: "Skrifið rökstuðning, 3–5 setningar: hvers vegna er rýminu raðað svona og hvers vegna völduð þið þessa hluti og þessar verslanir? Nefnið eitt sem þið sannreynduð, t.d. verð sem þið báruð saman í tveimur verslunum eða formúlu sem þið prófuðuð.", hint: "Rökstuðningurinn fer í skýrsluna og á eina glæru. Hann skilur 9–10 frá 7–8 í námsmatinu: rétt unnið verk sem þið getið útskýrt hvers vegna er svona." },
        { text: "Farið öll saman til Halla í stofu 312 í myndatöku á vinnudeginum 15. september. Hópmyndin fer á forsíðu skýrslunnar og í glærurnar; allar myndirnar fara í zip-möppuna.", hint: "Halli segir ykkur hvernig þið fáið myndirnar. Ef einhver er fjarverandi eða myndin berst ekki í tíma, talið við kennara og haldið áfram með hina hlutana. Viljið þið nota myndina sem prófílmynd í Innu og Canvas eru leiðbeiningarnar í Verk 6.", link: { label: "Verk 6 · Prófílmynd, skref fyrir skref", url: "https://ellertsmari.github.io/faguVerkefni/?verk=6&locked=1" } },
        { phase: "3 · Stoppið og athugið stöðuna", text: "Þegar um 50 mínútur eru eftir af vinnudeginum, þriðjudaginn 15. september: stoppið, farið saman yfir gátlistana þrjá hér fyrir neðan og skráið við hvert atriði sem vantar hver klárar það og hvenær. Markmiðið er að skila í lok vinnudagsins. Það sem vantar má klára heima, í síðasta lagi mánudaginn 21. september kl. 23:59.", hint: "Þetta er mikilvægasta stopp verkefnisins. Hópar vinna mishratt og það skiptir ekki máli hvað er búið, heldur að allir viti hvað vantar og hver gerir það. Hópar sem klára í tímanum skila strax; hinir klára heima í sameiginlegu vinnumöppunni." },
        { phase: "4 · Gátlisti: skýrslan (PDF)", text: "Forsíða með hópmynd, nöfnum allra í hópnum, hópnúmeri og dagsetningu." },
        "Ábyrgðartaflan.",
        "Grunnmyndin með málum og útreiknað flatarmál.",
        "Innkaupalistinn með línusamtölum, vörusamtölu, 10% ófyrirséðu og heildarkostnaði.",
        "Skjámynd af rásinni með logandi LED og merktum íhlutum.",
        "Rökstuðningurinn, 3–5 setningar.",
        "Myndatexti við hverja mynd, samræmt letur og blaðsíðutal.",
        { text: "Vistuð sem HopurX_Verk7_skyrsla.pdf, opnuð og skoðuð: ekkert klippist af og skýrslan er skiljanleg án munnlegrar útskýringar.", hint: "Sömu kröfur og í Verk 5. Opnið PDF-skrána í öðru forriti en hún var búin til í, t.d. í vafra, og flettið í gegnum allar síður.", link: { label: "Verk 5 · Myndaskýrsla og PDF", url: "https://ellertsmari.github.io/faguVerkefni/?verk=5&locked=1" } },
        { phase: "5 · Gátlisti: vinnuskjölin (ZIP)", text: "Skýrsluskjalið sjálft, Word- eða Docs-skjalið sem PDF-skráin var búin til úr." },
        "Grunnmyndin sem mynd eða teikniskrá.",
        "Reiknisskjalið sem skrá, t.d. .xlsx, með formúlunum inni.",
        "Vistaða rásin, t.d. .txt úr Falstad.",
        "Allar myndir, þar á meðal hópmyndin.",
        "Glærurnar.",
        { text: "Lýsandi möppuheiti og engar tómar möppur. Vistuð sem HopurX_Verk7_vinnuskjol.zip, opnuð og skrárnar prófaðar.", hint: "Dæmi: 01_Skyrsla, 02_Grunnmynd, 03_Innkaupalisti, 04_Rafras, 05_Myndir, 06_Kynning. Windows: veljið möppurnar, hægrismellið → Þjappa í ZIP-skrá. Mac: hægrismellið → Compress." },
        { phase: "6 · Gátlisti: glærusýningin", text: "Titilglæra með hópmynd, nöfnum og heiti rýmisins." },
        "Rýmið: grunnmyndin og flatarmálið.",
        "Kostnaður: helstu hlutir, vörusamtala og heildarkostnaður.",
        "Rásin: skjámyndin með logandi LED.",
        "Rökstuðningurinn: hvers vegna svona.",
        "Hvað hópurinn lærði og hvað hann myndi gera öðruvísi.",
        { text: "Allir í hópnum tala. Kynningin er æfð með tíma og tekur 10–15 mínútur.", hint: "Um 8–12 glærur duga. Ein mynd og fáar setningar á glæru; segið frekar frá en lesið. Skiptið glærunum á milli ykkar fyrirfram." },
        { text: "Flutt út sem HopurX_Verk7_kynning.pptx eða .key og útflutta skráin opnuð og skoðuð: myndir og texti birtast rétt.", hint: "Google Slides: Skrá → Hlaða niður → Microsoft PowerPoint (.pptx). Canva: Deila → Sækja → Microsoft PowerPoint (.pptx). Ekki PDF og engir hlekkir." },
        { phase: "7 · Skil, kynning og mat", text: "Einn úr hópnum skilar öllum þremur skránum saman í Canvas, helst í lok vinnudagsins og í síðasta lagi mánudaginn 21. september kl. 23:59. Sjá „Áður en þið skilið“ hér fyrir neðan.", hint: "Við endurskil þurfa allar þrjár skrárnar að fylgja aftur. Athugið staðfestinguna frá Canvas." },
        { text: "Kynnið þriðjudaginn 22. september, 10–15 mínútur á hóp. Kynningin er flutt af kennaratölvunni úr glæruskránni sem hópurinn skilaði í Canvas og kennari ákveður röð hópanna í byrjun tímans. Hafið afrit af glærunum í vinnumöppunni til öryggis.", hint: "Þið þurfið ekki að koma með eigin tölvu. Ef eitthvað birtist vitlaust á kennaratölvunni er afritið úr vinnumöppunni notað." },
        { text: "Hver fyrir sig: svarið „Jafningjamat Verk 7“ í Canvas eftir kynningarnar, í síðasta lagi miðvikudaginn 23. september kl. 23:59.", hint: "Tengillinn er efst á síðunni og undir Skil. Lýsið eigin framlagi og framlagi hvers hópfélaga með stuttum dæmum. Aðeins kennarar sjá svörin." },
      ], deliverable: "Þrjár skrár saman í einni skilatilraun: PDF-skýrsla, ZIP með vinnuskjölum og glærusýning (.pptx eða .key). Engir skilahlekkir. Einn skilar fyrir hópinn; hver nemandi skilar eigin jafningjamati og sjálfsmati." },
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
