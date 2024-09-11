alert("Welcome!");

const canvas = document.getElementById('gardenCanvas');
const canvasContext = canvas.getContext('2d');
const popup = document.getElementById('popup');

let isPanning = false;
let startY;
let offsetY = 0;

const gardenWidth = canvas.width;
const gardenHeight = 2500;

const items = [
    { id: "item1", x: 50, y: 50, width: 100, height: 100, color: 'blue', info: 'Test 1 - A blue square' },
    { id: "item2", x: 200, y: 100, width: 150, height: 100, color: 'green', info: 'Test 2 - A green rectangle' },
    { id: "item3", x: 150, y: 900, width: 80, height: 110, color: 'red', info: 'Test 3 - A red rectangle' }
];

function DrawItems() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.save()
    canvasContext.translate(0, offsetY)
    items.forEach(item => {
        canvasContext.fillStyle = item.color;
        canvasContext.fillRect(item.x, item.y, item.width, item.height);
    });
    canvasContext.restore();
}

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

        DrawItems();
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

DrawItems();