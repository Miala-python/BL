// Initialise the dictionnary
var dico = false


// Function to get the value of a GET parameter by name
function getParameterByName(name) {
    return new URLSearchParams(document.location.search).get(name);
}

// Set to english
var lang = getParameterByName("lang");
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
        "part": "En partie"
    };
} else {
    lang = "en";
    dico = {
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
        "part": "Partly"
    };
}


var rsrc = {
    "title": "Exφloπ@ | BL | Miala",
    "name": "Oneiri Exφloπ@",
    "progress": `<h1>Loading - Chargement en cours... | BL: Exφloπ@</h1>
		<br><progress class="progress is-small is-primary" max="100">15%</progress>`
};

// Function to switch the language
function switchLanguage() {
    // let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?uid=${pageId}`;
    if (lang == "en") {
        // newUrl += "&lang=fr";
        lang = 'fr';
    } else {
        // newUrl += "&lang=en";
        lang = 'en'
    }
    // window.location.href = newUrl;
    changeUrl(pageId, undefined, undefined, true);
}

// Function to switch the theme
function changeTheme() {
    var html = document.querySelector('html');
    if (html.classList.contains('theme-dark')) {
        html.classList.remove('theme-dark');
        html.classList.add('theme-light');
    } else {
        html.classList.remove('theme-light');
        html.classList.add('theme-dark');
    }
    localStorage.setItem('theme', html.classList.contains('theme-dark') ? 'dark' : 'light');
}

// Restore theme from local storage
document.addEventListener('DOMContentLoaded', (event) => {
    let savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        let html = document.querySelector('html');
        html.classList.remove('theme-dark', 'theme-light');
        html.classList.add(savedTheme === 'dark' ? 'theme-dark' : 'theme-light');
    }
});

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

// Get the 'uid' parameter from the URL
var pageId = getParameterByName('uid');
var dataBL = false;
var pageItem = false;
var pathItem = false;
var pageHeader = false;

// function resetPageHeader() {
//     pageHeader = "BL: <a onclick='changePage(``)'>Oneiri Exφloπ@</a>"
// }
// resetPageHeader();

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

function sortByTag(tid) {

    // alert("Fonction de tri par tag (" + tid + ") à venir ;)")

    listContent = document.getElementById("listContent");

    if (!listContent) {
        changeUrl(rsrc['name'], tid, undefined, true);
        return;
    }

    // listContent.innerHTML = "<a onclick='changePage(`" + pageId + "`)'>" + dico['exitSortingMode'] + "</a>";
    createItems(pageItem, listContent, tid);

    changeUrl(pageId, tid);
}

// Create tags from a list
function createTags(tags, parrent, colour = "NaC") {


    tags.forEach(tag_txt => {
        let tag = document.createElement("span");
        // console.log(tag_txt);
        tag.classList.add("tag", colour, "is-hoverable");//, "tag-" + tag_txt);
        // For level : The token can not contain whitespace.

        //Detect "(" => En partie
        let tag_txt_part = tag_txt.split("(");
        if (tag_txt_part[0] == "") {
            tag_txt_part.shift();
            tag_txt = tag_txt_part.join("(").toLowerCase();
            tag.innerHTML = dico['part']+" ";
        }

        // Tag onclick
        tag.onclick = (event) => {
            event.stopPropagation();
            sortByTag(tag_txt);
        };

        //Dico
        let tag_txt_convert = dico[tag_txt.toLowerCase()];
        if (!tag_txt_convert) {
            tag_txt_convert = tag_txt;
        }



        //Add tag to tag list
        tag.innerHTML += tag_txt_convert;
        parrent.appendChild(tag);
    });
}

function addHoures(from, inside) {
    let houres = document.createElement("p");
    houres.classList.add("help", "is-info");

    if (from.start) {
        houres.innerHTML = " ; A partir de " + from.start;

    }
    if (from.end) {
        houres.innerHTML += " ; Jusqu'à " + from.end;
    }
    if (from.delay) {
        houres.innerHTML += " ; Toutes les " + from.delay;
    }

    houres.innerHTML = houres.innerHTML.substring(3);
    inside.appendChild(houres);
}

function addTags(from, inside) {

    // Create the tags
    let tags = document.createElement("div");
    tags.classList.add("tags");
    if (from.type) {
        createTags(from.type.split(";"), tags, "is-info");
    }
    if (from.lvl) {
        let lvlList = from.lvl.split(";");
        let level = dico['lvl'] + " " + lvlList[0];
        if (lvlList[1]) {
            level += ` ${dico["->"]} ${lvlList[1]}`;
        }
        createTags([level], tags, "is-danger");
    }
    if (from.tags) {
        createTags(from.tags.split(";"), tags);

    }
    inside.appendChild(tags);
}

// Create all list items from a parent
function createItems(parent, listContent, sortingTag = false, lvl = 0, ParentZone = true) {
    // console.log(`createItems(${parent.nom}  ; ${lvl})`);
    if (!parent.items) {
        // console.log("No items in ", parent.nom);
        return;
    }

    if (!sortingTag) {
        sortingTag = getParameterByName("tag");
    }

    if (sortingTag && lvl == 0) {
        listContent.innerHTML = "<a onclick='changePage(`" + pageId + "`)'>" + dico['exitSortingMode'] + "</a>";
        if (sortingTag.includes(dico['lvl'])) {
            sortingTag = sortingTag.split(" ");
            sortingTag[0] = 1;
        } else {
            sortingTag = [sortingTag];
        }
    }

    lvl += 1;

    parent.items.forEach(item => {

        let IsZone = item.type == "zone";

        let cd = !sortingTag;

        if (!cd && sortingTag[0] === 1) {
            if (item.lvl) {
                let min = parseInt(sortingTag[1]);
                let stop = parseInt(sortingTag[3]) + 1;
                for (let index = min; index < stop; index++) {
                    cd = cd || (item.lvl.includes(index));
                    if (cd){break;}
                }
            }
        } else {
            cd = cd || (item.type && item.type.toLowerCase().includes(sortingTag[0]));
            cd = cd || (item.tags && item.tags.toLowerCase().includes(sortingTag[0]));
        }

        if (cd) {


            let itemElement = document.createElement("a");
            itemElement.onclick = () => changePage(item.nom);

            let article = document.createElement("article");
            article.id = "pl_view_article_0";
            article.classList.add("media", "video_selection", "is-rounded");
            article.onmouseover = () => {
                article.style.backgroundColor = 'rgba(100, 100, 100, 0.4)';
            };
            article.onmouseout = () => {
                article.style.backgroundColor = '';
            };

            // From MiYT, for the future
            // let figure = document.createElement("figure");
            // figure.classList.add("media-left");
            // figure.style.width = "7rem";

            // let p = document.createElement("p");
            // p.classList.add("image", "is-4by3");

            // let img = document.createElement("img");
            // img.classList.add("is-rounded");
            // img.src = "https://i.ytimg.com/vi/LMWH7NYbsq0/hqdefault.jpg";

            // p.appendChild(img);
            // figure.appendChild(p);
            // article.appendChild(figure);

            let mediaContentDiv = document.createElement("div");
            mediaContentDiv.classList.add("media-content");

            let contentDiv = document.createElement("div");
            contentDiv.classList.add("content");

            let txt = item.nom;
            if (item.id && ParentZone) {
                txt = item.id + " : " + txt;
            }
            if (IsZone) {
                txt = "<h3>-- " + txt + " --</h3>";
            } else if (ParentZone) {
                txt = "<h4>• " + txt + "</h4>";
            } else {
                txt = "<h4>+ " + txt + "</h4>";
            }
            if (item.desc) {
                txt += item.desc + "<br>";
            }

            contentDiv.innerHTML = txt;

            addHoures(item, contentDiv);
            addTags(item, contentDiv);
            // contentDiv.innerHTML += "<br>";

            // listItem = document.createElement("li");
            // listItem.appendChild(itemElement);

            mediaContentDiv.appendChild(contentDiv);
            article.appendChild(mediaContentDiv);
            itemElement.appendChild(article);
            listContent.appendChild(itemElement);

        }
        if (IsZone || sortingTag) {
            createItems(item, listContent, sortingTag, lvl, IsZone);
        }
    });
}


function createPage() {
    let IsZone = ['zone', 'land', undefined].includes(pageItem.type);

    let content = document.getElementById("pageContent");
    let newcontent = document.createElement("div");
    newcontent.id = "newContent";
    content.appendChild(newcontent);
    content = newcontent;
    let listPlace;
    let titlePlace = listPlace = content;
    let imgElement = false;
    if (pageItem.img) {
        if (IsZone) {
            let cols = document.createElement("div");
            cols.classList.add("columns");

            let col = document.createElement("div");
            col.classList.add("column", "col1");
            // col.id = "col1";
            cols.appendChild(col);

            col = document.createElement("div");
            col.classList.add("column", "col2");
            // col.id = "col2";
            cols.appendChild(col);

            content.appendChild(cols);

            titlePlace = document.getElementsByClassName("col1");
            titlePlace = titlePlace[titlePlace.length - 1];
            listPlace = document.getElementsByClassName("col2");
            listPlace = listPlace[listPlace.length - 1];
        }

        imgElement = document.createElement("img");
        imgElement.src = "./imgs/" + pageItem.img;

    }

    // Create the Title
    let titleElement = document.createElement("h1");
    titleElement.innerHTML = pageHeader;
    titlePlace.appendChild(titleElement);

    // Create the description
    if (pageItem.desc) {
        let descElement = document.createElement("h3");
        descElement.innerHTML = pageItem.desc;
        titlePlace.appendChild(descElement);
    }

    addHoures(pageItem, titlePlace);
    addTags(pageItem, titlePlace);

    // Create the image
    if (imgElement) {
        titlePlace.appendChild(imgElement);
    }

    // Create the list of items
    if (pageItem.items) {
        let list = document.createElement("div");
        list.classList.add("card", "list-container", "scroll");
        list.style.borderRadius = "18px";

        let header = document.createElement("header");
        header.classList.add("card-header");

        let headerTitle = document.createElement("p");
        headerTitle.classList.add("card-header-title");
        headerTitle.innerText = dico["list"];

        header.appendChild(headerTitle);
        list.appendChild(header);

        let cardContent = document.createElement("div");
        cardContent.classList.add("card-content");

        let listContent = document.createElement("div");
        listContent.classList.add("content");
        listContent.id = "listContent";



        createItems(pageItem, listContent);

        cardContent.appendChild(listContent);
        list.appendChild(cardContent);
        listPlace.appendChild(list);
    }

    // Create the breadcrumb
    let bc_container = document.getElementById("breadcrumb_container");
    bc_container.innerHTML = "";
    if (pathItem.length > 1) {
        let breadcrumb = document.createElement("nav");
        breadcrumb.classList.add("breadcrumb");
        breadcrumb.setAttribute("aria-label", "breadcrumbs");
        let breadcrumb_ul = document.createElement("ul");
        pathItem.forEach((item, index) => {
            let breadcrumb_li = document.createElement("li");
            let breadcrumb_a = document.createElement("a");
            if (index == pathItem.length - 1) {
                breadcrumb_li.classList.add("is-active");
                breadcrumb_a.setAttribute("aria-current", "page");
            }
            breadcrumb_a.onclick = () => changePage(item);
            breadcrumb_a.innerHTML = item;
            breadcrumb_li.appendChild(breadcrumb_a);
            breadcrumb_ul.appendChild(breadcrumb_li);
        });
        breadcrumb.appendChild(breadcrumb_ul);
        bc_container.appendChild(breadcrumb);
    }

    document.getElementById("deleteMe").remove();
}

function changeUrl(uid, tag = false, language = false, realChange = false) {

    let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?uid=${uid}&lang=`;
    newUrl += language ? language : lang;
    newUrl += tag ? "&tag=" + tag : "";

    if (realChange) {
        document.getElementById('pageContent').innerHTML = rsrc['progress'];

        window.location.href = newUrl;

    } else {
        window.history.pushState({ path: newUrl }, '', newUrl);
    }
}

function changePage(uid) {
    pageId = uid;
    changeUrl(uid);
    document.getElementById("newContent").id = "deleteMe";
    // resetPageHeader();
    setPageTitle();
    setPageItem();
}

function setPageTitle() {
    if (pageId && pageId != rsrc['name']) {
        // let title_add = pageId + " | ";
        pageHeader = pageId; // + pageHeader
    } else {
        pageId = rsrc['name'];
        pageHeader = dico['acc'];
    }
    document.getElementById("pageTitle").innerHTML = pageHeader + " | " + rsrc['title'];

}

// Set the pageItem var & create the page
function setPageItem() {
    [pageItem, pathItem] = searchInData(dataBL, item => item.nom === pageId);
    if (pageItem) {
        createPage();
    } else {
        console.log('Element not found');
        document.getElementById("deleteMe").innerHTML = "Un problème est survenu (erreur 404-7)."
    }
}

document.addEventListener('DOMContentLoaded', (event) => {

    setPageTitle();


    loadJSON('./data/BL.json', (data) => {
        dataBL = data;

        // console.log(dataBL);
        setPageItem();
    });

});

window.onpopstate = function (event) {
    //     console.log(
    //       "location: " +
    //         document.location +
    //         ", state: " +
    //         JSON.stringify(event.state),
    //     );
    changePage(getParameterByName('uid'));
};