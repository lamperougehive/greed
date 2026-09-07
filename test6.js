async function main() {
  for (let page = 1; page <= 10; page++) {
    const r = await fetch("https://api.geckoterminal.com/api/v2/networks/robinhood/new_pools?page=" + page);
    if (!r.ok) { console.log("Page", page, "-> HTTP", r.status); break; }
    const d = await r.json();
    if (!d.data || d.data.length === 0) { console.log("Page", page, "-> vide"); break; }

    const dates = d.data.map(p => p.attributes.pool_created_at);
    console.log("Page", page, "|", d.data.length, "pools | du", dates[dates.length-1], "au", dates[0]);

    await new Promise(r => setTimeout(r, 2500));
  }
}

main();