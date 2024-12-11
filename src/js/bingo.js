const sectionCont = document.getElementById("bingoContainer");
const btnTirar = document.getElementById("tirar");
const btnNum = document.getElementById("numerosUsados");
const bolillero = document.getElementById("bolillero");
const leftCont = document.getElementById("leftContainer");
const rightCont = document.getElementById("rightContainer");
const modal = document.querySelector("#g3 #modal");
const modalContent = document.getElementById("tabla-modal");
const btnCloseModal = document.querySelector("#g3 #closeModal");
let ultimoNumeroTirado = 0;

const max = 90;

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
  ultimoNumeroTirado = numeroTirado;
  console.log("numeros usados", numerosUsados);

  bolillero.innerHTML = numeroTirado; 
  resaltarNumero(numeroTirado);
  modalNumeros(numeroTirado);
  modal.style.display = "none";
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

const modalNumeros = (num) => {
  modalContent.innerHTML = "";

  const tablaModal = document.getElementById("tabla-modal");
  tablaModal.classList.add("tabla-modal");


  for(let i = 0; i < max; i++){
    const celdaModal = document.createElement("div");
    celdaModal.innerHTML = i +1;
    celdaModal.id = `numero-${i+1}`;
    tablaModal.appendChild(celdaModal);
  }
  resaltarNumeroEnModal(num); // Resalta el número en el modal
  modal.style.display = "block";
}

const resaltarNumeroEnModal = (num) => {
  numerosUsados.forEach((num) => {
    const celdaModal = document.getElementById(`numero-${num}`);
    if (celdaModal) {
      celdaModal.classList.add("highlight-modal");
    }
  });
};


const cerrarModal = () => {
  modal.style.display = "none";
};

btnCloseModal.addEventListener("click", cerrarModal);

btnNum.addEventListener("click", () => {
 modalNumeros(ultimoNumeroTirado);
});


btnTirar.addEventListener("click", () => {
  tirarNumero();
});

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});

