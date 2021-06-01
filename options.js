let page = document.getElementById("buttonDiv");

function readFile(){
  function handleFileSelect(evt) {
    var files = evt.target.files; 
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        try {
          json = JSON.parse(e.target.result);
          chrome.storage.local.set({items: json}, function (result){
            console.log(JSON.stringify(json));
          })
        } catch (ex) {
          console.log(ex);
        }
      }
    })(files[0]);
    reader.readAsText(files[0]);
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
}

readFile();