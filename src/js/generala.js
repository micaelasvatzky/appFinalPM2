const min = 1;
const max = 6;
const section = document.getElementById("contenedorGenerala");
const btnDados = document.getElementById("btnDados");
const btnTabla = document.getElementById("btnTabla");
const cerrarTabla = document.getElementById("cerrarTabla");
const btnVolver = document.getElementById("btn-g2-back");
const tabla = document.querySelector("#g2 .scores");
const overlay = document.querySelector(".modal-overlay-generala");

const game = {
  selectedDados: [false, false, false, false, false],
  dados: [0, 0, 0, 0, 0],
  moves: 3,
  players: 2,
  turno: 1,
  scores: [],
  round: 1,
};

const DICE_SIZE = 150;
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

const initGame = () => {
  btnVolver.removeAttribute("disabled");
  btnVolver.classList.remove("disable-button");
  game.dados = [0, 0, 0, 0, 0];
  game.selectedDados = [false, false, false, false, false];
  game.moves = 3;
  game.turno = 1;
  game.round = 1;

  for (let i = 0; i < game.players; i++) {
    game.scores.push([
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      0,
    ]);
  }

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
  drawScores();
};

const drawScores = () => {
  const contHeader = document.querySelector("#g2 .scores table thead tr");
  const contGames = document.querySelector("#g2 .scores table tbody");

  contHeader.innerHTML = "";

  const cellGame = document.createElement("th");
  cellGame.innerHTML = "Juego";
  contHeader.appendChild(cellGame);

  for (let i = 0; i < game.players; i++) {
    const cellPlayerName = document.createElement("th");
    cellPlayerName.innerHTML = `J${i + 1}`;
    if (i === game.turno - 1) {
      cellPlayerName.classList.add("playerTurn");
    } 
    contHeader.appendChild(cellPlayerName);
  }

  // Limpiar el cuerpo de la tabla antes de agregar filas
  contGames.innerHTML = "";

  // Juegos
  for (let i = 0; i < 11; i++) {
    const contGame = document.createElement("tr");
    const cellGameName = document.createElement("th");
    cellGameName.innerHTML = getGameName(i);
    contGame.appendChild(cellGameName);

    for (let p = 0; p < game.players; p++) {
      const cellPlayerScore = document.createElement("td");
      cellPlayerScore.innerHTML = game.scores[p][i];

      if (p === game.turno - 1) {
        cellPlayerScore.classList.add("playerTurn");

        if (game.scores[p][i] === " ") {
          cellPlayerScore.classList.add("resaltarFila");
        }
      }

      contGame.appendChild(cellPlayerScore);
    }
    contGames.appendChild(contGame);
    contGame.addEventListener("click", () => {
      if (game.dados.some((dado) => dado === 0)) {
        return;
      }
      if (game.scores[game.turno - 1][i] !== " ") {
        openCloseModal(`Ya se anoto el juego ${getGameName(i)}`);
        return;
      } else {
        const score = gameScore(i);

        if (
          i === 9 &&
          !isGameMatch(reGenerala) &&
          game.scores[game.turno - 1][10] !== "X"
        ) {
          openCloseModal(
            "Primero tachar la Doble antes de tachar la Generala."
          );
          return;
        }

        if (
          i === 10 &&
          isGameMatch(reGenerala) &&
          (game.scores[game.turno - 1][9] !== 50 ||
            game.scores[game.turno - 1][9] !== 55)
        ) {
          openCloseModal(
            "No podés anotar la doble sin antes haber hecho generala"
          );
          return;
        }

        if (score === 0) {
          confirmTacharPuntaje(i);
        } else {
          game.scores[game.turno - 1][i] = score;
          game.scores[game.turno - 1][11] += score;
          changePlayerTurn();
        }

        
        drawScores();
      }
    });
  }

  // Total
  const contTotal = document.createElement("tr");
  const cellTotalName = document.createElement("th");
  cellTotalName.innerHTML = "Total";
  contTotal.appendChild(cellTotalName);
  for (let p = 0; p < game.players; p++) {
    const cellPlayerTotal = document.createElement("td");
    cellPlayerTotal.innerHTML = game.scores[p][11];
    if (p === game.turno - 1) {
      cellPlayerTotal.classList.add("playerTurn");
    }
    contTotal.appendChild(cellPlayerTotal);
  }
  contGames.appendChild(contTotal);
};

const isGameMatch = (regex) => {
  return (
    game.dados
      .slice()
      .sort((d1, d2) => d1 - d2)
      .join("")
      .match(regex) !== null
  );
};

const gameScore = (whichGame) => {
  let score = 0;
  switch (whichGame) {
    case 6:
      if (isGameMatch(reEscalera)) {
        score = game.moves === 2 ? 25 : 20;
        console.log(`Escalera: ${score} puntos`);
      }
      break;

    case 7:
      if (isGameMatch(reFull)) {
        score = game.moves === 2 ? 35 : 30;
        console.log(`Full: ${score} puntos`);
      }
      break;
    case 8:
      if (isGameMatch(rePoker)) {
        score = game.moves === 2 ? 45 : 40;
        console.log(`Poker: ${score} puntos`);
      }
    case 9:
      if (isGameMatch(reGenerala)) {
        score = game.moves === 2 ? 55 : 50;
        console.log(`Generala: ${score} puntos`);
      }
      break;
    case 10:
      if (isGameMatch(reGenerala)) {
        score = game.moves === 2 ? 105 : 100;
        console.log(`Doble Generala: ${score} puntos`);
      }
      break;
    default: //1, 2, 3, 4, 5, 6
      score = game.dados
        .filter((dado) => dado === whichGame + 1)
        .reduce((acc, cur) => acc + cur, 0);
      //reduce usa dos parámetros, un valor acumulado, que empieza en 0, que se suma al valor actual

      break;
  }

  return score;
};

const toggleDadoSelection = (dadoNumber) => {
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
};

const drawDados = () => {
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
};

const drawState = () => {
  document.getElementById("generala-player").innerHTML = game.turno;
  document.getElementById("generala-jugadas").innerHTML = game.moves;
};

const tirarDados = () => {
  for (let i = 0; i < game.dados.length; i++) {
    if (game.moves === 3 || game.selectedDados[i]) {
      game.dados[i] = Math.floor(Math.random() * 6) + 1;
    }
  }
  game.selectedDados = [false, false, false, false, false];
  drawDados();

  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((whichGame) =>
    console.log(`Game ${getGameName(whichGame)} score: ${gameScore(whichGame)}`)
  );


  game.moves--;
  console.log(game.moves);

  if (game.moves < 3 && game.moves > 0) {
    btnVolver.setAttribute("disabled", "disabled");
    btnVolver.classList.add("disable-button");
  }

  if (game.moves == 0) {
    btnDados.setAttribute("disabled", "disabled");
    btnDados.classList.add("disable-button");
    
    drawState();

  } else {
    drawState();
  }

  
};

const changePlayerTurn = () => {
  game.dados = [0, 0, 0, 0, 0];
  game.selectedDados = [false, false, false, false, false];
  game.moves = 3;
  game.turno++;

  if(game.moves == 3){
    btnVolver.removeAttribute("disabled");
    btnVolver.classList.remove("disable-button");
  }

  if (game.turno > game.players) {
    game.turno = 1;
    game.round++;
    if (game.round == 12) {
      gameOver();
    }
  }
  btnDados.removeAttribute("disabled");
  btnDados.classList.remove("disable-button");
  game.dados.forEach((dado, i) => {
    const dadoElement = document.querySelector(
      `#contenedorGenerala .dice.d${i}`
    );
    drawDiceImages(dadoElement, dado);
  });
  drawState();
  drawScores();
};

const gameOver = () => {
  btnDados.setAttribute("disabled", "disabled");
  btnDados.classList.add("disable-button");
  let winner = 0;
  let winningScore = 0;
  for (let i = 0; i < game.players; i++) {
    if (game.scores[i][11] > winningScore) {
      winningScore = game.scores[i][11];
      winner = i;
    }
  }
  openModalFinal();
  game.scores = [];
  game.round = 1;
  btnVolver.removeAttribute("disabled");
  btnVolver.classList.remove("disable-button");
  initGame();
};

const getGameName = (whichGame) => {
  const games = ["1", "2", "3", "4", "5", "6", "E", "F", "P", "G", "D"];
  return games[whichGame];
};

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

const confirmTacharPuntaje = (i) => {
  const modal = document.getElementById("modalConfirmacion");
  const confirmarBtn = document.getElementById("confirmarTachar");
  const cancelarBtn = document.getElementById("cancelarTachar");
  const nombreJuego = getGameName(i);
  document.getElementById(
    "mensajeModal"
  ).innerHTML = `¿Estás seguro de que deseas tachar el puntaje de ${nombreJuego}?`;
  modal.style.display = "flex";

  const confirmar = () => {
    game.scores[game.turno - 1][i] = "X";
    drawScores();
    changePlayerTurn();
    cerrarModal();
  };

  const cerrarModal = () => {
    modal.style.display = "none";
    confirmarBtn.removeEventListener("click", confirmar);
    cancelarBtn.removeEventListener("click", cerrarModal);
  };

  confirmarBtn.addEventListener("click", confirmar);
  cancelarBtn.addEventListener("click", cerrarModal);
};

const openModalFinal = (jugador) => {
  modalContentFinal.innerHTML = `¡Jugador ${jugador} ganó!`;
  modalFinal.style.display = "flex";
  overlay.style.display = "block";
};

const openCloseModal = (messageModal) => {
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("closeModal");
  document.getElementById("modalMessage").innerHTML = messageModal;
  console.log(messageModal);
  modal.style.display = "flex";

  const cerrarModal = () => {
    modal.style.display = "none";
    closeBtn.removeEventListener("click", cerrarModal);
  };

  closeBtn.addEventListener("click", cerrarModal);
};

btnTabla.addEventListener("click", () => {
  tabla.style.display = "flex";
  btnDados.setAttribute("disabled", "disabled");
  btnDados.classList.add("disable-button");
  overlay.style.display = "block";
});

cerrarTabla.addEventListener("click", () => {
  tabla.style.display = "none";
  btnDados.removeAttribute("disabled");
  btnDados.classList.remove("disable-button");
  overlay.style.display = "none";
});

btnDados.addEventListener("click", () => {
  tirarDados();
});

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});
