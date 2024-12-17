const sectionCont = document.getElementById("bingoContainer");
const btnTirar = document.getElementById("tirar");
const btnNum = document.getElementById("numerosUsados");
const bolillero = document.getElementById("bolillero");
const leftCont = document.getElementById("leftContainer");
const rightCont = document.getElementById("rightContainer");
const modal = document.querySelector("#g3 #modal");
const modalTabla = document.getElementById("tabla-modal");
const btnCloseModal = document.querySelector("#g3 #closeModal");
const modalContent = document.querySelector("#g3 #modal-content");
const modalFinal = document.getElementById("modalFinal");
const modalNo = document.getElementById("modalNoSalio");
const modalContentNo = document.getElementById("modal-content-no");
const modalContentFinal = document.getElementById("modal-content-final");
const btnReset = document.getElementById("reset");
const btnMenu = document.getElementById("volverMenu");
const btnModalNo = document.getElementById("closeModalNo");
const overlay = document.querySelector(".modal-overlay");
let puntosJugador1 = 0;
let puntosJugador2 = 0;


let ultimoNumeroTirado = 0;
let jugador1Array = ["", "", "", "", "", "", "", "", "", "", "", "", "", "",""];
let jugador2Array = ["", "", "", "", "", "", "", "", "", "", "", "", "", "",""];
let juegoTerminado = false;
let turnoJugador = 0;

const max = 90;

const arrayNumbers = Array.from({ length: max }, (_, i) => i + 1);
const numerosUsados = [];
//Length del array:max, 2do argumento: funcion map: valor actual (_ para ignorar) e i (indice actual), i + 1 (para que empiece de 1 y no de 0)

const initGame = () => {
  drawCartones();
  puntosJugador1 = 0;
  puntosJugador2 = 0;
  actualizarPuntos();
};

const getRandomNumbers = () => {
  return Math.floor(Math.random() * (arrayNumbers.length - 1)) + 1;
};

const getUniqueNumber = (numUsados) => {
  let num;
  do {
    num = getRandomNumbers();
  } while (numUsados.includes(num));
  numUsados.push(num);
  return num;
};

const drawCartones = () => {
  leftCont.innerHTML = "";
  rightCont.innerHTML = "";

  for (let i = 0; i < 2; i++) {
    const divCarton = document.createElement("div");
    divCarton.classList.add("carton");
    turnoJugador = i + 1;
    divCarton.id = `carton-${turnoJugador}`;

    const jugador = document.createElement("h3");
    jugador.innerHTML = `Jugador ${turnoJugador}`;
    divCarton.appendChild(jugador);

    const celdaCont = document.createElement("div");
    celdaCont.classList.add("celda-contenedor");

    const usedNumbers = [];
    const numerosCarton = [];
    console.log(usedNumbers);

    for (let n = 0; n < 15; n++) {
      numerosCarton.push(getUniqueNumber(usedNumbers));
    }

    numerosCarton.sort((a, b) => a - b);

    numerosCarton.forEach((numero, index) => {
      const celda = document.createElement("div");
      celda.classList.add("celda", `jugador-${i + 1}`);
      celda.id = index;
      celda.innerHTML = numero;
      celda.addEventListener("click", () => seleccionarNumero(celda, numero));
      celdaCont.appendChild(celda);
    });

    divCarton.appendChild(celdaCont);

    if (i === 0) {
      leftCont.appendChild(divCarton);
    } else {
      rightCont.appendChild(divCarton);
    }
  }
};

const tirarNumero = () => {
  const numeroTirado = getUniqueNumber(numerosUsados);
  ultimoNumeroTirado = numeroTirado;
  console.log("numeros usados", numerosUsados);

  bolillero.innerHTML = `<p>${numeroTirado}</p>`;
  resaltarNumero(numeroTirado);
  modalNumeros(numeroTirado);
  modal.style.display = "none";
  overlay.style.display = "none";
};

const resaltarNumero = (num) => {
  const allCeldas = document.querySelectorAll(".celda");
  allCeldas.forEach((celda) => {
    if (parseInt(celda.innerHTML) === num) {
      celda.classList.add("highlight");
    } else {
      celda.classList.remove("highlight");
    }
  });
};

const seleccionarNumero = (celda, num) => {
  const index = parseInt(celda.id);

  if (numerosUsados.includes(num)) {
    celda.classList.add("selected");
    celda.classList.remove("highlight");
    verificarBingo(celda, num, index);
    verificarLinea(1);
    verificarLinea(2);
  } else {
    modalNoSalio();
  }
};

const actualizarPuntos = () => {
  document.getElementById("puntosJugador1").innerText = puntosJugador1;
  document.getElementById("puntosJugador2").innerText = puntosJugador2;
};

const verificarBingo = (celda, num, index) =>{
  if (celda.classList.contains("jugador-1")) {
    jugador1Array[index] = num;
    console.log("jugador1", jugador1Array);

    if (jugador1Array.every((num) => num !== "")) {
      puntosJugador1 += 20;
      actualizarPuntos();
      modalFinalizarJuego(1);
      
    }
  } else if (celda.classList.contains("jugador-2")) {
    jugador2Array[index] = num;
    console.log("jugador2", jugador2Array);

    if (jugador2Array.every((num) => num !== "")) {
      puntosJugador2 += 20;
      actualizarPuntos();
      modalFinalizarJuego(2);
      
    }
  }
};

const verificarLinea = (jugador) => {
  const filas = [
    [0, 1, 2, 3, 4],    
    [5, 6, 7, 8, 9],    
    [10, 11, 12, 13, 14] 
  ];

  
  const celdasJugador = Array.from(document.querySelectorAll(`.celda.jugador-${jugador}`));
  console.log("jugador", jugador);
  
  filas.forEach((fila) => {
   
    if (fila.every((index) => celdasJugador[index].classList.contains("selected"))) {
     
      fila.forEach((index) => {
        celdasJugador[index].classList.remove("selected"); 
        celdasJugador[index].classList.add("highlight-linea"); 
        console.log(`Línea completada por el jugador ${jugador}`);
      });

    
      if (jugador === 1) {
        puntosJugador1 += 5; 
        console.log("linea de", jugador);
      } else {
        puntosJugador2 += 5; 
        console.log("linea de", jugador);
      }
      actualizarPuntos();
    }
  });
};


const modalFinalizarJuego = (jugador) => {
  juegoTerminado = true;
  modalContentFinal.innerHTML = `¡Jugador ${jugador} ganó ${jugador === 1 ? puntosJugador1 : puntosJugador2} puntos!`;
  modalFinal.style.display = "flex";
  overlay.style.display = "block";
};

const modalNumeros = (num) => {
  
  modalTabla.innerHTML = "";

  for (let i = 0; i < max; i++) {
    const celdaModal = document.createElement("div");
    celdaModal.innerHTML = i + 1;
    celdaModal.id = `numero-${i + 1}`;
    modalTabla.appendChild(celdaModal);
  }
  resaltarNumeroEnModal(num); 
  modal.style.display = "flex";
  overlay.style.display = "block";

};

const resaltarNumeroEnModal = (num) => {
  numerosUsados.forEach((num) => {
    const celdaModal = document.getElementById(`numero-${num}`);
    if (celdaModal) {
      celdaModal.classList.add("highlight-modal");
    }
  });
};

const modalNoSalio = () => {
  modalContentNo.innerHTML = "Este número no salió";
  modalNo.style.display = "flex";
  overlay.style.display = "block";
};

const cerrarModal = (modal) => {
  modal.style.display = "none";
  btnTirar.removeAttribute("disabled");
  btnTirar.classList.remove("disable-button");
  overlay.style.display = "none";
};

btnCloseModal.addEventListener("click", () => cerrarModal(modal));
btnModalNo.addEventListener("click", () => cerrarModal(modalNo));


btnReset.addEventListener("click", () => {
  cerrarModal(modalFinal);
  initGame();
});

btnNum.addEventListener("click", () => {
  modalNumeros(ultimoNumeroTirado);
  btnTirar.setAttribute("disabled", "disabled");
  btnTirar.classList.add("disable-button");
});

btnTirar.addEventListener("click", () => {
  tirarNumero();
});

btnMenu.addEventListener("click", () => {
  document.getElementById("main").classList.remove("nodisp");
  document.getElementById("g3").classList.add("nodisp");
  modalFinal.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});

