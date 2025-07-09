// V0.1 BL


var Visu = {
    createPage: (pageItem, pathItem) => {
        let IsZone = miDb.ZONE_TYPES.concat([undefined]).includes(pageItem.type);

        let content = document.getElementById("pageContent");
        let newcontent = document.createElement("div");
        newcontent.id = "newContent";
        content.appendChild(newcontent);
        content = newcontent;
        let listPlace, imgDropdown;
        let titlePlace = listPlace = content;
        // let imgDropdown = false;
        if (pageItem.image) {
            if (IsZone) {
                let cols = document.createElement("div");
                cols.classList.add("columns");

                let col = document.createElement("div");
                col.classList.add("column", "col1");
                // col.id = "col1";
                cols.appendChild(col);

                col = document.createElement("div");
                col.classList.add("column", "col2");
                // col.id = "col2";
                cols.appendChild(col);

                content.appendChild(cols);

                titlePlace = document.getElementsByClassName("col1");
                titlePlace = titlePlace[titlePlace.length - 1];
                listPlace = document.getElementsByClassName("col2");
                listPlace = listPlace[listPlace.length - 1];
            }

            imgDropdown = document.createElement("div");

            let button = document.createElement("button");
            button.classList.add("button", "is-fullwidth");
            button.innerText = miDb.dico['imgBtn'];
            button.onclick = () => {
                imgElement.classList.toggle("is-hidden");
            };

            let imgElement = document.createElement("img");
            imgElement.src = "./Images/" + pageItem.image;
            imgElement.classList.add("is-hidden");

            imgDropdown.appendChild(button);
            imgDropdown.appendChild(imgElement);


        }

        // Create the Title
        let titleElement = document.createElement("h1");
        titleElement.innerHTML = pageHeader;
        titlePlace.appendChild(titleElement);

        // Create the description
        if (pageItem.desc) {
            let descElement = document.createElement("h3");
            descElement.innerHTML = pageItem.desc;
            titlePlace.appendChild(descElement);
        }

        Visu.addHoures(pageItem, titlePlace);
        Visu.addTags(pageItem, titlePlace);

        // Create the image
        if (imgDropdown) {
            titlePlace.appendChild(imgDropdown);
        }

        // Create the list of items
        if (pageItem.children) {
            let list = document.createElement("div");
            list.classList.add("card", "list-container", "scroll");
            list.style.borderRadius = "18px";

            let header = document.createElement("header");
            header.classList.add("card-header");

            let headerTitle = document.createElement("p");
            headerTitle.classList.add("card-header-title");
            headerTitle.innerText = miDb.dico["list"];

            header.appendChild(headerTitle);
            list.appendChild(header);

            let cardContent = document.createElement("div");
            cardContent.classList.add("card-content");

            let listContent = document.createElement("div");
            listContent.classList.add("content");
            listContent.id = "listContent";


            Visu.createItems(pageItem, listContent);

            cardContent.appendChild(listContent);
            list.appendChild(cardContent);
            listPlace.appendChild(list);
        }

        // Create the breadcrumb
        let bc_container = document.getElementById("breadcrumb_container");
        bc_container.innerHTML = "";
        if (pathItem && pathItem.length > 1) {
            let breadcrumb = document.createElement("nav");
            breadcrumb.classList.add("breadcrumb");
            breadcrumb.setAttribute("aria-label", "breadcrumbs");
            let breadcrumb_ul = document.createElement("ul");
            pathItem.forEach((item, index) => {
                let breadcrumb_li = document.createElement("li");
                let breadcrumb_a = document.createElement("a");
                if (index == pathItem.length - 1) {
                    breadcrumb_li.classList.add("is-active");
                    breadcrumb_a.setAttribute("aria-current", "page");
                }
                breadcrumb_a.onclick = () => changeItem(item);
                breadcrumb_a.innerHTML = item;
                breadcrumb_li.appendChild(breadcrumb_a);
                breadcrumb_ul.appendChild(breadcrumb_li);
            });
            breadcrumb.appendChild(breadcrumb_ul);
            bc_container.appendChild(breadcrumb);
        }

        document.getElementById("deleteMe").remove();

        // Get the changelog on main page
        let chg = document.getElementById('changelog');
        if (Nav.uid == miDb.dico.home) {
            chg.classList.add("last_item");
            chg.innerHTML = "Chargement de l'historique des versions en cours...";
            
            loadChangelog();
        } else {
            chg.innerHTML = "";
            chg.classList.remove("last_item");
        }
    },

    // With period: duration,start,interval,end
    addHoures: (period, parent) => {
        let houres = document.createElement("p");
        houres.classList.add("help", "is-info");
        let HTML = "";

        if (period[0] && period[0] != '-')
            HTML += `${miDb.dico.hDuration} : ${period[0]}<br>`;
        if (period[1] && period[1] != '-')
            HTML += `${miDb.dico.hStart} ${period[1]} ;  `;
        if (period[3] && period[3] != '-')
            HTML += `${miDb.dico.hEnd} ${period[3]} ;  `;
        if (period[2] && period[2] != '-')
            HTML += `${miDb.dico.hInterval} ${period[2]} ;  `;

        houres.innerHTML = HTML.substring(HTML.length - 4);
        parent.appendChild(houres);
    },

    addTags: (item, parent) => {

        // Create the tags
        let tags = document.createElement("div");
        tags.classList.add("tags");
        if (item.type) {
            Visu.createTags(item.type, tags, "is-info");
        }
        if (item.level) {
            let lvlList = item.level
            let level = miDb.dico['lvl'] + " " + lvlList[0];
            if (lvlList[1]) {
                level += ` ${miDb.dico["->"]} ${lvlList[1]}`;
            }
            Visu.createTags([level], tags, "is-danger");
        }
        if (item.tags) {
            Visu.createTags(item.tags, tags);

        }
        parent.appendChild(tags);
    },

    // Create tags from a list
    createTags: (tags, parent, colour = "NaC") => {
        if (!Array.isArray(tags)) tags = [tags];

        tags.forEach(tag_txt => {
            tag_txt = tag_txt.trim();
            let tag = document.createElement("span");
            // console.log(tag_txt);
            tag.classList.add("tag", colour, "is-hoverable");//, "tag-" + tag_txt);
            // For level : The token can not contain whitespace.

            //Detect "*" => En partie
            let tag_txt_part = tag_txt.split("*");
            if (tag_txt_part[0] == "") {
                tag_txt_part.shift();
                tag_txt = tag_txt_part.join("*").toLowerCase();
                tag.innerHTML = miDb.tags['*'] + " ";
            }

            // Tag onclick
            tag.onclick = (event) => {
                event.stopPropagation();
                sortByTag(tag_txt);
            };

            // Dico
            let tag_txt_convert = miDb.tags[tag_txt.toLowerCase()];
            if (!tag_txt_convert) {
                tag_txt_convert = tag_txt;
            }



            //Add tag to tag list
            tag.innerHTML += majFirst(tag_txt_convert);
            parent.appendChild(tag);
        });
    },


    // Create all list items from a parent
    createItems: (parent, listContent, sortingTag = false, lvl = 0, ParentZone = true) => {
        console.log(`createItems(${parent.name}  ; ${lvl})`);
        if (!parent.children) {
            console.log("No items in ", parent.name);
            return;
        }

        if (!sortingTag) {
            sortingTag = Nav.tag;
        }

        let sortingName; //TODO 
        const sortingState = (sortingTag || sortingName);

        if (sortingState && lvl == 0) {
            if (sortingName) {
                listContent.innerHTML = "<a onclick='Nav.updateUrl(true)'>" + miDb.dico['exitSortingMode'] + "</a>";
            } else {
                listContent.innerHTML = "<a onclick='Nav.updateUrl()'>" + miDb.dico['exitSortingMode'] + "</a>";
            }
            if (sortingTag) {
                if (sortingTag.includes(miDb.dico['lvl'])) {
                    sortingTag = sortingTag.split(" ");
                    sortingTag[0] = 1;
                } else {
                    sortingTag = sortingTag.toLowerCase().split(';');
                }
            }
        }

        lvl += 1;

        parent.children.forEach(item => {

            let IsZone = item.type == "zone";

            let cd = !sortingTag;

            if (!cd && sortingTag[0] === 1) {
                if (item.level) {
                    let min = parseInt(sortingTag[1]);
                    let stop = parseInt(sortingTag[3]) + 1;
                    for (let index = min; index < stop; index++) {
                        cd = cd || (item.level.includes(index));
                        if (cd) { break; }
                    }
                }
            } else if (!cd) {
                let score = 0;
                sortingTag.forEach(tag => {
                    cd = (
                        typeof item.type == 'string' && item.type.toLowerCase().includes(tag)
                        || (Array.isArray(item.type) && item.type.map(t => t.toLowerCase().includes(tag)).includes(true))
                    );
                    cd = cd || (
                        typeof item.tags == 'string' && item.tags.toLowerCase().includes(tag)
                        || (Array.isArray(item.tags) && item.tags.map(t => t.toLowerCase().includes(tag)).includes(true))
                    );
                    if (cd) { score += 1; }
                })

                cd = (score === sortingTag.length);
            }

            if (cd && sortingName) {
                cd = item.name.toLowerCase().includes(sortingName);
            }

            if (cd) {


                let itemElement = document.createElement("a");
                itemElement.onclick = () => changeItem(item.name);

                let article = document.createElement("article");
                article.id = "pl_view_article_0";
                article.classList.add("media", "video_selection", "is-rounded");
                article.onmouseover = () => {
                    article.style.backgroundColor = 'rgba(100, 100, 100, 0.4)';
                };
                article.onmouseout = () => {
                    article.style.backgroundColor = '';
                };

                let mediaContentDiv = document.createElement("div");
                mediaContentDiv.classList.add("media-content");

                let contentDiv = document.createElement("div");
                contentDiv.classList.add("content");

                let txt = item.name;
                if (item.id && ParentZone) {
                    txt = item.id + " : " + txt;
                }
                if (IsZone) {
                    txt = "<h3>-- " + txt + " --</h3>";
                } else if (ParentZone) {
                    txt = "<h4>• " + txt + "</h4>";
                } else {
                    txt = "<h4>+ " + txt + "</h4>";
                }
                if (item.desc) {
                    txt += item.desc + "<br>";
                }

                contentDiv.innerHTML = txt;

                Visu.addHoures(item, contentDiv);
                Visu.addTags(item, contentDiv);
                // contentDiv.innerHTML += "<br>";

                // listItem = document.createElement("li");
                // listItem.appendChild(itemElement);

                mediaContentDiv.appendChild(contentDiv);
                article.appendChild(mediaContentDiv);
                itemElement.appendChild(article);
                listContent.appendChild(itemElement);

            }
            if (IsZone || sortingState) {
                Visu.createItems(item, listContent, sortingTag, lvl, IsZone);
            }
        });
    }
}


var VisuJSLoaded = true;



