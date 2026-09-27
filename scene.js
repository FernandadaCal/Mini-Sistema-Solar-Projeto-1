import { Node } from "./sceneGraph.js";
import { loadTextures } from "./textures.js";


export const WIDTH = 900;
export const HEIGHT = 650;

const SUN_SIZE = 120;

const MERCURY_SIZE = 32;
const MERCURY_ORBIT = 150;

const EARTH_SIZE = 58;
const EARTH_ORBIT = 260;

const MOON_SIZE = 24;
const MOON_ORBIT = 55;


const MERCURY_PERIOD = 3.0;
const EARTH_PERIOD = 8.0;
const EARTH_ROTATION_PERIOD = 1.8;
const MOON_PERIOD = 2.2;


export function buildScene() {
  const textures = loadTextures(
    WIDTH,
    HEIGHT
  );

  const root = new Node("root");


  // Fundo
  const background = new Node(
    "background",
    {
      texture: textures.background,
      size: [WIDTH, HEIGHT],
      z: -10
    }
  );

  root.addChild(background);


  // Sol
  const sun = new Node(
    "sun",
    {
      texture: textures.sun,
      size: [SUN_SIZE, SUN_SIZE],
      z: 0
    }
  );

  root.addChild(sun);


  // Mercurio
  const mercuryOrbit =
    new Node("mercury_orbit");

  root.addChild(
    mercuryOrbit
  );

  const mercury = new Node(
    "mercury",
    {
      translation: [
        MERCURY_ORBIT,
        0
      ],

      texture: textures.mercury,

      size: [
        MERCURY_SIZE,
        MERCURY_SIZE
      ],

      z: 1
    }
  );

  mercuryOrbit.addChild(
    mercury
  );


  // Terra
  const earthOrbit =
    new Node("earth_orbit");

  root.addChild(
    earthOrbit
  );

  const earthPos = new Node(
    "earth_pos",
    {
      translation: [
        EARTH_ORBIT,
        0
      ]
    }
  );

  earthOrbit.addChild(
    earthPos
  );


  // Rotacao propria da Terra
  const earthSpin = new Node(
    "earth_spin",
    {
      texture: textures.earth,

      size: [
        EARTH_SIZE,
        EARTH_SIZE
      ],

      z: 2
    }
  );

  earthPos.addChild(
    earthSpin
  );


  // Lua
  // Fica ligada a posicao da Terra,
  // mas nao ao no earth_spin
  const moonOrbit =
    new Node("moon_orbit");

  earthPos.addChild(
    moonOrbit
  );

  const moon = new Node(
    "moon",
    {
      translation: [
        MOON_ORBIT,
        0
      ],

      texture: textures.moon,

      size: [
        MOON_SIZE,
        MOON_SIZE
      ],

      z: 3
    }
  );

  moonOrbit.addChild(
    moon
  );


  return {
    root,

    nodes: {
      mercuryOrbit,
      mercury,

      earthOrbit,
      earthSpin,

      moonOrbit,
      moon
    }
  };
}


export function updateScene(
  nodes,
  time
) {
  const mercuryAngle =
    2 * Math.PI * time
    / MERCURY_PERIOD;

  const earthAngle =
    2 * Math.PI * time
    / EARTH_PERIOD;

  const earthSpinAngle =
    2 * Math.PI * time
    / EARTH_ROTATION_PERIOD;

  const moonAngle =
    2 * Math.PI * time
    / MOON_PERIOD;


  // Mercurio gira ao redor do Sol
  nodes.mercuryOrbit.rotation =
    mercuryAngle;

  // Evita que a textura de Mercurio
  // gire junto com a orbita
  nodes.mercury.rotation =
    -mercuryAngle;


  // Terra gira ao redor do Sol
  nodes.earthOrbit.rotation =
    earthAngle;

  // Rotacao propria da Terra.
  // Subtrai earthAngle porque essa
  // rotacao ja foi herdada da orbita.
  nodes.earthSpin.rotation =
    earthSpinAngle - earthAngle;


  // A Lua deve girar ao redor da Terra.
  // Tiramos earthAngle para a orbita dela
  // nao ganhar a rotacao da orbita terrestre.
  nodes.moonOrbit.rotation =
    moonAngle - earthAngle;

  // Mantem a textura da Lua sem
  // rotacao propria.
  nodes.moon.rotation =
    -moonAngle;
}