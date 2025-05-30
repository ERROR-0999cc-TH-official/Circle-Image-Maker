/[ javascript ]/
const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const borderSizeInput = document.getElementById("borderSize");
const downloadBtn = document.getElementById("download");

let image = null;

upload.addEventListener("change", handleUpload);
borderSizeInput.addEventListener("input", drawImageWithBorder);

function handleUpload(e) {
const file = e.target.files[0];
if (!file) return;

if (file.type !== "image/png") {
alert("[ กรุณาอัปโหลดไฟล์ PNG เท่านั้น ]");
upload.value = "";
return;
}

const reader = new FileReader();
reader.onload = function(event) {
image = new Image();
image.onload = function() {
drawImageWithBorder();
downloadBtn.style.display = "inline-block";
};
image.src = event.target.result;
};
reader.readAsDataURL(file);
}

function drawImageWithBorder() {
if (!image) return;

let border = parseInt(borderSizeInput.value, 10);
if (isNaN(border) || border < 0) border = 0;
if (border > 100) border = 100;
borderSizeInput.value = border;

const canvasSize = Math.min(canvas.width, canvas.height);
const circleRadius = (canvasSize / 2) - (border / 2); // ปรับให้วงกลมเล็กลงตาม border

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.save();

const cropSize = Math.min(image.width, image.height);
const cropX = (image.width - cropSize) / 2;
const cropY = (image.height - cropSize) / 2;

// ตัดรูปให้เล็กลงตามขอบ
ctx.beginPath();
ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, Math.PI * 2);
ctx.closePath();
ctx.clip();

// วาดภาพ (เล็กลงตาม border)
ctx.drawImage(
image,
cropX, cropY, cropSize, cropSize,
border / 2, border / 2,
canvasSize - border, canvasSize - border
);

ctx.restore();

// วาดขอบดำ
ctx.beginPath();
ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, Math.PI * 2);
ctx.lineWidth = border;
ctx.strokeStyle = "black";
ctx.stroke();

downloadBtn.href = canvas.toDataURL("image/png");
}

/*[ ป้องการคัดลอกข้อความ และบล็อก Dev Tools ]*/
document.addEventListener('contextmenu', e => e.preventDefault()); /* บล็อกคลิกขวา */
document.addEventListener('copy', e => e.preventDefault());       /* บล็อก Ctrl+C */
document.addEventListener('keydown', function (e) {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || // Ctrl+Shift+I / J
    (e.ctrlKey && e.key === 'U')                                     // Ctrl+U
  ) {
    e.preventDefault();
    return false;
  }
});


/*[ หน้าโหลด 10 วินาที + ข้อความ [ Loading... ] ]*/
window.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const loadingText = document.getElementById("loading-text");
  const overlay = document.getElementById("overlay");

  // ขออนุญาตผู้ใช้ก่อน
  const confirmResult = confirm("[ TH ]\n- เว็บไซต์นี้ต้องการอนุญาตการใช้งาน JavaScript จากผู้ใช้เพื่อการทำงาน\n- กรุณากด > ตกลง < เพื่อดำเนินการต่อ\n\n[ US ]\n- This website requires JavaScript permission from the user to function.\n Please press > OK < to continue.");
  
  if (confirmResult) {
    // ผู้ใช้กดตกลง

    // บล็อกการเลื่อนและการคลิก
    document.body.style.overflow = "hidden";
    document.documentElement.style.pointerEvents = "none";

    // แสดงหน้าโหลดแบบค่อยๆ ชัดขึ้น
    setTimeout(() => {
      preloader.classList.add("show");
    }, 1000);

    // สลับข้อความ . .. ...
    let dots = 0;
    const dotInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      loadingText.textContent = `[ Loading${'.'.repeat(dots)} ]`;
    }, 700);

    // หลังจาก 20 วินาที ปิดหน้าโหลดและ overlay
    setTimeout(() => {
      clearInterval(dotInterval);

      // ปลดบล็อกการเลื่อนและการคลิก
      document.body.style.overflow = "";
      document.documentElement.style.pointerEvents = "";

      // ค่อยๆ จางหายไป
      preloader.style.opacity = "0";
      overlay.classList.add("hidden");

      setTimeout(() => {
        preloader.style.display = "none";
        overlay.style.display = "none";
      }, 500);
    }, 20000); // 20 วินาที
  } else {
    // ผู้ใช้กด "ยกเลิก" หรือไม่อนุญาต
    alert("[ TH ]\n- คุณไม่ได้อนุญาตให้เราใช้งาน JavaScript หน้าต่างนี่จะไม่ทำงาน\n- ระบบจะรีเซ็ตหน้าเว็บใน 5 วินาทีโดยอัตโนมัติ หลังจากคุณกด > ตกลง <\n\n[ US ]\n- You have not allowed us to use JavaScript. This window will not work.\n- The page will automatically reset in 5 seconds after you press > OK <");

    // หลังจาก 5 วินาที รีเฟรชหน้าเว็บ
    setTimeout(() => {
      location.reload();
    }, 5000);
  }
});

/*[ บล็อกการซูมด้วย Ctrl + Scroll ]*/
    document.addEventListener('wheel', function(e) {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    }, { passive: false });

    // บล็อกการซูมด้วย Ctrl + +/- หรือ Ctrl + 0
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
      }
    });

    // บล็อก pinch-zoom บนมือถือ
    document.addEventListener('gesturestart', function(e) {
      e.preventDefault();
    });
    document.addEventListener('gesturechange', function(e) {
      e.preventDefault();
    });
    document.addEventListener('gestureend', function(e) {
      e.preventDefault();
    });