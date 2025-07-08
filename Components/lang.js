// V0.1.BL

//TODO
var Lang = {
    init: () => {
        document.querySelector("html").setAttribute('lang', Lang.get());
        // lang = urlGetParameter("lang");
    },

    get: () => { return 'fr'; }
}


var LangJSLoaded;