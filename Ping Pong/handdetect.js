export function startDetectionHand(coordinatesCallback) {
    console.log("start callback detect");
    const videoElement = document.getElementById('videoInput');
    const canvasElement = document.getElementById('canvasOutput');
    var canvasCtx = null;
    if (canvasElement) {
        canvasCtx = canvasElement.getContext('2d');
    } else {
        canvasCtx = null;
    }

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
    });

    function drawRectangle(canvasCtx, x, y) {
        const rectSize = 20;
        // Draw the rectangle
        canvasCtx.beginPath();
        canvasCtx.lineWidth = "4";
        canvasCtx.strokeStyle = "red";
        canvasCtx.rect(x - rectSize / 2, y - rectSize / 2, rectSize, rectSize);
        canvasCtx.stroke();
    }
    function drawImage(canvasCtx, image, width, height) {
        canvasCtx.scale(-1, 1);
        canvasCtx.translate(-width, 0);

        canvasCtx.clearRect(0, 0, width, height);
        canvasCtx.drawImage(image, 0, 0, width, height);

    }

    hands.onResults((results) => {
        let width = videoElement.videoWidth;
        // const width = (vide/oElement.videoWidth).toFixed(0) + 20;
        let height = videoElement.videoHeight;

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // loggedData("on landmarks");
            if (canvasCtx) {
                canvasElement.width = width;
                canvasElement.height = height;
                drawImage(canvasCtx, results.image, width, height);
            }

            const landmarks = results.multiHandLandmarks[0];

            // Ініціалізуємо змінні для суми координат
            let sumX = 0;
            let sumY = 0;

            // Ітеруємо по всіх точках-орієнтирах руки та додаємо їхні координати до суми
            for (const landmark of landmarks) {
                sumX += landmark.x;
                sumY += landmark.y;
            }

            // Обчислюємо середні координати, поділивши суму на кількість точок
            const averageX = sumX / landmarks.length;
            const averageY = sumY / landmarks.length;

            // Розрахунок процента на основі середньої точки
            const xPercent = ((1 - averageX) * 100).toFixed(2);
            const yPercent = (averageY * 100).toFixed(2);

            // Відображення прямокутника на знайденій середній точці
            const centerX = averageX * width;
            const centerY = averageY * height;
            if (canvasCtx) {
                drawRectangle(canvasCtx, centerX, centerY);
            }
            // Виклик callback з новими значеннями
            if (coordinatesCallback) {
                coordinatesCallback(xPercent, yPercent);
            }
        }
    });
    var counter = 0;
    var timToParse = 0;

    const camera = new Camera(videoElement, {

        onFrame: () => {
            counter++;
            hands.send({ image: videoElement });

        },
        width: 640,
        height: 480,
        facingMode: 'user',
        frameRate: 25

    });

    camera.start();


}
function loggedData(message) {
    const now = new Date();
    const formattedDatetime = now.toISOString().replace('T', ' ').replace('Z', '');
    console.log(`[${formattedDatetime}] ${message}`);

}

window.startDetection = (callback) => {
    startDetectionHand(callback);
};
