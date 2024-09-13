//alert("Welcome!");

const canvas = document.getElementById('gardenCanvas');
const canvasContext = canvas.getContext('2d');
const popup = document.getElementById('popup');
const closeButton = document.getElementById('close-btn');

const backgroundImage = new Image();
backgroundImage.src = "bg.png";

let isPanning = false;
let startY;
let offsetY = 0;
let lastOffset = 0

const gardenWidth = canvas.width;
const gardenHeight = 2500;

const itemWidth = 100;
const itemHeight = 100;
const gap = 10; // 10px gap between buildings
const totalCellWidth = itemWidth + gap; // 110px (building + gap)
const totalCellHeight = itemHeight + gap; // 110px (building + gap)
const initialOffsetX = 10; // Start offset for the first column
const initialOffsetY = 10; // Start offset for the first row
const columns = 7; // Number of columns per row

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

const items = [];
const itemData = [
    { color: 'blue', info: 'In loving memory of blue square.' },
    { color: 'green', info: 'Green square, always in our hearts.' },
    { color: 'red', info: 'Red square - forever missed.' },
    { color: 'yellow', info: 'Goodbye, yellow square'}
];

backgroundImage.onload = function () {
    Draw();
}

function GenerateItems(){
    let idCounter = 1;
    itemData.forEach((data, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const x = initialOffsetX + col * (itemWidth + gap);
        const y = initialOffsetY + row * (itemHeight + gap);

        items.push({
            id: idCounter.toString(),
            x: x,
            y: y,
            width: itemWidth,
            height: itemHeight,
            info: data.info,
            color: data.color
        });
        ++idCounter;
    });
}
GenerateItems();

function DrawItems() {    
    canvasContext.save()
    let row = 0
    let col = 0
    //canvasContext.translate(0, offsetY/15)
    items.forEach(item => {
        const x = initialOffsetX + (col * totalCellWidth);
        const y = initialOffsetY + (row * totalCellHeight);

        canvasContext.fillStyle = item.color;
        canvasContext.fillRect(x, y, itemWidth, itemHeight);
        
        item.width = itemWidth;
        item.height = itemHeight;
        item.x = x;
        item.y = y;

        ++col;
        if (col == columns) {
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

function GetNewItemAt(x, y){
     // Subtract the initial offsets before calculating the column and row
     const adjustedX = x - initialOffsetX;
     const adjustedY = y - initialOffsetY;
 
     // Make sure the x and y are within the building grid boundaries
     if (adjustedX < 0 || adjustedY < 0) return null;
 
     // Calculate the column and row based on the adjusted x, y
     const col = Math.floor(adjustedX / totalCellWidth);
     const row = Math.floor(adjustedY / totalCellHeight);
 
     // Calculate the building's index in the items array
     const index = row * columns + col;
 
     // Check if the index is valid and if the x, y is within a building's area
     if (index >= 0 && index < items.length) {
         const item = items[index];
         const itemX = item.x;
         const itemY = item.y;
 
         // Check if the click/tap is within the actual building area, not the gap
         if (x >= itemX && x <= itemX + itemWidth &&
             y >= itemY && y <= itemY + itemHeight) {
             return item;
         }
     } 
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
    }
});

canvas.addEventListener('mouseup', function () {
    isPanning = false
    popup.style.display = 'none';
});

canvas.addEventListener('touchstart', HandleTouchStart, {passive: false });
canvas.addEventListener('touchmove', HandleTouchMove, { passive: false });
canvas.addEventListener('touchend', HandleTouchEnd, {});
canvas.addEventListener('click', HandlePopup);
closeButton.addEventListener('click', ClosePopup)

function HandleTouchStart(e) {
    isPanning = true;
    const touch = e.touches[0];
    startY = touch.clientY - offsetY;
}

function HandleTouchMove(e) {
    e.preventDefault();
    if (isPanning) {
        const touch = e.touches[0];
        const newOffsetY = touch.clientY - startY;
        offsetY = Math.min(0, Math.max(canvas.height - gardenHeight, newOffsetY));
        Draw();
    }
}

function HandleTouchEnd(e) {
    isPanning = false;
}

function HandlePopup(e) {
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = canvas.getBoundingClientRect();
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;
    //const item = GetItemAt(canvasX, canvasY);
    const item = GetNewItemAt(canvasX, canvasY);
    if (item) {
        popup.textContent = item.info;
        popup.style.left = `${e.clientX + 10}px`;
        popup.style.top = `${e.clientY + 10}px`;
        popup.style.display = 'block';
    }
}
function ClosePopup() {
    popup.style.display = 'none';
}
