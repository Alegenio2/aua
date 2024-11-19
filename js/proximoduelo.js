document.addEventListener("DOMContentLoaded", async function () {
    const categorias = [
        { name: "Categoria 1", url: "https://raw.githubusercontent.com/Alegenio2/civs/refs/heads/main/categoria1.json" },
        { name: "Categoria 2", url: "https://raw.githubusercontent.com/Alegenio2/civs/refs/heads/main/categoria2.json" },
        { name: "Categoria 3", url: "https://raw.githubusercontent.com/Alegenio2/civs/refs/heads/main/categoria3.json" },
        { name: "Categoria 4", url: "https://raw.githubusercontent.com/Alegenio2/civs/refs/heads/main/categoria4.json" },
        { name: "Categoria 5", url: "https://raw.githubusercontent.com/Alegenio2/civs/refs/heads/main/categoria5.json" }
    ];

    // Selecciona específicamente el segundo div con la clase torneo-info
    const container = document.querySelectorAll(".torneo-info")[1];

    if (!container) {
        console.error("Contenedor para los próximos duelos no encontrado.");
        return;
    }

    try {
        // Procesar cada categoría
        for (const categoria of categorias) {
            const response = await fetch(categoria.url);
            if (!response.ok) throw new Error(`Error al cargar ${categoria.name}`);

            const data = await response.json();

            // Obtener la fecha actual
            const now = new Date();

            // Filtrar partidos futuros
            const partidosFuturos = data.tournament.matches.filter(match => {
                const matchDate = new Date(match.match.scheduled_time);
                return matchDate > now;
            });

            // Obtener el partido más cercano
            if (partidosFuturos.length > 0) {
                partidosFuturos.sort((a, b) => new Date(a.match.scheduled_time) - new Date(b.match.scheduled_time));
                const proximoPartido = partidosFuturos[0];

                // Obtener nombres de los jugadores
                const participants = data.tournament.participants.reduce((acc, participant) => {
                    acc[participant.participant.id] = participant.participant.name;
                    return acc;
                }, {});

                const player1 = participants[proximoPartido.match.player1_id] || "A definir";
                const player2 = participants[proximoPartido.match.player2_id] || "A definir";
                const fecha = new Date(proximoPartido.match.scheduled_time).toLocaleString();

                // Crear y agregar el contenido al contenedor
                const dueloHTML = `
                    <div class="categoria-info">
                        <h4>Próximo Duelo (${categoria.name})</h4>
                        <p>${player1} vs ${player2}</p>
                        <p>${fecha}</p>
                    </div>
                `;
                container.innerHTML += dueloHTML;
            }
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
});
