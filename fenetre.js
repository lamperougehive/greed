async function main() {
  const r = await fetch("https://api.geckoterminal.com/api/v2/networks/robinhood/trending_pools?page=1");
  const d = await r.json();
  const pools = d.data.filter(p => Number(p.attributes.reserve_in_usd) < 15000000).slice(0, 3);

  for (const p of pools) {
    const r2 = await fetch("https://api.geckoterminal.com/api/v2/networks/robinhood/pools/" + p.attributes.address + "/trades");
    const t = await r2.json();

    const dates = t.data.map(x => new Date(x.attributes.block_timestamp));
    const recent = new Date(Math.max(...dates));
    const ancien = new Date(Math.min(...dates));
    const heures = (recent - ancien) / 3600000;

    let achat = 0, vente = 0;
    t.data.forEach(x => {
      const v = Number(x.attributes.volume_in_usd) || 0;
      if (x.attributes.kind === "buy") achat += v; else vente += v;
    });

    console.log(p.attributes.name);
    console.log("   ", t.data.length, "trades sur", heures.toFixed(2), "h");
    console.log("    achat:", Math.round(achat), "$ | vente:", Math.round(vente), "$ | ratio:", (achat/(achat+vente)).toFixed(3));
    console.log("    (vol 24h annoncé:", Math.round(Number(p.attributes.volume_usd.h24)), "$)");
    console.log("");

    await new Promise(r => setTimeout(r, 3000));
  }
}

main();