const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const resultDiv = document.getElementById("result");

// Premios y configuración
const segments = [
  "Nos vemos la próxima",
  "Premio sorpresa",
  "10% descuento",
  "Nos vemos la próxima",
  "Premio sorpresa",
  "Gira de nuevo",
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
const segmentAngle = (2 * Math.PI) / segmentCount; // Ángulo de cada segmento
let rotation = 0; // Rotación actual de la ruleta
let isSpinning = false;

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

    // Dibujar texto
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

// Girar la ruleta con lógica de desaceleración
function spinWheel() {
  if (isSpinning) return; // Evitar clics múltiples
  isSpinning = true;
  spinBtn.disabled = true;
  resultDiv.textContent = "";

  const totalRotation = Math.random() * 360 + 3600; // Rotación aleatoria inicial (10 vueltas completas como mínimo)
  const spinTime = 3000; // Duración del giro
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / spinTime;

    if (progress < 1) {
      // Aceleración al principio y desaceleración al final
      const easeOut = 1 - Math.pow(1 - progress, 3);
      rotation = totalRotation * easeOut;

      ctx.clearRect(0, 0, 500, 500);
      ctx.save();
      ctx.translate(250, 250);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-250, -250);
      drawWheel();
      ctx.restore();

      requestAnimationFrame(animate);
    } else {
      showResult();
    }
  }

  animate();
}

// Mostrar resultado según la posición final de la ruleta
function showResult() {
  const finalAngle = (rotation % 360) * (Math.PI / 180); // Ángulo final en radianes
  const correctedAngle = (Math.PI * 1.5 - finalAngle + 2 * Math.PI) % (2 * Math.PI); // Ajustar para que el marcador esté en la parte superior
  const index = Math.floor((correctedAngle + segmentAngle / 2) / segmentAngle) % segmentCount; // Índice del premio correspondiente

  const prize = segments[index];
  resultDiv.textContent = `¡Te tocó: ${prize}!`;

  if (prize !== "Nos vemos la próxima") {
    launchConfetti(); // Activar confeti si el premio no es un intento fallido
  }

  spinBtn.disabled = false;
  isSpinning = false;
}

// Efecto de confeti
function launchConfetti() {
  const duration = 3 * 1000; // Duración total del confeti (3 segundos)
  const end = Date.now() + duration;

  function frame() {
    // Configuración del confeti
    const colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });

    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }

  frame();
}

spinBtn.addEventListener("click", spinWheel);

// Dibujar la ruleta al cargar la página
drawWheel();
