async function main() {
  const r = await fetch("https://api.geckoterminal.com/api/v2/networks/robinhood/trending_pools?page=1");
  const d = await r.json();
  const pool = d.data.find(p => Number(p.attributes.reserve_in_usd) < 15000000);
  const adresse = pool.attributes.address;
  console.log("Pool testé :", pool.attributes.name, "\n");

  const r2 = await fetch("https://api.geckoterminal.com/api/v2/networks/robinhood/pools/" + adresse + "/trades");
  console.log("HTTP", r2.status);
  if (!r2.ok) return;

  const t = await r2.json();
  console.log("Trades reçus :", t.data.length);
  console.log("\nExemple :");
  console.log(JSON.stringify(t.data[0].attributes, null, 2));
}

main();