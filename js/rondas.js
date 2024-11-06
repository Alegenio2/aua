document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get("categoria");

    const categoriaBtns = document.querySelectorAll(".categoria-btn");
    const infoCategoria = document.getElementById("info-categoria");
    const partidas = document.getElementById("partidas");
    const tablaPosiciones = document.getElementById("tabla-posiciones");

    // Cargar automáticamente la categoría seleccionada desde el parámetro en la URL
    if (categoria) {
        cargarDatosCategoria(categoria);
        const categoriaButton = document.querySelector(`.categoria-btn[data-categoria="${categoria}"]`);
        if (categoriaButton) {
            categoriaButton.classList.add("active");
        }
        infoCategoria.style.display = "block"; // Muestra la información de categoría
    }

    // Event listeners para los botones de categoría
    categoriaBtns.forEach(button => {
        button.addEventListener("click", function () {
            const categoria = this.getAttribute("data-categoria");
            cargarDatosCategoria(categoria);
            infoCategoria.style.display = "block";
        });
    });

    function cargarDatosCategoria(categoria) {
        fetch(`https://raw.githubusercontent.com/Alegenio2/civs/refs/heads/main/${categoria}.json`)
            .then(response => response.json())
            .then(data => {
                const dataForPoints = structuredClone(data);
                const dataForRounds = structuredClone(data);

                calcularPuntos(dataForPoints);
                mostrarPartidasPorRonda(dataForRounds);
                mostrarTablaPosiciones(dataForPoints);
            })
            .catch(error => console.error("Error al cargar los datos:", error));
    }

    function calcularPuntos(data) {
        const pointsMap = data.tournament.participants.reduce((acc, participant) => {
            acc[participant.participant.id] = {
                name: participant.participant.name,
                points: 0,
                matchesPlayed: 0,
                matchesWon: 0
            };
            return acc;
        }, {});

        data.tournament.matches.forEach(match => {
            if (match.match.state === "complete" && match.match.scores_csv) {
                const [score1, score2] = match.match.scores_csv.split('-').map(Number);

                pointsMap[match.match.player1_id].matchesPlayed += 1;
                pointsMap[match.match.player2_id].matchesPlayed += 1;

                if (match.match.player1_id in pointsMap && match.match.player2_id in pointsMap) {
                    pointsMap[match.match.player1_id].points += score1;
                    pointsMap[match.match.player2_id].points += score2;

                    if (score1 > score2) {
                        pointsMap[match.match.player1_id].matchesWon += 1;
                    } else if (score2 > score1) {
                        pointsMap[match.match.player2_id].matchesWon += 1;
                    }
                }
            }
        });

        data.tournament.participants = Object.values(pointsMap);
    }

    function mostrarPartidasPorRonda(data) {
        partidas.innerHTML = `<h3>Partidas de ${data.tournament.name}</h3>`;

        const rounds = {};
        const participants = data.tournament.participants.reduce((acc, participant) => {
            acc[participant.participant.id] = participant.participant.name;
            return acc;
        }, {});

        data.tournament.matches.forEach(match => {
            const round = match.match.round;
            if (!rounds[round]) {
                rounds[round] = [];
            }

            const player1Name = participants[match.match.player1_id] || "Jugador 1";
            const player2Name = participants[match.match.player2_id] || "Jugador 2";
            let player1Score = "", player2Score = "";

            if (match.match.state === "complete" && match.match.scores_csv) {
                const [score1, score2] = match.match.scores_csv.split('-').map(Number);
                player1Score = score1;
                player2Score = score2;
            }

            rounds[round].push({
                matchId: match.match.id,
                state: match.match.state,
                player1Name,
                player1Score,
                player2Name,
                player2Score
            });
        });

        for (const round in rounds) {
            const roundTitle = document.createElement("h4");
            roundTitle.textContent = `Ronda ${round}`;
            partidas.appendChild(roundTitle);

            const roundContainer = document.createElement("div");
            roundContainer.classList.add("round-container");

            rounds[round].forEach(match => {
                const matchBox = document.createElement("div");
                matchBox.classList.add("match-box");
                matchBox.innerHTML = `
                    <div class="player">
                        ${match.player1Name} <span class="score">${match.player1Score}</span>
                    </div>
                    <div class="player">
                        ${match.player2Name} <span class="score">${match.player2Score}</span>
                    </div>
                `;
                roundContainer.appendChild(matchBox);
            });

            partidas.appendChild(roundContainer);
        }
    }

    function mostrarTablaPosiciones(data) {
        tablaPosiciones.innerHTML = "<h3>Tabla de Posiciones</h3>";
        const tabla = document.createElement("table");
        tabla.classList.add("tabla-posiciones");

        const headerRow = tabla.insertRow();
        headerRow.innerHTML = "<th>Posición</th><th>Jugador</th><th>Puntos</th><th>Jugadas</th><th>Ganadas</th>";

        data.tournament.participants
            .sort((a, b) => b.points - a.points)
            .forEach((participant, index) => {
                const row = tabla.insertRow();
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${participant.name}</td>
                    <td>${participant.points}</td>
                    <td>${participant.matchesPlayed}</td>
                    <td>${participant.matchesWon}</td>
                `;
            });

        tablaPosiciones.appendChild(tabla);
    }
});
