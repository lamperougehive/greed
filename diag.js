const BASE = "https://api.geckoterminal.com/api/v2/networks/robinhood";
const pause = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const r = await fetch(BASE + "/trending_pools?page=1");
  const d = await r.json();
  const pools = d.data.map(p => p.attributes).filter(a => {
    const l = Number(a.reserve_in_usd) || 0;
    return l > 0 && l < 15000000;
  });

  for (const a of pools) {
    const rt = await fetch(BASE + "/pools/" + a.address + "/trades");
    let info = "HTTP " + rt.status;
    if (rt.ok) {
      const t = await rt.json();
      info += " | " + (t.data ? t.data.length : "?") + " trades";
    } else {
      info += " | " + (await rt.text()).slice(0, 120);
    }
    console.log(a.name.padEnd(24), info);
    await pause(3000);
  }
}

main();