import './style.css'

let curimg = new Image();

const sslider = document.getElementById("scale")
const sval = document.getElementById("scaleval");
sval.innerHTML = sslider.value + "%";

sslider.oninput = function() {
  sval.innerHTML = this.value + "%";
  if (curimg.src) load(curimg, this.value / 100);
}

const colorEmojis = [
  {emoji: "🍎", r: 255, g: 0, b: 0},
  {emoji: "🍓", r: 220, g: 0, b: 40},
//   {emoji: "🍒", r: 200, g: 0, b: 30},
  {emoji: "🍊", r: 255, g: 165, b: 0},
  {emoji: "🍋", r: 255, g: 250, b: 50},
//   {emoji: "🍌", r: 255, g: 255, b: 0},
  {emoji: "🥭", r: 255, g: 200, b: 50},
  {emoji: "🥝", r: 120, g: 180, b: 40},
  {emoji: "🥦", r: 0, g: 128, b: 0},
  {emoji: "🌽", r: 255, g: 255, b: 100},
  {emoji: "🫐", r: 0, g: 0, b: 255},
  {emoji: "🍇", r: 110, g: 0, b: 130},
  {emoji: "🍆", r: 128, g: 0, b: 128},
  {emoji: "🫑", r: 0, g: 200, b: 0},
  {emoji: "🫒", r: 100, g: 150, b: 50},
  {emoji: "🍉", r: 255, g: 50, b: 50},
  {emoji: "🥕", r: 255, g: 140, b: 0},
  {emoji: "🤍", r: 255, g: 255, b: 255},
  {emoji: "⚫", r: 0, g: 0, b: 0},
  {emoji: "🟫", r: 150, g: 75, b: 0},
  {emoji: "🟨", r: 255, g: 255, b: 0},
  {emoji: "🟩", r: 0, g: 255, b: 0},
  {emoji: "🟦", r: 0, g: 0, b: 255},
  {emoji: "🟪", r: 128, g: 0, b: 128},
  {emoji: "🟧", r: 255, g: 165, b: 0},
  {emoji: "🟥", r: 255, g: 0, b: 0},
  {emoji: "🟩", r: 0, g: 128, b: 0},
  {emoji: "🟦", r: 0, g: 0, b: 255},
  {emoji: "🟫", r: 139, g: 69, b: 19},
  {emoji: "🟪", r: 128, g: 0, b: 128},
  {emoji: "🟨", r: 255, g: 255, b: 0},
  {emoji: "🟧", r: 255, g: 165, b: 0},
//   {emoji: "🌸", r: 255, g: 182, b: 193},
//   {emoji: "🌼", r: 255, g: 255, b: 0},
//   {emoji: "🌻", r: 255, g: 223, b: 0},
//   {emoji: "🌺", r: 255, g: 0, b: 127},
//   {emoji: "🌹", r: 255, g: 0, b: 0},
//   {emoji: "🥀", r: 200, g: 0, b: 0},
  {emoji: "💛", r: 255, g: 255, b: 0},
  {emoji: "💚", r: 0, g: 255, b: 0},
  {emoji: "💙", r: 0, g: 0, b: 255},
  {emoji: "💜", r: 128, g: 0, b: 128},
  {emoji: "🖤", r: 0, g: 0, b: 0},
  {emoji: "🤎", r: 139, g: 69, b: 19}
];

function closestEmoji(r, g, b, palette) {
    let closest = palette[0];
    let minDist = Infinity;

    for (const item of palette) {
        const dr = r - item.r;
        const dg = g - item.g;
        const db = b - item.b;
        const dist = dr*dr + dg*dg + db*db;
        if (dist < minDist) {
            minDist = dist;
            closest = item;
        }
    }

    return closest.emoji;
}

function getEmojiWithNeighbors(pixels, x, y, width, height, palette) {
    const neighbors = [];
    for (let dy=-1; dy<=1; dy++) {
        for (let dx=-1; dx<=1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >=0 && ny < height) {
                const i = (ny*width + nx)*4;
                neighbors.push({
                    r: pixels[i],
                    g: pixels[i+1],
                    b: pixels[i+2]
                });
            }
        }
    }

    const avg = neighbors.reduce((acc, p) => {
        acc.r += p.r; acc.g += p.g; acc.b += p.b;
        return acc;
    }, {r:0,g:0,b:0});

    avg.r = Math.round(avg.r / neighbors.length);
    avg.g = Math.round(avg.g / neighbors.length);
    avg.b = Math.round(avg.b / neighbors.length);

    return closestEmoji(avg.r, avg.g, avg.b, palette);
}

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

    let html = '';

    for (let y = 0; y < height; y++) {
        let row = '';
        for (let x = 0; x < width; x++) {
            row += getEmojiWithNeighbors(pixels, x, y, width, height, colorEmojis);
        }
        html += row + '\n';
    }

    const appDiv = document.getElementById('app');
    appDiv.style.whiteSpace = 'pre';
    appDiv.style.fontFamily = 'monospace';
    appDiv.innerText = html;
}

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
