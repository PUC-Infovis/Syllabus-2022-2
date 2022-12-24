const ArtistProcessedURL = 'https://gist.githubusercontent.com/Hernan4444/16a8735acdb18fabb685810fc4619c73/raw/face46bb769c88a3e36ef3e7287eebd8c1b64773/ArtistProcessed.csv'

// Función para procesar los datos de artistas
function parseArtist(d) {
    const data = {
        Artist: d.Artist,
        BirthYear: +d.BirthYear,
        Categories: JSON.parse(d.Categories),
        DeathYear: +d.DeathYear,
        Gender: d.Gender,
        Nacionality: d.Nacionality,
        TotalArtwork: +d.TotalArtwork,
    }
    return data
}

// Cargamos los datos, los procesamos y creamos las 4 visualizaciones
d3.csv(ArtistProcessedURL, parseArtist).then(artists => {
    // Multiples appends
    createVis1(artists.slice(10, 20));
    // Delays
    createVis2();
    // Reordenar datos
    createVis3(artists.slice(10, 20));
    // MoveEvent mouse
    createVis4();
})


// Función para practicar múltiples appends.
function createVis1(array) {

}

// Función para poner en práctica delays
function createVis2() {

}

// Función par poner en práctica el ordenamiento
function createVis3(artistas) {

}

// Función para poner en juego el dataJoin
function createVis4() {

}