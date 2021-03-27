
let input = document.getElementById("upload-button");

input.addEventListener("change",uploadImage);

let img = document.getElementById("im");
function uploadImage(e) {
    const image = e.target.files[0];
    img.src = image.path;
    document.getElementById("empty-cover").style.display = "none";
    img.style.display = "flex";
    let path = sketchify(image.path);
    img.src = "output.jpg";
}
