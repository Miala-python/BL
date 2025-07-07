// V1.0.BL

var miDb = {
    set: (name, type) => {
        getDb(`./DB/${Lang.get()}.${name}.${type}.db.mi`).then((data) => {
            eval(`miDb.${name} = miDb.format('${type}', data);`);
        })
    },


    format: (type, data) => {
        switch (type) {
            case 'dico':
                const dico = {};
                data.trim().split("\n").map((row) => {
                    const keyVal = row.trim().split(":");
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
                                lastKey = lines[idx][0];
                                if (noError("miDb.tags") && miDb.tags[lastKey]) lastKey = miDb.tags[lastKey];
                                if (lines[idx].lenth == 2) items[itemIdx][lastKey] = lines[idx][1];
                                else items[itemIdx][lastKey] = lines[idx].slice(1);
                        }
                    }
                };
                const dataObject = {};
                fillObjectItems(dataObject);
                return dataObject;
        }
    }
};











var MiDbReaderJSLoaded = true;