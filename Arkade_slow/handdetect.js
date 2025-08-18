export function startDetectionHand(coordinatesCallback) {
    console.log("start callback detect");
    const videoElement = document.getElementById('videoInput');
    const canvasElement = document.getElementById('videoOutput');
    const canvasCtx = canvasElement.getContext('2d');

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

    hands.onResults((results) => {
            canvasElement.width = videoElement.videoWidth;
            // const width = (vide/oElement.videoWidth).toFixed(0) + 20;
            canvasElement.height = videoElement.videoHeight;

            canvasCtx.scale(-1, 1);
            canvasCtx.translate(-canvasElement.width, 0);

            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
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
                const centerX = averageX * canvasElement.width;
                const centerY = averageY * canvasElement.height;
                drawRectangle(canvasCtx, centerX, centerY);

                // Виклик callback з новими значеннями
				//loggedData(`Hand detected at X: ${xPercent}, Y: ${yPercent}`);
                if (coordinatesCallback) {
					// loggedData(`Calling coordinatesCallback with X: ${xPercent}, Y: ${yPercent}`);
                    coordinatesCallback(xPercent, yPercent);
                }
            }
        });

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480,
        facingMode: 'user'
    });

    camera.start();


}
function loggedData(message) {
    const now = new Date();
    const formattedDatetime = now.toLocaleString();
    console.log(`[${formattedDatetime}] ${message}`);
    window.startDetection = (callback) => {
        console.log("start callback detect");
        const videoElement = document.getElementById('videoInput');
        const canvasElement = document.getElementById('canvasOutput');
        const canvasCtx = canvasElement.getContext('2d');

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

        hands.onResults((results) => {
            canvasElement.width = videoElement.videoWidth;
            // const width = (vide/oElement.videoWidth).toFixed(0) + 20;
            canvasElement.height = videoElement.videoHeight;

            canvasCtx.scale(-1, 1);
            canvasCtx.translate(-canvasElement.width, 0);

            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
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
                const centerX = averageX * canvasElement.width;
                const centerY = averageY * canvasElement.height;
                drawRectangle(canvasCtx, centerX, centerY);

                // Виклик callback з новими значеннями
                if (callback) {
                    callback(xPercent, yPercent);
                }
            }
        });

        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({ image: videoElement });
            },
            width: 640,
            height: 480,
            facingMode: 'user'
        });

        camera.start();
    };
}

export function startHandDetection() {
    loggedData("Starting hand detection");
}
//loggedData('Hand detection script loaded');