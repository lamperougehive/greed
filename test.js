const url = "https://api.dexscreener.com/latest/dex/search?q=robinhood";

fetch(url)
  .then(reponse => reponse.json())
  .then(donnees => {
    console.log("Nombre de paires trouvées :", donnees.pairs.length);
    console.log("Première paire :");
    console.log(JSON.stringify(donnees.pairs[0], null, 2));
  })
  .catch(erreur => console.log("Erreur :", erreur.message));