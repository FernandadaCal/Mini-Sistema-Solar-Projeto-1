function createCanvas(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

function circleGradient(ctx, size, inner, outer) {
  const c = size / 2;

  const gradient = ctx.createRadialGradient(
    c, c, 0,
    c, c, size / 2
  );

  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(c, c, size / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
}

export function makeSun(size = 180) {
  const canvas = createCanvas(size);
  const ctx = canvas.getContext("2d");

  circleGradient(ctx, size, "#fff0a0", "#ff8a00");

  const spots = [
    [0.35, 0.35, 0.05],
    [0.62, 0.42, 0.035],
    [0.47, 0.63, 0.04],
    [0.68, 0.68, 0.03],
    [0.29, 0.58, 0.025]
  ];

  ctx.fillStyle = "rgba(190, 100, 20, 0.65)";

  for (const [x, y, r] of spots) {
    ctx.beginPath();
    ctx.arc(x * size, y * size, r * size, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

export function makeEarth(size = 100) {
  const canvas = createCanvas(size);
  const ctx = canvas.getContext("2d");
  const c = size / 2;

  circleGradient(ctx, size, "#3b8bea", "#164ba6");

  ctx.fillStyle = "#4aa34f";

  ctx.beginPath();
  ctx.moveTo(18, 28);
  ctx.lineTo(29, 18);
  ctx.lineTo(43, 22);
  ctx.lineTo(48, 31);
  ctx.lineTo(42, 42);
  ctx.lineTo(30, 44);
  ctx.lineTo(22, 36);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(54, 47);
  ctx.lineTo(66, 40);
  ctx.lineTo(79, 44);
  ctx.lineTo(84, 54);
  ctx.lineTo(76, 66);
  ctx.lineTo(64, 73);
  ctx.lineTo(55, 64);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#5aaa55";
  ctx.beginPath();
  ctx.ellipse(35, 64, 8, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(34, 30, 20, 0.2, 2.5);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(63, 62, 20, 3.5, 5.8);
  ctx.stroke();

  // Marcador para deixar a rotacao da Terra visivel
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(c, c);
  ctx.lineTo(c, 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(c, 6);
  ctx.lineTo(c - 5, 14);
  ctx.lineTo(c + 5, 14);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

function makeRocky(size, color, craters) {
  const canvas = createCanvas(size);
  const ctx = canvas.getContext("2d");

  circleGradient(ctx, size, color.light, color.dark);

  for (const [x, y, r] of craters) {
    ctx.fillStyle = color.crater;
    ctx.beginPath();
    ctx.arc(x * size, y * size, r * size, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

export function makeMercury(size = 70) {
  return makeRocky(
    size,
    {
      light: "#b79673",
      dark: "#7d624c",
      crater: "rgba(90, 70, 55, 0.7)"
    },
    [
      [0.32, 0.30, 0.08],
      [0.65, 0.40, 0.07],
      [0.45, 0.65, 0.06],
      [0.70, 0.70, 0.04]
    ]
  );
}

export function makeMoon(size = 60) {
  return makeRocky(
    size,
    {
      light: "#ddddda",
      dark: "#9a9a98",
      crater: "rgba(110, 110, 110, 0.65)"
    },
    [
      [0.30, 0.35, 0.08],
      [0.66, 0.32, 0.05],
      [0.55, 0.67, 0.07],
      [0.28, 0.70, 0.04]
    ]
  );
}

export function makeBackground(width = 900, height = 650) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#070a1c";
  ctx.fillRect(0, 0, width, height);

  // Seed simples para as estrelas ficarem sempre iguais
  let seed = 10;

  function random() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  for (let i = 0; i < 140; i++) {
    const x = random() * width;
    const y = random() * height;
    const brightness = 150 + Math.floor(random() * 105);
    const radius = random() > 0.9 ? 1.5 : 0.7;

    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

export function loadTextures(width, height) {
  return {
    background: makeBackground(width, height),
    sun: makeSun(180),
    mercury: makeMercury(70),
    earth: makeEarth(100),
    moon: makeMoon(60)
  };
}
