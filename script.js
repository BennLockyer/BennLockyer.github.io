//alert("Welcome!");

const canvas = document.getElementById('gardenCanvas');
const canvasContext = canvas.getContext('2d');
const popup = document.getElementById('popup');

const backgroundImage = new Image();
backgroundImage.src = "bg.png";

let isPanning = false;
let startY;
let offsetY = 0;
let lastOffset = 0

const gardenWidth = canvas.width;
const gardenHeight = 2500;

function DrawBackground() {    
    const patternY = offsetY % backgroundImage.height;
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    const pattern = canvasContext.createPattern(backgroundImage, 'repeat');
    const diff = offsetY - lastOffset;
    canvasContext.fillStyle = pattern;
    canvasContext.translate(0, diff);
    canvasContext.fillRect(0, 0, gardenWidth, gardenHeight);
    lastOffset = offsetY;
}

const items = [
    { id: "item1", x: 0, y: 0, width: 0, height: 0, color: 'blue', info: 'Test 1 - A blue square' },
    { id: "item2", x: 0, y: 0, width: 0, height: 0, color: 'green', info: 'Test 2 - A green rectangle' },
    { id: "item3", x: 0, y: 0, width: 0, height: 0, color: 'red', info: 'Test 3 - A red rectangle' }
];

backgroundImage.onload = function () {
    Draw();
}


function DrawItems() {    
    canvasContext.save()
    let row = 0
    let col = 0
    //canvasContext.translate(0, offsetY/15)
    items.forEach(item => {
        const x = 10 + (col * 110);
        const y = 10 + (row * 110);

        canvasContext.fillStyle = item.color;
        canvasContext.fillRect(x, y, 100, 100);
        
        item.width = 100;
        item.height = 100;
        item.x = x;
        item.y = y;

        ++col;
        if (col > 6) {
            col = 0
            ++row;
        }
    });

    canvasContext.restore();
}

function Draw() {
    DrawBackground();
    DrawItems();
}

Draw();

function GetItemAt(x, y) {
    const adjustedY = y - offsetY;
    for (const item of items) {
        if (x >= item.x && x <= item.x + item.width &&
            adjustedY >= item.y && adjustedY <= item.y + item.height) {
            return item
        }
    }
    return null;
}

canvas.addEventListener('mousedown', function (e) {
    isPanning = true;
    startY = e.clientY - offsetY;
});

canvas.addEventListener('mousemove', function (e) {
    if (isPanning) {
        const newOffsetY = e.clientY - startY;
        offsetY = Math.min(0, Math.max(canvas.height - gardenHeight, newOffsetY));

        Draw();
    } else {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const item = GetItemAt(mouseX, mouseY);
        if (item) {
            popup.textContent = item.info;
            popup.style.left = `${e.clientX + 10}px`;
            popup.style.top = `${e.clientY + 10}px`;
            popup.style.display = 'block';
        } else {
            popup.style.display = 'none';
        }
    }
});

canvas.addEventListener('mouseup', function () {
    isPanning = false
    popup.style.display = 'none';
});

canvas.addEventListener('touchstart', function (e) {
    isPanning = true;
    const touch = e.touches[0];
    startY = touch.clientY - offsetY;
});

canvas.addEventListener('touchmove', function (e) {
    if (isPanning) {
        const touch = e.touches[0];
        const newOffsetY = touch.clientY - startY;
        offsetY = Math.min(0, Math.max(canvas.height - gardenHeight, newOffsetY));
        Draw();
    }
});

canvas.addEventListener('touchend', function () {
    isPanning = false;
});