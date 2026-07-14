import { db, auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    where,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/*==================================
    QUEEN AD BANNER FLEX V4
    PART 1
===================================*/

/*=========================
DOM ELEMENTS
=========================*/

const layer = document.getElementById("circleLayer");

const uploadModal = document.getElementById("uploadModal");

const picker = document.getElementById("imagePicker");

const studentName = document.getElementById("studentName");

const submitRequest = document.getElementById("submitRequest");

const cancelUpload = document.getElementById("cancelUpload");

const circleNumber = document.getElementById("circleNumber");

const preview = document.getElementById("preview");

const previewImage = document.getElementById("previewImage");

const close = document.getElementById("close");

const imagePreview = document.getElementById("imagePreview");

const previewLarge = document.getElementById("previewLarge");

const closePreview = document.getElementById("closePreview");


/*=========================
ADMIN
=========================*/

const adminOpen = document.getElementById("adminOpen");

const adminPanel = document.getElementById("adminPanel");

const adminLoginBox = document.getElementById("adminLoginBox");

const adminDashboard = document.getElementById("adminDashboard");

const adminPassword = document.getElementById("adminPassword");

const adminLogin = document.getElementById("adminLogin");

const adminLogout = document.getElementById("adminLogout");

const adminCancel = document.getElementById("adminCancel");

const loginStatus = document.getElementById("loginStatus");

/*=========================
PAGES
=========================*/

const tabDashboard = document.getElementById("tabDashboard");

const tabPending = document.getElementById("tabPending");

const tabApproved = document.getElementById("tabApproved");

const tabSettings = document.getElementById("tabSettings");

const dashboardPage = document.getElementById("dashboardPage");

const pendingPage = document.getElementById("pendingPage");

const approvedPage = document.getElementById("approvedPage");

const settingsPage = document.getElementById("settingsPage");

/*=========================
CONTAINERS
=========================*/

const pendingRequests =
document.getElementById("pendingRequests");

const approvedStudents =
document.getElementById("approvedStudents");

/*=========================
STATS
=========================*/

const pendingCount =
document.getElementById("pendingCount");

const approvedCount =
document.getElementById("approvedCount");

const emptyCount =
document.getElementById("emptyCount");

/*=========================
VARIABLES
=========================*/

let selectedCircle = null;

let selectedNumber = 0;

let selectedFile = null;

const circles = [];
const printLayer =
document.getElementById("printCircles");

/*=========================
CLOUDINARY
=========================*/

const CLOUD_NAME = "ozglomoi";

const UPLOAD_PRESET = "Queenad";

const CLOUDINARY_URL =
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/*=========================
SHOW ADMIN PAGE
=========================*/

function showPage(page){

    dashboardPage.style.display = "none";

    pendingPage.style.display = "none";

    approvedPage.style.display = "none";

    settingsPage.style.display = "none";

    page.style.display = "block";

}

tabDashboard.onclick = () => showPage(dashboardPage);

tabPending.onclick = () => showPage(pendingPage);

tabApproved.onclick = () => showPage(approvedPage);

tabSettings.onclick = () => showPage(settingsPage);

/*=========================
IMAGE PREVIEW
=========================*/

close.onclick = () => {

    preview.style.display = "none";

};

preview.onclick = e => {

    if(e.target === preview){

        preview.style.display = "none";

    }

};

window.showImage = function(url){

    previewLarge.src = url;

    imagePreview.style.display = "flex";

};

closePreview.onclick = () => {

    imagePreview.style.display = "none";

};

imagePreview.onclick = e => {

    if(e.target === imagePreview){

        imagePreview.style.display = "none";

    }

};

/*=========================
UPLOAD POPUP
=========================*/

cancelUpload.onclick = () => {

    uploadModal.style.display = "none";

    studentName.value = "";

    picker.value = "";

    selectedFile = null;

    selectedCircle = null;

    selectedNumber = 0;

};

picker.onchange = function(){

    selectedFile = this.files[0];

};

/*=========================
CREATE CIRCLES
=========================*/

const TOP = 12;

const BOTTOM = 12;

const LEFT_ROWS = 9;

const RIGHT_ROWS = 9;

const LEFT_COLS = 2;

const RIGHT_COLS = 2;

function createCircle(x,y,number){

    const div = document.createElement("div");

    div.className = "circle empty";

    div.dataset.booked = "false";

    div.style.left = x + "%";

    div.style.top = y + "%";

    div.onclick = () => {

        if(div.dataset.booked === "true"){

            previewImage.src =
            div.querySelector("img").src;

            preview.style.display = "flex";

            return;

        }

        selectedCircle = div;

        selectedNumber = number;

        circleNumber.innerHTML =
        "Circle No. " + number;

        uploadModal.style.display = "flex";

    };

    layer.appendChild(div);

    circles[number] = div;

}

/*=========================
GENERATE ALL 60 CIRCLES
=========================*/

let circle = 1;

for(let i=0;i<TOP;i++){

    createCircle(7+i*7,4,circle++);

}

for(let i=0;i<BOTTOM;i++){

    createCircle(7+i*7,88,circle++);

}

for(let c=0;c<LEFT_COLS;c++){

    for(let r=0;r<LEFT_ROWS;r++){

        const offset = r%2===0 ? 0 : 4;

        createCircle(
            2+offset+(c*8),
            15+(r*7.6),
            circle++
        );

    }

}

for(let c=0;c<RIGHT_COLS;c++){

    for(let r=0;r<RIGHT_ROWS;r++){

        const offset = r%2===0 ? 0 : -4;

        createCircle(
            84+offset+(c*8),
            15+(r*7.6),
            circle++
        );

    }

}

/*==================================
    PART 2
===================================*/

/*=========================
UPLOAD TO CLOUDINARY
=========================*/

async function uploadToCloudinary(file){

    const formData = new FormData();

    formData.append("file", file);

    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL,{

        method:"POST",

        body:formData

    });

    const data = await response.json();

    return data.secure_url;

}

/*=========================
DASHBOARD COUNTS
=========================*/

async function updateDashboard(){

    const pendingSnapshot = await getDocs(
        collection(db,"requests")
    );

    const approvedSnapshot = await getDocs(
        collection(db,"students")
    );

    pendingCount.textContent =
    pendingSnapshot.size;

    approvedCount.textContent =
    approvedSnapshot.size;

    emptyCount.textContent =
    60 - approvedSnapshot.size;

}

/*=========================
UPLOAD REQUEST
=========================*/

submitRequest.onclick = async ()=>{

    if(studentName.value.trim()==""){

        alert("Enter your full name.");

        return;

    }

    if(!selectedFile){

        alert("Select a passport.");

        return;

    }

    submitRequest.disabled = true;

    submitRequest.innerHTML="Uploading...";

    try{

        const pendingCheck = await getDocs(

            query(

                collection(db,"requests"),

                where("circle","==",selectedNumber)

            )

        );

        if(!pendingCheck.empty){

            alert("Circle already has a pending request.");

            submitRequest.disabled=false;

            submitRequest.innerHTML="Upload Passport";

            return;

        }

        const approvedCheck = await getDocs(

            query(

                collection(db,"students"),

                where("circle","==",selectedNumber)

            )

        );

        if(!approvedCheck.empty){

            alert("Circle already booked.");

            submitRequest.disabled=false;

            submitRequest.innerHTML="Upload Passport";

            return;

        }

        const imageURL = await uploadToCloudinary(selectedFile);

        await addDoc(

            collection(db,"requests"),

            {

                name:studentName.value.trim(),

                circle:selectedNumber,

                image:imageURL,

                approved:false,

                created:serverTimestamp()

            }

        );

        alert("Request submitted successfully.");

        uploadModal.style.display="none";

        studentName.value="";

        picker.value="";

        selectedFile=null;

    }

    catch(error){

        alert(error.message);

        console.log(error);

    }

    submitRequest.disabled=false;

    submitRequest.innerHTML="Upload Passport";

};

/*=========================
ADMIN OPEN
=========================*/

adminOpen.onclick = async ()=>{

    try{

        await signOut(auth);

    }catch(e){}

    adminPanel.style.display="flex";

    adminLoginBox.style.display="block";

    adminDashboard.style.display="none";

    adminPassword.value="";

    loginStatus.innerHTML="";

};

/*=========================
ADMIN LOGIN
=========================*/

adminLogin.onclick = async ()=>{

    const email="qadadmin@qad.com";

    const password=adminPassword.value;

    if(password==""){

        loginStatus.innerHTML="Enter password.";

        return;

    }

    try{

        await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

    }

    catch(error){

        loginStatus.innerHTML=

        "❌ "+error.message;

    }

};

/*=========================
CANCEL LOGIN
=========================*/

adminCancel.onclick=()=>{

    adminPanel.style.display="none";

    adminPassword.value="";

    loginStatus.innerHTML="";

};

/*=========================
LOGOUT
=========================*/

adminLogout.onclick = async ()=>{

    await signOut(auth);

};

/*=========================
AUTH STATE
=========================*/

onAuthStateChanged(auth,(user)=>{

    if(user){

        adminLoginBox.style.display="none";

        adminDashboard.style.display="block";

        showPage(dashboardPage);

        updateDashboard();

        loadPendingRequests();

        loadApprovedStudents();

    }

    else{

        adminDashboard.style.display="none";

        adminLoginBox.style.display="block";

        adminPanel.style.display="none";

    }

});

/*==================================
    PART 3
===================================*/

/*=========================
LOAD PENDING REQUESTS
=========================*/

async function loadPendingRequests(){

    pendingRequests.innerHTML = "Loading...";

    const q = query(
        collection(db,"requests"),
        where("approved","==",false)
    );

    const snapshot = await getDocs(q);

    if(snapshot.empty){

        pendingRequests.innerHTML =
        "<p>No pending requests.</p>";

        return;

    }

    pendingRequests.innerHTML = "";

    snapshot.forEach(docSnap=>{

        const data = docSnap.data();

        pendingRequests.innerHTML += `

        <div class="requestCard">

            <img
                src="${data.image}"
                class="requestImage"
                onclick="showImage('${data.image}')">

            <h3>${data.name}</h3>

            <p>Circle ${data.circle}</p>

            <div class="requestButtons">

                <button
                onclick="approveRequest('${docSnap.id}')">

                ✅ Approve

                </button>

                <button
                onclick="rejectRequest('${docSnap.id}')">

                ❌ Reject

                </button>

            </div>

        </div>

        `;

    });

}

/*=========================
APPROVE REQUEST
=========================*/

window.approveRequest = async function(id){

    try{

        const requestRef =
        doc(db,"requests",id);

        const requestSnap =
        await getDoc(requestRef);

        if(!requestSnap.exists()){

            alert("Request not found.");

            return;

        }

        const data =
        requestSnap.data();

        await setDoc(

            doc(db,"students",id),

            {

                ...data,

                approved:true,

                approvedAt:
                serverTimestamp()

            }

        );

        await deleteDoc(requestRef);

        alert("✅ Student Approved.");

        loadPendingRequests();

        loadApprovedStudents();

        updateDashboard();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

};

/*=========================
REJECT REQUEST
=========================*/

window.rejectRequest = async function(id){

    const yes =
    confirm("Reject this request?");

    if(!yes) return;

    try{

        await deleteDoc(

            doc(db,"requests",id)

        );

        alert("Request rejected.");

        loadPendingRequests();

        updateDashboard();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

};

/*=========================
REFRESH PENDING LIVE
=========================*/

onSnapshot(

    collection(db,"requests"),

    ()=>{

        loadPendingRequests();

        updateDashboard();

    }

);

/*==================================
    PART 4
===================================*/

/*=========================
LOAD APPROVED STUDENTS
=========================*/

async function loadApprovedStudents(){

    approvedStudents.innerHTML = "Loading...";

    const snapshot = await getDocs(
        collection(db,"students")
    );

    if(snapshot.empty){

        approvedStudents.innerHTML =
        "<p>No approved students.</p>";

        return;

    }

    approvedStudents.innerHTML = "";

    snapshot.forEach(docSnap=>{

        const data = docSnap.data();

        approvedStudents.innerHTML += `

        <div class="requestCard">

            <img
                src="${data.image}"
                class="requestImage"
                onclick="showImage('${data.image}')">

            <h3>${data.name}</h3>

            <p>Circle ${data.circle}</p>

            <button
            onclick="removeStudent('${docSnap.id}')">

            🗑 Remove Student

            </button>

        </div>

        `;

    });

}

/*=========================
REMOVE STUDENT
=========================*/

window.removeStudent = async function(id){

    const yes = confirm(
        "Remove this student?\nThis will free the circle."
    );

    if(!yes) return;

    try{

        await deleteDoc(
            doc(db,"students",id)
        );

        alert("✅ Student removed.");

        loadApprovedStudents();

        updateDashboard();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

};

/*=========================
LIVE UPDATE BANNER
=========================*/

onSnapshot(

    collection(db,"students"),

    (snapshot)=>{

        // Reset every circle

        circles.forEach(circle=>{

            if(!circle) return;

            circle.innerHTML = "";

            circle.classList.add("empty");

            circle.dataset.booked = "false";

        });

        // Fill approved circles

        snapshot.forEach(docSnap=>{

            const student = docSnap.data();

            const circle = circles[student.circle];

            if(!circle) return;

            circle.innerHTML = "";

            circle.classList.remove("empty");

            circle.dataset.booked = "true";

            const img =
            document.createElement("img");

            img.src = student.image;

            img.alt = student.name;

            img.title = student.name;

            circle.appendChild(img);

        });

        // Refresh admin page

        loadApprovedStudents();

        updateDashboard();

    }

);

/*==================================
    PART 5 (FINAL)
===================================*/

/*=========================
SETTINGS PAGE
=========================*/

settingsPage.innerHTML = `

<h3>⚙️ Settings</h3>

<button id="refreshDashboard">
🔄 Refresh Dashboard
</button>

<br><br>

<input
type="text"
id="searchStudent"
placeholder="Search student or circle">

<br><br>

<button id="exportCSV">
📥 Export Approved List
</button>

<br><br>

<button id="generateBanner">
🖨️ Generate Print Banner
</button>

<br><br>

<button id="adminLogout">
🚪 Logout
</button>

`;

const refreshDashboard =
document.getElementById("refreshDashboard");

const searchStudent =
document.getElementById("searchStudent");

const exportCSV =
document.getElementById("exportCSV");
const generateBanner =
document.getElementById("generateBanner")
generateBanner.onclick = () => {

    window.location.href = "print.html";

};

/* Reconnect logout button */

document
.getElementById("adminLogout")
.onclick = async ()=>{

    await signOut(auth);

};

/*=========================
REFRESH
=========================*/

refreshDashboard.onclick = ()=>{

    updateDashboard();

    loadPendingRequests();

    loadApprovedStudents();

    alert("Dashboard refreshed.");

};

/*=========================
SEARCH APPROVED STUDENTS
=========================*/

searchStudent.onkeyup = ()=>{

    const value =
    searchStudent.value.toLowerCase();

    const cards =
    approvedStudents.querySelectorAll(".requestCard");

    cards.forEach(card=>{

        const text =
        card.innerText.toLowerCase();

        if(text.includes(value)){

            card.style.display="block";

        }

        else{

            card.style.display="none";

        }

    });

};

/*=========================
EXPORT CSV
=========================*/

exportCSV.onclick = async ()=>{

    const snapshot =
    await getDocs(collection(db,"students"));

    if(snapshot.empty){

        alert("No approved students.");

        return;

    }

    let csv =
    "Name,Circle\n";

    snapshot.forEach(doc=>{

        const data=doc.data();

        csv += `"${data.name}",${data.circle}\n`;

    });

    const blob =
    new Blob([csv],{

        type:"text/csv"

    });

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    "QueenAD_ApprovedStudents.csv";

    a.click();

    URL.revokeObjectURL(url);

};

async function generatePrintBanner(){

    printLayer.innerHTML = "";

    const snapshot =
    await getDocs(collection(db,"students"));

    snapshot.forEach(docSnap=>{

        const student =
        docSnap.data();

        const original =
        circles[student.circle];

        if(!original) return;

        const div =
        document.createElement("div");

        div.className =
        "printCircle";

        div.style.left =
        original.style.left;

        div.style.top =
        original.style.top;

        div.style.width =
        original.offsetWidth+"px";

        div.style.height =
        original.offsetHeight+"px";

        const img =
        document.createElement("img");

        img.src =
        student.image;

        div.appendChild(img);

        printLayer.appendChild(div);

    });

    const win =
    window.open("");

    win.document.write(`

    <html>

    <head>

    <title>Queen AD Banner</title>

    <style>

    body{

        margin:0;

        background:white;

    }

    #wrap{

        position:relative;

        width:100%;

    }

    #wrap img{

        width:100%;

        display:block;

    }

    .printCircle{

        position:absolute;

        overflow:hidden;

        border-radius:50%;

    }

    .printCircle img{

        width:100%;

        height:100%;

        object-fit:cover;

    }

    </style>

    </head>

    <body>

    <div id="wrap">

    ${document.getElementById("printPage").innerHTML}

    </div>

    </body>

    </html>

    `);

    win.document.close();

    setTimeout(()=>{

        win.print();

    },1000);

}
/*=========================
STARTUP
=========================*/

updateDashboard();

loadPendingRequests();

loadApprovedStudents();

console.log("✅ Queen AD Banner Flex V4 Loaded Successfully");
