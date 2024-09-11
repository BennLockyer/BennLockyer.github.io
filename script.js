alert("Welcome!");

const canvas = document.getElementById('gardenCanvas');
const canvasContext = canvas.getContext('2d');

const items = [
    { id: "item1", x: 50, y: 50, width: 100, height: 100, color: 'blue' },
    { id: "item2", x: 200, y: 100, width: 150, height: 100, color: 'green' }
];

function DrawItems() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    items.forEach(item => {
        canvasContext.fillStyle = item.color;
        canvasContext.fillRect(item.x, item.y, item.width, item.height);
    });
}

DrawItems();