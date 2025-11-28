let cuadrado = () => {
    let numero = prompt("Ingrese un numero para elevar al cuadrado")
    let elevar = numero * numero;
    const elem = document.getElementById("resultado1");
    elem.innerHTML = elevar;
}

let transformarT = () => {
    let texto = prompt("Tirate un texto pa cambiar el div");
    const div = document.getElementById("resultado2");
    div.innerHTML = texto;
}

const filtro = () => {
    let arr = [5,12,8,21,16];
    let filtrar = arr.filter(a => a >10);
    console.log(filtrar);
    const padre = document.getElementsByTagName("body")
    const crearDiv = document.createElement('div');
    crearDiv.textContent= filtrar;
    padre[0].appendChild(crearDiv);
    

}

const subcadena = () => {
    let texto = prompt("Ingrese un texto");
    let verificacion = texto.includes("genial");
    const crearTexto = document.createElement('p');
    const padre = document.getElementsByTagName("body");
    crearTexto.textContent = texto;
    padre[0].appendChild(crearTexto)
    if(verificacion){
        console.log("En el texto: "+texto+" Esta la palabra");
        crearTexto.style.backgroundColor="green";
    } else {
        console.log("No esta en el texto")
        crearTexto.style.backgroundColor="red";
    }
   
}



const unir = () => {
    let text1 = prompt("Ingrese el primer texto");
    let text2 = prompt("Ingrese el segundo texto");
    let concatenar = text1.concat(text2);


    const crearTexto = document.createElement('p');
    const padre = document.getElementsByTagName("body");
    crearTexto.textContent = concatenar.toUpperCase();
    crearTexto.classList.add("resaltado");
    padre[0].appendChild(crearTexto);


    console.log(concatenar);
}

const suma = () => {
    let arr = [4,6,5];
    let suma = 0;
    arr.forEach(a => {
        suma = suma + a;
    });

    const crearTexto = document.createElement('p');
    const padre = document.getElementsByTagName("body");
    crearTexto.textContent = suma;
    padre[0].appendChild(crearTexto);

    console.log("El resultado es: "+suma);
}

const filtrar = () => {
    let arr = ["sol", "luna", "estrellas","mar"];
    const padre = document.getElementsByTagName("body");
    arr.forEach(a => {
        const crearTexto = document.createElement('p');
        let filtro = a.length
        if(filtro>=4){
            let may = a.toUpperCase();
            console.log(may);
            crearTexto.textContent = may;
            padre[0].appendChild(crearTexto);
        }
        
    });

}

const vocal = () => {
    let texto = prompt("Ingrese un texto");
    const crearTexto = document.createElement('p');
    const padre = document.getElementsByTagName("body");
    crearTexto.textContent = texto;
    crearTexto.style.fontSize="100px";
    padre[0].appendChild(crearTexto);
    
    let min = texto.toLowerCase();
    let vocales = "aeiou";
    let contador = 0;

    for(i=0;i<=min.length;i++){
        if(vocales.includes(min[i])){
            
            contador++;
        }
    }

    console.log("El texto tiene: "+contador+" Vocales");
}

const reemplazar = () => {
    let texto1 = prompt("Ingrese un texto entero");
    
    const crearTexto = document.createElement('p');
    const padre = document.getElementsByTagName("body");
    crearTexto.textContent = texto1;
    padre[0].appendChild(crearTexto);

    let texto2 = prompt("Ingrese una palabra que quiere cambiar");
    let texto3 = prompt("Ingrese la palabra para remplazar");

    let reemplazado = texto1.replace(texto2,texto3);

    crearTexto.textContent = reemplazado;
    padre[0].appendChild(crearTexto);

    console.log(reemplazado);
}

const crearTexto = document.createElement('div');

const ordenar = () => {
    let arr = [5,2,9,1];
    let ordenar = arr.sort((a,b) => (b-a))
    console.log(ordenar);


    
    const padre = document.getElementsByTagName("body");
    crearTexto.textContent = ordenar;
    crearTexto.classList.toggle("cambiar")
    padre[0].appendChild(crearTexto);
}