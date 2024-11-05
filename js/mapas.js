document.addEventListener("DOMContentLoaded", () => {
    fetch("json/mapas.json")  // Archivo JSON local con datos de mapas
        .then(response => response.json())
        .then(data => {
            const mapasContainer = document.querySelector(".contenedor-mapas");
            data.mapas.forEach(mapa => {
                mapasContainer.innerHTML += `
                    <div class="mapa">
                        <img src="${mapa.imagen}" alt="${mapa.nombre}">
                        <p>${mapa.nombre}</p>
                    </div>
                `;
            });
        })
        .catch(error => console.error("Error al cargar los mapas:", error));
});
