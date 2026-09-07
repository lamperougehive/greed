const url = "https://api.dexscreener.com/latest/dex/search?q=robinhood";

fetch(url)
  .then(reponse => reponse.json())
  .then(donnees => {
    console.log("Total :", donnees.pairs.length);

    const chaines = {};
    donnees.pairs.forEach(paire => {
      chaines[paire.chainId] = (chaines[paire.chainId] || 0) + 1;
    });
    console.log("Répartition par chaîne :", chaines);

    console.log("\nLes 30 tokens :");
    donnees.pairs.forEach(paire => {
      console.log(paire.chainId, "|", paire.baseToken.symbol, "|", paire.baseToken.name);
    });
  });