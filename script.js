alert("Welcome!");

const canvas = document.getElementById('gardenCanvas');
const canvasContext = canvas.getContext('2d');

let isPanning = false;
let startX, startY;
let offsetX = 0, offsetY = 0;

const items = [
    { id: "item1", x: 50, y: 50, width: 100, height: 100, color: 'blue' },
    { id: "item2", x: 200, y: 100, width: 150, height: 100, color: 'green' }
];

function DrawItems() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.save()
    canvasContext.translate(offsetX, offsetY)
    items.forEach(item => {
        canvasContext.fillStyle = item.color;
        canvasContext.fillRect(item.x, item.y, item.width, item.height);
    });
}

canvas.addEventListener('mousedown', function (e) {
    isPanning = true;
    startX = e.offsetX - offsetX;
    startY = e.offsetY - offsetY;
});

canvas.addEventListener('mousemove', function (e) {
    if (isPanning) {
        offsetX = e.offsetX - startX;
        offsetY = e.offsetY - startY;
        DrawItems();
    }
});

canvas.addEventListener('mouseup', function () {
    isPanning = false
});

DrawItems();