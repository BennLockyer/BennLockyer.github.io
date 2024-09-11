alert("Welcome!");

const canvas = document.getElementById('gardenCanvas');
const canvasContext = canvas.getContext('2d');

let isPanning = false;
let startY;
let offsetY = 0;

const gardenWidth = canvas.width;
const gardenHeight = 2500;

const items = [
    { id: "item1", x: 50, y: 50, width: 100, height: 100, color: 'blue' },
    { id: "item2", x: 200, y: 100, width: 150, height: 100, color: 'green' },
    { id: "item3", x: 150, y: 900, width: 80, height: 110, color: 'red' }
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

canvas.addEventListener('mousedown', function (e) {
    isPanning = true;
    startY = e.clientY - offsetY;
});

canvas.addEventListener('mousemove', function (e) {
    if (isPanning) {
        const newOffsetY = e.clientY - startY;
        offsetY = Math.min(0, Math.max(canvas.height - gardenHeight, newOffsetY));

        DrawItems();
    }
});

canvas.addEventListener('mouseup', function () {
    isPanning = false
});

DrawItems();