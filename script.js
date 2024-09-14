//alert("Welcome!");

const canvas = document.getElementById('gardenCanvas');
const canvasContext = canvas.getContext('2d');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popup-text');
const popupImage = document.getElementById('popup-image');
const closeButton = document.getElementById('close-btn');

const backgroundImage = new Image();
backgroundImage.src = "bg.png";
const flowerImage = new Image();
flowerImage.src = "flower.png";

let isPanning = false;
let startY;
let offsetY = 0;
let lastOffset = 0;

let popupOpen = false;

const gardenWidth = canvas.width;
const gardenHeight = 2500;

const itemWidth = 150;
const itemHeight = 150;
const gap = 30; // 10px gap between buildings
const totalCellWidth = itemWidth + gap; // 110px (building + gap)
const totalCellHeight = itemHeight + gap; // 110px (building + gap)
const initialOffsetX = 30; // Start offset for the first column
const initialOffsetY = 30; // Start offset for the first row
const columns = 4; // Number of columns per row

function DrawBackground() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    const pattern = canvasContext.createPattern(backgroundImage, 'repeat');
    const diff = offsetY - lastOffset;
    canvasContext.fillStyle = pattern;
    canvasContext.translate(0, diff);
    canvasContext.fillRect(0, 0, gardenWidth, gardenHeight);
    lastOffset = offsetY;
}

const flowers = [];
const items = [];
const itemData = [
    { image: 'images/img-0001.png', info: 'In loving memory.' },
    { image: 'images/img-0002.png', info: 'Always in our hearts.' },
    { image: 'images/img-0003.png', info: 'Forever missed.' },
    { image: 'images/img-0004.png', info: 'Goodbye...'},
    { image: 'images/img-0005.png', info: 'Mountain!'},
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
            image: data.image,
            imageRef: null
        });
        ++idCounter;
    });
}
GenerateItems();

function GenerateFlowers() {
    for(x = 0; x < 10; ++x) {
        for(y = 0; y < 2; ++y){
            const position = GetRandomSpotInGap(x+1);
            flowers.push({
                x: position.x,
                y: position.y
            });
        }
    }
}
GenerateFlowers();

function GetRandomSpotInGap(row){
    console.log("Row is: " + row);
    const startY = 15 + (row * (itemHeight + gap));
    const x = Math.random() * (gardenWidth - 50);
    const y = (Math.random() * 10) + startY - 50;
    console.log("Y is " + y + ". StartY is " + startY);
    return {x: x, y: y};
}

function DrawItems() {    
    canvasContext.save();
    let row = 0
    let col = 0
    //canvasContext.translate(0, offsetY/15)
    items.forEach(item => {
        const x = initialOffsetX + (col * totalCellWidth);
        const y = initialOffsetY + (row * totalCellHeight);

        canvasContext.fillStyle = 'lightgray';
        canvasContext.fillRect(x, y, itemWidth, itemHeight);

        if(item.imageRef == null){
            const img = new Image();
            img.src = item.image;
            img.onload = function(){
                item.imageRef = img;
                DrawItems();
                return;
            }
        }
        if(item.imageRef){
            canvasContext.drawImage(item.imageRef, item.x, item.y, item.width, item.height);
        }
        
        item.width = itemWidth;
        item.height = itemHeight;
        item.x = x;
        item.y = y;

        ++col;
        if (col == columns) {
            col = 0
            ++row;
        }

        DrawFlowers();
    });

    canvasContext.restore();
}

function DrawFlowers(){
    //canvasContext.save();
    flowers.forEach(flower =>{        
        //canvasContext.clearRect(flower.x, flower.y, 50, 50);
        //canvasContext.fillRect(flower.x, flower.y, 50, 50);
        canvasContext.drawImage(flowerImage, flower.x, flower.y, 50, 50);
    });
    //canvasContext.restore();
}

function Draw() {
    DrawBackground();    
    
    DrawItems();
}

Draw();

function GetNewItemAt(x, y){
     // Subtract the initial offsets before calculating the column and row
     const adjustedX = x - initialOffsetX;
     const adjustedY = (y-offsetY) - initialOffsetY;
 
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
             (y-offsetY) >= itemY && (y-offsetY) <= itemY + itemHeight) {
             return item;
         }
     } 
}

canvas.addEventListener('mousedown', function (e) {
    isPanning = true;
    startY = e.clientY - offsetY;
});

canvas.addEventListener('mousemove', function (e) {
    if(popupOpen){
        return;
    }
    if (isPanning) {
        popup.style.display = 'none';
        const newOffsetY = e.clientY - startY;
        offsetY = Math.min(0, Math.max(canvas.height - gardenHeight, newOffsetY));

        Draw();
    }
});

canvas.addEventListener('mouseup', function () {
    isPanning = false
    //popup.style.display = 'none';
});

canvas.addEventListener('touchstart', HandleTouchStart, {passive: false });
canvas.addEventListener('touchmove', HandleTouchMove, { passive: false });
canvas.addEventListener('touchend', HandleTouchEnd, {});
canvas.addEventListener('click', HandlePopup);
closeButton.addEventListener('click', ClosePopup)

function HandleTouchStart(e) {
    e.preventDefault();
    isPanning = true;
    const touch = e.touches[0];
    startY = touch.clientY - offsetY;
}

function HandleTouchMove(e) {
    e.preventDefault();
    if(popupOpen){
        return;
    }
    if (isPanning) {
        popup.style.display = 'none';
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
        popupText.textContent = item.info;
        popupImage.src = item.image;
        popup.style.display = 'block';
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;
        const centerX = (canvas.width / 2) - (popupWidth / 2);
        const centerY = (canvas.height / 2) - (popupHeight / 2);    
        popup.style.left = `${rect.left + centerX}px`;
        popup.style.top = `${rect.top + centerY}px`;
        popupOpen = true;
        
    }
}
function ClosePopup() {
    popupOpen = false;
    popup.style.display = 'none';
}
