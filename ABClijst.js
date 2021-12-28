"use strict";
//GUI maken
//saveData verwerken
//- saveData toeveogen en saveData verwijderen
//opslag bepalen

const lijstA = document.getElementById("lijstA");
const lijstB = document.getElementById("lijstB");
const lijstC = document.getElementById("lijstC");
const inputs = document.getElementsByClassName("inputList");
const btnClear = document.getElementById("btnClear");
const btnSave = document.getElementById("btnSave");
const btnLoad = document.getElementById("btnLoad");
const onderwerp = document.getElementById("onderwerp");

let saveOnderwerp = localStorage.getItem("saveOnderwerp");
if (saveOnderwerp !== null) {
    onderwerp.value = saveOnderwerp.substring(saveOnderwerp.indexOf(`"`) + 1, saveOnderwerp.length - 2);
}

let saveDataA = JSON.parse(localStorage.getItem("saveDataA"));
if (saveDataA === null) {
    saveDataA = [];
}
let saveDataB = JSON.parse(localStorage.getItem("saveDataB"));
if (saveDataB === null) {
    saveDataB = [];
}
let saveDataC = JSON.parse(localStorage.getItem("saveDataC"));
if (saveDataC === null) {
    saveDataC = [];
}
readSaveData();

onderwerp.onblur = function() {
    localStorage.setItem("saveOnderwerp", `["${this.value}"]`);
};

for (const input of inputs) {
    input.onblur = function() {

        if (input.value !== "") {
            getLijst(input.getAttribute("data-lijst")).push({ lijst: input.getAttribute("data-lijst"), priority: 0, value: input.value })
            addToList(input.getAttribute("data-lijst"), 0, input.value);
            input.value = "";
        }
        localStorage.setItem("saveDataA", JSON.stringify(saveDataA));
        localStorage.setItem("saveDataB", JSON.stringify(saveDataB));
        localStorage.setItem("saveDataC", JSON.stringify(saveDataC));
    }
}

btnClear.onclick = function() {
    localStorage.clear();
    location.reload();
}
btnSave.onclick = function() {
    let a = document.createElement('a');
    a.href = `data:application/octet-stream, 
        {
        "onderwerp":[${JSON.stringify(onderwerp)}]
        "saveDataA":${JSON.stringify(saveDataA)}
        "saveDataB":${JSON.stringify(saveDataB)}
        "saveDataC":${JSON.stringify(saveDataC)}
        }`;
    a.download = 'abc.txt';
    a.click();
}
btnLoad.onclick = async function() {
    let loadData;
    let r;
    await fetch("abc.json")
        .then(response => response.json())
        .then(data => loadData = data)
        .catch(error => console.log("error"));

    localStorage.setItem("saveOnderwerp", JSON.stringify(loadData.onderwerp));
    localStorage.setItem("saveDataA", JSON.stringify(loadData.saveDataA));
    localStorage.setItem("saveDataB", JSON.stringify(loadData.saveDataB));
    localStorage.setItem("saveDataC", JSON.stringify(loadData.saveDataC));
    location.reload();
}

function addToList(lijst, priority, text) {
    const item = createListItem(priority, text);
    document.getElementById(lijst).appendChild(item);

}

function readSaveData() {
    for (let e of saveDataA.sort((a, b) => (a.priority < b.priority) ? 1 : ((b.priority < a.priority) ? -1 : 0))) { // werkt maar tot 9
        lijstA.appendChild(createListItem(e.priority, e.value));
    }
    for (let e of saveDataB.sort((a, b) => (a.priority < b.priority) ? 1 : ((b.priority < a.priority) ? -1 : 0))) { // werkt maar tot 9
        lijstB.appendChild(createListItem(e.priority, e.value));
    }
    for (let e of saveDataC.sort((a, b) => (a.priority < b.priority) ? 1 : ((b.priority < a.priority) ? -1 : 0))) { // werkt maar tot 9
        lijstC.appendChild(createListItem(e.priority, e.value));
    }
}

function createListItem(varPriority, input) {
    const item = document.createElement("li");
    const text = document.createElement("span");
    const priority = document.createElement("input");
    const imgUp = document.createElement("img");
    const imgDown = document.createElement("img");
    const imgDelete = document.createElement("img");
    text.innerText = " " + input + " ";
    imgUp.src = "up-arrow.png";
    imgDown.src = "down-arrow.png";
    priority.setAttribute("class", "priority");
    imgDelete.src = "delete.png";
    imgDelete.id = "imgDelete";

    imgUp.onclick = function() {
        const priority = this.parentNode.childNodes[0];
        const lijst = this.parentNode.parentNode.id;
        const lookup = this.parentNode.childNodes[1].innerText.split(' ').join('');
        if (!isNaN(priority.value) && priority.value < 9) {
            getLijst(lijst).find(s => { return s.value.split(' ').join('') === lookup }).priority = Number(priority.value) + 1;
            saveLocalStorage();
            this.parentNode.parentNode.innerHTML = "";
        } else {
            getLijst(lijst).find(s => { return s.value.split(' ').join('') === lookup }).priority = 0
            priority.value = 0;
        }
        saveLocalStorage();
        location.reload();
    }
    imgDown.onclick = function() {
        const priority = this.parentNode.childNodes[0];
        const lijst = this.parentNode.parentNode.id;
        const lookup = this.parentNode.childNodes[1].innerText.split(' ').join('');
        if (!isNaN(priority.value) && priority.value < 9) {
            getLijst(lijst).find(s => { return s.value.split(' ').join('') === lookup }).priority = Number(priority.value) - 1;
            saveLocalStorage();
            this.parentNode.parentNode.innerHTML = "";
        } else {
            getLijst(lijst).find(s => { return s.value.split(' ').join('') === lookup }).priority = 0
            priority.value = 0;
        }
        saveLocalStorage();
        location.reload();
    }
    imgDelete.onclick = function() {
        const lijst = this.parentNode.parentNode.id;
        const lookup = this.parentNode.childNodes[1].textContent.split(' ').join('');
        const index = getLijst(lijst).findIndex(s => { return s.value.split(' ').join('') === lookup });
        if (index > -1) {
            getLijst(lijst).splice(index, 1);
        }
        this.parentNode.remove();
        saveLocalStorage();
    }
    if (!isNaN(varPriority)) {
        priority.value = varPriority;
    } else {
        priority.value = 0;
    }
    priority.onblur = function() { // can nog een bug geven wanner twee lijsten dezelfde waarde hebben
        if (!isNaN(this.value) && this.value < 10) {
            const lijst = this.parentNode.parentNode.id;
            const lookup = this.nextElementSibling.textContent.split(' ').join('');
            getLijst(lijst).find(s => { return s.value.split(' ').join('') === lookup }).priority = this.value;
            saveLocalStorage();
            this.parentNode.parentNode.innerHTML = "";
            location.reload();
        } else {
            this.value = 0;
        }
    }

    item.appendChild(priority);
    item.appendChild(text);
    item.appendChild(imgUp);
    item.appendChild(imgDown);
    item.appendChild(imgDelete);
    return item;
}

function getLijst(lijst) {
    switch (lijst) {
        case "lijstA":
            return saveDataA;
            break;
        case "lijstB":
            return saveDataB;
            break;
        case "lijstC":
            return saveDataC;
            break;
    }
}

function saveLocalStorage() {
    localStorage.setItem("saveDataA", JSON.stringify(saveDataA));
    localStorage.setItem("saveDataB", JSON.stringify(saveDataB));
    localStorage.setItem("saveDataC", JSON.stringify(saveDataC));
}