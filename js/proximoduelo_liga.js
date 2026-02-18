document.addEventListener("DOMContentLoaded", async function () {
    const categorias = [
        { name: "A", url: "https://raw.githubusercontent.com/Alegenio2/civs/main/ligas/liga_a.json" },
        { name: "B", url: "https://raw.githubusercontent.com/Alegenio2/civs/main/ligas/liga_b.json" },
        { name: "C", url: "https://raw.githubusercontent.com/Alegenio2/civs/main/ligas/liga_c.json" },
        { name: "D", url: "https://raw.githubusercontent.com/Alegenio2/civs/main/ligas/liga_d.json" },
        { name: "E", url: "https://raw.githubusercontent.com/Alegenio2/civs/main/ligas/liga_e.json" }
    ];

    const container = document.getElementById("proximas-partidas");
    if (!container) return;

    function parsearFecha(p) {
        if (!p.fecha || !p.horario) return null;
        try {
            const [d, m, a] = p.fecha.split(/[-/]/);
            const horaLimpia = p.horario.replace('.', ':');
            const [hh, mm] = horaLimpia.includes(':') ? horaLimpia.split(':') : [horaLimpia, '00'];
            return new Date(a, m - 1, d, hh, mm);
        } catch (e) { return null; }
    }

    try {
        const ahora = new Date();
        let todosLosDuelos = [];

        // Usamos Promise.all para cargar todas las categorías en paralelo (más rápido)
        const resultados = await Promise.all(categorias.map(cat => 
            fetch(cat.url).then(res => res.json()).catch(() => null)
        ));

        resultados.forEach((data, index) => {
            if (!data || !data.jornadas) return;
            const participantes = data.participantes || [];
            
            data.jornadas.forEach(j => {
                (j.partidos || []).forEach(partido => {
                    const fechaReal = parsearFecha(partido);
                    if (fechaReal && fechaReal > ahora) {
                        todosLosDuelos.push({
                            cat: categorias[index].name,
                            p: partido,
                            fecha: fechaReal,
                            parts: participantes
                        });
                    }
                });
            });
        });

        todosLosDuelos.sort((a, b) => a.fecha - b.fecha);
        const proximos = todosLosDuelos.slice(0, 2);

        if (proximos.length === 0) {
            container.innerHTML = `<p class="empty-msg">No hay partidas programadas por ahora.</p>`;
            return;
        }

        container.innerHTML = ""; // Limpiar
        proximos.forEach(duelo => {
            const j1 = duelo.parts.find(p => p.id === duelo.p.jugador1Id)?.nombre || "A definir";
            const j2 = duelo.parts.find(p => p.id === duelo.p.jugador2Id)?.nombre || "A definir";
            
            const item = document.createElement("div");
            item.className = "categoria-info fade-in";
            item.innerHTML = `
                <div class="match-badge">Cat ${duelo.cat}</div>
                <div class="match-players">
                    <strong>${j1}</strong> <span class="vs">vs</span> <strong>${j2}</strong>
                </div>
                <div class="match-date">
                    <i class="far fa-clock"></i> ${duelo.fecha.toLocaleString('es-UY', { 
                        weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                    })}
                </div>
            `;
            container.appendChild(item);
        });

    } catch (error) {
        container.innerHTML = `<p>Error al sincronizar con el mapa.</p>`;
    }
});


