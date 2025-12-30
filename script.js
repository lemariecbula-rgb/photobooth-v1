const video = document.getElementById("video");
const captureBtn = document.getElementById("capture");
const downloadBtn = document.getElementById("download");
const resetBtn = document.getElementById("reset");
const countdownEl = document.getElementById("countdown");

const shots = [
  document.getElementById("shot1"),
  document.getElementById("shot2"),
  document.getElementById("shot3")
];

let currentShot = 0;

/* ======================
   START CAMERA
====================== */
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(() => {
    alert("Camera access denied");
  });

/* ======================
   COUNTDOWN FUNCTION
====================== */
function countdown(seconds, done) {
  countdownEl.textContent = seconds;

  const timer = setInterval(() => {
    seconds--;
    if (seconds === 0) {
      clearInterval(timer);
      countdownEl.textContent = "";
      done();
    } else {
      countdownEl.textContent = seconds;
    }
  }, 1000);
}

/* ======================
   INITIALIZE PREVIEWS WITH IMAGE
====================== */
const placeholderImg = new Image();
placeholderImg.src = "sushi222.png"; // your placeholder image in same folder

placeholderImg.onload = () => {
  shots.forEach(canvas => {
    const ctx = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = 150;

    // Fill background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw placeholder image centered
    const imgWidth = canvas.width * 0.8;
    const imgHeight = canvas.height * 0.8;
    const offsetX = (canvas.width - imgWidth) / 2;
    const offsetY = (canvas.height - imgHeight) / 2;
    ctx.drawImage(placeholderImg, offsetX, offsetY, imgWidth, imgHeight);
  });
};

/* ======================
   CAPTURE PHOTO
====================== */
captureBtn.addEventListener("click", () => {
  if (currentShot >= 3) return;

  countdown(3, () => {
    const canvas = shots[currentShot];
    const ctx = canvas.getContext("2d");

    // Capture full video resolution for high quality
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    currentShot++;

    if (currentShot === 3) {
      downloadBtn.disabled = false;
    }
  });
});

/* ======================
   RESET BUTTON
====================== */
resetBtn.addEventListener("click", () => {
  currentShot = 0;
  downloadBtn.disabled = true;
  countdownEl.textContent = "";

  shots.forEach(canvas => {
    const ctx = canvas.getContext("2d");

    canvas.width = 100;
    canvas.height = 150;

    // Fill background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw placeholder image
    const imgWidth = canvas.width * 0.8;
    const imgHeight = canvas.height * 0.8;
    const offsetX = (canvas.width - imgWidth) / 2;
    const offsetY = (canvas.height - imgHeight) / 2;
    ctx.drawImage(placeholderImg, offsetX, offsetY, imgWidth, imgHeight);
  });
});

/* ======================
   DOWNLOAD PHOTO STRIP
====================== */
downloadBtn.addEventListener("click", () => {
  const w = shots[0].width;
  const h = shots[0].height;

  const strip = document.createElement("canvas");
  const ctx = strip.getContext("2d");

  strip.width = w + 40;             // white border
  strip.height = (h * 3) + 100;     // spacing + date

  // White background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, strip.width, strip.height);

  // Draw each captured shot
  shots.forEach((shot, i) => {
    ctx.drawImage(shot, 20, 20 + i * (h + 20), w, h);
  });

  // Date stamp
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(new Date().toLocaleString(), 20, strip.height - 20);

  // Trigger download
  strip.toBlob(blob => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "photobooth.png";
    link.click();
    URL.revokeObjectURL(link.href);
  });
});
