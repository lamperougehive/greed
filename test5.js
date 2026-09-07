async function main() {
  const r = await fetch("https://api.geckoterminal.com/api/v2/networks/robinhood/new_pools?page=1");
  const d = await r.json();

  console.log("Pools reçus :", d.data.length);

  d.data.forEach(p => {
    const a = p.attributes;
    console.log("---");
    console.log(a.name, "|", a.pool_created_at);
    console.log("  vol24h:", a.volume_usd?.h24, "| liq:", a.reserve_in_usd, "| fdv:", a.fdv_usd);
    console.log("  var24h:", a.price_change_percentage?.h24, "| b/s:", a.transactions?.h24?.buys, "/", a.transactions?.h24?.sells);
  });
}

main();