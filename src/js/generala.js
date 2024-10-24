const min = 1;
const max = 6;
const section = document.getElementById("contenedorGenerala");
const btnDados = document.getElementById("btnDados");
let selectedDados;
let dados;

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
    dadoElement.innerHTML = dado;
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


btnDados.addEventListener("click", () => {
  tirarDados();
});

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});
