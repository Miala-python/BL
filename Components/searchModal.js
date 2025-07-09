
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

var tagsAddedSearch = []; // Used here
function scanData(data, lvl = 0) {

    //Zone
    if (data.type) {
        let type = data.type
        if (typeof type=='string') type = [type];
        type.map(w=>w.trim().toLowerCase());
        if (type.includes('zone') || type.includes('land') || type.includes('parc')) {
            let option = document.createElement('option');
            option.textContent = option.value = data.name;
            document.getElementById('zoneSelect').appendChild(option);
        }
    }
    if (data.tags) {
        let tags = data.tags;
        if (!Array.isArray(tags)) tags = [tags];
        tags.forEach(tag => {
            tag = tag.trim().toLowerCase().replace(/^\(/, '');
            if (!tagsAddedSearch.includes(tag)) {
                let option = document.createElement('option');
                option.value = tag;
                let name = miDb.dico[tag];
                option.textContent = name ? name : tag.toUpperCase();
                option.onclick = (event) => {
                    tagClicked(event, option, tag);
                }
                document.getElementById('tagSelect').appendChild(option);
                tagsAddedSearch.push(tag);
            }
        });
    }


    lvl += 1;
    if (data.children) {
        for (let item of data.children) {
            scanData(item, lvl);
        }
    }

}

var myTagsSearch = [];
function tagClicked(event, option, name) {
    console.log('clicked', option);
    event.preventDefault();
    if (myTagsSearch.includes(name)) {
        option.classList.remove('selected');
        myTagsSearch = myTagsSearch.filter(t => t !== name);
        document.getElementById("SearchTagOption_" + name).remove();
    } else {
        option.classList.add('selected');
        myTagsSearch.push(name);
        const selectedDiv = document.getElementById("SearchTagsSelected");
        const controlDiv = document.createElement('div');
        controlDiv.classList.add('control');
        controlDiv.id = 'SearchTagOption_' + name;

        const tagsDiv = document.createElement('div');
        tagsDiv.classList.add('tags', 'has-addons');

        const nameTag = document.createElement('a');
        nameTag.classList.add('tag');
        const dicoName = miDb.dico[name];
        if (dicoName) {
            nameTag.textContent = dicoName;
        } else {
            nameTag.textContent = name;

        }

        const deleteTag = document.createElement('a');
        deleteTag.classList.add('tag', 'is-delete');
        deleteTag.onclick = (event) => tagClicked(event, option, name);

        tagsDiv.appendChild(nameTag);
        tagsDiv.appendChild(deleteTag);
        controlDiv.appendChild(tagsDiv);
        selectedDiv.appendChild(controlDiv);
    }
}

function submit(event) {
    event.preventDefault();
    let zone = document.getElementById('zoneSelect').value;
    let tags = myTagsSearch.join(';');
    let name = document.getElementById("nameInput").value;
    zone = (zone == "0") ? miDb.dico['home'] : zone;

    Nav.uid = zone;
    Nav.tag = tags;
    Nav.name = name;
    Nav.updateUrl(true);
}

function initSearch() {
    scanData(miDb.PARCS);
    document.getElementById("zoneSelect").value = Nav.uid;
    document.getElementById("searchLoading").remove();
    document.getElementById("submitButton").onclick = (event) => {
        submit(event);
    };
}

function initSearchModal(){
initModalAuto();
initSearch();
}



var SearchModalJSLoaded = true;