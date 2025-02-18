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

    cargarCartelFight();
    cargarEventos(); // Ensure cargarEventos is called

    setearStats();    
    dibujarSprites();
    dibujarNumeros();
    dibujarVida();
});
function cargarCartelFight() {
    document.getElementById("cartelFight").style.display = "block";
}
function cargarEventos() {
    document.getElementById("cartelFight").addEventListener("click", () => {
        document.getElementById("cartelFight").remove();
        decidirAtaquesDefensas();
        pelear();
    });
    document.getElementById("pokeball1").addEventListener("click", () => {
        pokemonActualPlayer = 0;
        cambiarPokemon();        
    });
    document.getElementById("pokeball2").addEventListener("click", () => {
        pokemonActualPlayer = 1;
        cambiarPokemon();
    });
    document.getElementById("pokeball3").addEventListener("click", () => {
        pokemonActualPlayer = 2;
        cambiarPokemon();        
    });
    document.getElementById("pokeball4").addEventListener("click", () => {
        pokemonActualPlayer = 3;
        cambiarPokemon();        
    });
    document.getElementById("pokeball5").addEventListener("click", () => {
        pokemonActualPlayer = 4;
        cambiarPokemon();        
    });
}


function setearStats(){
    vidaMaximaPlayer = statsJugador[pokemonActualPlayer][4];
    vidaMaximaMachine = statsMachine[pokemonActualMachine][4];
}


async function decidirAtaquesDefensas() {

    ataquePlayer = ataqueMasAlto(statsJugador[pokemonActualPlayer]);
    ataqueMachine = ataqueMasAlto(statsMachine[pokemonActualMachine]);

    defensaPlayer = elegirDefensa(ataqueMachine, statsMachine[pokemonActualMachine],statsJugador[pokemonActualPlayer]);
    defensaMachine = elegirDefensa(ataquePlayer, statsJugador[pokemonActualPlayer], statsMachine[pokemonActualMachine]);

}


async function pelear() {    
    console.log("entra en pelea");

    while (statsJugador[pokemonActualPlayer][4] > 0 && statsMachine[pokemonActualMachine][4] > 0) {
        await realizarAtaque(ataquePlayer, ataqueMachine, defensaPlayer, defensaMachine);
    } 
    console.log("sale de pelea");
}


async function realizarAtaque(ataquePlayer, ataqueMachine, defensaPlayer, defensaMachine) {

    if (statsJugador[pokemonActualPlayer][9] > statsMachine[pokemonActualMachine][9]) {

        statsMachine[pokemonActualMachine][4] -= ((ataquePlayer - defensaMachine) > 0 ? (ataquePlayer - defensaMachine) : 0);

        await realizarAtaquePlayer();  
        dibujarVida();
        comprobarVida();
        dibujarNumeros();

        if (statsMachine[pokemonActualMachine][4] <= 0) {
            pokeballM1.classList.add("muerto");
            document.getElementById("jugadaMachine").classList.add("muriendo");
            return; // Exit if machine's life is 0
        } 

        statsJugador[pokemonActualPlayer][4] -= ((ataqueMachine - defensaPlayer) > 0 ? (ataqueMachine - defensaPlayer) : 0);

        await realizarAtaqueMachine();  
        dibujarVida();
        comprobarVida();
        dibujarNumeros();

        if (statsJugador[pokemonActualPlayer][4] <= 0) {
            pokeball1.classList.add("muerto");
            document.getElementById("jugadaPlayer").classList.add("muriendo");
            return; // Exit if machine's life is 0
        }
    } else {
        statsJugador[pokemonActualPlayer][4] -= ((ataqueMachine - defensaPlayer) > 0 ? (ataqueMachine - defensaPlayer) : 0);

        await realizarAtaqueMachine();
        dibujarVida();
        comprobarVida();
        dibujarNumeros();

        if (statsJugador[pokemonActualPlayer][4] <= 0) {
            pokeball1.classList.add("muerto");
            document.getElementById("jugadaPlayer").classList.add("muriendo");
            return; // Exit if machine's life is 0
        }

        statsMachine[pokemonActualMachine][4] -= ((ataquePlayer - defensaMachine) > 0 ? (ataquePlayer - defensaMachine) : 0);

        await realizarAtaquePlayer();
        dibujarVida();
        comprobarVida();
        dibujarNumeros();

        if (statsMachine[pokemonActualMachine][4] <= 0) {
            pokeballM1.classList.add("muerto");
            document.getElementById("jugadaMachine").classList.add("muriendo");
            return; // Exit if machine's life is 0
        } 

    }
    await esperarEntreAnimaciones(); // Ensure animations wait correctly
}
function comprobarVida() {
    if (statsJugador[pokemonActualPlayer][4] <= 0) {
        statsJugador[pokemonActualPlayer][4] = 0;
    }
    if (statsMachine[pokemonActualMachine][4] <= 0) {
        statsMachine[pokemonActualMachine][4] = 0;
    }
}
async function realizarAtaquePlayer() {

    document.getElementById("jugadaPlayer").classList.add("ataque");

    await esperarEntreAnimaciones(1000);
    document.getElementById("jugadaPlayer").classList.remove("ataque");

    document.getElementById("jugadaMachine").classList.add("golpe");

    await esperarEntreAnimaciones(2000);
    document.getElementById("jugadaMachine").classList.remove("golpe");
}
async function realizarAtaqueMachine() {
    document.getElementById("jugadaMachine").classList.add("ataqueEnemigo");

    await esperarEntreAnimaciones(1000);
    document.getElementById("jugadaMachine").classList.remove("ataqueEnemigo");

    document.getElementById("jugadaPlayer").classList.add("golpe");

    await esperarEntreAnimaciones(2000);
    document.getElementById("jugadaPlayer").classList.remove("golpe");
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
function dibujarVida() {

    porcentajePlayer = (statsJugador[pokemonActualPlayer][4] / vidaMaximaPlayer[pokemonActualPlayer]) * 100;
    porcentajeMachine = (statsMachine[pokemonActualMachine][4] / vidaMaximaMachine[pokemonActualMachine]) * 100;

    if(porcentajeMachine < 20) {
        document.getElementById("vidaRestanteMachine").style.backgroundColor = "red";
    }else if(porcentajeMachine < 40) {
        document.getElementById("vidaRestanteMachine").style.backgroundColor = "yellow";
    }else {
        document.getElementById("vidaRestanteMachine").style.backgroundColor = "green";
    }

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

    if(porcentajeMachine <= 0) {
        document.getElementById("vidaRestanteMachine").style.width = "0%";
    }else {
        document.getElementById("vidaRestanteMachine").style.width = porcentajeMachine + "%";
    }
    

}
function dibujarNumeros() {
    nombrePlayer.innerHTML = `${statsJugador[pokemonActualPlayer][3]}`;    
    vidaPlayer.innerHTML = `${statsJugador[pokemonActualPlayer][4]}/${vidaMaximaPlayer[pokemonActualPlayer]}`;

    nombreMachine.innerHTML = `${statsMachine[pokemonActualMachine][3]}`;    
    vidaMachine.innerHTML = `${statsMachine[pokemonActualMachine][4]}/${vidaMaximaMachine[pokemonActualMachine]}`;
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
function dibujarSprites() {
    
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

    jugadaMachine.innerHTML = `
    <img src="${statsMachine[pokemonActualMachine][0]}" alt="${statsMachine[pokemonActualMachine][2]}">
    `;
    jugadaPlayer.innerHTML = `
    <img src="${statsJugador[pokemonActualPlayer][1]}" alt="${statsJugador[pokemonActualPlayer][2]}">
    `;
}
async function buscarApi(num) {

    let pokemonArray = [];

    let url = `https://pokeapi.co/api/v2/pokemon/${num}/`;

    await fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

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
        
        console.log(pokemonArray);
        console.log(datos);

    });
    return pokemonArray;
}
function cambiarPokemon() {

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
    setearStats();    
    dibujarSprites();
    dibujarNumeros();
    dibujarVida();
}