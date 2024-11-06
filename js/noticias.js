document.addEventListener("DOMContentLoaded", function () {
    fetch('https://raw.githubusercontent.com/Alegenio2/civs/refs/heads/main/feed.json')
        .then(response => response.json())  // Aquí se obtiene el JSON
        .then(data => {
            const noticiasContainer = document.getElementById("noticias-container");

            data.forEach(item => {
                const title = item.title;
                const link = item.link;
                const description = item.description;
                const pubDate = new Date(item.pubDate).toLocaleDateString();
                const imageUrl = item.image;

                // Crear un elemento para la noticia
                const noticia = document.createElement("div");
                noticia.classList.add("noticia");

                noticia.innerHTML = `
                    <h3><a href="${link}" target="_blank">${title}</a></h3>
                    <img src="${imageUrl}" alt="${title}">
                    <p>${description}</p>
                    <small>Publicado el: ${pubDate}</small>
                `;

                noticiasContainer.appendChild(noticia);
            });
        })
        .catch(error => console.error("Error al obtener el JSON:", error));
});
