async function main() {
  const r = await fetch("https://api.geckoterminal.com/api/v2/networks/robinhood/pools?page=1");
  const d = await r.json();

  console.log("Pools reçus :", d.data.length);

  d.data.slice(0, 5).forEach(p => {
    const a = p.attributes;
    console.log("---");
    console.log(a.name);
    console.log("  créé:", a.pool_created_at);
    console.log("  vol24h:", a.volume_usd?.h24);
    console.log("  var24h:", a.price_change_percentage?.h24);
    console.log("  achats/ventes 24h:", a.transactions?.h24?.buys, "/", a.transactions?.h24?.sells);
    console.log("  liquidité:", a.reserve_in_usd);
  });
}

main();