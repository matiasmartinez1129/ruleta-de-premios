const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const resultDiv = document.getElementById("result");

// Configuración para confeti
const confettiCanvas = document.createElement("canvas");
confettiCanvas.id = "confetti-canvas";
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
document.body.appendChild(confettiCanvas);
const confettiCtx = confettiCanvas.getContext("2d");
let confetti = [];

// Premios
const segments = [
  "Nos vemos la próxima",
  "Premio sorpresa",
  "10% descuento",
  "Nos vemos la próxima",
  "Premio sorpresa",
  "Premio sorpresa",
  "10% descuento",
  "Premio sorpresa",
];

const colors = [
  "#F57F5B",
  "#FACA78",
  "#68C7C1",
  "#F57F5B",
  "#FACA78",
  "#DD5341",
  "#68C7C1",
  "#FACA78",
];

const segmentCount = segments.length;
const segmentAngle = (2 * Math.PI) / segmentCount;
let rotation = 0;

// Dibujar la ruleta
function drawWheel() {
  for (let i = 0; i < segmentCount; i++) {
    const startAngle = i * segmentAngle;
    const endAngle = startAngle + segmentAngle;

    // Dibujar segmento
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, startAngle, endAngle);
    ctx.fillStyle = colors[i];
    ctx.fill();

    // Agregar texto
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(startAngle + segmentAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(segments[i], 230, 10);
    ctx.restore();
  }
}

// Girar la ruleta
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  resultDiv.textContent = "";
  const spinAngle = Math.random() * 360 + 3600; // Rotación aleatoria
  const spinTime = 3000; // Duración de la rotación

  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / spinTime, 1);
    rotation = spinAngle * progress;

    ctx.clearRect(0, 0, 500, 500);
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-250, -250);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      showResult();
    }
  }

  animate();
});

// Mostrar resultado
function showResult() {
  const finalAngle = (rotation % 360) * (Math.PI / 180);
  const index = Math.floor(segmentCount - (finalAngle / segmentAngle) % segmentCount);

  const prize = segments[index];
  resultDiv.textContent = `¡Te tocó: ${prize}!`;

  // Animación para confeti si corresponde
  if (["5% descuento", "10% descuento", "Premio sorpresa"].includes(prize)) {
    launchConfetti();
  }

  // Animación de desplazamiento para el texto del premio
  resultDiv.classList.add("animate");
  setTimeout(() => {
    resultDiv.classList.remove("animate");
  }, 1000);

  spinBtn.disabled = false;

  playSound(prize);
}

const sounds = {
  confetti: new Audio('../sounds/premio.mp3'), // Reemplaza con una URL o archivo válido
  discount: new Audio('../sounds/campanita.mp3'),
};

function playSound(prize) {
  if (["Premio sorpresa"].includes(prize)) {
    sounds.confetti.play();
  } else if (["5% descuento", "10% descuento"].includes(prize)) {
    sounds.discount.play();
  }
}
// Dibujar la ruleta al cargar la página
drawWheel();

// Función para lanzar confeti
function launchConfetti() {
  confetti = [];
  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 2, // Radio del confeti
      color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Color aleatorio
      speed: Math.random() * 3 + 1,
      angle: Math.random() * Math.PI * 2,
    });
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confetti.forEach((p) => {
      confettiCtx.beginPath();
      confettiCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fill();
      p.y += p.speed;
      p.x += Math.sin(p.angle) * 2;
      if (p.y > confettiCanvas.height) p.y = -10; // Reaparece arriba
    });

    if (confetti.length) requestAnimationFrame(animateConfetti);
  }

  animateConfetti();

  // Detener el confeti después de 5 segundos
  setTimeout(() => {
    confetti = [];
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 5000);
}
