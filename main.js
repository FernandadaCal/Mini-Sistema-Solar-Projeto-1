import {
  WIDTH,
  HEIGHT,
  buildScene,
  updateScene
} from "./scene.js";

import { Renderer } from "./renderer.js";

async function loadShader() {
  const response = await fetch("./shader.wgsl");
  return await response.text();
}

async function main() {
  const errorDiv = document.getElementById("erro");

  if (!navigator.gpu) {
    errorDiv.textContent =
      "WebGPU não está disponível neste navegador.";
    return;
  }

  const canvas = document.getElementById("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) {
    errorDiv.textContent =
      "Não foi possível encontrar um adaptador WebGPU.";
    return;
  }

  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  const format = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format,
    alphaMode: "opaque"
  });

  const { root, nodes } = buildScene();
  const shaderCode = await loadShader();

  const renderer = new Renderer(
    canvas,
    device,
    context,
    format,
    root,
    shaderCode
  );

  await renderer.prepare();

  const start = performance.now();

  function frame(now) {
    const time = (now - start) / 1000;

    updateScene(nodes, time);
    renderer.render();

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main();
