document.addEventListener("DOMContentLoaded", function () {
    const categoriaBtns = document.querySelectorAll(".categoria-btn");
    const infoCategoria = document.getElementById("info-categoria");
    const partidas = document.getElementById("partidas");
    const tablaPosiciones = document.getElementById("tabla-posiciones");

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
        // Inicializamos el mapa de puntos para cada jugador
        const pointsMap = data.tournament.participants.reduce((acc, participant) => {
            acc[participant.participant.id] = {
                name: participant.participant.name,
                points: 0,
                matchesPlayed: 0,
                matchesWon: 0
            };
            return acc;
        }, {});

        // Calculamos los puntos basados en los resultados de cada partida
        data.tournament.matches.forEach(match => {
            if (match.match.state === "complete" && match.match.scores_csv) {
                const [score1, score2] = match.match.scores_csv.split('-').map(Number);
 
                // Aumentamos la cantidad de partidas jugadas
                pointsMap[match.match.player1_id].matchesPlayed += 1;
                pointsMap[match.match.player2_id].matchesPlayed += 1;


                // Asignamos puntos del scores_csv a los jugadores
                if (match.match.player1_id in pointsMap && match.match.player2_id in pointsMap) {
                    pointsMap[match.match.player1_id].points += score1;
                    pointsMap[match.match.player2_id].points += score2;
                
                 // Verificamos quién ganó
                 if (score1 > score2) {
                    pointsMap[match.match.player1_id].matchesWon += 1; // Jugador 1 ganó
                } else if (score2 > score1) {
                    pointsMap[match.match.player2_id].matchesWon += 1; // Jugador 2 ganó
                }
                
                }
            }
        });

        // Guardamos los puntos calculados en `data.tournament.participants` para usarlos en la tabla
        data.tournament.participants = Object.values(pointsMap);
    }

    function mostrarPartidasPorRonda(data) {
        partidas.innerHTML = `<h3>Partidas de ${data.tournament.name}</h3>`;

        const rounds = {};
        const participants = data.tournament.participants.reduce((acc, participant) => {
            acc[participant.participant.id] = participant.participant.name;
            return acc;
        }, {});

            // Agrupa las partidas por ronda
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
    
            // Muestra las rondas y sus partidas en columnas tipo "llaves"
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
                .sort((a, b) => b.points - a.points) // Ordena por puntos de mayor a menor
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