document.addEventListener("DOMContentLoaded", function () { 
    const noticiasContainer = document.getElementById("feed-news");
    if (!noticiasContainer) return;

    fetch('https://raw.githubusercontent.com/Alegenio2/civs/refs/heads/main/feed.json')
        .then(response => response.json())
        .then(data => {
            noticiasContainer.innerHTML = ""; 
            const ultimasNoticias = data.slice(0, 3);

            ultimasNoticias.forEach(item => {
                const pubDate = new Date(item.pubDate).toLocaleDateString('es-UY', {
                    day: '2-digit', month: 'long', year: 'numeric'
                });

                const noticia = document.createElement("div");
                noticia.classList.add("noticia", "fade-in"); // Añadida animación fade-in de tu CSS

                noticia.innerHTML = `
                    <h3><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></h3>
                    <div class="noticia-img-container">
                        <img src="${item.image}" alt="${item.title}" loading="lazy">
                    </div>
                    <p>${item.description.substring(0, 150)}...</p>
                    <small><i class="far fa-calendar-alt"></i> ${pubDate}</small>
                `;
                noticiasContainer.appendChild(noticia);
            });
        })
        .catch(err => {
            console.error("Error noticias:", err);
            noticiasContainer.innerHTML = "<p>No se pudieron cargar las noticias del frente.</p>";
        });
});
