// Initialise the dictionnary
var dico = {
    "tr": "Transport",
    "att": "Attraction",
    "mu": "Musée",
    "ma": "Manège",
    "fs": "Fortes sensations",
    "it": "Interactif",
    "s": "Santé correcte requise",
    "zone": "Zone",
    "dx": "Sensations douces",
    "ap": "A pied",
    "st": "Sous terre"
};










// Function to get the value of a GET parameter by name
function getParameterByName(name) {
    return new URLSearchParams(document.location.search).get(name);
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

// Get the 'uid' parameter from the URL
var pageId = getParameterByName('uid');
var dataBL = false;
var pageItem = false;
var pathItem = false;
var pageHeader = false;

function resetPageHeader() {
    pageHeader = "BL: <a onclick='changePage(``)'>Oneiri Exφloπ@</a>"
}
resetPageHeader();

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

function sortByTag(tid){
    alert("Fonction de tri par tag ("+tid+") à venir ;)")
}

// Create tags from a list
function createTags(tags, parrent, colour = "NaC") {


    tags.forEach(tag_txt => {
        let tag = document.createElement("span");


        //Detect "(" => En partie
        let tag_txt_part = tag_txt.split("(");
        if (tag_txt_part[0] == "") {
            tag_txt_part.shift();
            tag_txt = tag_txt_part.join("(").toLowerCase();
            tag.innerHTML = "En partie "
        }

        // Tag onclick
        tag.onclick = () => sortByTag(tag_txt);

        //Dico & Color
        tag.classList.add("tag", colour, "is-hoverable");
        let tag_txt_convert = dico[tag_txt.toLowerCase()];
        if (!tag_txt_convert) {
            tag_txt_convert = tag_txt;
        }



        //Add tag to tag list
        tag.innerHTML += tag_txt_convert;
        parrent.appendChild(tag);
    });
}

function createPage() {
    let IsZone = pageItem.type == "zone";

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
            col.classList.add("column");
            col.id = "col1";
            cols.appendChild(col);

            col = document.createElement("div");
            col.classList.add("column");
            col.id = "col2";
            cols.appendChild(col);

            content.appendChild(cols);

            titlePlace = document.getElementById("col1");
            listPlace = document.getElementById("col2");
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

    // Create the tags
    let tags = document.createElement("div");
    tags.classList.add("tags");
    if (pageItem.type) {
        createTags(pageItem.type.split(";"), tags, "is-info");
    }
    if (pageItem.lvl) {
        let lvlList = pageItem.lvl.split(";");
        let level = "Niveau " + lvlList[0];
        if (lvlList[1]) {
            level += " à " + lvlList[1];
        }
        createTags([level], tags, "is-danger");
    }
    if (pageItem.tags) {
        createTags(pageItem.tags.split(";"), tags);

    }
    titlePlace.appendChild(tags);


    // Create the image
    if (imgElement) {
        titlePlace.appendChild(imgElement);
    }

    if (IsZone) {
        let list = document.createElement("ul");
        pageItem.items.forEach(item => {
            let itemElement = document.createElement("a");
            itemElement.onclick = () => changePage(item.nom);
            let txt = item.nom;
            if (item.id) {
                txt = item.id + " : " + txt;
            }
            txt = "<h3>• " + txt + "</h3>";
            if (item.desc) {
                txt += item.desc + "<br>";
            }

            txt += "<br>";

            itemElement.innerHTML = txt;
            // listItem = document.createElement("li");
            // listItem.appendChild(itemElement);
            list.appendChild(itemElement);
        });
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

function changePage(uid) {
    pageId = uid;
    document.getElementById("newContent").id = "deleteMe";
    resetPageHeader();
    setPageTitle();
    setPageItem();
    let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?uid=${uid}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

function setPageTitle() {
    if (pageId) {
        let title_add = pageId + " | ";
        pageHeader = title_add + pageHeader;
        document.getElementById("pageTitle").innerHTML = title_add + document.getElementById("pageTitle").innerHTML;
    } else {
        pageId = "Oniri Explora";
    }
}

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