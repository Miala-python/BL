var [dataMi,
    lang,
    dico,
    rsrc,
    progressVal,
    progressInterval,
    progress
] = Array(7).fill(false);

var path = './data/PARCS.json';
var tagsAdded = [];
var myTags = [];


function setProgressBar(val) {
    progressVal = val;
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    let currentVal = progress.value;
    let step = (val - currentVal) / 50; // Adjust the number of steps as needed
    progressInterval = setInterval(() => {
        currentVal += step;
        progress.value = currentVal;
        progress.innerHTML = Math.round(currentVal) + "%";
        if ((step > 0 && currentVal >= val) || (step < 0 && currentVal <= val)) {
            clearInterval(progressInterval);
            progress.value = val;
            progress.innerHTML = val + "%";
        }
    }, 40); // Adjust the interval time as needed
}

document.addEventListener('DOMContentLoaded', function () {
    progress = document.querySelector('progress');
    setProgressBar(40);
    const script = document.createElement('script');
    script.src = './lib/tools.js';
    script.onload = function () {
        setProgressBar(70);
        startPage();
    };
    document.head.appendChild(script);
    setProgressBar(45);
});

function startPage() {
    initLangAndRsrc()
    loadJSON(rsrc['db'], (data) => {
        dataMi = data;
        setProgressBar(80);
        scanData(dataMi);
        document.getElementById("deleteMe").remove();
    });
    document.getElementById("submitButton").onclick = (event) => {
        submit(event);
    };


}

function tagClicked(event, option, name) {
    console.log('clicked', option);
    event.preventDefault();
    if (myTags.includes(name)) {
        option.classList.remove('selected');
        myTags = myTags.filter(t => t !== name);
    } else {
        option.classList.add('selected');
        myTags.push(name);
    }
}



function scanData(data, lvl = 0) {

    setProgressBar(progressVal + 1);

    //Zone
    if (data.type) {
        let type = data.type.toLowerCase();
        if (type.includes('zone') || type.includes('land') || type.includes('parc')) {
            let option = document.createElement('option');
            option.textContent = option.value = data.nom;
            document.getElementById('zoneSelect').appendChild(option);
        }
    }
    if (data.tags) {
        let tags = data.tags.toLowerCase().split(";");
        tags.forEach(tag => {
            tag = tag.replace(/^\(/, '');
            if (!tagsAdded.includes(tag)) {
                let option = document.createElement('option');
                option.value = tag;
                let name = dico[tag];
                option.textContent = name ? name : tag.toUpperCase();
                option.onclick = (event) => {
                    tagClicked(event, option, tag);
                }
                document.getElementById('tagSelect').appendChild(option);
                tagsAdded.push(tag);
            }
        });
    }


    lvl += 1;
    if (data.items) {
        for (let item of data.items) {
            scanData(item, lvl);
        }
    }

}

function submit(event) {
    event.preventDefault();
    let zone = document.getElementById('zoneSelect').value;
    let tags = myTags.join(';');
    let name = document.getElementById("nameInput").value;

    let newUrl = getPageURL('v.html');
    newUrl += (zone == "0") ? '' : `&uid=${zone}`;
    newUrl += (tags == "") ? '' : `&tag=${tags}`;
    newUrl += (name == "") ? '' : `&name=${name}`;
    window.open(newUrl, '_blank');
}