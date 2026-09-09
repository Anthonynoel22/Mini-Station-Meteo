// je cree des variables pour recuperer et manipuler les elements du DOM
const cityInput = document.getElementById("cityInput");
const button = document.querySelector("button");
const cityEl = document.getElementById("city");
const gpsEl = document.getElementById("gps");
const tempEl = document.getElementById("temperature");
const detailsEl = document.getElementById("details");

button.addEventListener("click", handleSearch);

// fonction fetchCoordinates pour obtenir les coordonnées de la ville saisie
async function fetchCoordinates(city) {
    const url = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1`;

    // on attend le reponse de l'url
    const response = await fetch(url);
    // si il n'y a pas de reponse correcte
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des coordonnées");
    }
    // on attend la reponse en format json
    const data = await response.json();
    // si il y a pas de donnee, message d'ereur
    if (data.length === 0) {
        throw new Error("Aucune donnée trouvée pour la ville spécifiée");
    }

    //Retourner lat + lon
    return {
        lat: data[0].lat,
        lon: data[0].lon,
    };
}
// ne pas oublier de l'appeler plus bas !!!!

// fonction qui lance la recherche quand on clique sur le bouton ok
async function handleSearch(event) {
    // On récupère la valeur que l'utilisateur a tapée dans l'input
    const city = cityInput.value.trim();

    // si l'utilisateur n'a rien écrit on affiche un message et on arrête la fonction
    if (!city) {
        gpsEl.textContent = "Vous n'avez pas saisi de ville";
        return; // stop ici
    }

    try {
        // j'appelle la fonction qui récupère les coordonnées GPS de la ville
        // j'utilise await car c'est une fonction asynchrone
        const coords = await fetchCoordinates(city);

        // j'affiche dans la console ce qu'on a reçu pour verifier
        console.log("COORDS REÇUES :", coords);
        gpsEl.textContent = `latitude: ${coords.lat}, longitude: ${coords.lon}`;

        //  j'appelle maintenant l'API météo AVEC ces coordonnées
        const meteo = await fetchWeather(coords.lat, coords.lon);
        console.log("METEO REÇUE :", meteo);

        // j'affiche la température dans la page
        tempEl.textContent = `${meteo.temperature}°C`;

        // j'affiche des détails sur la météo
        detailsEl.textContent = `Vent : ${meteo.vent} km/h — code météo : ${meteo.codeMeteo}`;
    } catch (error) {
        // si il y a une erreur quelque part
        console.error(error);

        // j'affiche un message d'erreur dans la page
        gpsEl.textContent =
            "Impossible de récupérer les coordonnées ou la météo";
        detailsEl.textContent = "Une erreur s'est produite";
    }
}

// console.log pour verifier que le script est bien chargé

// function pour recuperer la meteo avec lat et lon
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    // on attend le reponse de l'url
    const response = await fetch(url);
    // si il n'y a pas de reponse correcte
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données météo");
    }
    // on attend la reponse en format json
    const data = await response.json();
    // si il y a pas de donnee, message d'ereur
    if (!data.current_weather) {
        throw new Error(
            "Aucune donnée météo trouvée pour les coordonnées spécifiées",
        );
    }

    return {
        temperature: data.current_weather.temperature,
        vent: data.current_weather.windspeed,
        codeMeteo: data.current_weather.weathercode,
    };
}
