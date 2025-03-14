
function initLangAndRsrc() {
    // Set to english
    lang = getParameterByName("lang");
    if (!lang || lang.toLowerCase() == "fr") {
        lang = "fr";
        dico = {
            "tr": "Transport",
            "att": "Attraction",
            "mu": "Musée",
            "ma": "Manège",
            "fs": "Fortes sensations",
            "it": "Interactif",
            "ss": "Santé correcte requise",
            "zone": "Zone",
            "dx": "Attractions familiales",
            "ap": "A pied",
            "st": "Sous terre",
            "land": "Region",
            "sp": "Spectacle",
            "bb": "Boutique",
            "rr": "Restaurant",
            "ext": "En extérieur",
            "hh": "Hotel",
            "list": "Liste des activités :",
            "ff": "Peut effrayer les enfants",
            "acc": "Accueil",
            "exitSortingMode": "Quitter le mode de tri",
            "lvl": "Niveau",
            "->": "à",
            "part": "En partie",
            "eau": "Peut éclabousser",
            "npm": "Ne pas manquer",
            "photo": "Photo souvenirs",
            "pti": "Pour les plus petits",
            "nde": "Interdit aux doudous enceints",
            "imgBtn": "Afficher/Masquer l'image",
            "tschmp": "Toutes les conditions doivent etre remplies.",
            "Switch language":"Switch to English"
        };
    } else {
        lang = "en";
        dico = {
            "Recherche paramétrée":"Advanced search",
            "Switch language":"Passer en Français",
            "Changer le thème":"Change theme",
            "tr": "Transport",
            "att": "Attraction",
            "mu": "Museum",
            "ma": "Ride",
            "fs": "Thrill ride",
            "it": "Interactive",
            "ss": "Good health required",
            "zone": "Area",
            "dx": "Family friendly",
            "ap": "On foot",
            "st": "Underground",
            "land": "Region",
            "sp": "Show",
            "bb": "Shop",
            "rr": "Restaurant",
            "ext": "Outdoor",
            "hh": "Hotel",
            "list": "List of activities:",
            "ff": "May scare children",
            "acc": "Home",
            "exitSortingMode": "Exit the Sorting Mode",
            "lvl": "Level",
            "->": "to",
            "part": "Partly",
            "eau": "Water splash",
            "npm": "Must see",
            "photo": "Photo souvenirs",
            "pti": "For the little ones",
            "nde": "Forbidden to pregnant teddies",
            "imgBtn": "Show/Hide Image",
            "Rechercher":"Search",
            "Annuler":"Cancel",
            "Nom":"Name",
            "tschmp": "All conditions have to be checked."
        };
    }

    rsrc = {
        "title": "Exφloπ@ | BL | Miala",
        "name": "Miala",
        "progress": `<h1>Loading - Chargement en cours... | BL: Exφloπ@</h1>
		<br><progress class="progress is-small is-primary" max="100">15%</progress>`,
        "db": "./data/PARCS.json"
    };

}

// Function to get the value of a GET parameter by name
function getParameterByName(name) {
    return new URLSearchParams(document.location.search).get(name);
}

// Function to load a JSON file
function loadJSON(filePath, callback = () => { }) {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', filePath, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}


// Search something in the data
function searchInData(data, callbackFn) {
    // console.log(data.nom);
    if (callbackFn(data)) {
        // console.log("OK");
        let path = [data.nom];
        return [data, path];
    }
    if (data.items) {
        for (let item of data.items) {
            let [result, path] = searchInData(item, callbackFn);

            if (result) {
                // console.log("OK", data.nom, result.nom);
                path = [data.nom, ...path];
                return [result, path];
            }
        }
    }
    return [false, false];
}

function getPageURL(page) {
    let path = window.location.pathname.split('/').slice(0, -1).join('/') + "/" + page;
    let newUrl = window.location.protocol + "//" + window.location.host + path + `?mi`;
    return newUrl;

}



// Function to load a JSON file
function loadFile(filePath, callback = () => { }) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
}

// Modal code from bulma
// Functions to open and close a modal
function openModal($el) {
    $el.classList.add('is-active');
}

function closeModal($el) {
    $el.classList.remove('is-active');
}

function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
    });
}
// Autoopen & close
function initModalAuto(){

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);


        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });
};

function translatePage(){
    (document.querySelectorAll('.dico') || []).forEach(($trigger) => {
        let txt = $trigger.innerHTML;
        txt = dico[txt];
        if (txt){
            $trigger.innerHTML = txt;
        }
    });
}