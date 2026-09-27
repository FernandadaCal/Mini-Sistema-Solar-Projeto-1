export function translate(tx, ty) {
  return [
    1, 0, tx,
    0, 1, ty,
    0, 0, 1
  ];
}

export function rotate(angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return [
     c, -s, 0,
     s,  c, 0,
     0,  0, 1
  ];
}

export function scale(sx, sy) {
  return [
    sx, 0,  0,
    0,  sy, 0,
    0,  0,  1
  ];
}

export function multiply(a, b) {
  const result = new Array(9).fill(0);

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      for (let k = 0; k < 3; k++) {
        result[row * 3 + col] +=
          a[row * 3 + k] * b[k * 3 + col];
      }
    }
  }

  return result;
}

export class Node {
  constructor(
    name,
    {
      translation = [0, 0],
      rotation = 0,
      nodeScale = [1, 1],
      texture = null,
      size = [1, 1],
      z = 0
    } = {}
  ) {
    this.name = name;
    this.translation = translation;
    this.rotation = rotation;
    this.nodeScale = nodeScale;
    this.texture = texture;
    this.size = size;
    this.z = z;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
  }

  localMatrix() {
    const t = translate(
      this.translation[0],
      this.translation[1]
    );

    const r = rotate(this.rotation);

    const s = scale(
      this.nodeScale[0],
      this.nodeScale[1]
    );

    return multiply(
      multiply(t, r),
      s
    );
  }

  walk(parentMatrix = null, result = []) {
    const local = this.localMatrix();

    const world = parentMatrix
      ? multiply(parentMatrix, local)
      : local;

    result.push({
      node: this,
      world
    });

    for (const child of this.children) {
      child.walk(world, result);
    }

    return result;
  }
}
