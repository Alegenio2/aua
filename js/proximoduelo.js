document.addEventListener("DOMContentLoaded", async function () {
    const categorias = [
        { name: "Categoría A", url: "https://raw.githubusercontent.com/Alegenio2/civs/main/ligas/liga_a.json" },
        { name: "Categoría B", url: "https://raw.githubusercontent.com/Alegenio2/civs/main/ligas/liga_b.json" },
        { name: "Categoría C", url: "https://raw.githubusercontent.com/Alegenio2/civs/main/ligas/liga_c.json" },
        { name: "Categoría D", url: "https://raw.githubusercontent.com/Alegenio2/civs/main/ligas/liga_d.json" },
        { name: "Categoría E", url: "https://raw.githubusercontent.com/Alegenio2/civs/main/ligas/liga_e.json" }
    ];

    const container = document.querySelector(".torneo-info .box-content");
    if (!container) {
        console.error("Contenedor para los próximos duelos no encontrado.");
        return;
    }

    function obtenerFechaPartido(partido) {
        if (!partido.fecha || !partido.horario) return null;
    
        const [dia, mes, anio] = partido.fecha.split("-");
        let hora = parseInt(partido.horario);
        if (isNaN(hora)) return null;
    
        // Usamos la hora como local sin tocar por GMT
        const fechaStr = `${anio}-${mes}-${dia}T${hora.toString().padStart(2, "0")}:00:00`;
    
        // Esto ya lo interpreta como hora local (ej: 2025-07-25T21:00:00)
        return new Date(fechaStr);
    }
    

    try {
        const ahora = new Date();
        const duelosFuturos = [];

        for (const categoria of categorias) {
            const response = await fetch(categoria.url);
            if (!response.ok) throw new Error(`Error al cargar ${categoria.name}`);
            const data = await response.json();

            if (!data.jornadas || !Array.isArray(data.jornadas)) continue;

            const partidos = data.jornadas.flatMap(j => j.partidos || []);

            for (const partido of partidos) {
                const fechaReal = obtenerFechaPartido(partido);
                if (fechaReal && fechaReal > ahora) {
                    duelosFuturos.push({
                        categoria: categoria.name,
                        partido,
                        fechaReal,
                        participantes: data.participantes
                    });
                }
            }
        }

        // Ordenar todos los partidos futuros por fecha
        duelosFuturos.sort((a, b) => a.fechaReal - b.fechaReal);

        // Tomar los 2 más cercanos
        const proximos = duelosFuturos.slice(0, 2);

        if (proximos.length === 0) {
            container.innerHTML = `<p>⏳ Todavía no hay partidos coordinados.</p>`;
            return;
        }
       

        for (const duelo of proximos) {
            const { partido, fechaReal, participantes, categoria } = duelo;

            const jugador1 = participantes.find(p => p.id === partido.jugador1Id);
            const jugador2 = participantes.find(p => p.id === partido.jugador2Id);

            const nombre1 = jugador1 ? jugador1.nombre : "A definir";
            const nombre2 = jugador2 ? jugador2.nombre : "A definir";
            const fechaFormateada = fechaReal.toLocaleString();

            const dueloHTML = `
                <div class="categoria-info">
                    <h4>Próximo Duelo (${categoria})</h4>
                    <p>${nombre1} vs ${nombre2}</p>
                    <p>${fechaFormateada}</p>
                </div>
            `;
            container.innerHTML += dueloHTML;
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
});
