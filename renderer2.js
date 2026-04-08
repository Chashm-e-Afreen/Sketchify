const { webUtils } = require('electron');
const path = require('path');
const fs = require('fs');

// 1. Load the native module using an absolute path
// process.cwd() ensures we find it even on Musl's weird directory resolution
const nativePath = path.join(process.cwd(), 'index.node');
let native;

try {
    native = require(nativePath);
    console.log("Native module loaded successfully from:", nativePath);
} catch (err) {
    console.error("FAILED TO LOAD NATIVE MODULE:", err);
}

// Ensure this matches cx.export_function("sketch", ...) in your lib.rs
const sketchify = native ? native.sketch : null;

// 2. UI Elements
const input = document.getElementById("upload-button");
const sketch_button = document.getElementById("button");
const img = document.getElementById("im");

// 3. Logic for Uploading
function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Electron 35+ requirement: Get the REAL path from the file object
    const imagePath = webUtils.getPathForFile(file);
    console.log("Processing path:", imagePath);

    if (sketchify) {
        try {
            // Call the Rust function
            sketchify(imagePath);
            
            // Show the original image using the file:// protocol
            img.src = `file://${imagePath}`;
            document.getElementById("empty-cover").style.display = "none";
            img.style.display = "flex";
        } catch (err) {
            console.error("Rust Execution Error:", err);
        }
    } else {
        console.error("Sketchify function is not defined. Check Rust exports.");
    }
}

// 4. Logic for showing the result
function show_sketch(e) {
    // The output is usually saved in the project root
    const outputPath = path.join(process.cwd(), 'output.jpg');

    if (fs.existsSync(outputPath)) {
        // We add a timestamp to the URL to force Electron to bypass the image cache
        img.src = `file://${outputPath}?v=${Date.now()}`;
        console.log("Showing sketch from:", outputPath);
    } else {
        console.error("output.jpg not found at:", outputPath);
        alert("Sketch file not found. Did the Rust code finish?");
    }
}

// 5. Event Listeners
input.addEventListener("change", uploadImage);
sketch_button.addEventListener("click", show_sketch);
