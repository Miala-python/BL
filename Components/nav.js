// Nav V2.0 BL

var Nav = {
    init: (...params) => {
        Nav.parameters = params;
        params.forEach(element => {
            Nav[element] = urlGetParameter(element);
        });
    },

    updateUrl(realChange = false) {
        let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  
        if (Nav.parameter && Nav.parameter.length){
            newUrl += '?';
            Nav.parameter.forEach((param, index) => {
                if (Nav[param] === undefined || Nav[param] === null) {
                    console.warn(`Parameter ${param} is undefined or null.`);
                    return;
                }
                if (index > 0) newUrl += '&';
                newUrl += `${param}=${Nav[param]}`;
            });
        }

        if (realChange) {
            document.getElementById('pageContent').innerHTML = miDb.dico['progress'];

            window.location.href = newUrl;

        } else {
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
}
}

var NavJSLoaded = true;

