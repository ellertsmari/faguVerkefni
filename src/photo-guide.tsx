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
    <details><summary>Góð selfie og manneskjan á bak við verkið</summary>
      <div className="guide-content">
        <p>Þú þarft bara símann þinn. Snúðu þér að glugga eða ljósi svo birtan lendi á andlitinu, ekki fyrir aftan þig. Haltu símanum í augnhæð eða fáðu vin til að taka myndina. Hafðu einfaldan bakgrunn, horfðu í myndavélina, hafðu eðlilegan svip og láttu höfuð og herðar sjást. Prófaðu að minnka myndina í hring í huganum: sést andlitið enn skýrt?</p>
        <p>Góð prófílmynd þarf ekki sérstök föt, betri síma eða síu. Hún á að sýna þig eins og þú ert dags daglega. Forðastu annað fólk á myndinni og persónulegar upplýsingar í bakgrunni.</p>
        <p>Viðskiptavinur sem sér andlitið á bak við vöru eða þjónustu veit við hvern hann er að tala og á auðveldara með að treysta verkinu. Mynd sannar þó hvorki hæfni né heiðarleika: vönduð vinna, skýr svör og efnd loforð þurfa að standa á bak við hana.</p>
      </div>
    </details>
    {guides.map(guide => <details key={guide.key}>
      <summary>{guide.name}: skref fyrir skref með skjámyndum</summary>
      <div className="guide-content">
        {guide.key === "inna" && <p>Skjámyndirnar eru úr kennaraaðgangi. Útlit nemendaaðgangs getur verið öðruvísi. Ef Breyta mynd vantar skaltu fá kennara til að aðstoða; ekki breyta aðgangsstillingum.</p>}
        <ol>{guide.steps.map(([title, text, file]) => <li key={file}><h4>{title}</h4><p>{text}</p>
          {/* Actual interface captures; identifying pixels were permanently replaced before publication. */}
          <img src={`${import.meta.env.BASE_URL}guides/${guide.key}-${file}.png`} alt={`${guide.name}: ${title}. Persónuupplýsingar afmáðar; aðgerð afmörkuð með appelsínugulum ramma.`} loading="lazy" />
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
