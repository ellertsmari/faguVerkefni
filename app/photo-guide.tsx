const guides = [
  {
    name: "Inna", key: "inna", steps: [
      ["Opnaðu valmyndina", "Skráðu þig inn á nam.inna.is í vafra. Opnaðu valmyndina við prófílmyndina efst og veldu Stillingar.", "menu"],
      ["Veldu Breyta mynd", "Í Stillingum skaltu opna fellihlutann Breyta mynd. Ekki breyta persónuupplýsingum eða innskráningarstillingum.", "settings"],
      ["Veldu myndina og staðfestu", "Smelltu á Viðhengi og veldu eigin JPEG- eða PNG-mynd. Fylgdu staðfestingu sem birtist. Endurhladdu svo síðunni og athugaðu hvort nýja myndin haldist.", "upload"],
    ],
  },
  {
    name: "Canvas", key: "canvas", steps: [
      ["Opnaðu Reikningur", "Skráðu þig inn á canvas.tskoli.is. Í mjóum glugga opnarðu fyrst Aðalvalmynd. Veldu Reikningur og síðan Stillingar.", "menu"],
      ["Smelltu á prófílmyndina", "Í Stillingum smellirðu á hringlaga prófílmyndina við nafnið þitt.", "settings"],
      ["Hladdu upp og vistaðu", "Veldu Hlaða upp mynd í Myndavalkostum. Smelltu á choose a picture, veldu myndina og stilltu skurðinn ef sá valkostur birtist. Smelltu á Vista. Endurhladdu síðunni og athugaðu myndina.", "upload"],
    ],
  },
];

export default function PhotoGuide() {
  return <section className="photo-guides" aria-label="Myndaleiðbeiningar">
    <h3>Hjálp þegar þú þarft hana</h3>
    <details><summary>Góð prófílmynd og manneskjan á bak við verkið</summary>
      <div className="guide-content">
        <p>Notaðu mjúka dagsbirtu framan á andlitið, ekki bjartan glugga fyrir aftan þig. Hafðu vélina í augnhæð og einfaldan bakgrunn. Horfðu í linsuna, hafðu eðlilegan svip og sýndu höfuð og herðar. Prófaðu myndina litla og hringlaga: sést andlitið enn skýrt?</p>
        <p>Góð prófílmynd þarf ekki dýra vél, sérstök föt eða fegrunarsíu. Hún á að sýna þig eins og þú ert. Forðastu annað fólk í myndinni og persónulegar upplýsingar í bakgrunni.</p>
        <p>Viðskiptavinur sem sér andlitið á bak við vöru eða þjónustu getur átt auðveldara með að þekkja þann sem vinnur verkið og vita við hvern á að tala. Það getur aukið persónuleg tengsl og traust. Mynd sannar þó hvorki hæfni né heiðarleika: vönduð vinna, skýrar upplýsingar og efnd loforð þurfa að standa á bak við hana.</p>
      </div>
    </details>
    {guides.map(guide => <details key={guide.key}>
      <summary>{guide.name}: skref fyrir skref með skjámyndum</summary>
      <div className="guide-content">
        {guide.key === "inna" && <p>Skjámyndirnar eru úr kennaraaðgangi. Útlit nemendaaðgangs getur verið öðruvísi. Ef Breyta mynd vantar skaltu fá kennara til að aðstoða; ekki breyta aðgangsstillingum.</p>}
        <ol>{guide.steps.map(([title, text, file]) => <li key={file}><h4>{title}</h4><p>{text}</p>
          {/* Actual interface captures; identifying pixels were permanently replaced before publication. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/guides/${guide.key}-${file}.png`} alt={`${guide.name}: ${title}. Persónuupplýsingar afmáðar; aðgerð afmörkuð með appelsínugulum ramma.`} loading="lazy" />
        </li>)}</ol>
        {guide.key === "canvas" && <p><a href="https://community.instructure.com/en/kb/articles/662885-how-do-i-add-a-profile-picture-in-my-user-account" target="_blank" rel="noopener noreferrer">Opinberar Canvas-leiðbeiningar um prófílmynd</a></p>}
      </div>
    </details>)}
    <details><summary>Persónuvernd eða tæknilegt vandamál?</summary><div className="guide-content">
      <p>Skjámyndirnar hér eru afmáðar til að vernda reikning kennara. Í þínum skilum á eigin prófílmynd að sjást, en skerðu burt eða hyljið kennitölu, netfang, einkunnir og upplýsingar um aðra. Ekki senda hráar skjámyndir í AI.</p>
      <p>Ef kerfið leyfir ekki myndabreytingu skaltu skrá hvaða skref stöðvaðist og sýna kennara örugga skjámynd af villunni. Ekki búa til falska staðfestingu. Ef þú hefur persónuverndaráhyggjur skaltu ræða við kennara um einkasýningu eða aðra leið til að staðfesta vinnuna áður en þú birtir mynd.</p>
    </div></details>
  </section>;
}
