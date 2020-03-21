let currStatus = document.getElementsByClassName("status")[0];

chrome.storage.sync.get("name", function(result){
   if(result.name) {
       currStatus.innerText = "Loaded!";
       currStatus.style.color = "#00ff00";
   }
   else {
       currStatus.innerText = "Not Loaded";
       currStatus.style.color = "red";
   }
});

document.getElementsByClassName("schoolsoftBtn")[0].addEventListener("click", function() {
    function returnDOM() {
        if(document.getElementsByClassName("h1")[0].innerHTML == "Kontaktlistor") {
            let nameObj = document.getElementsByClassName("table table-striped")[0].getElementsByClassName("heading_bold");
            let arr = [];
            for (var i = 0; nameObj.length > i; i++) {
                arr.push(nameObj[i].innerHTML);
            }
            return arr;
        }
        else {
            return false;
        }
    }
    chrome.tabs.executeScript({
        code: '(' + returnDOM + ')();'
    }, function(result) {
        if(result[0]) {
            console.log(result[0]);
            let returnedNameObj = {name: []};
            for (var i = 0; result[0].length > i; i++) {
                returnedNameObj.name.push(result[0][i])
            }
            chrome.storage.sync.set(returnedNameObj);
        }
        else {
            console.log("ERROR: Extension is not on the contact page.");
            chrome.storage.sync.get("name", function(r){console.log(r.name)});
        }
    });
});

document.getElementsByClassName("verifyList")[0].addEventListener("click", function() {

    function returnDOM() {
        let meetList = document.querySelectorAll('[data-sort-key]');
        if(meetList) {
            let arr = [];
            for (var i = 0; meetList.length > i; i++) {
                arr.push(meetList[i].innerText);
            }
            return arr;
        }
        else {
            return false;
        }
    }
    chrome.tabs.executeScript({
        code: '(' + returnDOM + ')();'
    }, function(meetListArr) {
        chrome.storage.sync.get("name", function(response) {
            for(var i = 0; meetListArr.length > i; i++) {
                for(var j = 0; response.name.length > j; j++) {
                    if(meetListArr[i][0].includes(response.name[j])) {
                        console.log("quack");
                    }
                }
            }
        });
    });
    //TODO: document.body.children[1].children[2].children[0].children[0].children[2].children[2].children[2].children[0].children[1].children[0].children[1].children[0].children[1].children[0].children[0].children[0].children[1].children[0].children[0] from meets.google.com
});