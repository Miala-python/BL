var urlParams = new URLSearchParams(window.location.search);
// Function to get the value of a GET parameter by name
function getParameterByName(name) {
    return urlParams.get(name);
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
var pageHeader = "BL: Oneiri Exφloπ@"

function searchInData(data, callbackFn) {
    console.log(data.nom);
    if (callbackFn(data)) {
        // console.log("OK");

        return data;
    }
    if (data.items) {
        for (let item of data.items) {
            let result = searchInData(item, callbackFn);
            if (result) {
                // console.log("OK", data.nom, result.nom);
                return result;
            }
        }
    }
    return false;
}

function createPage() {
    let content = document.getElementById("pageContent");
    let listPlace;
    let titlePlace = listPlace = content;
    let imgElement = false;
    if (pageItem.img) {
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

        imgElement = document.createElement("img");
        imgElement.src = "./imgs/" + pageItem.img;

    }

    let titleElement = document.createElement("h1");
    titleElement.innerHTML = pageHeader;
    titlePlace.appendChild(titleElement);

    if (imgElement) {
        titlePlace.appendChild(imgElement);
    }

    let list = document.createElement("ul");
    pageItem.items.forEach(item => {
        let itemElement = document.createElement("a");
        itemElement.href = "explora.html?uid=" + item.nom;
        let txt = item.nom;
        if (item.id){
            txt = item.id + " : " + txt;
        }
        itemElement.innerHTML = txt;
        listItem = document.createElement("li");
        listItem.appendChild(itemElement);
        list.appendChild(listItem);
        list.appendChild(document.createElement("br"));
    });
    listPlace.appendChild(list);

    document.getElementById("deleteMe").remove();
}

document.addEventListener('DOMContentLoaded', (event) => {


    if (pageId) {
        let title_add = pageId + " | ";
        pageHeader = title_add + pageHeader;
        document.getElementById("pageTitle").innerHTML = title_add + document.getElementById("pageTitle").innerHTML;
    } else {
        pageId = "Oniri Explora";
    }

    loadJSON('./data/BL.json', (data) => {
        dataBL = data;

        // console.log(dataBL);
        pageItem = searchInData(dataBL, item => item.nom === pageId);
        if (pageItem) {
            console.log(pageItem);
            createPage();
        } else {
            console.log('Element not found');
            alert("Un problème est survenu (erreur 404-7).");
        }
    });

});
