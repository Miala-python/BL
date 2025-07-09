// MV1.0 EDDG 
// from MV1.0 EDDG

// M
function libLoaded(libname) {
    try {
        return eval(libname + 'JSLoaded');
    } catch (e) {
        return;
    }
}

/**
 * Attend qu'une condition soit remplie en vérifiant à intervalles réguliers
 * @param {function} condition - Fonction à tester qui retourne une valeur truthy quand prête
 * @param {number} [interval=100] - Intervalle de vérification en millisecondes
 * @param {number} [timeout=10000] - Délai maximum d'attente en millisecondes
 * @returns {Promise<any>} Promesse résolue avec la valeur retournée par la condition
 * @throws {Error} Si le timeout est atteint ou si la condition lève une erreur
 * 
 * @example
 * // Attendre un élément DOM
 * const button = await wait(() => document.querySelector('#submit-btn'));
 * 
 * @example
 * // Attendre une valeur spécifique avec vérification
 * const data = await wait(
 *   () => api.data?.status === 'ready' ? api.data : null,
 *   200,
 *   5000
 * );
 */
function wait(condition, interval = 100, timeout = 10 ** 7) {
    return new Promise((resolve, reject) => {
        let intervalId;
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            reject(new Error(`Timeout after ${timeout}ms`));
        }, timeout);

        const check = () => {
            try {
                const result = condition();
                if (result) {
                    clearTimeout(timeoutId);
                    clearInterval(intervalId);
                    resolve(result);
                }
            } catch (error) {
                clearTimeout(timeoutId);
                clearInterval(intervalId);
                reject(error);
            }
        };

        check(); // Premier check immédiat
        intervalId = setInterval(check, interval);
    });
}

// Code

var pageHeader; // Used in visu
// Set the title of the webpage
function setPageTitle() {
    if (!miDb.dico) return console.error('64D No miDb.dico for setPageTitle');
    if (Nav.uid && Nav.uid != miDb.dico.home) pageHeader = Nav.uid;
    else {
        Nav.uid = miDb.dico.home;
        pageHeader = miDb.dico.acc;
    }
    document.getElementById("pageTitle").innerHTML = pageHeader + " | " + miDb.dico.title;
}

// Search in the db for the page item
function getPageItem() {
    if (!miDb.PARCS) return console.error('No db.PARCS');
    return searchInObject(miDb.PARCS, (obj) => {
        return obj.name == Nav.uid || obj.shortcut == Nav.uid;
    });
}

var pageItem, pathItem; // Used in sortByTag
function updatePage() {
    let [item, path] = getPageItem();
    if (item) Visu.createPage(item, path);
    else document.getElementById("deleteMe").innerHTML = "Un problème est survenu (erreur 404-7).";
    [pageItem, pathItem] = [item, path];
}

function changeItem(uid) {
    Nav.uid = uid;
    Nav.updateUrl();
    document.getElementById("newContent").id = "deleteMe";
    // resetPageHeader();
    setPageTitle();
    updatePage();
}

async function loadChangelog() {
    await miDb.set('changelog', 'list', 'doc');
    document.getElementById('changelog').innerHTML = miDb.changelog;
}

function sortByTag(tid) {
    console.log("Fonction de tri par tag (" + tid + ") à venir ;)")

    listContent = document.getElementById("listContent");

    if (!listContent) {
        Nav.uid = pathItem[1];
        Nav.tag = tid;
        Nav.updateUrl(true);
        return;
    }

    // listContent.innerHTML = "<a onclick='changePage(`" + pageId + "`)'>" + dico['exitSortingMode'] + "</a>";
    Visu.createItems(pageItem, listContent, tid);

    Nav.uid = pathItem[1];
    Nav.tag = tid;
    Nav.updateUrl();
}

async function initMain() {

    await wait(() => libLoaded('Tools'));
    console.log('Tools loaded');
    await wait(() => libLoaded('Nav'));
    Nav.init('lang', 'uid', 'tag', 'name');
    console.log('Nav loaded & init');

    await wait(() => libLoaded('Lang'));
    Lang.init();
    console.log('Lang loaded & init');
    await wait(() => libLoaded('MiDbReader'));
    console.log('MiDb loaded');

    miDb.set('tags', 'dico');
    miDb.set('dico', 'dico').then(() => {
        setPageTitle();
    });
    Loading.setProgressBar(15);
    miDb.set('objKey', 'dico').then(async () => {
        await wait(() => libLoaded('Loading'));
        Loading.setProgressBar(25);
        await miDb.set('PARCS', 'obj');
        Loading.setProgressBar(30);

        await wait(miDb.constLoaded);
        Loading.setProgressBar(40);
        await wait(() => { return miDb.dico; });
        Loading.setProgressBar(50);
        await wait(() => libLoaded('Visu'));
        Loading.setProgressBar(60);
        updatePage();
        Loading.setProgressBar(70);

        await wait(() => libLoaded('SearchModal'));
        initSearchModal();
        Loading.setProgressBar(80);
    });
    miDb.initConst();


    await wait(() => libLoaded('Loading'));
    // Loading init
    Loading.init();
    console.log('Loading loaded & init');

    Loading.setProgressBar(0);
    Loading.setProgressBar(10);

}


// M

console.log('Main:init...');
var devFast = false;
document.addEventListener("DOMContentLoaded", function () {
    console.log('Doc loaded');
    initMain();
});


MainJSLoaded = true;