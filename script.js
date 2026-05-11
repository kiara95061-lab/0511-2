const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
const successOverlay = document.getElementById('success-overlay');
let isSelectedGreen = false;
let isDrawing = false;

// 初始化畫布遮罩
function initCanvas() {
    canvas.width = 300;
    canvas.height = 300;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#d1d8e0'; // 灰色
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 寫上引導文字
    ctx.fillStyle = "#7f8c8d";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("選好畫筆後開始塗色", 150, 150);
    
    ctx.globalCompositeOperation = 'destination-out'; // 設定為擦除模式
}

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'zh-TW';
    window.speechSynthesis.speak(msg);
}

function checkColor(color) {
    if (color === 'green') {
        isSelectedGreen = true;
        speak("正確！請找出綠色 green 的物品並塗滿它！");
    } else {
        isSelectedGreen = false;
        speak("這不是綠色喔，再試試看");
    }
}

function draw(e) {
    if (!isDrawing || !isSelectedGreen) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    checkProgress();
}

function checkProgress() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clearPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) clearPixels++;
    }
    if (clearPixels > (pixels.length / 4) * 0.6) {
        successOverlay.style.display = 'flex';
        speak("恭喜答對！！");
    }
}

canvas.addEventListener('mousedown', () => isDrawing = true);
window.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', (e) => { isDrawing = true; draw(e); e.preventDefault(); }, {passive: false});
canvas.addEventListener('touchmove', (e) => { draw(e); e.preventDefault(); }, {passive: false});
canvas.addEventListener('touchend', () => isDrawing = false);

window.onload = initCanvas;
