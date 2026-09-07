async function main() {
  const r = await fetch("https://api.geckoterminal.com/api/v2/networks/robinhood/trending_pools?page=1");
  console.log("HTTP", r.status);
  if (!r.ok) return;
  const d = await r.json();
  console.log("Pools :", d.data.length);
  d.data.forEach(p => {
    const a = p.attributes;
    console.log(a.name, "| vol24h:", Math.round(a.volume_usd?.h24), "| var24h:", a.price_change_percentage?.h24, "| b/s:", a.transactions?.h24?.buys, "/", a.transactions?.h24?.sells, "| liq:", Math.round(a.reserve_in_usd));
  });
}

main();