// ============================================================
//  Ma ToDo — point de départ
//  Écran unique, sans routage.
// ============================================================

var $$ = Dom7; // utilitaire DOM intégré à Framework7

var app = new Framework7({
  el: "#app",
  name: "MaToDo",
  theme: "auto",
  routes: routes,
});

var mainView = app.views.create(".view-main", { url: "/" });

//
// ======================VARIABLES======================================
//

let filtreActif = "toutes";

//Cle de sauvegarde pour le localStorage (browser)
let LS_CLE = "todolist";

let taches = chargerTaches();

//==============================================
//LOCALSTORAGE
//==============================================

// Sauvegarder : objet -> texte
function sauvegarder() {
  localStorage.setItem(LS_CLE, JSON.stringify(taches));
}

// Charger : texte -> objet (ou tâches d'exemple la première fois)
function chargerTaches() {
  const data = localStorage.getItem(LS_CLE);
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

//==============================================
//ACTION
//==============================================

//
// ======================FUNCTION=======================================
//

function ligneTache(t) {
  return `<li class="item-content" data-id="${t.id}">
            <div class="item-media">
                <label class="checkbox">
                    <input type="checkbox" ${t.fait ? "checked" : ""}/>
                    <i class="icon-checkbox"></i>
                </label>
            </div>
            <div class="item-inner">
                <div class="item-title ${t.fait ? "tache-faite" : ""}">${t.texte}</div>
                <div class="item-after">  
                    <a href="#" class="btn-suppr custom-color"><i class="icon f7-icons">trash</i></a>  
                </div>
            </div>
        </li>`;
}

function afficherTache() {
  $$(".liste-taches").html(tachesVisibles().map(ligneTache).join(""));

  // Compte le nombre de taches restantes
  const nbreTachesrestantes = tachesVisibles().filter(function (t) {
    return !t.fait;
  }).length;
  $$(".compteur").text(nbreTachesrestantes + " tâche(s) restante(s)");
}

// Ajout de la logique d'ajout via le bouton ajouter une taches
function ajouterTache(texte) {
  if (texte.trim() === "") return;
  var nouvelId =
    taches.reduce(function (m, t) {
      return Math.max(m, t.id);
    }, 0) + 1;
  taches.push({ id: nouvelId, texte: texte.trim(), fait: false });
  sauvegarder();
  afficherTache();
}

// Ajout de la logique de suppression via le bouton supprimer une taches
function supprimerTache(id) {
  taches = taches.filter(function (t) {
    return t.id !== parseInt(id, 10);
  });
  sauvegarder();
  afficherTache();
}

function basculerTache(id) {
  var t = taches.find(function (x) {
    return x.id === parseInt(id, 10);
  });
  if (t) {
    t.fait = !t.fait;
    sauvegarder();
    afficherTache();
  }
}

function tachesVisibles() {
  if (filtreActif === "afaire")
    return taches.filter(function (t) {
      return !t.fait;
    });
  if (filtreActif === "faites")
    return taches.filter(function (t) {
      return t.fait;
    });
  return taches;
}

//
// ======================EVENNEMENT=======================================
//

$$(document).on("page:init", '.page[data-name="taches"]', function () {
  afficherTache(); // premier affichage
});

$$(document).on("click", "#btn-ajouter", function () {
  var champ = $$("#champ-tache");
  ajouterTache(champ.val());
  champ.val("");
  app.toast.create({ text: "Tâche ajoutée !", closeTimeout: 2000 }).open();
});

$$(document).on("click", ".btn-suppr", function (e) {
  e.preventDefault();
  var id = $$(this).parents(".item-content").attr("data-id");
  supprimerTache(id);
});

$$(document).on("change", '.liste-taches input[type="checkbox"]', function () {
  var id = $$(this).parents(".item-content").attr("data-id");
  basculerTache(id);
});

$$(document).on("click", ".filtre-btn", function () {
  $$(".filtre-btn").removeClass("button-active");
  $$(this).addClass("button-active");
  filtreActif = $$(this).attr("data-filtre");
  afficherTache();
});
