const min = 1;
const max = 6;
const section = document.getElementById("contenedorGenerala");
const btnDados = document.getElementById("btnDados");
let selectedDados;
let dados;

const DICE_SIZE = 100;
const DOT_RADIUS = 0.1 * DICE_SIZE;
const AT_QUARTER = 0.25 * DICE_SIZE;
const AT_HALF = 0.5 * DICE_SIZE;
const AT_3QUARTER = 0.75 * DICE_SIZE;

function initGame() {
  dados = [0, 0, 0, 0, 0];
  selectedDados = [false, false, false, false, false];
 

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
}

function toggleDadoSelection(dadoNumber) {
  selectedDados[dadoNumber] = !selectedDados[dadoNumber];

  const dadoElement = document.querySelector(
    `#contenedorGenerala .dice.d${dadoNumber}`
  );
  if (selectedDados[dadoNumber]) {
    dadoElement.classList.add("selected");
  } else {
    dadoElement.classList.remove("selected");
  }

  console.log("Dados selection" + selectedDados);
}

function drawDados() {
  dados.forEach((dado, i) => {
    const dadoElement = document.querySelector(`#contenedorGenerala .dice.d${i}`);
    if(selectedDados[i]){
      dadoElement.classList.add("selected");
    }else{
      dadoElement.classList.remove("selected");
    }
    showDice(dadoElement, dado);
  });
}

function tirarDados() {
  for (let i = 0; i < dados.length; i++) {
    if (selectedDados[i]) {
      dados[i] = Math.floor(Math.random() * 6) + 1;
    }
  }
  selectedDados = [false, false, false, false, false];
  drawDados();
}

/* Draw dices code begins */
const drawDot = (ctx, x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}

const showDice = (contDiv, number) => {
  contDiv.innerHTML = null;
  let canvas = document.createElement("canvas");
  canvas.setAttribute("width", "" + DICE_SIZE);
  canvas.setAttribute("height", "" + DICE_SIZE);
  drawDice(canvas, number);
  contDiv.appendChild(canvas);
}

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
}
/* Draw dices code ends */

btnDados.addEventListener("click", () => {
  tirarDados();
});

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});
