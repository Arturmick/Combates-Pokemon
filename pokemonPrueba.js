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
    
    statsJugador[0] = await buscarApi(numerosAleatorios[0]);
    statsJugador[1] = await buscarApi(numerosAleatorios[1]);
    statsJugador[2] = await buscarApi(numerosAleatorios[2]);
    statsJugador[3] = await buscarApi(numerosAleatorios[3]);
    statsJugador[4] = await buscarApi(numerosAleatorios[4]);
    vidaMaximaPlayer[0] = statsJugador[0][4];
    vidaMaximaPlayer[1] = statsJugador[1][4];
    vidaMaximaPlayer[2] = statsJugador[2][4];
    vidaMaximaPlayer[3] = statsJugador[3][4];
    vidaMaximaPlayer[4] = statsJugador[4][4];

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

    

    await pulsarBotonParaEmpezar();

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
        backgroundMusic.volume = 0.8;
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
                mostrarMensaje(`${statsMachine[pokemonActualMachine][3]} se ha debilitado!`);
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
                mostrarMensaje(`${statsJugador[pokemonActualPlayer][3]} se ha debilitado!`);
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
function dibujarPokemon() {
        
    pokemon1.innerHTML = `
        <img src="${statsJugador[0][0]}" alt="${statsJugador[0][2]}">
        `;
    pokemon2.innerHTML = `
        <img src="${statsJugador[1][0]}" alt="${statsJugador[0][2]}">
        `;
    pokemon3.innerHTML = `
        <img src="${statsJugador[2][0]}" alt="${statsJugador[0][2]}">
        `;
    pokemon4.innerHTML = `
        <img src="${statsJugador[3][0]}" alt="${statsJugador[0][2]}">
        `;
    pokemon5.innerHTML = `
        <img src="${statsJugador[4][0]}" alt="${statsJugador[0][2]}">
        `;
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