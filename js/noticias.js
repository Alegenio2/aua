document.addEventListener("DOMContentLoaded", function () {
    fetch('https://www.ageofempires.com/feed/')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");

            // Selecciona todos los elementos <item> del feed
            const items = xml.querySelectorAll("item");
            const noticiasContainer = document.getElementById("noticias-container");

            items.forEach(item => {
                const title = item.querySelector("title").textContent;
                const link = item.querySelector("link").textContent;
                const description = item.querySelector("description").textContent;
                const pubDate = new Date(item.querySelector("pubDate").textContent).toLocaleDateString();

                // Extracción de la imagen de <content:encoded>
                const contentEncoded = item.querySelector("content\\:encoded").textContent;
                const parser = new DOMParser();
                const contentDoc = parser.parseFromString(contentEncoded, "text/html");
                const imageUrl = contentDoc.querySelector("img")?.getAttribute("src") || "";

                // Crear un elemento para la noticia
                const noticia = document.createElement("div");
                noticia.classList.add("noticia");

                noticia.innerHTML = `
                    <h3><a href="${link}" target="_blank">${title}</a></h3>
                    <img src="${imageUrl}" alt="${title}" style="max-width:100%; height:auto;">
                    <p>${description}</p>
                    <small>Publicado el: ${pubDate}</small>
                `;

                noticiasContainer.appendChild(noticia);
            });
        })
        .catch(error => console.error("Error al obtener el feed:", error));
});
