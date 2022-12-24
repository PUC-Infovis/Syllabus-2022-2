const linkDataset = ('https://gist.githubusercontent.com/Hernan4444/' +
'16a8735acdb18fabb685810fc4619c73/raw/face46bb769c88a3e36ef3e7287eebd8c1b64773/ArtistProcessed.csv')

function estudiarDatos(data) {
    //console.log(data);                        //data es un array de objetos
    //console.log(data.columns);                //Nos las llaves de los objetos
    //for (let i = 0; i < 10; i ++) {           //Usamos for solamente para explorar los datos
        //console.log(data[i]);                     //Imprimimos el objeto, nos muestra los nombres de sus atributos y valores
        //console.log(data[i].Artist);              //Acceder al nombre del objeto
        //console.log(data[i]["BirthYear"]);        //Otra forma de acceder a los atributos
        //console.log(data[i].Categories)           //El atributo que parseamos en d3.csv
    //}

    //Podemos revisar el artista mas antiguo
    //console.log("El artista más antiguo nació en:", d3.min(data, d => d.BirthYear))

    //Podemos revisra el artista más diverso (que ha figurado en más categorías)

    //Retorna el mayor valor encontrado
    //console.log("El artista más diverso ha participado en", d3.max(data, d => Object.keys(d.Categories).length),
    //            "categorias")                        
    
    //Retorna el menor indice de los maximos valores encontrados. 
    //Ej: d3.maxIndex([1, 3, 2, 3]) retorna 1 porque el 3 es el mayor valor, y el 1 es el menor indice cuyo valor es 3.
    //let indiceMayor = d3.maxIndex(data, d => Object.keys(d.Categories).length)  
    //console.log("El indice del mayor valor es:", indiceMayor)    
    
    //Vemos las categorias del mayor valor
    //console.log("Las categorias del artista mas diverso son:", data[indiceMayor].Categories)  
}

function parseCategory(d) {
    data = {
        Artist: d.Artist,
        BirthYear: d.BirthYear,
        Categories: JSON.parse(d.Categories),   // Nos permite transformar el string a un JSON
        DeathYear: d.DeathYear,
        Gender: d.Gender,
        Nacionality: d.Nacionality,
        TotalArtwork: d.TotalArtwork,
    }

    data["edad"] = 30
    
    return data
}

// Al anteponer + a las llaves que son numeros, las deja como ints en vez de strings.
// JSON.parse convierte las categorias que antes era un string en un diccionario.

d3.csv(linkDataset)                           //Función que lee el csv y retorna una promesa
    .then(datos => {estudiarDatos(datos)})      //Si la promesa se cumple, se llama a la funcion estudiarDatos
    .catch(error => {console.log(error)});      //Si la promesa no se cumple, muestra el error que causó el problema

function estudiarDatos_2(data) {
    console.log(data[0]["¿Cuanto le gusta los siguientes tipos de visualización?"
                        +" [Visualizaciones interactivas (para usar el mouse y realizar acciones)]"])
    
    //No queremos acceder de esta manera a los atributos, queremos un acceso mas simple como en el caso anterior
    //¿Que se podría hacer?
    //console.log(data[0]["gustoInteractivas"])
    //console.log(data)
    //console.log(data.columns)
    
    //for (let i = 0; i < 10; i ++) {           Ahora podemos obtener los atributos con los nombres cortos :)
        //console.log(data[i].rangoEdad)
        //console.log(data[i].maximoCompletos)   
        //console.log(data[i].numeroMarraqueta)
    //}

    // Veamos si alguien seleccionó 1, 2 o 5 en la foto de la marraqueta

    //let agrupado = d3.rollup(data, v => d3.count(v, d => d.numeroMarraqueta), d => d.numeroMarraqueta)
    //console.log(agrupado)                   // Curioso, en clase se verá con calma

    // Veamos ahora el maximo de completos que se ha comido una persona
    // Importancia de que los atributo sean ints (+)

    //console.log("El record de completos es:", d3.max(data, d => d.maximoCompletos))

    //Tambien podemos ver el maximo de series, libros, salidas de fiesta, etc..
    
    //console.log("El record de peliculas/series es:", d3.max(data, d => d.peliculasSeriesVistas))
    //console.log("El record de salidas a carretes es:", d3.max(data, d => d.fiestas))

}

function parseoNombresLargos(d) {
    data = {
        rangoEdad: d["Rango de edad"],
        gustoEstaticas: d["¿Cuanto le gusta los siguientes tipos de visualización? [Visualizaciones estáticas (para imprimir)]"],
        gustoInteractivas: d[("¿Cuanto le gusta los siguientes tipos de visualización? " +
                            "[Visualizaciones interactivas (para usar el mouse y realizar acciones)]")],
        gustoAnimadas: d["¿Cuanto le gusta los siguientes tipos de visualización? [Visualizaciones animadas (gift/videos)]"],
        frecuenciaTelevision: d["¿Con cuantas visualizaciones se encuentra a la semana en los siguientes medios ? [Televisión]"],
        frecuenciaRRSS: d["¿Con cuantas visualizaciones se encuentra a la semana en los siguientes medios ? [Redes Sociales]"],
        frencuenciaPrensaEscrita: d[("¿Con cuantas visualizaciones se encuentra a la semana en los siguientes medios ? "+
                                    "[Prensa Escrita (página de noticia, periodico)]")],
        numeroMarraqueta: d["¿Con qué número asocia \"Una maraqueta\"?\nLink a la imagen"],
        estacionFavorita: d["¿Estación del año favorita?"],
        peliculasSeriesVistas: d["¿Cuantas películas o series has visto aproximadamente este año?"],
        librosLeidos: d[("¿Cuantos libros/papers/mangas distintos has leido aproximadamente este año? "+
                        "No es necesario que los hayas terminado de leer")],
        maximoCompletos: d["¿Cuanto es el máximo de completos que te has comido en un día?"],
        fiestas: d["¿Cuanto veces aproximadamente has salido de fiesta este año?"],
        tamanoCirculo: d[("El tamaño del círculo de la izquierda representa el valor 1, a medida que aumenta el tamaño "+
                        "(área), el valor es más grande. ¿Qué valor crees que representa el círculo de la derecha?")],
        largoBarra: d[("El largo de la barra de la izquierda representa el valor 1, a medida que aumenta el "+
                    "largo, el valor es más grande. ¿Qué valor crees que representa la barra de la derecha?")],
        colorCirculo: d[("El color del circulo de la izquierda representa el valor 1, a medida que el color "+
                    "se vuelve más claro, el valor es más grande. ¿Qué valor crees que representa el círculo de la derecha?")],
        colorMatematica: d["¿A qué color asocia el curso de “Matemáticas” (piense en el forro de cuaderno del colegio)?"],
        colorLenguaje: d["¿A qué color asocia el curso de “Lenguaje” (piense en el forro de cuaderno del colegio)?"],
        animalRandom: d["Conteste un animal cualquiera"],
        primerAnimalRelacionado: d["Conteste con otro animal que esté relacionado al que dijo en la pregunta anterior" ],
        segundoAnimalRelacionado: d["Conteste con un tercer animal que esté relacionado al que dijo justo antes" ],
        hobbies: d["Tienes hobbies ¿cuales?"],
        gustoFecha: d["Piense en una fecha que le guste"],
        paisVisitar: d["¿Qué país le gustaría visitar?"],
        horaJunta: d["Si tuviera que organizar una junta (de amigos, para ir al cine, de trabajo o cualquier tema) ¿A qué hora la haría?"]
    }
    return data
}


d3.csv("../generacion_de_datos.csv")
    .then(datos => estudiarDatos_2(datos))      //Si la promesa se cumple, se llama a la funcion estudiarDatos
    .catch(error => {console.log(error)});



//Explicar primer d3.csv sin funcion de parseo, despues con funcion de parseo y los + a las categorias que sean ints
//Explicar segundo d3.csv sin funcion de parseo, explicar que los nombres quedarian inmensos, despues con funcion de parseo
//y al tratar de determinar las mayores o menores cantidades indicar que hay que transformarlo a ints con los +