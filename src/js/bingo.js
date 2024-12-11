const sectionCont = document.getElementById("bingoContainer");
const btnTirar = document.getElementById("tirar");
const btnNum = document.getElementById("numerosUsados");
const bolillero = document.getElementById("bolillero");
const leftCont = document.getElementById("leftContainer");
const rightCont = document.getElementById("rightContainer");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

const max = 89;

const arrayNumbers = Array.from({ length: max }, (_, i) => i + 1);
const numerosUsados = [];
//Length del array:max, 2do argumento: funcion map: valor actual (_ para ignorar) e i (indice actual), i + 1 (para que empiece de 1 y no de 0)

const initGame = () => {
  drawCartones();
}

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
    divCarton.id = `carton-${i + 1}`;

    const jugador = document.createElement("h3");
    jugador.innerHTML = `Jugador ${i + 1}`;
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

    numerosCarton.forEach((numero) => {
      const celda = document.createElement("div");
      celda.classList.add("celda");
      celda.innerHTML = numero;
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

const tirarNumero = () =>{
  const numeroTirado = getUniqueNumber(numerosUsados);  
  console.log("numeros usados", numerosUsados);

  bolillero.innerHTML = numeroTirado; 
  resaltarNumero(numeroTirado);
  modalNumeros(numeroTirado);
}

const resaltarNumero = (num) =>{
  const allCeldas = document.querySelectorAll(".celda");
  allCeldas.forEach((celda) => {
    if (parseInt(celda.innerHTML) === num) {
      celda.classList.add("highlight");
    }else{
      celda.classList.remove("highlight");
    }
  });
} 

const modalNumeros = () => {
  const tablaModal = document.createElement("div");
  tablaModal.classList.add("tabla-modal");


  for(let i = 0; i < max; i++){
    const celdaModal = document.createElement("div");
    celdaModal.innerHTML = i;
    celdaModal.id = `numero-${i}`;
    tablaModal.appendChild(celdaModal);
  }
  modalContent.appendChild(tablaModal);
}

const resaltarNumeroEnModal = (num) => {
  const celdaModal = document.getElementById(`numero-${num}`);
  if (celdaModal) {
    celdaModal.classList.add("highlight-modal");
  }
};

const abrirModal = () => {
  modal.style.display = "flex";
};


const cerrarModal = () => {
  modal.style.display = "none";
};

document.getElementById("closeModal").addEventListener("click", cerrarModal);

btnNum.addEventListener("click", () => {
  abrirModal();
});


btnTirar.addEventListener("click", () => {
  tirarNumero();
});

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});

