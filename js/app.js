// ============================================================
//  Ma ToDo — point de départ
//  Écran unique, sans routage.
// ============================================================

var $$ = Dom7; // utilitaire DOM intégré à Framework7

var app = new Framework7({
  el: "#app",
  name: "MaToDo",
  theme: "auto",
});

// ------------------------------------------------------------
//  SÉANCE 2 — déclarer le tableau des tâches, puis :
//    - une fonction afficher() qui construit la liste
//    - une fonction ajouterTache(texte)
//    - une fonction supprimerTache(id)
//-------------------------------------------------------------

var taches = [
  { id: 1, texte: "Réviser l'algorithmique", fait: true },
  { id: 2, texte: "Réviser JavaScript", fait: true },
  { id: 3, texte: "Réviser React et Java", fait: true },
  { id: 4, texte: "Préparer le cadeau pour la fête des mères", fait: false },
  { id: 5, texte: "Apprendre C, C# et C++", fait: false },
];

function ligneTache(t) {
  return `<li class="item-content" data-id="${t.id}">
            <div class="item-media">
                <label class="checkbox">
                    <input type="checkbox" ${t.fait ? "checked" : ""}/>
                    <i class="icon-checkbox"></i>
                </label>
            </div>
            <div class="item-inner">
                <div class="item-title">${t.texte}</div>
                <div class="item-after">  
                    <a href="#" class="btn-suppr custom-color"><i class="icon f7-icons">trash</i></a>  
                </div>
            </div>
        </li>`;
}

function afficherTache() {
  $$(".liste-taches").html(taches.map(ligneTache).join(""));
}

afficherTache(); // premier affichage

// Ajout de la logique d'ajout via le bouton ajouter une taches

function ajouterTache(texte) {
  if (texte.trim() === "") return;
  var nouvelId =
    taches.reduce(function (m, t) {
      return Math.max(m, t.id);
    }, 0) + 1;
  taches.push({ id: nouvelId, texte: texte.trim(), fait: false });
  afficherTache();
}
$$(document).on("click", "#btn-ajouter", function () {
  var champ = $$("#champ-tache");
  ajouterTache(champ.val());
  champ.val("");
});

// Ajout de la logique de suppression via le bouton supprimer une taches

function supprimerTache(id) {
  taches = taches.filter(function (t) {
    return t.id !== parseInt(id, 10);
  });
  afficherTache();
}
$$(document).on("click", ".btn-suppr", function (e) {
  e.preventDefault();
  var id = $$(this).parents(".item-content").attr("data-id");
  supprimerTache(id);
});

//  SÉANCE 3 — ajouter :
//    - basculerTache(id) pour cocher / décocher
//    - le compteur de tâches restantes
//    - les filtres (Toutes / À faire / Faites)
//    - chargerTaches() et sauvegarder() avec localStorage
// ------------------------------------------------------------

// Exemple de structure de données (à activer en séance 2) :
// var taches = [
//   { id: 1, texte: "Réviser l'algorithmique", fait: false },
// ];
