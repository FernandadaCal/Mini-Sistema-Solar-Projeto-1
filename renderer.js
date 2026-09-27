import { multiply, scale } from "./sceneGraph.js";

function toMat4(m) {
  return new Float32Array([
    m[0], m[3], 0, 0,
    m[1], m[4], 0, 0,
    0,    0,    1, 0,
    m[2], m[5], 0, 1
  ]);
}

function makeProjection(width, height) {
  return [
    2 / width, 0, 0,
    0, -2 / height, 0,
    0, 0, 1
  ];
}

export class Renderer {
  constructor(canvas, device, context, format, root, shaderCode) {
    this.canvas = canvas;
    this.device = device;
    this.context = context;
    this.root = root;
    this.objects = new Map();

    const shader = device.createShaderModule({
      code: shaderCode
    });

    this.pipeline = device.createRenderPipeline({
      layout: "auto",

      vertex: {
        module: shader,
        entryPoint: "vertexMain"
      },

      fragment: {
        module: shader,
        entryPoint: "fragmentMain",

        targets: [
          {
            format,

            blend: {
              color: {
                srcFactor: "src-alpha",
                dstFactor: "one-minus-src-alpha",
                operation: "add"
              },

              alpha: {
                srcFactor: "one",
                dstFactor: "one-minus-src-alpha",
                operation: "add"
              }
            }
          }
        ]
      },

      primitive: {
        topology: "triangle-list"
      }
    });

    this.sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear"
    });
  }

  async prepare() {
    const items = this.root
      .walk()
      .filter(item => item.node.texture);

    const layout = this.pipeline.getBindGroupLayout(0);

    for (const item of items) {
      const node = item.node;

      const buffer = this.device.createBuffer({
        size: 64,

        usage:
          GPUBufferUsage.UNIFORM |
          GPUBufferUsage.COPY_DST
      });

      const image = await createImageBitmap(node.texture);

      const texture = this.device.createTexture({
        size: [image.width, image.height, 1],
        format: "rgba8unorm",

        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT
      });

      this.device.queue.copyExternalImageToTexture(
        { source: image },
        { texture },
        [image.width, image.height]
      );

      const bindGroup = this.device.createBindGroup({
        layout,

        entries: [
          {
            binding: 0,
            resource: {
              buffer
            }
          },

          {
            binding: 1,
            resource: this.sampler
          },

          {
            binding: 2,
            resource: texture.createView()
          }
        ]
      });

      this.objects.set(node, {
        buffer,
        bindGroup
      });
    }
  }

  getMatrix(world, size) {
    const model = multiply(
      world,
      scale(size[0], size[1])
    );

    const projection = makeProjection(
      this.canvas.width,
      this.canvas.height
    );

    return toMat4(
      multiply(projection, model)
    );
  }

  render() {
    const items = this.root
      .walk()
      .filter(item => item.node.texture)
      .sort((a, b) => a.node.z - b.node.z);

    for (const item of items) {
      const obj = this.objects.get(item.node);

      const matrix = this.getMatrix(
        item.world,
        item.node.size
      );

      this.device.queue.writeBuffer(
        obj.buffer,
        0,
        matrix
      );
    }

    const encoder = this.device.createCommandEncoder();

    const view = this.context
      .getCurrentTexture()
      .createView();

    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view,
          clearValue: {
            r: 0,
            g: 0,
            b: 0,
            a: 1
          },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    });

    pass.setPipeline(this.pipeline);

    for (const item of items) {
      const obj = this.objects.get(item.node);

      pass.setBindGroup(
        0,
        obj.bindGroup
      );

      pass.draw(6);
    }

    pass.end();

    this.device.queue.submit([
      encoder.finish()
    ]);
  }
}