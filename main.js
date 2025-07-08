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

// Set the title of the webpage
function setPageTitle() {
    if (!miDb.dico) return console.error('64D No miDb.dico for setPageTitle');
    let header;
    if (Nav.uid && Nav.uid != miDb.dico.home) header = Nav.uid;
    else {
        Nav.uid = miDb.dico.home;
        header = miDb.dico.acc;
    }
    document.getElementById("pageTitle").innerHTML = header + " | " + miDb.dico.title;
}

// Search in the db for the page item
function getPageItem() {
    if (!miDb.PARCS) return console.error('No db.PARCS');
    return searchInObject(miDb.PARCS);
}

function updatePage() {
    let [item, path] = getPageItem();
    if (item); // TODO:Create page
    else document.getElementById("deleteMe").innerHTML = "Un problème est survenu (erreur 404-7).";
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
    await miDb.set('changelog', 'doc');
    document.getElementById('changelog').innerHTML = miDb.changelog;
}

function sortByTag(tid) {
    alert("Fonction de tri par tag (" + tid + ") à venir ;)")

    listContent = document.getElementById("listContent");

    if (!listContent) {
        Nav.uid = pathItem[1];
        Nav.tag = tid;
        Nav.updateUrl(true);
        return;
    }

    // listContent.innerHTML = "<a onclick='changePage(`" + pageId + "`)'>" + dico['exitSortingMode'] + "</a>";
    createItems(pageItem, listContent, tid);

    Nav.uid = pathItem[1];
    Nav.tag = tid;
    Nav.updateUrl();
}

async function initMain() {

    await wait(() => libLoaded('Tools'));
    await wait(() => libLoaded('Nav'));
    Nav.init('lang', 'uid', 'tag', 'name');

    await wait(() => libLoaded('Lang'));
    await wait(() => libLoaded('MiDbReader'));

    miDb.set('tags', 'dico');
    miDb.set('dico', 'dico').then(() => {
        setPageTitle();
    });
    miDb.set('objKey', 'dico');
    wait(() => miDb.objKey).then(async () => {
        Loading.setProgressBar(20);
        miDb.set('PARCS', 'obj');
        Loading.setProgressBar(30);

        await wait(miDb.constLoaded);
        await wait(() => { return miDb.dico; });
        updatePage();
    });
    miDb.initConst();


    await wait(() => libLoaded('Loading'));
    // Loading init
    Loading.init();
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