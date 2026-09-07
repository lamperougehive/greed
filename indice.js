const fs = require("fs");
const BASE = "https://api.geckoterminal.com/api/v2/networks/robinhood";
const SEUIL_LIQ_MAX = 15000000;
const COUVERTURE_MIN = 0.80;

const pause = ms => new Promise(r => setTimeout(r, ms));
const borner = (v, min, max) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
const mediane = l => {
  const t = [...l].sort((a, b) => a - b);
  const m = Math.floor(t.length / 2);
  return t.length % 2 ? t[m] : (t[m - 1] + t[m]) / 2;
};

async function trades(adresse) {
  for (let essai = 1; essai <= 4; essai++) {
    const r = await fetch(BASE + "/pools/" + adresse + "/trades");
    if (r.ok) return (await r.json()).data;
    if (r.status === 429) {
      await pause(essai * 8000);
      continue;
    }
    return null;
  }
  return null;
}

async function main() {
  const r = await fetch(BASE + "/trending_pools?page=1");
  const d = await r.json();

  const pools = d.data.map(p => p.attributes).filter(a => {
    const l = Number(a.reserve_in_usd) || 0;
    return l > 0 && l < SEUIL_LIQ_MAX;
  });

  console.log("Univers :", pools.length, "pools\n");

  const ratios = [];
  const echecs = [];

  for (const a of pools) {
    const t = await trades(a.address);
    if (!t) {
      echecs.push(a.name);
      console.log("  " + a.name.padEnd(24), "ECHEC");
    } else {
      let achat = 0, vente = 0;
      t.forEach(x => {
        const v = Number(x.attributes.volume_in_usd) || 0;
        if (x.attributes.kind === "buy") achat += v; else vente += v;
      });
      if (achat + vente > 0) {
        const ratio = achat / (achat + vente);
        ratios.push(ratio);
        console.log("  " + a.name.padEnd(24), ratio.toFixed(3));
      } else {
        echecs.push(a.name);
        console.log("  " + a.name.padEnd(24), "vide");
      }
    }
    await pause(4000);
  }

  const couverture = ratios.length / pools.length;
  console.log("\nCouverture :", ratios.length + "/" + pools.length, "(" + Math.round(couverture * 100) + "%)");

  if (couverture < COUVERTURE_MIN) {
    console.log("\nCOUVERTURE INSUFFISANTE — aucun indice publié.");
    console.log("Manquants :", echecs.join(", "));
    return;
  }

  const ratioMedian = mediane(ratios);
  const flux = borner(ratioMedian, 0.35, 0.65);

  const hausses = pools.filter(a => Number(a.price_change_percentage?.h24) > 0).length;
  const largeur = (hausses / pools.length) * 100;

  const med24 = mediane(pools.map(a => Number(a.price_change_percentage?.h24) || 0));
  const momentum = borner(med24, -30, 30);

  const med1h = mediane(pools.map(a => Number(a.price_change_percentage?.h1) || 0));
  const tendance = borner(med1h, -5, 5);

  const indice = Math.round((flux + tendance + largeur + momentum) / 4);

  console.log("\n----------------------------------");
  console.log("Flux      ", Math.round(flux), "   ( médiane achat", ratioMedian.toFixed(3), ")");
  console.log("Tendance  ", Math.round(tendance), "   ( médiane 1h ", med1h.toFixed(2), "% )");
  console.log("Largeur   ", Math.round(largeur), "   (", hausses, "/", pools.length, "en hausse )");
  console.log("Momentum  ", Math.round(momentum), "   ( médiane 24h", med24.toFixed(2), "% )");
  console.log("----------------------------------");
  console.log("INDICE :", indice);

  const hist = fs.existsSync("historique.json")
    ? JSON.parse(fs.readFileSync("historique.json", "utf8"))
    : [];

  hist.push({
    date: new Date().toISOString(),
    indice,
    flux: Math.round(flux),
    tendance: Math.round(tendance),
    largeur: Math.round(largeur),
    momentum: Math.round(momentum),
    poolsUnivers: pools.length,
    poolsFlux: ratios.length,
        couverture: Math.round(couverture * 100),
    univers: pools.map(a => a.name)
  });

  fs.writeFileSync("historique.json", JSON.stringify(hist, null, 2));
  console.log("\nEnregistré. Total :", hist.length, "mesure(s).");
}

main();