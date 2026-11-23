// Lokaverkefni · Heildarlausn fyrir íbúð 7. All text for the overview and the four day pages.
// Edit the text here; lok.js draws the pages. Dates must agree with Canvas assignment 24144.
// A step is { t, hint?, prompt?, in3? }. `in3` says who takes a "Tilboð og samskipti" step in a group of three:
// the fourth role is shared out evenly (teikn 4 steps, reikn 5, oryggi 4 over the four days).
window.LOK = {
  canvas: "https://canvas.tskoli.is/courses/1907/assignments/24144",
  kynning: "https://canvas.tskoli.is/courses/1907/assignments/24145",
  jafningjamat: "https://canvas.tskoli.is/courses/1907/assignments/37372",
  files: {
    kostnadur: "https://canvas.tskoli.is/courses/1907/files/229409",
    tilbod: "https://canvas.tskoli.is/courses/1907/files/229410",
  },
  budget: "1.500.000 kr.",
  rate: "9.000 kr.",
  roles: {
    teikn: { name: "Teiknari", icon: "📐", does: "Teikningin af íbúðinni með breytingunum" },
    reikn: { name: "Reiknari", icon: "💰", does: "Magn, verð og að verðin séu sannreynd" },
    oryggi: { name: "Öryggi og heimildir", icon: "🔎", does: "Áhættulisti og ein opinber heimild" },
    tilbod: { name: "Tilboð og samskipti", icon: "📄", does: "Tilboðið, svarið til viðskiptavinar og mappan" },
  },
  // What the group folder holds when the project is done.
  folder: [
    ["Dagbok_Hopur[númer]", "Dagbókin. Allir skrifa í lok hvers dags."],
    ["Teikning/", "Teikning_v1 og Teikning_v2, og skjáskot af báðum"],
    ["Verd/", "Lausn_og_magn, Kostnadur_v1 og Kostnadur_v2"],
    ["Heimildir/", "Ahaettulisti og Heimild"],
    ["Tilbod/", "Tilbod_v1, Tilbod_v2 og Svar_til_vidskiptavinar"],
    ["Afhending/", "Tilboðið sem PDF og AI_yfirlysing"],
  ],
  // What each of the three takes over from "Tilboð og samskipti" in a group of three.
  share3: {
    teikn: "mappan, verðin í tilboðið og PDF-skjalið",
    reikn: "setur tilboðið upp og uppfærir það",
    oryggi: "forsendur og svarið til viðskiptavinar",
  },
  journal: "[dagsetning] · [hlutverk]: Í dag gerði ég ___. Næst ætla ég að ___. AI: ég notaði Copilot í ___ og athugaði það með því að ___.",
  days: [
    {
      n: 2, date: "2026-11-24", label: "þri. 24. nóv.", short: "Lausn og teikning",
      title: "Lausn og teikning",
      goal: "Í dag ákveðið þið hvað á að gera í íbúðinni. Svo byrjar hver og einn á sínum hluta.",
      done: [
        "Mappa hópsins er til, með fimm undirmöppum",
        "Lausnarlistinn er tilbúinn: 6 til 10 línur",
        "Teikningin er komin af stað",
        "Allir hafa skrifað í dagbókina",
      ],
      sections: [
        {
          who: "allir", title: "Byrjið saman", time: "um 30 mínútur",
          steps: [
            { t: "Setjist saman. Lesið <strong>verkbeiðnina</strong> og skoðið <strong>grunnmyndina</strong>. Hvort tveggja er efst á þessari síðu." },
            { t: "<strong>Mappa hópsins.</strong> Einn býr til möppu í OneDrive sem heitir <code>Ibud7_Hopur[númer]</code> og deilir henni með hinum. Búið til fimm undirmöppur: <code>Teikning</code>, <code>Verd</code>, <code>Heimildir</code>, <code>Tilbod</code> og <code>Afhending</code>.",
              hint: "OneDrive → <strong>Nýtt</strong> → <strong>Mappa</strong>. Til að deila: hægrismelltu á möppuna → <strong>Deila</strong> → skrifaðu skólanetföng hinna → veldu <strong>Getur breytt</strong>. Eigið þið möppu síðan í gær? Notið hana og bætið við því sem vantar." },
            { t: "<strong>Dagbókin.</strong> Búið til Word-skjal í möppunni sem heitir <code>Dagbok_Hopur[númer]</code>. Skrifið efst hver er með hvaða hlutverk.",
              hint: "Hlutverkin eru fjögur: Teiknari, Reiknari, Öryggi og heimildir, Tilboð og samskipti. Eruð þið þrjú? Þá skiptist fjórða hlutverkið, Tilboð og samskipti, jafnt á milli ykkar þriggja. Veldu hópstærð og hlutverk efst á síðunni, þá sérðu þín verk." },
            { t: "<strong>Lausnarlistinn.</strong> Búið til skjal í möppunni <code>Verd</code> sem heitir <code>Lausn_og_magn</code>. Ákveðið saman hvað á að gera í <strong>alrýminu</strong> og <strong>vinnuherberginu</strong>. Ein lína fyrir hvert atriði: <em>Rými · Hvað · Magn · Eining</em>.",
              hint: "Dæmi um línu (þið ákveðið ykkar eigin): <em>Vinnuherbergi · LED-loftljós · 2 · stk.</em> Einingin er stk., m eða m². Viðskiptavinurinn vill fjögur atriði: betri <strong>lýsingu</strong>, <strong>rafmagnsöryggi</strong>, <strong>geymslu</strong> og <strong>vinnuaðstöðu</strong>. Hafið að minnsta kosti eina línu fyrir hvert." },
            { t: "Teljið línurnar. Þær eiga að vera <strong>6 til 10</strong>. Sniðmátin fyrir verð og tilboð hafa pláss fyrir 10 línur." },
          ],
        },
        {
          who: "teikn", title: "Teiknari", time: "um 45 mínútur",
          steps: [
            { t: "Teiknaðu íbúðina ofan frá með málunum af grunnmyndinni. Þú velur verkfæri: Copilot (SVG-vefsíða eins og í Verk 20), Inkscape eða Tinkercad.",
              hint: "Með Copilot: Outlook í Edge → Copilot → veldu <strong>GPT-5.6 Sol Think deeper</strong> (ekki Auto). Vistaðu svarið sem <code>index.html</code> og opnaðu í Edge. Fékkstu bara kóða? Notepad → líma → Save as → All files → index.html.",
              prompt: "Búðu til einfalda vefsíðu (eina index.html skrá) sem sýnir grunnmynd af íbúð ofan frá, teiknaða með SVG. Notaðu mælikvarðann 1 px = 1 cm og teiknaðu rúðunet með þunnum línum á 10 cm fresti og þykkari línum á 1 m fresti. Íbúðin er 1000 cm á lengd (vinstri til hægri) og 650 cm á breidd. Veggur liggur upp og niður 600 cm frá vinstri hlið. Hægra megin við hann er alrými, 400 × 650 cm. Vinstra megin eru tvö herbergi: svefnherbergi efst, 600 × 370 cm, og vinnuherbergi neðst, 600 × 280 cm. Merktu herbergin með texta. Bættu svo þessu við og merktu hvert atriði með texta: [skrifaðu hér línurnar af lausnarlistanum og hvar hvert atriði á að vera]. Settu allt í eina skrá sem virkar án nettengingar." },
            { t: "Settu <strong>hvert atriði af lausnarlistanum</strong> á teikninguna og merktu það með texta." },
            { t: "Vistaðu í möppuna <code>Teikning</code> sem <code>Teikning_v1</code>. Þú þarft ekki að klára í dag. Þú heldur áfram á degi 3." },
          ],
        },
        {
          who: "reikn", title: "Reiknari", time: "um 45 mínútur",
          steps: [
            { t: "Farðu yfir lausnarlistann. Stendur <strong>magn</strong> og <strong>eining</strong> við hverja línu? Lagaðu það sem vantar." },
            { t: "Sæktu <strong>Kostnaðaráætlun</strong> (hlekkur neðst á síðunni). Vistaðu afrit í möppuna <code>Verd</code> sem <code>Kostnadur_v1</code>.",
              hint: "Skjalið er Excel-skjal með tveimur flipum. Þú notar flipann <strong>Áætlun</strong>. Flipinn <strong>Verðlisti</strong> er gömul æfingagögn: ekki nota verðin þar." },
            { t: "Skrifaðu línurnar af lausnarlistanum í flipann <strong>Áætlun</strong>: dálkarnir <em>Vara</em>, <em>Eining</em> og <em>Magn</em>. Engin verð ennþá. Þau koma á degi 3." },
            { t: "Er tími eftir? Finndu fyrsta verðið í íslenskri vefverslun og límdu hlekkinn í dálkinn <em>Athugasemd</em>." },
          ],
        },
        {
          who: "oryggi", title: "Öryggi og heimildir", time: "um 45 mínútur",
          steps: [
            { t: "Búðu til Word-skjal í möppunni <code>Heimildir</code> sem heitir <code>Ahaettulisti</code>." },
            { t: "Skrifaðu <strong>að minnsta kosti þrjár línur</strong>: <em>Hvað gæti farið úrskeiðis eða þarf að athuga?</em> og <em>Hvernig athugum við það?</em>",
              hint: "Spurningar til að koma þér af stað: Hver má vinna við raflagnir í íbúð? Þolir rafkerfið það sem bætist við? Hvað þarf að staðfesta við viðskiptavininn áður en verkið byrjar? Þú þarft ekki að vita svörin í dag. Skrifaðu spurninguna og hvar svarið gæti verið." },
            { t: "Lestu lausnarlistann með öryggisaugum. Vantar eitthvað sem bætir <strong>rafmagnsöryggi</strong>? Segðu hópnum það." },
            { t: "Byrjaðu að leita að <strong>opinberri heimild</strong> um rafmagnsöryggi, til dæmis hjá HMS eða Vinnueftirlitinu. Límdu slóðina neðst í skjalið. Þú klárar þetta á degi 3." },
          ],
        },
        {
          who: "tilbod", title: "Tilboð og samskipti", time: "um 45 mínútur",
          steps: [
            { in3: "reikn", t: "Sæktu <strong>Tilboðssniðmát</strong> (hlekkur neðst á síðunni). Vistaðu afrit í möppuna <code>Tilbod</code> sem <code>Tilbod_v1</code>.",
              hint: "Skjalið er Excel-skjal. Þú notar flipann <strong>Tilboð</strong>. Þið þurfið ekki flipann Tímaskrá." },
            { in3: "reikn", t: "Fylltu í bláu reitina efst: <em>Fyrirtæki</em> (nafn sem hópurinn velur), <em>Viðskiptavinur</em> (Eigandi íbúðar 7), <em>Verkstaður</em> (Íbúð 7) og <em>Dagsetning</em>." },
            { in3: "oryggi", t: "Þegar lausnarlistinn er tilbúinn: skrifaðu línurnar í dálkana <em>Lýsing</em>, <em>Eining</em> og <em>Magn</em>. Engin verð ennþá." },
            { in3: "teikn", t: "<strong>Mappan:</strong> er hver skrá dagsins í réttri undirmöppu og með skýrt heiti? Lagaðu það sem er á röngum stað." },
          ],
        },
        {
          who: "lok", title: "Áður en þið farið", time: "5 mínútur",
          steps: [
            { t: "Hver og einn skrifar sína færslu í <strong>dagbókina</strong>. Sniðið er hér fyrir neðan." },
            { t: "Segið hvert öðru í einni setningu hvað þið kláruðuð í dag." },
          ],
        },
      ],
    },
    {
      n: 3, date: "2026-11-30", label: "mán. 30. nóv.", short: "Verð, öryggi og tilboð",
      title: "Verð, öryggi og tilboðsdrög",
      goal: "Í dag kemur verðið. Í lok dags vitið þið hvað lausnin kostar og hvort hún rúmast innan 1.500.000 kr.",
      done: [
        "Kostnadur_v1 með verði í hverri línu",
        "Að minnsta kosti fimm verð sannreynd, með hlekk",
        "Ein opinber heimild skráð og áhættulistinn kláraður",
        "Teikning_v1 passar við lausnarlistann",
        "Tilbod_v1 sýnir heildarverð sem er ekki hærra en 1.500.000 kr.",
      ],
      sections: [
        {
          who: "allir", title: "Byrjið saman", time: "10 mínútur",
          steps: [
            { t: "Opnið möppu hópsins og lesið síðustu færslurnar í dagbókinni." },
            { t: "Hver og einn segir í einni setningu hvað hann eða hún ætlar að klára í dag." },
            { t: "Var einhver fjarverandi síðast? Sýnið viðkomandi lausnarlistann og hvar verkið stendur." },
          ],
        },
        {
          who: "reikn", title: "Reiknari", time: "um 60 mínútur",
          steps: [
            { t: "Afritaðu lausnarlistann og biddu Copilot um <strong>ágiskun</strong> á verði og vinnutíma.",
              prompt: "Hér er listi yfir efni og búnað fyrir endurnýjun á íbúð á Íslandi. Giskaðu á einingarverð án VSK í íslenskum krónum og vinnustundir fyrir hverja línu. Settu svarið í töflu með dálkunum: Vara, Eining, Magn, Einingarverð án VSK, Vinnustundir. Þetta eru ágiskanir sem ég ætla að sannreyna. Listinn: [límdu lausnarlistann hér]" },
            { t: "Skrifaðu einingarverðin í <code>Kostnadur_v1</code>, flipann <strong>Áætlun</strong>, dálkinn <em>Einingarverð án VSK</em>. Skrifaðu <em>AI-ágiskun</em> í dálkinn <em>Athugasemd</em>." },
            { t: "<strong>Sannreyndu að minnsta kosti fimm verð.</strong> Finndu vöruna í íslenskri vefverslun, til dæmis Byko, Húsasmiðjunni, Bauhaus eða IKEA. Skrifaðu rétta verðið og límdu hlekkinn í <em>Athugasemd</em> í staðinn fyrir „AI-ágiskun“.",
              hint: "Verð í búðum er <strong>með VSK</strong>. Sniðmátið vill verð <strong>án VSK</strong> og bætir svo 24% við neðst. Deildu búðarverðinu með 1,24. Dæmi: 12.400 kr. í búð ÷ 1,24 = 10.000 kr. án VSK. Biddu teiknarann að sannreyna tvö af verðunum með þér." },
            { t: "Segðu þeim sem er með tilboðið <strong>einingarverðin</strong> og <strong>vinnustundirnar</strong>. Þau fara í <code>Tilbod_v1</code>." },
          ],
        },
        {
          who: "teikn", title: "Teiknari", time: "um 60 mínútur",
          steps: [
            { t: "Kláraðu teikninguna." },
            { t: "<strong>Berðu saman:</strong> teldu atriðin á teikningunni og línurnar á lausnarlistanum. Er allt á listanum á teikningunni, og öfugt? Lagaðu það sem passar ekki." },
            { t: "Vistaðu <code>Teikning_v1</code> og taktu skjáskot af henni. Hvort tveggja fer í möppuna <code>Teikning</code>.",
              hint: "Skjáskot: <strong>Windows + Shift + S</strong>, dragðu utan um teikninguna, límdu í Paint og vistaðu sem <code>Teikning_v1.png</code>." },
            { t: "Hjálpaðu reiknaranum: sannreyndu <strong>tvö verð</strong> í vefverslun og sendu honum eða henni hlekkina." },
          ],
        },
        {
          who: "oryggi", title: "Öryggi og heimildir", time: "um 60 mínútur",
          steps: [
            { t: "Finndu <strong>eina opinbera heimild</strong> um rafmagnsöryggi sem skiptir máli fyrir lausnina, til dæmis hjá HMS eða Vinnueftirlitinu.",
              hint: "Opinber heimild er frá stofnun eða úr lögum og reglugerðum, ekki frá verslun, bloggi eða AI. Leitaðu til dæmis að „rafmagnsöryggi“ á hms.is eða að reglugerð á island.is/reglugerdir." },
            { t: "Búðu til Word-skjal í möppunni <code>Heimildir</code> sem heitir <code>Heimild</code>. Skrifaðu þrjár línur: <em>Slóð</em>, <em>Hvað segir heimildin</em> (ein setning með þínum orðum) og <em>Hvað þýðir það fyrir lausnina okkar</em>." },
            { t: "Spurðu Copilot sömu spurningar og berðu svarið saman við heimildina, eins og í Verk 18. Skrifaðu eina línu: <em>Copilot sagði ___. Heimildin segir ___.</em>" },
            { t: "Kláraðu <code>Ahaettulisti</code>: að minnsta kosti þrjár línur, og við hverja stendur hvernig þið athugið málið." },
          ],
        },
        {
          who: "tilbod", title: "Tilboð og samskipti", time: "um 60 mínútur",
          steps: [
            { in3: "teikn", t: "Opnaðu <code>Tilbod_v1</code>. Fáðu tölurnar hjá reiknaranum og skrifaðu <em>Einingarverð</em> í hverja línu." },
            { in3: "reikn", t: "Skrifaðu <strong>vinnuna í krónum</strong> í dálkinn <em>Vinna</em>: vinnustundir × 9.000 kr.",
              hint: "Tímagjaldið í þessu verkefni er <strong>9.000 kr. á klukkustund án VSK</strong>. Dæmi: 4 vinnustundir × 9.000 = 36.000 kr. Græni reiturinn <em>Tilboð samtals</em> neðst reiknar efni, vinnu og VSK saman." },
            { in3: "oryggi", t: "Skrifaðu <strong>forsendur</strong> neðst í tilboðið: hvað er innifalið, hvað er ekki innifalið og tvö til þrjú atriði sem þarf að staðfesta við viðskiptavininn." },
            { in3: "teikn", t: "<strong>Mappan:</strong> er hver skrá í réttri undirmöppu og með skýrt heiti?" },
          ],
        },
        {
          who: "lok", title: "Saman áður en þið farið", time: "10 mínútur",
          steps: [
            { t: "<strong>Passar allt saman?</strong> Sömu atriðin eiga að vera á teikningunni, í <code>Kostnadur_v1</code> og í <code>Tilbod_v1</code>." },
            { t: "Lesið græna reitinn <em>Tilboð samtals</em> í <code>Tilbod_v1</code>. Er talan <strong>1.500.000 kr. eða lægri</strong>? Ef ekki: ákveðið saman hvað þið minnkið og lagið listann, teikninguna og verðin." },
            { t: "Hver og einn skrifar sína færslu í <strong>dagbókina</strong>." },
          ],
        },
      ],
    },
    {
      n: 4, date: "2026-12-01", label: "þri. 1. des.", short: "Viðskiptavinurinn breytir",
      title: "Viðskiptavinurinn breytir",
      goal: "Í dag koma ný skilaboð frá viðskiptavininum. Þið bregðist við án þess að skerða öryggi.",
      done: [
        "Útgáfa 1 er óbreytt og útgáfa 2 er til af teikningu, kostnaði og tilboði",
        "Tilbod_v2 rúmast innan nýja fjárhagsrammans",
        "Svar til viðskiptavinar er skrifað",
        "Allir hafa skrifað í dagbókina",
      ],
      // Shown from the start of class on day 4. Before that the page says when it opens.
      message: {
        opens: "2026-12-01T10:25:00Z",
        locked: "Skilaboðin frá viðskiptavininum opnast þriðjudaginn 1. desember kl. 10:25.",
        from: "Eigandi íbúðar 7",
        text: "Sæl. Ég þarf því miður að lækka hámarkið um 150.000 kr. Nýtt hámark er <strong>1.350.000 kr.</strong> með efni og vinnu. Hvað leggið þið til? Kveðja, eigandi íbúðar 7.",
      },
      sections: [
        {
          who: "allir", title: "Byrjið saman", time: "um 25 mínútur",
          steps: [
            { t: "Lesið <strong>skilaboðin frá viðskiptavininum</strong> efst á síðunni." },
            { t: "<strong>Búið til útgáfu 2.</strong> Afritið þrjár skrár og breytið bara afritunum: <code>Kostnadur_v1</code> → <code>Kostnadur_v2</code>, <code>Tilbod_v1</code> → <code>Tilbod_v2</code> og <code>Teikning_v1</code> → <code>Teikning_v2</code>. Útgáfa 1 á að haldast óbreytt.",
              hint: "Í OneDrive: hægrismelltu á skrána → <strong>Afrita í</strong> → sama mappa → endurnefndu afritið. Hvert hlutverk afritar sína skrá." },
            { t: "<strong>Ákveðið saman:</strong> hvað breytist og hvað helst? Skrifið tvær til fjórar línur í nýtt Word-skjal í möppunni <code>Tilbod</code> sem heitir <code>Svar_til_vidskiptavinar</code>: <em>Við breyttum ___. Það sparar ___ kr. Við völdum þetta því ___.</em>" },
            { t: "<strong>Regla:</strong> öryggi má ekki skerða. Sá eða sú sem er með Öryggi og heimildir segir nei ef einhver vill spara á öryggisatriði." },
          ],
        },
        {
          who: "reikn", title: "Reiknari", time: "um 30 mínútur",
          steps: [
            { t: "Breyttu <code>Kostnadur_v2</code> eins og hópurinn ákvað: minnkaðu magn, veldu ódýrari vöru eða taktu línu út." },
            { t: "Breyttirðu vöru? Finndu nýja verðið í vefverslun og límdu hlekkinn í <em>Athugasemd</em>." },
            { t: "Segðu þeim sem er með tilboðið nýju tölurnar." },
          ],
        },
        {
          who: "teikn", title: "Teiknari", time: "um 30 mínútur",
          steps: [
            { t: "Breyttu <code>Teikning_v2</code> svo hún sýni lausnina eins og hún er núna. Það sem var tekið út á ekki að sjást." },
            { t: "Berðu <code>Teikning_v2</code> saman við <code>Kostnadur_v2</code>: sömu atriði á báðum stöðum?" },
            { t: "Taktu skjáskot og vistaðu í möppuna <code>Teikning</code> sem <code>Teikning_v2.png</code>." },
          ],
        },
        {
          who: "oryggi", title: "Öryggi og heimildir", time: "um 30 mínútur",
          steps: [
            { t: "Berðu útgáfu 2 saman við <code>Ahaettulisti</code>. Var eitthvað tekið út sem skiptir máli fyrir öryggi? Ef svo er: láttu hópinn setja það aftur inn og spara annars staðar." },
            { t: "Skrifaðu eina línu í <code>Svar_til_vidskiptavinar</code>: <em>Öryggi: ___ helst óbreytt því ___.</em>" },
          ],
        },
        {
          who: "tilbod", title: "Tilboð og samskipti", time: "um 30 mínútur",
          steps: [
            { in3: "reikn", t: "Breyttu <code>Tilbod_v2</code> með nýju tölunum úr Kostnadur_v2. Er græni reiturinn <em>Tilboð samtals</em> innan nýja hámarksins?" },
            { in3: "oryggi", t: "Skrifaðu <strong>svar til viðskiptavinar</strong> efst í <code>Svar_til_vidskiptavinar</code>, þrjár til fimm setningar: þakkaðu fyrir skilaboðin, segðu hvað breytist, hvað helst, nýja heildarverðið og hvað gerist næst.",
              hint: "Skrifaðu kurteislega og skýrt, eins og í Verk 9. Engin slanguryrði og engar afsakanir. Viðskiptavinurinn á að skilja svarið án þess að opna önnur skjöl." },
          ],
        },
        {
          who: "lok", title: "Áður en þið farið", time: "5 mínútur",
          steps: [
            { t: "Var útgáfa 1 þegar innan nýja hámarksins? Þá er útgáfa 2 eins og útgáfa 1, og svarið segir viðskiptavininum að lausnin rúmist enn." },
            { t: "Hver og einn skrifar sína færslu í <strong>dagbókina</strong>." },
          ],
        },
      ],
    },
    {
      n: 5, date: "2026-12-07", label: "mán. 7. des.", short: "Frágangur og skil",
      title: "Tilboð, frágangur og skil",
      goal: "Í dag klárið þið og skilið. Á morgun, þriðjudaginn 8. desember, kynnið þið lausnina. Hver hópur fær 10 mínútur.",
      done: [
        "Tilboðið er til sem PDF og opnast",
        "AI-yfirlýsing hópsins er skrifuð",
        "ZIP-skrá og PDF eru komin í Canvas",
        "Hópurinn veit hver segir hvað í kynningunni",
      ],
      sections: [
        {
          who: "tilbod", title: "Tilboð og samskipti", time: "um 25 mínútur",
          steps: [
            { in3: "reikn", t: "Opnaðu <code>Tilbod_v2</code>. Lestu hverja línu: stemma tölurnar við <code>Kostnadur_v2</code>? Eru forsendurnar neðst enn réttar?" },
            { in3: "teikn", t: "Vistaðu tilboðið sem PDF í möppuna <code>Afhending</code>: <code>Tilbod_Ibud7_Hopur[númer].pdf</code>.",
              hint: "Í Excel: <strong>Skrá → Flytja út → Sækja sem PDF</strong> (eða Prenta → Vista sem PDF). Veldu bara flipann Tilboð." },
            { in3: "oryggi", t: "Opnaðu PDF-skjalið. Sést allt tilboðið á einni síðu? Er heildarverðið rétt?" },
          ],
        },
        {
          who: "reikn", title: "Reiknari", time: "um 25 mínútur",
          steps: [
            { t: "Eru <code>Kostnadur_v1</code> og <code>Kostnadur_v2</code> báðar í möppunni <code>Verd</code>? Opnast þær?" },
            { t: "Smelltu á hvern hlekk í dálknum <em>Athugasemd</em>. Virka að minnsta kosti fimm, og er verðið á síðunni það sama og í töflunni?" },
          ],
        },
        {
          who: "teikn", title: "Teiknari", time: "um 25 mínútur",
          steps: [
            { t: "Eru <code>Teikning_v1</code> og <code>Teikning_v2</code> og skjáskot af báðum í möppunni <code>Teikning</code>? Opnast þær?" },
            { t: "Veldu skjáskotið sem hópurinn sýnir í kynningunni á morgun." },
          ],
        },
        {
          who: "oryggi", title: "Öryggi og heimildir", time: "um 25 mínútur",
          steps: [
            { t: "Eru <code>Ahaettulisti</code> og <code>Heimild</code> í möppunni <code>Heimildir</code>? Smelltu á slóðina: opnast heimildin?" },
            { t: "Lestu áhættulistann einu sinni enn. Á hann enn við um útgáfu 2?" },
          ],
        },
        {
          who: "allir", title: "Klárið saman", time: "um 45 mínútur",
          steps: [
            { t: "<strong>AI-yfirlýsing hópsins.</strong> Búið til Word-skjal í möppunni <code>Afhending</code> sem heitir <code>AI_yfirlysing</code>. Hver og einn skrifar eina línu: <em>[hlutverk]: Ég notaði Copilot til að ___. Ég athugaði það með því að ___.</em>" },
            { t: "Bætið við einni línu frá hópnum: <em>⛔ Ef viðskiptavinurinn væri raunverulegur myndum við aldrei setja ___ í AI, því ___.</em>",
              hint: "Í þessu verkefni er viðskiptavinurinn tilbúinn. Hugsið um raunverulegt verk: hvaða upplýsingar um fólk, heimili eða greiðslur ættu aldrei að fara í AI?" },
            { t: "<strong>Farið yfir möppuna:</strong> dagbókin, tvær teikningar, lausnarlistinn, tvær kostnaðaráætlanir, áhættulistinn, heimildin, tvö tilboð, svarið til viðskiptavinar, PDF-tilboðið og AI-yfirlýsingin. Vantar eitthvað?" },
            { t: "Hver og einn skrifar <strong>síðustu færsluna í dagbókina</strong>." },
            { t: "<strong>Búið til ZIP-skrá.</strong> Sækið alla möppuna úr OneDrive. Skráin á að heita <code>Ibud7_Hopur[númer].zip</code>.",
              hint: "Í OneDrive á vefnum: merktu við möppuna → <strong>Sækja</strong>. OneDrive býr sjálft til ZIP-skrá sem lendir í Downloads. Endurnefndu hana ef hún heitir annað." },
            { t: "<strong>Einn úr hópnum skilar í Canvas:</strong> ZIP-skránni og PDF-tilboðinu, í einni skilatilraun. Hinir horfa á og staðfesta að báðar skrárnar séu komnar inn." },
            { t: "<strong>Kynningin á morgun:</strong> hver hópur fær 10 mínútur, fyrir kynningu og spurningar. Ákveðið hver segir hvað: vandinn, lausnin, verðið og breytingin." },
          ],
        },
      ],
    },
  ],
};
