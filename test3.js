async function chercher() {
  for (let page = 1; page <= 4; page++) {
    const r = await fetch("https://api.geckoterminal.com/api/v2/networks?page=" + page);
    const d = await r.json();

    if (d.data.length === 0) {
      console.log("Page " + page + " : vide, fin de la liste.");
      break;
    }

    const trouves = d.data
      .map(x => ({ id: x.id, nom: x.attributes.name }))
      .filter(x => x.nom.toLowerCase().includes("robin") || x.id.includes("robin"));

    console.log("Page " + page + " : " + d.data.length + " réseaux, trouvés :", trouves);
  }
}

chercher();