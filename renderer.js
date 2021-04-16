// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const sketchify = require('@amilajack/neon-hello/lib/index.js');
let input = document.getElementById("upload-button");
let sketch_button = document.getElementById("button");
let img = document.getElementById("im");


function uploadImage(e) {
    const image = e.target.files[0];
    sketchify(image.path);
    img.src = image.path;
    document.getElementById("empty-cover").style.display = "none";
    img.style.display = "flex";
}

function show_sketch(e) {
    let new_path = "output.jpg?dummy=" + e.timeStamp;
    img.src = new_path;
}
input.addEventListener("change",uploadImage);
sketch_button.addEventListener("click",show_sketch);
