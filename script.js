const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const penButton = document.getElementById('penButton');
const markerButton = document.getElementById('markerButton');
const eraserButton = document.getElementById('eraserButton');
const textButton = document.getElementById('textButton');
const colorChangeButton = document.getElementById('colorChangeButton');
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const imageUrl = document.getElementById('imageUrl');

canvas.width = 1000;
canvas.height = 500;

let drawing = false;
let currentTool = 'pen';
let lineWidth = 5;
let color = '#000000';
let startX, startY;
let texts = [];
let changingTextColor = false;
let selectedTextIndex = -1;

function setTool(tool) {
    currentTool = tool;
    if (tool === 'eraser') {
        lineWidth = 20;
        color = '#ffffff'; // Eraser color
    } else {
        lineWidth = 5;
        color = '#000000'; // Default color for pen/marker
    }
}

function setColor(newColor) {
    color = newColor;
    if (currentTool === 'eraser') {
        color = '#ffffff'; // Eraser color
    }
}

function drawTexts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    texts.forEach(text => {
        ctx.font = '20px Arial';
        ctx.fillStyle = text.color;
        ctx.fillText(text.text, text.x, text.y);
    });
}

canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    startX = event.clientX - canvas.getBoundingClientRect().left;
    startY = event.clientY - canvas.getBoundingClientRect().top;
    if (currentTool === 'text') {
        const text = prompt('Enter text:');
        if (text) {
            texts.push({
                text: text,
                x: startX,
                y: startY,
                color: color
            });
            drawTexts();
        }
        drawing = false; // Stop drawing immediately after text
    } else if (currentTool === 'colorChange') {
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            const textWidth = ctx.measureText(text.text).width;
            const textHeight = 20; // Approximate height of text
            if (startX >= text.x && startX <= text.x + textWidth && startY >= text.y - textHeight && startY <= text.y) {
                selectedTextIndex = i;
                colorPicker.value = text.color;
                break;
            }
        }
        changingTextColor = selectedTextIndex !== -1;
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', (event) => {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2, false);
        ctx.fill();
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
});

penButton.addEventListener('click', () => setTool('pen'));
markerButton.addEventListener('click', () => setTool('marker'));
eraserButton.addEventListener('click', () => setTool('eraser'));
textButton.addEventListener('click', () => setTool('text'));
colorChangeButton.addEventListener('click', () => setTool('colorChange'));
colorPicker.addEventListener('input', (event) => {
    setColor(event.target.value);
    if (changingTextColor && selectedTextIndex !== -1) {
        texts[selectedTextIndex].color = event.target.value;
        drawTexts();
    }
});
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    texts = [];
});

saveButton.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    imageUrl.innerHTML = `<a href="${dataURL}" target="_blank" download="whiteboard.png">View Whiteboard Image</a>`;
});
