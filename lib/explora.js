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
if (!pageId) {
    pageId = "Oniri Explora";
}
var dataBL = false;

function searchInData(data, callbackFn){
    console.log(data.nom);
    if (callbackFn(data)){
        // console.log("OK");
        return data;
    }
    if (data.items){
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

loadJSON('./data/BL.json', (data) => {
    dataBL = data;

    // console.log(dataBL);
    var pageItem = searchInData(dataBL, item => item.nom === pageId);
    if (pageItem) {
        console.log(pageItem);
    } else {
        console.log('Element not found');
    }
});
