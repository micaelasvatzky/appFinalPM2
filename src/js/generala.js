const min = 1;
const max = 6;
const section = document.getElementById("contenedorGenerala");
const btnDados = document.getElementById("btnDados");

const game = {
  selectedDados: [false, false, false, false, false],
  dados: [0, 0, 0, 0, 0],
  moves: 1,
  players: 2,
  turno: 1,
};

const DICE_SIZE = 100;
const DOT_RADIUS = 0.1 * DICE_SIZE;
const AT_QUARTER = 0.25 * DICE_SIZE;
const AT_HALF = 0.5 * DICE_SIZE;
const AT_3QUARTER = 0.75 * DICE_SIZE;

const reEscalera = /12345|23456|13456/;
const reGenerala = /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/;
const rePoker =
  /1{4}[23456]|12{4}|2{4}[3456]|[12]3{4}|3{4}[456]|[123]4{4}|4{4}[56]|[1234]5{4}|5{4}6|[12345]6{4}/;
const reFull =
  /1{3}(2{2}|3{2}|4{2}|5{2}|6{2})|1{2}(2{3}|3{3}|4{3}|5{3}|6{3})|2{3}(3{2}|4{2}|5{2}|6{2})|2{2}(3{3}|4{3}|5{3}|6{3})|3{3}(4{2}|5{2}|6{2})|3{2}(4{3}|5{3}|6{3})|4{3}(5{2}|6{2})|4{2}(5{3}|6{3})|5{3}6{2}|5{2}6{3}/;

function initGame() {
  game.dados = [0, 0, 0, 0, 0];
  game.selectedDados = [false, false, false, false, false];
  game.moves = 1;
  game.turno = 1;

  document
    .querySelectorAll("#contenedorGenerala .dice")
    .forEach((dadoElement) => {
      dadoElement.addEventListener("click", () =>
        toggleDadoSelection(
          parseInt(dadoElement.getAttribute("class").replace("dice d", ""))
        )
      );
    });

  drawDados();
  drawState();
}

const isGameMatch = (regex) => {
  return game.dados.slice().sort((d1, d2) => d1 - d2).join("").match(regex) !== null;
}

function toggleDadoSelection(dadoNumber) {
  game.selectedDados[dadoNumber] = !game.selectedDados[dadoNumber];

  const dadoElement = document.querySelector(
    `#contenedorGenerala .dice.d${dadoNumber}`
  );
  if (game.selectedDados[dadoNumber]) {
    dadoElement.classList.add("selected");
  } else {
    dadoElement.classList.remove("selected");
  }

  console.log("Dados selection" + game.selectedDados);
}

function drawDados() {
  game.dados.forEach((dado, i) => {
    const dadoElement = document.querySelector(
      `#contenedorGenerala .dice.d${i}`
    );
    if (game.selectedDados[i]) {
      dadoElement.classList.add("selected");
    } else {
      dadoElement.classList.remove("selected");
    }
    drawDiceImages(dadoElement, dado);
  });
}

const drawState = () => {
  document.getElementById("generala-player").innerHTML = game.turno;
  document.getElementById("generala-jugadas").innerHTML = game.moves;
};

function tirarDados() {
  for (let i = 0; i < game.dados.length; i++) {
    if (game.moves === 1 || game.selectedDados[i]) {
      game.dados[i] = Math.floor(Math.random() * 6) + 1;
    }
  }
  game.selectedDados = [false, false, false, false, false];
  drawDados();

  game.moves++;
  if (game.moves > 3) {
    game.turn++;
    if (game.turn > game.players) {
      game.turn = 1;
    }
    game.moves = 1;
  }
  drawState();
}

/* Draw dices code begins */
const drawDot = (ctx, x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
};

const showDice = (contDiv, number) => {
  contDiv.innerHTML = null;
  let canvas = document.createElement("canvas");
  canvas.setAttribute("width", "" + DICE_SIZE);
  canvas.setAttribute("height", "" + DICE_SIZE);
  drawDice(canvas, number);
  contDiv.appendChild(canvas);
};

const drawDice = (cont, number) => {
  let ctx = cont.getContext("2d");

  // Borro
  ctx.clearRect(0, 0, DICE_SIZE, DICE_SIZE);

  // Dado
  ctx.beginPath();
  ctx.rect(0, 0, DICE_SIZE, DICE_SIZE);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();

  switch (number) {
    case 1:
      drawDot(ctx, AT_HALF, AT_HALF);
      break;
    case 2:
      drawDot(ctx, AT_3QUARTER, AT_QUARTER);
      drawDot(ctx, AT_QUARTER, AT_3QUARTER);
      break;
    case 3:
      drawDot(ctx, AT_HALF, AT_HALF);
      drawDot(ctx, AT_3QUARTER, AT_QUARTER);
      drawDot(ctx, AT_QUARTER, AT_3QUARTER);
      break;
    case 4:
      drawDot(ctx, AT_3QUARTER, AT_QUARTER);
      drawDot(ctx, AT_QUARTER, AT_3QUARTER);
      drawDot(ctx, AT_QUARTER, AT_QUARTER);
      drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
      break;
    case 5:
      drawDot(ctx, AT_HALF, AT_HALF);
      drawDot(ctx, AT_3QUARTER, AT_QUARTER);
      drawDot(ctx, AT_QUARTER, AT_3QUARTER);
      drawDot(ctx, AT_QUARTER, AT_QUARTER);
      drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
      break;
    case 6:
      drawDot(ctx, AT_3QUARTER, AT_QUARTER);
      drawDot(ctx, AT_QUARTER, AT_3QUARTER);
      drawDot(ctx, AT_QUARTER, AT_QUARTER);
      drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
      drawDot(ctx, AT_QUARTER, AT_HALF);
      drawDot(ctx, AT_3QUARTER, AT_HALF);
  }
};
/* Draw dices code ends */

/*Draw dice with images*/
const drawDiceImages = (contDiv, number) => {
  contDiv.innerHTML = null;
  let img = document.createElement("img");
  img.setAttribute("width", "" + DICE_SIZE);
  img.setAttribute("height", "" + DICE_SIZE);
  img.setAttribute("alt", `dice-${number}`);
  img.setAttribute(
    "src",
    document.getElementById(`d${number}`).getAttribute("src")
  );
  contDiv.appendChild(img);
};

btnDados.addEventListener("click", () => {
  tirarDados();
});

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});
