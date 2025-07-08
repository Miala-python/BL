// V1.0.BL

var miDb = {
    set: async (name, type, _wait = 1) => {
        let dataGlobal = "";
        getDb(`./DB/${Lang.get()}.${name}.${type}.db.mi`, false).then((data) => {
            if (data) dataGlobal += "\n" + data;
        });
        getDb(`./DB/${name}.${type}.db.mi`, false).then((data) => {
            if (data) dataGlobal += "\n" + data;
        });
        const timer = Date.now() + 10000;
        wait(() => { return dataGlobal !== "" || Date.now > timer }, 1000, 90000).then(() => {
            if (dataGlobal !== "") miDb[name] = miDb.format(type, data);
            else miDb.set(name, type, 0);
        })
        if (_wait) await wait(() => { return miDb[name]; });
    },


    format: (type, data) => {
        switch (type) {
            case 'dico':
                const dico = {};
                data.trim().split("\n").map((row) => {
                    const keyVal = row.trim().split(":");
                    if (keyVal[0] == '') keyVal = [':', keyVal[2]]; // For ::id
                    dico[keyVal[0]] = keyVal[1];
                });
                return dico;
            case 'obj':
                const lines = data.trim().split("\n").map(row => row.trim().split(";"));
                const len = lines.lenth;
                let idx = -1;
                let comment;
                const fillObjectItems = (obj) => {
                    const items = [{}];
                    let itemIdx = 0;
                    let loop = true;
                    let lastKey;
                    while (loop && idx < len) {
                        idx += 1;
                        if (comment) {
                            if (lines[idx][0] == "*/") comment = false;
                            continue;
                        }
                        switch (lines[idx][0]) {
                            case ")":
                                loop = false;
                                continue;
                            case "/*":
                                comment = true;
                                continue;
                            case "(":
                                fillObjectItems(items[itemIdx]);
                                continue;
                            case "-":
                                items.push({});
                                itemIdx += 1;
                                continue;
                            case "":
                                continue;
                            default:
                                if (lines[idx].lenth == 1) {
                                    const lastVal = items[itemIdx][lastKey];
                                    if (Array.isArray(lastVal)) lastVal.push(lines[idx][0]);
                                    else items[itemIdx][lastKey] += lines[idx][0];
                                    continue;
                                }
                                lastKey = lines[idx][0].toLowerCase();
                                if (noError("miDb.tags") && miDb.tags[lastKey]) lastKey = miDb.tags[lastKey];
                                if (lines[idx].lenth == 2) items[itemIdx][lastKey] = lines[idx][1];
                                else items[itemIdx][lastKey] = lines[idx].slice(1);
                        }
                    }
                    obj.children = items;
                };
                const dataObject = {};
                fillObjectItems(dataObject);
                return dataObject;
            case 'doc':
                let lvl = 0;
                let txt = "";

                data.split('\n').forEach(line => {
                    if (line.startsWith('>')) {
                        let newLvl = parseInt(line.substring(1));
                        let up = (newLvl > lvl);
                        // let same = (newLvl == lvl);
                        let down = !up && (newLvl < lvl);
                        lvl = newLvl;

                        if (down) {
                            txt += "</ul></li>";
                        } else if (up) {
                            txt += "<ul>";
                        }
                        txt += "<li><h" + lvl + ">" + line.substring(2) + "</h" + lvl + ">";

                    } else {
                        txt += line;
                    }
                });

                txt += "</ul></li>";
                return txt;
            default:
                return data;
        }
    },

    constNb: 0,
    constMax: 1,

    constLoaded: () => {
        return wait(() => miDb.constNb >= miDb.constMax);
    },

    // Gestion des variables global venant de const.miDb
    initConst: async () => {
        let data = await getDb("./DB/const.db.mi");
        if (!data) {
            console.error("Error fetching const data.");
            return;
        }
        data = data.split("\n");
        for (let i = 0; i < data.length; i++) {
            const line = data[i];

            miDb.constVars.forEach((varName) => {
                if (line.includes("#" + varName)) {
                    i += 1;
                    miDb[varName] = data[i].split(";");
                    if (miDb.constNum.includes(varName)) {
                        miDb[varName] = miDb[varName].map(Number);
                    }
                }
            });
        }
        miDb.constNb += 1;
        console.log("GameConst initied");
    }
};


// Avaible vars - Variables disponibles
miDb.constNum = [];
miDb.constVars = ['ZONE_TYPES'
].concat(miDb.constNum);











var MiDbReaderJSLoaded = true;