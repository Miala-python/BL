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
var pageHeader = false;

function resetPageHeader() {
    pageHeader = "BL: <a onclick='changePage(``)'>Oneiri Exφloπ@</a>"
}
resetPageHeader();

// Search something in the data
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

    let titleElement = document.createElement("h1");
    titleElement.innerHTML = pageHeader;
    titlePlace.appendChild(titleElement);

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
    pageItem = searchInData(dataBL, item => item.nom === pageId);
    if (pageItem) {
        createPage();
    } else {
        console.log('Element not found');
        alert("Un problème est survenu (erreur 404-7).");
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