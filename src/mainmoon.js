import './style.css'

let curimg = new Image();

const sslider = document.getElementById("scale")
const sval = document.getElementById("scaleval");
sval.innerHTML = sslider.value + "%";

sslider.oninput = function() {
  sval.innerHTML = this.value + "%";
  if (curimg.src) load(curimg, this.value / 100);
}


function getMoonFromNeighbors(pixels, x, y, width, height, moons) {
    const i = (y * width + x) * 4;
    const r = pixels[i];
    const g = pixels[i+1];
    const b = pixels[i+2];
    const grey = Math.round(0.299*r + 0.587*g + 0.114*b);

    let leftGrey = grey, rightGrey = grey;
    if (x > 0) {
        const li = (y*width + (x-1))*4;
        leftGrey = Math.round(0.299*pixels[li] + 0.587*pixels[li+1] + 0.114*pixels[li+2]);
    }
    if (x < width-1) {
        const ri = (y*width + (x+1))*4;
        rightGrey = Math.round(0.299*pixels[ri] + 0.587*pixels[ri+1] + 0.114*pixels[ri+2]);
    }

    let index = Math.floor(grey / 256 * moons.length);

    if (leftGrey < grey && index > 0) index--;   // left
    if (rightGrey > grey && index < moons.length-1) index++; // right

    return moons[index];
}

// Main image-to-moon function
function load(img, scale=0.1){
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    const moons = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
    let html = '';

    for (let y = 0; y < height; y++) {
        let row = '';
        for (let x = 0; x < width; x++) {
            row += getMoonFromNeighbors(pixels, x, y, width, height, moons);
        }
        html += row + '\n';
    }

    const appDiv = document.getElementById('app');
    appDiv.style.whiteSpace = 'pre';
    appDiv.style.fontFamily = 'monospace';
    appDiv.innerText = html;
}

// File input handling
document.getElementById('imageForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const fileInput = document.getElementById('img');
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            curimg = img
            load(img, sslider.value / 100);
        };
    };

    reader.readAsDataURL(file);
});
