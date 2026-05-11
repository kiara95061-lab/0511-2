const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
const successOverlay = document.getElementById('success-overlay');
let isSelectedGreen = false;
let isDrawing = false;

function initCanvas() {
    // 確保畫布大小與容器一致
    canvas.width = 300;
    canvas.height = 300;
    
    // 1. 先把畫布填滿灰色 (這就是蓋在葉子上的遮罩)
    ctx.globalCompositeOperation = 'source-over'; // 確保現在是「畫上去」模式
    ctx.fillStyle = '#bdc3c7'; // 灰色
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. 設定「擦除」模式
    // 這樣之後手指滑過時，才會把灰色「擦掉」露出底下的綠色葉子
    ctx.globalCompositeOperation = 'destination-out'; 
}
}

[span_9](start_span)// 語音引導[span_9](end_span)
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'zh-TW';
    window.speechSynthesis.speak(msg);
}

// 檢查選擇顏色
function checkColor(color) {
    if (color === 'green') {
        isSelectedGreen = true;
        speak("正確！請開始塗滿葉子吧");
    } else {
        isSelectedGreen = false;
        speak("這不是綠色喔，再試試看");
    }
}

// 塗鴉/擦除邏輯
function draw(e) {
    if (!isDrawing || !isSelectedGreen) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    
    checkProgress();
}

[span_10](start_span)// 偵測進度：當灰色被擦掉夠多時[span_10](end_span)
function checkProgress() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clearPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) clearPixels++;
    }
    
    if (clearPixels > (pixels.length / 4) * 0.7) { // 擦除超過 70%
        showSuccess();
    }
}

function showSuccess() {
    successOverlay.style.display = 'flex';
    speak("恭喜答對！你真棒");
}

// 事件監聽
canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('touchstart', (e) => { isDrawing = true; draw(e); });
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', () => isDrawing = false);

window.onload = () => {
    initCanvas();
    setTimeout(() => speak("請點選綠色 green 並塗滿葉子"), 500);
};
