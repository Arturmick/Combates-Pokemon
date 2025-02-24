let peticion;
let datos;
let descripcion;
let correcto = false;
let num = 1;
let statsJugador = [];
let statsMachine = [];
let numerosAleatorios = [];
let vidaMaximaPlayer = [];
let vidaMaximaMachine = [];
let pokemonActualPlayer = 0;
let pokemonActualMachine = 0;
let ataquePlayer = 0;
let ataqueMachine = 0;
let defensaPlayer = 0;
let defensaMachine = 0;
let porcentajeMachine = 0;
let porcentajePlayer = 0;
let peleaParada = true; 
let turnoEnemigo = true;
let primerPokemonEnemigo = true;
//let backgroundMusic; // Variable para almacenar la referencia al objeto de audio de la música de fondo
let eventosPokeballsAgregados = false; // Flag to check if event listeners are already added
let audio = new Audio();
let backgroundMusic = new Audio();
let equipoIndex = 0;
let intentos = 8;
let pokemons = [];

const tablaDeTipos = {
    fire: { strongAgainst: ['grass', 'bug', 'ice', 'steel'], weakAgainst: ['water', 'rock', 'fire', 'dragon'] },
    water: { strongAgainst: ['fire', 'ground', 'rock'], weakAgainst: ['water', 'grass', 'dragon'] },
    grass: { strongAgainst: ['water', 'ground', 'rock'], weakAgainst: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'] },
    electric: { strongAgainst: ['water', 'flying'], weakAgainst: ['electric', 'ground', 'grass', 'dragon'] },
    ice: { strongAgainst: ['grass', 'ground', 'flying', 'dragon'], weakAgainst: ['fire', 'water', 'ice', 'steel'] },
    fighting: { strongAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'], weakAgainst: ['poison', 'flying', 'psychic', 'bug', 'fairy'] },
    poison: { strongAgainst: ['grass', 'fairy'], weakAgainst: ['poison', 'ground', 'rock', 'ghost'] },
    ground: { strongAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'], weakAgainst: ['grass', 'ice', 'water'] },
    flying: { strongAgainst: ['grass', 'fighting', 'bug'], weakAgainst: ['electric', 'rock', 'steel'] },
    psychic: { strongAgainst: ['fighting', 'poison'], weakAgainst: ['psychic', 'steel'] },
    bug: { strongAgainst: ['grass', 'psychic', 'dark'], weakAgainst: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'] },
    rock: { strongAgainst: ['fire', 'ice', 'flying', 'bug'], weakAgainst: ['water', 'grass', 'fighting', 'ground', 'steel'] },
    ghost: { strongAgainst: ['psychic', 'ghost'], weakAgainst: ['dark'] },
    dragon: { strongAgainst: ['dragon'], weakAgainst: ['steel', 'fairy'] },
    dark: { strongAgainst: ['psychic', 'ghost'], weakAgainst: ['fighting', 'dark', 'fairy'] },
    steel: { strongAgainst: ['ice', 'rock', 'fairy'], weakAgainst: ['fire', 'water', 'electric', 'steel'] },
    fairy: { strongAgainst: ['fighting', 'dragon', 'dark'], weakAgainst: ['poison', 'steel', 'fire'] },
    normal: { strongAgainst: [], weakAgainst: ['fighting'] }
};

document.addEventListener('DOMContentLoaded', async () => {  
    await numeroAleatorio();
    /*
    statsJugador[0] = await buscarApi(numerosAleatorios[0]);
    statsJugador[1] = await buscarApi(numerosAleatorios[1]);
    statsJugador[2] = await buscarApi(numerosAleatorios[2]);
    statsJugador[3] = await buscarApi(numerosAleatorios[3]);
    statsJugador[4] = await buscarApi(numerosAleatorios[4]);
    

    */

    statsMachine[0] = await buscarApi(numerosAleatorios[5]);
    statsMachine[1] = await buscarApi(numerosAleatorios[6]);
    statsMachine[2] = await buscarApi(numerosAleatorios[7]);
    statsMachine[3] = await buscarApi(numerosAleatorios[8]);
    statsMachine[4] = await buscarApi(numerosAleatorios[9]);
    vidaMaximaMachine[0] = statsMachine[0][4];
    vidaMaximaMachine[1] = statsMachine[1][4];
    vidaMaximaMachine[2] = statsMachine[2][4];
    vidaMaximaMachine[3] = statsMachine[3][4];
    vidaMaximaMachine[4] = statsMachine[4][4];
    
    console.table(statsMachine);
    console.table(statsJugador);

    quitarPonerProtector();
    await guardarPokemons();
    await mostrarPokemons();
    mostrarPokemoncentro();
    cargarEventosRuleta();
    activarDesactivarBotones("selector","desactivar"); // Desactiva el botón seleccionar al principio

    await pulsarBotonParaEmpezar();
    quitarPonerProtector();
    quitarRuleta();

    vidaMaximaPlayer[0] = statsJugador[0][4];
    vidaMaximaPlayer[1] = statsJugador[1][4];
    vidaMaximaPlayer[2] = statsJugador[2][4];
    vidaMaximaPlayer[3] = statsJugador[3][4];
    vidaMaximaPlayer[4] = statsJugador[4][4];

    musica("start");
    dibujarPokemon();
    mostrarMensaje("¡El entrenador Gary te desafía!");
    await esperarEntreAnimaciones(3000);
    mostrarMensaje("¡Prepárate para la batalla!");
    await esperarEntreAnimaciones(3000);

    cambiarPokemonEnemigo();
});
function musica(tipo) {
    let sonido = "./audio/10. Battle! (Trainer Battle).mp3";
    if (tipo === "start") {
        backgroundMusic.src = sonido; // Establecer la ruta del archivo de audio de la música de fondo
        backgroundMusic.loop = true; // Reproduce en bucle
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();
    } else if (tipo === "stop" && backgroundMusic) {
        backgroundMusic.pause();        
    }
}
async function pulsarBotonParaEmpezar() {
    // Create and insert the start button container
    const startButtonContainer = document.createElement('div');
    startButtonContainer.id = 'startButtonContainer';
    startButtonContainer.innerHTML = '<button id="startButton">Start Game</button>';
    document.body.appendChild(startButtonContainer);
    
    const startButton = document.getElementById('startButton');    

    return new Promise(resolve => {
        startButton.addEventListener('click', () => {
            startButtonContainer.style.display = 'none';
            resolve();
        });
    });
}
async function mostrarMensaje(mensaje) {
    anuncios.innerHTML = mensaje;    
}
function agregarEventosPokeballs() {
    if (eventosPokeballsAgregados) return; // Prevent adding event listeners multiple times

    document.getElementById("pokeball1").addEventListener("click", () => {        
        if(!document.getElementById("pokeball1").classList.contains("muerto") && peleaParada) {
            pokemonActualPlayer = 0;
            cambiarPokemon();
        }    
    });
    document.getElementById("pokeball2").addEventListener("click", () => {
        if(!document.getElementById("pokeball2").classList.contains("muerto") && peleaParada) {
            pokemonActualPlayer = 1;
            cambiarPokemon();
        }
    });
    document.getElementById("pokeball3").addEventListener("click", () => {
        if(!document.getElementById("pokeball3").classList.contains("muerto") && peleaParada) {
            pokemonActualPlayer = 2;
            cambiarPokemon(); 
        }  
    });
    document.getElementById("pokeball4").addEventListener("click", () => {
        if(!document.getElementById("pokeball4").classList.contains("muerto") && peleaParada) {
            pokemonActualPlayer = 3;
            cambiarPokemon();  
        }   
    });
    document.getElementById("pokeball5").addEventListener("click", () => {
        if(!document.getElementById("pokeball5").classList.contains("muerto") && peleaParada) {
            pokemonActualPlayer = 4;
            cambiarPokemon(); 
        }       
    });

    eventosPokeballsAgregados = true; // Set the flag to true after adding event listeners
}
async function decidirAtaquesDefensas() {

    ataquePlayer = ataqueMasAlto(statsJugador[pokemonActualPlayer]);
    ataqueMachine = ataqueMasAlto(statsMachine[pokemonActualMachine]);

    defensaPlayer = elegirDefensa(ataqueMachine, statsMachine[pokemonActualMachine],statsJugador[pokemonActualPlayer]);
    defensaMachine = elegirDefensa(ataquePlayer, statsJugador[pokemonActualPlayer], statsMachine[pokemonActualMachine]);

}


async function pelear() {    
    peleaParada = false; // Resetear la variable al iniciar la pelea
    let decidirVelocidad = true;
  
    while (statsJugador[pokemonActualPlayer][4] > 0 && statsMachine[pokemonActualMachine][4] > 0 && !peleaParada) {

        if(((statsJugador[pokemonActualPlayer][9] < statsMachine[pokemonActualMachine][9])) && decidirVelocidad) {
            turnoEnemigo = true;
            decidirVelocidad = false;
        }
        if (turnoEnemigo) {
            turnoEnemigo = false;
            console.log("Turno enemigo");
            await realizarAtaque("enemigo",ataquePlayer, ataqueMachine, defensaPlayer, defensaMachine);
            
        }else {
            turnoEnemigo = true;
            console.log("Turno jugador");           
            await realizarAtaque("jugador",ataquePlayer, ataqueMachine, defensaPlayer, defensaMachine);
            
        }
    } 
}

async function realizarAtaque(turno ,ataquePlayer, ataqueMachine, defensaPlayer, defensaMachine) {
    mostrarMensaje("");

    if (turno === "jugador") {
        let tiposAtacante = statsJugador[pokemonActualPlayer][11]; 
        let tiposDefensor = statsMachine[pokemonActualMachine][11];
        let modificador = calcularModificadorTipo(tiposAtacante, tiposDefensor);

        statsMachine[pokemonActualMachine][4] -= ((ataquePlayer * modificador - defensaMachine) > 0 ? (ataquePlayer * modificador - defensaMachine) : 10);

        if(modificador > 1) {
            mostrarMensaje("¡Es supereficaz!");
        } else if(modificador < 1) {
            mostrarMensaje("¡No es muy eficaz!");
        }
        console.log("Ataque del jugador");
        await spritesAtaque(); 
         
        dibujarVidaPokemonCambiado("enemigo");
        comprobarVida();
        dibujarNumeros("enemigo");

        if (statsMachine[pokemonActualMachine][4] <= 0) {
            peleaParada = true;
            reproducirSonidoPokemon(pokemonActualMachine,"enemigo");
            detectarPokemonMuerto("enemigo");  
            document.getElementById("jugadaMachine").classList.add("muriendo");
            await esperarEntreAnimaciones(1000);
             
            if(!comprobarVictoria()) {
                mostrarMensaje(`¡${statsMachine[pokemonActualMachine][3]} se ha debilitado!`);
            } 
            await esperarEntreAnimaciones(2000);
            cambiarPokemonEnemigo();
        } 
    } else {
        let tiposAtacante = statsMachine[pokemonActualMachine][11];
        let tiposDefensor = statsJugador[pokemonActualPlayer][11];
        let modificador = calcularModificadorTipo(tiposAtacante, tiposDefensor);

        statsJugador[pokemonActualPlayer][4] -= ((ataqueMachine * modificador - defensaPlayer) > 0 ? (ataqueMachine * modificador - defensaPlayer) : 10);

        if(modificador > 1) {
            mostrarMensaje("¡Es supereficaz!");
        } else if(modificador < 1) {
            mostrarMensaje("¡No es muy eficaz!");
        }
        console.log("Ataque del enemigo");
        await spritesAtaque("enemigo");  
        
        dibujarVidaPokemonCambiado();
        comprobarVida();
        dibujarNumeros();

        if (statsJugador[pokemonActualPlayer][4] <= 0) {
            peleaParada = true;
            reproducirSonidoPokemon(pokemonActualPlayer,"jugador");
            detectarPokemonMuerto("jugador");  
            document.getElementById("jugadaPlayer").classList.add("muriendo");
            if(!comprobarVictoria("enemigo")) {
                mostrarMensaje(`¡${statsJugador[pokemonActualPlayer][3]} se ha debilitado!`);
                await esperarEntreAnimaciones(2000);
                mostrarMensaje("¡Elige otro Pokémon!");
            }
        }
    }  
    await esperarEntreAnimaciones(500); 
}

function detectarPokemonMuerto(enemigo) {

    if(enemigo === "enemigo" && pokemonActualMachine === 0){
        pokeballM1.classList.add("muerto");
    }else if(enemigo === "enemigo" && pokemonActualMachine === 1) {
        pokeballM2.classList.add("muerto");
    }else if(enemigo === "enemigo" && pokemonActualMachine === 2) {
        pokeballM3.classList.add("muerto");
    }else if(enemigo === "enemigo" && pokemonActualMachine === 3) {
        pokeballM4.classList.add("muerto");
    }else if(enemigo === "enemigo" && pokemonActualMachine === 4) {
        pokeballM5.classList.add("muerto");
    }else if(enemigo === "jugador" && pokemonActualPlayer === 0) {
        pokeball1.classList.add("muerto");
    }else if(enemigo === "jugador" && pokemonActualPlayer === 1) {
        pokeball2.classList.add("muerto");
    }else if(enemigo === "jugador" && pokemonActualPlayer === 2) {
        pokeball3.classList.add("muerto");
    }else if(enemigo === "jugador" && pokemonActualPlayer === 3) {
        pokeball4.classList.add("muerto");
    }else if(enemigo === "jugador" && pokemonActualPlayer === 4) {
        pokeball5.classList.add("muerto");
    }
}


function comprobarVida() {
    if (statsJugador[pokemonActualPlayer][4] <= 0) {
        statsJugador[pokemonActualPlayer][4] = 0;
    }
    if (statsMachine[pokemonActualMachine][4] <= 0) {
        statsMachine[pokemonActualMachine][4] = 0;
    }
}
async function spritesAtaque(enemigo) {

    if(enemigo === "enemigo") {
        document.getElementById("jugadaMachine").classList.add("ataqueEnemigo");

        await esperarEntreAnimaciones(1000);
        document.getElementById("jugadaMachine").classList.remove("ataqueEnemigo");
    
        document.getElementById("jugadaPlayer").classList.add("golpe");
        reproducirSonido("ataque");
    
        await esperarEntreAnimaciones(2000);
        document.getElementById("jugadaPlayer").classList.remove("golpe");


    }else {
        document.getElementById("jugadaPlayer").classList.add("ataque");

        await esperarEntreAnimaciones(1000);
        document.getElementById("jugadaPlayer").classList.remove("ataque");
    
        document.getElementById("jugadaMachine").classList.add("golpe");
        reproducirSonido("ataque");
    
        await esperarEntreAnimaciones(2000);
        document.getElementById("jugadaMachine").classList.remove("golpe");
    }
    
}

async function esperarEntreAnimaciones(tiempo) {
    return new Promise(resolve => setTimeout(resolve, tiempo)); // Correctly use setTimeout
}

function ataqueMasAlto(stats) {
    let ataque = "";
  
    stats[5] > stats[7] ?  ataque = stats[5] : ataque = stats[7];

    return ataque;
}
function elegirDefensa(ataque, statsAtaque, statsDefensa) {

    let defensa="";   

    if(statsAtaque[5] == ataque) {
        defensa = statsDefensa[6];
    }else {
        defensa = statsDefensa[8];
    }
    
    return defensa;
}
function dibujarVidaPokemonCambiado(enemigo) {

    if(enemigo === "enemigo") {
        porcentajeMachine = (statsMachine[pokemonActualMachine][4] / vidaMaximaMachine[pokemonActualMachine]) * 100;

        if(porcentajeMachine < 20) {
            document.getElementById("vidaRestanteMachine").style.backgroundColor = "red";
        }else if(porcentajeMachine < 40) {
            document.getElementById("vidaRestanteMachine").style.backgroundColor = "yellow";
        }else {
            document.getElementById("vidaRestanteMachine").style.backgroundColor = "green";
        }

        if(porcentajeMachine <= 0) {
            document.getElementById("vidaRestanteMachine").style.width = "0%";
        }else {
            document.getElementById("vidaRestanteMachine").style.width = porcentajeMachine + "%";
        }
    }else {
        porcentajePlayer = (statsJugador[pokemonActualPlayer][4] / vidaMaximaPlayer[pokemonActualPlayer]) * 100;
        
        if(porcentajePlayer < 20) {
            document.getElementById("vidaRestantePlayer").style.backgroundColor = "red";
        }else if(porcentajePlayer < 40) {
            document.getElementById("vidaRestantePlayer").style.backgroundColor = "yellow";
        }else {
            document.getElementById("vidaRestantePlayer").style.backgroundColor = "green";
        }
    
        if(porcentajePlayer <= 0) {
            document.getElementById("vidaRestantePlayer").style.width = "0%";
            
        }else {
            document.getElementById("vidaRestantePlayer").style.width = porcentajePlayer + "%";
        }
    }    
}
function dibujarNumeros(enemigo) {

    if(enemigo === "enemigo") {
        nombreMachine.innerHTML = `${statsMachine[pokemonActualMachine][3]}`;    
        vidaMachine.innerHTML = `${statsMachine[pokemonActualMachine][4]}/${vidaMaximaMachine[pokemonActualMachine]}`;
    }else {
        nombrePlayer.innerHTML = `${statsJugador[pokemonActualPlayer][3]}`;    
        vidaPlayer.innerHTML = `${statsJugador[pokemonActualPlayer][4]}/${vidaMaximaPlayer[pokemonActualPlayer]}`;
    }    
}
function quitarClasesMuerto(enemigo) {
    if(enemigo === "enemigo") {
        document.getElementById("jugadaMachine").classList.remove("muriendo");
    }else {
        document.getElementById("jugadaPlayer").classList.remove("muriendo");
    }
}
async function numeroAleatorio() {
    let num = 1;

    for (let i = 0; i < 10; i++) {

        num = Math.floor(Math.random() * 151);

        if (num === 0) {
            num = 3;
        }
        numerosAleatorios[i] = num;
    }
    num = 133;
    console.log(numerosAleatorios);    
}
function dibujarPokemon(numero) {
    console.log(numero);
        if(numero === 0 ){
            pokemon1.innerHTML = ` 
            <img src="${statsJugador[0][0]}" alt="${statsJugador[0][2]}">
            `;
        }else if(numero === 1) {
            pokemon2.innerHTML = `
            <img src="${statsJugador[1][0]}" alt="${statsJugador[0][2]}">
            `;
        }else if(numero === 2) {
            pokemon3.innerHTML = `
            <img src="${statsJugador[2][0]}" alt="${statsJugador[0][2]}">
            `;
        }else if(numero === 3) {
            pokemon4.innerHTML = `
            <img src="${statsJugador[3][0]}" alt="${statsJugador[0][2]}">
            `;
        }else if(numero === 4) {
            pokemon5.innerHTML = `
            <img src="${statsJugador[4][0]}" alt="${statsJugador[0][2]}">
            `;
        }
}
function dibujarSprites(enemigo) {

    if(enemigo === "enemigo") {
        jugadaMachine.innerHTML = `
        <img src="${statsMachine[pokemonActualMachine][0]}" alt="${statsMachine[pokemonActualMachine][2]}">
        `;
    }else {
        jugadaPlayer.innerHTML = `
        <img src="${statsJugador[pokemonActualPlayer][1]}" alt="${statsJugador[pokemonActualPlayer][2]}">
        `;
    }
}
async function buscarApi(num) {
    let pokemonArray = [];

    let url = `https://pokeapi.co/api/v2/pokemon/${num}/`;

    await fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
        console.log(datos);

        let nombre = datos.name.charAt(0).toUpperCase() + datos.name.slice(1);
        let numero = datos.id;
        let imagen = datos.sprites.other['official-artwork'].front_default;
        let imagenDetras = datos.sprites.back_default;
        let hp = datos.stats['0'].base_stat;
        let ataque = datos.stats['1'].base_stat;
        let defensa = datos.stats['2'].base_stat;
        let ataqueEspecial = datos.stats['3'].base_stat;
        let defensaEspecial = datos.stats['4'].base_stat;
        let velocidad = datos.stats['5'].base_stat;
        let sonido = datos.cries.latest;
        let tipos = datos.types.map(typeInfo => typeInfo.type.name);

        pokemonArray[0] = imagen;
        pokemonArray[1] = imagenDetras;        
        pokemonArray[2] = numero;
        pokemonArray[3] = nombre;        
        pokemonArray[4] = hp;
        pokemonArray[5] = ataque;
        pokemonArray[6] = defensa;
        pokemonArray[7] = ataqueEspecial;
        pokemonArray[8] = defensaEspecial;
        pokemonArray[9] = velocidad;
        pokemonArray[10] = sonido;
        pokemonArray[11] = tipos;
        
        console.log(pokemonArray);
        console.log(datos);
    });
    return pokemonArray;
}

async function cambiarPokemon() {

    if (event.target.id === "pokeball2") {
        pokemonActualPlayer = 1;
    }else if (event.target.id === "pokeball3") {
        pokemonActualPlayer = 2;
    }else if (event.target.id === "pokeball4") {
        pokemonActualPlayer = 3;
    }else if (event.target.id === "pokeball5") {
        pokemonActualPlayer = 4;
    }else if(event.target.id === "pokeball1") {
        pokemonActualPlayer = 0;
    }  
    mostrarMensaje(`¡${statsJugador[pokemonActualPlayer][3]}! ¡Te elijo!`);
    quitarClasesMuerto();   
    dibujarSprites();
    dibujarNumeros();
    dibujarVidaPokemonCambiado();
    decidirAtaquesDefensas();
    await esperarEntreAnimaciones(1000);

    reproducirSonidoPokemon(pokemonActualPlayer,"player");   
    await esperarEntreAnimaciones(1000); 
    peleaParada = false;
    turnoEnemigo = true;
    console.log("pelea jugador");
    pelear();
    agregarEventosPokeballs();
}
async function cambiarPokemonEnemigo() {
   
    if(!primerPokemonEnemigo) {
        pokemonActualMachine++;  
        mostrarMensaje(`¡El entrenador Gary cambia a ${statsMachine[pokemonActualMachine][3]}!`);               
    }    else {
        mostrarMensaje(`¡El entrenador Gary elige a ${statsMachine[pokemonActualMachine][3]}!`);        
    }
    
    await esperarEntreAnimaciones(2000);
    quitarClasesMuerto("enemigo"); 
    dibujarSprites("enemigo");
    dibujarNumeros("enemigo");
    dibujarVidaPokemonCambiado("enemigo");
    decidirAtaquesDefensas();
    await esperarEntreAnimaciones(1000);
    reproducirSonidoPokemon(pokemonActualMachine,"enemigo");

    if(!primerPokemonEnemigo) {
        turnoEnemigo = false; 
        await esperarEntreAnimaciones(1000); 
        console.log("pelea machine");
        pelear();
    }else {
        anuncios.innerHTML = "Elige tu primer Pokémon";
        agregarEventosPokeballs();
    }
    
    primerPokemonEnemigo = false;
}
function reproducirSonidoPokemon(pokemon, turno) {

    let sonido = statsJugador[pokemon][10];

    if(turno === "enemigo") {
        sonido = statsMachine[pokemon][10];
    }
    audio.src = sonido;    
    audio.play();
}
function reproducirSonido(tipo){
    let sonido = "";

    if(tipo === "ataque") {
        sonido = "./audio/ataque.mp3";
    }else if(tipo === "victoria") {
        sonido = "./audio/victoria.mp3";
        musica("stop"); // Detener la música de fondo cuando suene la música de victoria
    }
    audio.src = sonido;
    audio.play();
}
function comprobarVictoria(enemigo) {

    if((enemigo === "enemigo") 
        && pokeball1.classList.contains("muerto") 
        && pokeball2.classList.contains("muerto") 
        && pokeball3.classList.contains("muerto") 
        && pokeball4.classList.contains("muerto") 
        && pokeball5.classList.contains("muerto")) {

        mostrarMensaje("¡Has perido!");
        peleaParada = false;
        return true;
    }else if(pokeballM1.classList.contains("muerto") 
        && pokeballM2.classList.contains("muerto") 
        && pokeballM3.classList.contains("muerto") 
        && pokeballM4.classList.contains("muerto") 
        && pokeballM5.classList.contains("muerto")) {  

        musica("stop");
        reproducirSonido("victoria");
        mostrarMensaje("¡Has ganado!");
        
        return true;
    }    
    return false;
}
function calcularModificadorTipo(tiposAtacante, tiposDefensor) {
    let modificador = 1;

    tiposAtacante.forEach(tipoAtacante => {
        tiposDefensor.forEach(tipoDefensor => {
            if (tablaDeTipos[tipoAtacante].strongAgainst.includes(tipoDefensor)) {
                modificador *= 2; // Doble daño
            } else if (tablaDeTipos[tipoAtacante].weakAgainst.includes(tipoDefensor)) {
                modificador *= 0.5; // Mitad de daño
            }
        });
    });

    return modificador;
}

/************************** ruelta *******************************/
//muestra los pokemons en el html
async function mostrarPokemons() {

    // muestra los pokemons en el html
    for (let i = 0; i < 8; i++) {
        if (pokemons[i]) {
            const casilla = document.getElementById(`c${i + 1}`);
            const img = document.createElement('img');
            img.src = pokemons[i][0];
            img.alt = pokemons[i][4];
            casilla.innerHTML = '';
            casilla.appendChild(img);
        }
    }
}

// muestra los detalles del pokemon seleccionado en el centro
function mostrarPokemoncentro() {
    const elementoSeleccionado = document.querySelector('.seleccionada');
    const indiceSeleccionado = Array.from(elementoSeleccionado.parentNode.children).indexOf(elementoSeleccionado);
    const pokemonSeleccionado = pokemons[indiceSeleccionado];
    const elemento = document.getElementById('centro');

    elemento.innerHTML = `
        <img src="${pokemonSeleccionado[0]}" alt="${pokemonSeleccionado[0]}">
        <div id="nombre">${pokemonSeleccionado[3]}</div>
        <div id="altura">${pokemonSeleccionado[4]}</div>
    `;
}
function cargarEventosRuleta() {
    let i = 0;
    // evento para el botón SELECCIONAR, copia el pokemon seleccionado en el equipo
    document.getElementById('selector').addEventListener('click', () => {
        
        if (equipoIndex < 5) {
            const elementoSeleccionado = document.querySelector('.seleccionada');
            const indiceSeleccionado = Array.from(elementoSeleccionado.parentNode.children).indexOf(elementoSeleccionado);
            const pokemonSeleccionado = pokemons[indiceSeleccionado];

            /*
            const miembroElement = document.getElementById(`miembro${equipoIndex}`);
            miembroElement.innerHTML = `
                <img src="${pokemonSeleccionado[0]}" alt="${pokemonSeleccionado[0]}">
                <div class="nombre">${pokemonSeleccionado[3]}</div>
                <div class="altura">${pokemonSeleccionado[4]}</div>
            `;
            */
            equipoIndex++;
            const div = document.createElement('div');
            div.classList.add('esMiembro');
            div.innerHTML = "X";
            elementoSeleccionado.appendChild(div); // Añade la clase .esMiembro a la casilla seleccionada
            statsJugador[i] = pokemonSeleccionado;
            console.log("Stats jugador" + statsJugador);
            dibujarPokemon(i);
            i++
        }
        
        activarDesactivarBotones("selector","desactivar"); // Desactiva el botón seleccionar después de seleccionar el pokemon        
        comprobarNumeroPlazaIntentos();
    });

    // evento para el botón LANZAR, cambia la clase seleccionada y decrementa el contador de intentos
    document.getElementById('lanzador').addEventListener('click', async () => {
        activarDesactivarBotones("selector","desactivar");
        activarDesactivarBotones("lanzador","desactivar");

        await lanzarPokemon();
        
        activarDesactivarBotones("selector","activar"); // Activa el botón seleccionar después del primer lanzamiento
        activarDesactivarBotones("lanzador","activar");

        // Decrementa el contador de intentos
        intentos--;
        document.getElementById('contadorIntentos').innerText = `Intentos: ${intentos}`;

        if(comprobarNumeroPlazaIntentos()) {
            activarDesactivarBotones("selector","activar");//activa el selector para poder hacer click automaticamente
            document.getElementById('selector').click();// Selecciona automáticamente el Pokémon si los intentos son iguales a las plazas vacías
            activarDesactivarBotones("selector","desactivar");//desactiva el selector porque se va a seleccionar automáticamente
        }
        mostrarPokemoncentro();
    });
}

async function lanzarPokemon() {
    let indiceActual = 0;
    let intervaloTiempo = 50;
    const cambiosTotales = Math.floor(Math.random() * 9) + 12; // Entre 12 y 20 cambios        

    for (let i = 0; i < cambiosTotales; i++) {
        await esperarEntreAnimaciones(intervaloTiempo);
        document.querySelector('.seleccionada').classList.remove('seleccionada');
        indiceActual = (indiceActual + 1) % 8;
        document.getElementById(`c${indiceActual + 1}`).classList.add('seleccionada');
        intervaloTiempo += 10;
    }  
    // Verifica si el Pokémon seleccionado ya ha sido seleccionado
    const elementoSeleccionado = document.querySelector('.seleccionada');
    if (elementoSeleccionado.querySelector('.esMiembro')) {
        await lanzarPokemon(); // Relanza automáticamente si el Pokémon ya ha sido seleccionado
    } 
}

// Comprueba que el número de intentos restantes sea mayor que el número de plazas vacías
function comprobarNumeroPlazaIntentos() {
    const plazasVacias = [1, 2, 3, 4, 5].filter(i => !document.getElementById(`pokemon${i}`).innerHTML.trim()).length;

    if(plazasVacias == 0){   
        activarDesactivarBotones("lanzador","desactivar");//desactiva el lanzador si no hay plazas vacías
    }
    if (intentos == plazasVacias) {
        document.getElementById('contadorIntentos').classList.add('alert');
        return false;
    } else if (intentos < plazasVacias) {        
        return true;
    } else {
        document.getElementById('contadorIntentos').classList.remove('alert');
        return false;
    }
}

async function guardarPokemons() {

    for (let i = 0; i < 8; i++) {
        pokemons[i] = await solicitarPokemonApi();
    }
}

//busca en la api la info y la mete en un array que despues manejaré
async function solicitarPokemonApi() {
    const maxPokemon = 1017; // El pokémon con el ID más alto excluyendo los pokeon con id 10.000 y pico. 
    const primeraGeneracion = 151; // El último pokémon de la primera generación
    let found = false;
    let pokemonArray = [];


    while (!found) {
        let randomId = Math.floor(Math.random() * primeraGeneracion) + 1; // Genera un ID aleatorio hasta el 151 porque soy fan de los 90
        try {                                      
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);                                       
            if (!response.ok) continue; // Si la respuesta no es válida, intenta otro número                                       
                                                
            let datos = await response.json();                                     
            found = true; // Si llega aquí, encontró un Pokémon válido                                     
                                                                                 
            //Descomenta esta parte para ver un arte movido (es horrible pero se mueve)                                    
            //let imagen = datos.sprites.other['showdown'].front_default;                                      
            let nombre = datos.name.charAt(0).toUpperCase() + datos.name.slice(1);
            let numero = datos.id;
            let imagen = datos.sprites.other['official-artwork'].front_default;
            let imagenDetras = datos.sprites.back_default;
            let hp = datos.stats['0'].base_stat;
            let ataque = datos.stats['1'].base_stat;
            let defensa = datos.stats['2'].base_stat;
            let ataqueEspecial = datos.stats['3'].base_stat;
            let defensaEspecial = datos.stats['4'].base_stat;
            let velocidad = datos.stats['5'].base_stat;
            let sonido = datos.cries.latest;
            let tipos = datos.types.map(typeInfo => typeInfo.type.name);

            pokemonArray[0] = imagen;
            pokemonArray[1] = imagenDetras;        
            pokemonArray[2] = numero;
            pokemonArray[3] = nombre;        
            pokemonArray[4] = hp;
            pokemonArray[5] = ataque;
            pokemonArray[6] = defensa;
            pokemonArray[7] = ataqueEspecial;
            pokemonArray[8] = defensaEspecial;
            pokemonArray[9] = velocidad;
            pokemonArray[10] = sonido;
            pokemonArray[11] = tipos; 
        } catch (error) {
          console.error("Error en la petición:", error);
        }
    }
    return pokemonArray;
}

//dependiendo del tiempo que se le pase a la función, espera ese tiempo
async function esperarEntreAnimaciones(tiempo) { 
    return new Promise(resolve => setTimeout(resolve, tiempo)); 
} 
 
//activa o desactiva los botones según los parámetros 
function activarDesactivarBotones(boton, accion) {

    if(boton === 'selector' && accion === 'activar') { 
        document.getElementById('selector').disabled = false;         
    } else if(boton === 'selector' && accion === 'desactivar') { 
        document.getElementById('selector').disabled = true;        
    }else if(boton === 'lanzador' && accion === 'activar') { 
        document.getElementById('lanzador').disabled = false; 
    } else if(boton === 'lanzador' && accion === 'desactivar') { 
        document.getElementById('lanzador').disabled = true; 
    }
}
function quitarPonerProtector() {
    const protectorElement = document.getElementById('protector');
    protectorElement.classList.toggle('protector');
}
function quitarRuleta() {

    const ruleta = document.getElementById('contenedorPrincipal');
    ruleta.style.display = 'none';
}