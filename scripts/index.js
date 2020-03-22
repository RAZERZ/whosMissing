var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-156240083-3']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

let navBar = document.getElementsByClassName("navBar")[0].children;

navBar[0].addEventListener("click", function() {

    for(var i=0;navBar.length>i;i++){navBar[i].removeAttribute("class");}
    navBar[0].setAttribute("class", "active");
    document.getElementsByClassName("content")[0].innerHTML = '<div class="create"><p>Want to create a custom namelist?</p><p>This extension reads JSON objects, but you can always create one using <a href="https://razerz.github.io" target="_blank">my generator.</a></p><p>When you' + "'" + 're ready, click "import" to import your namelist.</p><hr><p>Psst, you can also export the currently loaded namelist. Give it a name and hit export.</p><input type="text"><br><a style="text-decoration:none" class="download">Export</a></div>';

    let downloadBtn = document.getElementsByClassName("download")[0];
    let userLabel = document.getElementsByTagName("input")[0];

    downloadBtn.setAttribute("target", "_blank");
    downloadBtn.setAttribute("download", "mommyHelpIcantNameThings.json");
    userLabel.addEventListener("input", function() {
        downloadBtn.setAttribute("download", userLabel.value + ".json");
    });

    chrome.storage.sync.get("name", function(r) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(r.name));
        downloadBtn.setAttribute("href", dataStr);
    });

});

navBar[1].addEventListener("click", function() {

    for(var i=0;navBar.length>i;i++){navBar[i].removeAttribute("class");}
    navBar[1].setAttribute("class", "active");
    document.getElementsByClassName("content")[0].innerHTML = '<div class="import"><p class="innerText">Let' +  "'" + 's get started, load a namelist (json)</p><p>Current Status: <span class="status" style="color:red">Not Loaded</span></p><label class="upload"><input type="file">Upload</label><p class="uploadId"></p><hr><p>Want to load directly from SchoolSoft?</p><p>Open up SchoolSoft and go to the contact list page and select the class you want to load.</p><p class="ssStatus"></p><button class="schoolsoftBtn" style="margin-top:2%;background: rgba(0,0,0,0);height: 45px"><svg transform="scale(2)" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="#fff" fill-rule="evenodd" clip-rule="evenodd"><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg></button></div>';

    let uploadInput = document.getElementsByTagName("input")[0];
    let uploadInputId = document.getElementsByClassName("uploadId")[0];

    let currStatus = document.getElementsByClassName("status")[0];

    function getStatus() {
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
    }

    chrome.storage.sync.get("name", function(result){
        if(result.name) {
            currStatus.innerText = "Warning! There is already a namelist loaded. Loading a new one will overwrite the currently loaded list."
            currStatus.style.color = "#ffb000";
        }
    });

    uploadInput.addEventListener("change", function(e) {
        uploadInputId.innerText = e.target.files[0].name;
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            let saveData = {name: []};
            let uploadedJson = JSON.parse(e.target.result);

            for(var i = 0; uploadedJson.length > i; i++) {
                saveData.name.push(uploadedJson[i]);
            }
            chrome.storage.sync.set(saveData);
            getStatus();

        };
        fileReader.readAsText(e.target.files[0]);
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
                let returnedNameObj = {name: []};
                for (var i = 0; result[0].length > i; i++) {
                    returnedNameObj.name.push(result[0][i])
                }
                chrome.storage.sync.set(returnedNameObj);
                getStatus();
            }
            else {
                document.getElementsByClassName("ssStatus")[0].innerText = "Slow down! Are you sure you are on the contact page?";
            }
        });
    });

});

navBar[2].addEventListener("click", function() {

    for(var i=0;navBar.length>i;i++){navBar[i].removeAttribute("class");}
    navBar[2].setAttribute("class", "active");
    document.getElementsByClassName("content")[0].innerHTML = '<div class="check"><p style="font-size:1.2em">Ready when you are</p><button class="verifyList" style="height:40px;">Start</button><ul class="absentList"></ul></div>';

    document.getElementsByClassName("verifyList")[0].addEventListener("click", function() {
        setInterval(function(){
            function returnDOM() {
                let meetList = document.querySelectorAll('[data-sort-key]');
                let openMeetList = document.querySelectorAll('[aria-disabled="false"]')[3];

                if (!meetList.length) {
                    openMeetList.click();
                } else {
                    let arr = [];
                    for (var i = 0; document.querySelectorAll('[data-sort-key]').length > i; i++) {
                        arr.push(document.querySelectorAll('[data-sort-key]')[i].innerText);
                    }
                    return arr;
                }

            }

            chrome.tabs.executeScript({
                code: '(' + returnDOM + ')();'
            }, function(meetListArr) {
                let absentArr = [];
                let presentArr = [];
                chrome.storage.sync.get("name", function(response) {
                    for(var i = 0; meetListArr[0].length > i; i++) {
                        for(var j = 0; response.name.length > j; j++) {
                            if(meetListArr[0][i].includes(response.name[j])) {
                                presentArr.push(response.name[j]);
                            }
                        }
                    }
                    absentArr = response.name.diff(presentArr);

                    let absentList = document.getElementsByClassName("absentList")[0];
                    absentList.innerHTML = "";
                    for(var i = 0; absentArr.length > i; i++) {
                        var li = document.createElement("li");
                        li.innerText = absentArr[i];
                        absentList.appendChild(li);
                    }
                });
            });
        }, 500);
    });
});

navBar[0].click();