let category1 = "Watch List";
let category2 = "Last Resort";
let category3 = "Hard Pass";
let category1Color = "#2ccb13";
let category2Color = "#e48c07" ;
let category3Color = "#f70707";

function appendStatusToItems(){
    chrome.storage.local.get(["items"], function (result) {
        let items = document.getElementsByClassName("s-item__wrapper");
        Array.from(items).forEach(e => {
            let lnk = e.getElementsByClassName("s-item__link")[0];
            let alreadyLabeled = e.getElementsByClassName("cat-label").length > 0
            if(!alreadyLabeled){
                let url = lnk.href;
                let itemId = url.slice(url.indexOf("/itm/") + 5).split('?')[0];
                let itm = result.items.filter(a => a.id === itemId);
                if(itm.length > 0){
                    let ct = itm[0].category;
                    let color = (ct ==  category1) ? 
                            category1Color : (ct == category2) ? category2Color : category3Color;       
                    e.innerHTML += "<div class='cat-label' style='position: relative; display: table; height: 100%; width: 100%; bottom: 50px'>" +
                    "<div style='float: right; width: 10%; height: 30px;" +
                    "background-color:" + color + "; text-align: center" +
                    "position: absolute; bottom: 60px'>" +
                    "<p style='margin-top: 5px; text-align: center;'>" + ct + "</p> </div> "
                    + "</div>"
                }
            }
        });
    })
}

appendStatusToItems();