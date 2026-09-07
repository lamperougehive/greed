async function main() {
  const r = await fetch("https://api.geckoterminal.com/api/v2/networks/robinhood/trending_pools?page=1");
  const d = await r.json();
  console.log(JSON.stringify(d.data[0].attributes, null, 2));
}

main();