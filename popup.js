/* Constants */

let category1 = "Watch List";
let category2 = "Last Resort";
let category3 = "Hard Pass";
let category1Color = "#2ccb13";
let category2Color = "#e48c07" ;
let category3Color = "#f70707";
let notEbayErrorMessage = "The page being browsed is not ebay. If you would like the plugin to support another site, please create an issue on <a id='github'> github </a>";

/* Bind Listeners */

let saveBtt = document.getElementById("save");
let desc = document.getElementById("desc");
let categoryButtons = document.getElementsByClassName("radio-input");
let download = document.getElementById("download");

saveBtt.addEventListener("click", async () => {
  if(canSubmit()){
    save();
  }
});

download.addEventListener("click", async () => {
  downloadData();
});

desc.addEventListener('input', (event) => {
  if(canSubmit()){
    saveBtt.classList.add("btn");
  }else{
    saveBtt.classList.remove("btn");
  }
});

Array.from(categoryButtons).forEach(e => 
  e.addEventListener('change', (event) => {
    if(canSubmit()){
      saveBtt.classList.add("btn");
    }else{
      saveBtt.classList.remove("btn");
    }
  })
);

/**
 * Sets the popup view from form to note display
 * @param {*} n note to display 
 */
function setViewToNoteView(n){
  document.getElementById("desc-frm").style.display = "none"
  document.getElementById("cntr").style.display = "none"
  document.getElementById("notes").style.display = "block"
  document.getElementById("display-label").style.display = "block";
  document.getElementById("notebody").innerHTML =  n
  saveBtt.style.display = "none"
}

/**
 * 
 * @returns if at least one option is checked
 */
function isChecked(){
  return document.getElementById("opt1").checked || document.getElementById("opt2").checked || document.getElementById("opt3").checked
}

/**
 * 
 * @returns Can submit the form
 */
function canSubmit(){
  return isChecked() && document.getElementById("desc").value.length > 0
}

/**
 * Download user data to their computer
 */
function downloadData(){
  chrome.storage.local.get(["items"], function (result) {
    let itemsL  = (result.items) ? result.items : [];
    let blob = new Blob([JSON.stringify(itemsL)], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url: url,
      filename: "items.json"
    });
  });
}

/**
 * Display error messaging stating the current page isn't ebay
 */
function displayErrorMessage(){
  let error = document.getElementById("error");
  document.getElementById("desc").style.display = "none"
  document.getElementById("save").style.display = "none"
  document.getElementById("desc-frm").style.display = "none"
  document.getElementById("cntr").style.display = "none"
  error.style.display = "block"
  error.innerHTML = notEbayErrorMessage;
  let github= document.getElementById("github")
  github.addEventListener("click", async () => {
    var newURL = "http://github.com/";
    chrome.tabs.create({ url: newURL });
  });
}

/**
 * Set the display properties and the style of the category label
 * @param {*} ct the category of the label
 */
function setDisplayLabel(ct){
  let color = (ct ==  category1) ?
               category1Color : (ct == category2) ? category2Color : category3Color;
  document.getElementById("display-label").style.backgroundColor = color 
  document.getElementById("display-label").innerHTML = "<span>" + ct + "</span>"
}

function makeBoldText(text){
  return  "<b class='bld'>"  + text + " </b> " 
}

async function save(){
  chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, 
    function(tabs){
      chrome.storage.local.get(["items"], function (result) {
        var itemsL  = (result.items) ? result.items : [];
        chrome.scripting.executeScript( {
          target: {tabId: tabs[0].id},
          files: ["domscript.js"],
        }, (results) => {
            let opt1 = document.getElementById("opt1");
            let opt2 = document.getElementById("opt2");
            let category = (opt1.checked) ? category1 : (opt2.checked) ? category2 : category3;
            let notes = document.getElementById("desc").value;
            let filtered = itemsL.filter(i => i.id == results[0].result.id);
            if(filtered.length > 0){
              itemsL = itemsL.filter(i => i.id != results[0].result.id);
            }
            itemsL.push({
              id: results[0].result.id,
              seller: results[0].result.seller, 
              item: results[0].result.item, 
              desc: notes, 
              category: category
            });
            setDisplayLabel(category);
            chrome.storage.local.set({items: itemsL}, function (result){
              setViewToNoteView(notes);
            })
        });
      });
  })
}

chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, 
  function(tabs){
    let currenturl = tabs[0].url
    if(!currenturl.includes("ebay")){
      displayErrorMessage();
    }else{
      chrome.storage.local.get(["items"], function (result) {
        chrome.scripting.executeScript( {
          target: {tabId: tabs[0].id},
          files: ["domscript.js"],
        }, (results) => {
          let itemname = document.getElementById("itemname");
          let seller = document.getElementById("seller");
          let itemId = document.getElementById("itmid");

          itemname.innerHTML = makeBoldText("Item: ") + results[0].result.item
          seller.innerHTML = makeBoldText("Seller: ") + results[0].result.seller
          itemId.innerHTML = makeBoldText("Id: ")  + results[0].result.id
          if(result.items){
            let fltr = result.items.filter(i => i.id == results[0].result.id)
            if(fltr.length >  0){
              setDisplayLabel(fltr[0].category);
              setViewToNoteView(fltr[0].desc)
            }
          }
      });
    });
  }
});

