# Projeto 1 - INF1761

# Fernanda da Cal e Fernanda Auler

Mini-sistema solar 2D feito em JavaScript usando WebGPU.

## Como rodar

O projeto precisa ser aberto por um servidor local porque os arquivos JavaScript usam módulos.

Uma opção simples é usar a extensão Live Server do VS Code:

1. Abra a pasta do projeto no VS Code.
2. Abra o arquivo `index.html`.
3. Clique com o botão direito.
4. Escolha `Open with Live Server`.

Também pode ser usado qualquer outro servidor local.

O navegador precisa ter suporte a WebGPU. Chrome e Edge atualizados normalmente funcionam.

## Arquivos

- `index.html`: página da aplicação.
- `main.js`: inicialização do WebGPU e loop da animação.
- `sceneGraph.js`: nós e matrizes do grafo de cena.
- `scene.js`: organização dos astros e movimentos.
- `textures.js`: criação das texturas.
- `renderer.js`: renderização com WebGPU.
- `shader.wgsl`: vertex shader e fragment shader.
