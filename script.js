const cuadrado = () =>{
    let n = prompt("Ingrese un numero para elevar al cuadrado");
    let elevar = n*n;
    console.log(elevar);
}


const texto = () => {
    let texto = prompt("Ingrese un texto para pasar a mayusculas");
    let mayusculas = texto.toUpperCase();
    let cortar = mayusculas.trim();
    console.log(cortar);
}

const filtro = () => {
    let arr = [5,12,8,21,16];
    let filtrar = arr.filter(a => a >10);
    console.log(filtrar);
}

const subcadena = () => {
    let texto = prompt("Ingrese un texto");
    let verificacion = texto.includes("genial");
    if(verificacion){
        console.log("En el texto: "+texto+" Esta la palabra");
    } else {
        console.log("No esta en el texto");
    }
}

const unir = () => {
    let text1 = prompt("Ingrese el primer texto");
    let text2 = prompt("Ingrese el segundo texto");
    let concatenar = text1.concat(text2);

    console.log(concatenar);
}

const suma = () => {
    let arr = [4,6,5];
    let suma = 0;
    arr.forEach(a => {
        suma = suma + a;
    });

    console.log("El resultado es: "+suma);
}

const filtrar = () => {
    let arr = ["sol", "luna", "estrellas","mar"];
    
    arr.forEach(a => {
        let filtro = a.length
        if(filtro>=4){
            let may = a.toUpperCase();
            console.log(may);
        }
    });

}

const vocal = () => {
    let texto = prompt("Ingrese un texto");
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

const remplazar = () => {
    let texto1 = prompt("Ingrese un texto entero");
    console.log(texto1);
    let texto2 = prompt("Ingrese una palabra que quiere cambiar");
    let texto3 = prompt("Ingrese la palabra para remplazar");

    let reemplazado = texto1.replace(texto2,texto3);

    console.log(reemplazado);
}

const ordenar = () => {
    let arr = [5,2,9,1];
    let ordenar = arr.sort((a,b) => (b-a))
    console.log(ordenar);

}