import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const layer = document.getElementById("printLayer");

const printBtn = document.getElementById("printBtn");

const backBtn = document.getElementById("backBtn");

const downloadBtn = document.getElementById("downloadBtn");


const container = document.getElementById("printContainer");


function getCircleSize() {
    const banner = document.getElementById("printBanner");
    return Math.max(20, banner.clientWidth * 0.055);
}

/*=========================
BACK BUTTON
=========================*/

backBtn.onclick = () => {

    window.location.href = "index.html";

};

/*=========================
PRINT
=========================*/

printBtn.onclick = async () => {

    const canvas = await html2canvas(container,{
        scale:3,
        useCORS:true,
        backgroundColor:null
    });

    const win = window.open("");

    win.document.write(`
        <html>
        <head>
        <title>Print</title>
        <style>
        body{
            margin:0;
            display:flex;
            justify-content:center;
            align-items:center;
        }
        img{
            width:100%;
        }
        </style>
        </head>
        <body>
            <img src="${canvas.toDataURL()}">
        </body>
        </html>
    `);

    win.document.close();

    win.onload = () => {
        win.print();
    };

};


downloadBtn.onclick = async ()=>{

    const canvas = await html2canvas(container,{
        scale:4,
        useCORS:true,
        backgroundColor:null
    });

    const link = document.createElement("a");

    link.download = "Queen_AD_Banner.png";

    link.href = canvas.toDataURL("image/png");

    link.click();

};
/*=========================
SAME CIRCLE POSITIONS
=========================*/

const circles = [];

const TOP = 12;
const BOTTOM = 12;

const LEFT_ROWS = 9;
const RIGHT_ROWS = 9;

const LEFT_COLS = 2;
const RIGHT_COLS = 2;

function createCircle(x, y, number){

    const div = document.createElement("div");

    div.className = "printCircle";

    const size = getCircleSize();

    div.style.width = size + "px";
    div.style.height = size + "px";

    div.style.left = x + "%";
    div.style.top = y + "%";

    // Remove translate
    // div.style.transform = "translate(-50%, -50%)";

    layer.appendChild(div);

    circles[number] = div;

}


let circle = 1;

// TOP
for(let i=0;i<TOP;i++){
    createCircle(7+i*7,4,circle++);
}

// BOTTOM
for(let i=0;i<BOTTOM;i++){
    createCircle(7+i*7,88,circle++);
}

// LEFT
for(let c=0;c<LEFT_COLS;c++){

    for(let r=0;r<LEFT_ROWS;r++){

        const offset = r%2===0 ? 0 : 4;

        createCircle(
            2 + offset + (c*8),
            15 + (r*7.6),
            circle++
        );

    }

}

// RIGHT
for(let c=0;c<RIGHT_COLS;c++){

    for(let r=0;r<RIGHT_ROWS;r++){

        const offset = r%2===0 ? 0 : -4;

        createCircle(
            84 + offset + (c*8),
            15 + (r*7.6),
            circle++
        );

    }

}

/*=========================
LOAD STUDENTS
=========================*/

async function loadStudents(){

    const snapshot =
    await getDocs(collection(db,"students"));

    snapshot.forEach(doc=>{

        const student = doc.data();

        const circle = circles[student.circle];

        if(!circle) return;

const img = document.createElement("img");

img.crossOrigin = "anonymous";
img.src = student.image;
img.alt = student.name;

img.style.width = "100%";
img.style.height = "100%";
img.style.objectFit = "cover";
img.style.borderRadius = "50%";
img.style.display = "block";

circle.innerHTML = "";
circle.appendChild(img);
    });

}

window.onload = () => {

    setTimeout(() => {

        loadStudents();

    }, 300);

};

window.addEventListener("resize",()=>{

    location.reload();

});

