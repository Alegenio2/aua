async function fetchAndSaveDraftData() {
    const draftCode = document.getElementById('draftCode').value;
    if (!draftCode) {
        alert("Por favor, ingresa un código de draft.");
        return;
    }

    try {
        const response = await fetch(`https://aoe2cm.net/api/draft/${draftCode}`);
        const data = await response.json();

        const civsData = [];
        const neutralCivs = [];

        data.events.forEach(event => {
            // Validar que no esté vacío 'chosenOptionId' y que 'actionType' sea relevante
            if (!event.chosenOptionId || (event.player === 'NONE' && !event.actionType)) {
                return; // Ignorar civilizaciones sin nombre o con 'NONE' sin actionType
            }

            const civ = {
                name: event.chosenOptionId,
                player: event.player,
                actionType: event.actionType,
                won: false,
                lost: false
            };
            if (event.player === 'NONE' || (event.player === 'NONE' && !event.actionType) ) {                            
                neutralCivs.push(civ); // Guardar civilizaciones neutrales por separado
                       } else {
                civsData.push(civ); // Guardar civilizaciones de jugadores
            }
        });

        localStorage.setItem('civsData', JSON.stringify(civsData));
        localStorage.setItem('neutralCivs', JSON.stringify(neutralCivs));
console.log(neutralCivs);
        alert("Datos cargados y guardados en localStorage.");
        renderCivs();
        renderNeutralCivs();

    } catch (error) {
        console.error("Error al obtener los datos del draft:", error);
        alert("Error al obtener los datos del draft. Verifica el código e intenta nuevamente.");
    }
}

function renderCivs() {
    const hostPicksColumn = document.getElementById('hostPicksColumn');
    const guestPicksColumn = document.getElementById('guestPicksColumn');
    const hostBansColumn = document.getElementById('hostBansColumn');
    const guestBansColumn = document.getElementById('guestBansColumn');

    hostPicksColumn.innerHTML = '';
    guestPicksColumn.innerHTML = '';
    hostBansColumn.innerHTML = '';
    guestBansColumn.innerHTML = '';

    const civsData = JSON.parse(localStorage.getItem('civsData'));

    civsData.forEach(civ => {
        if (civ.player === 'NONE') return;
        const column = civ.player === 'HOST'
            ? (civ.actionType === 'ban' ? hostBansColumn : hostPicksColumn)
            : (civ.actionType === 'ban' ? guestBansColumn : guestPicksColumn);

        const civElement = document.createElement('div');
        civElement.classList.add('civ');
        if (civ.actionType === 'ban') civElement.classList.add('civ-ban');

        // Añadir imagen si ganó o perdió
        if (civ.won) {
            const wonImage = document.createElement('img');
            wonImage.src = 'img/gano.svg';
            wonImage.alt = 'Ganador';
            wonImage.classList.add('status-image');
            civElement.appendChild(wonImage);
        }

        if (civ.lost) {
            const lostImage = document.createElement('img');
            lostImage.src = 'img/perdio.svg';
            lostImage.alt = 'Perdedor';
            lostImage.classList.add('status-image');
            civElement.appendChild(lostImage);
        }

        civElement.innerHTML += `
            <span>${civ.name}</span>
            ${civ.actionType !== 'ban' ? `
                <label><input type="checkbox" ${civ.won ? 'checked' : ''} onchange="markAsWinner('${civ.name}', this.checked)"> Ganador</label>
                <label><input type="checkbox" ${civ.lost ? 'checked' : ''} onchange="markAsLoser('${civ.name}', this.checked)"> Perdedor</label>
            ` : ''}
        `;
        column.appendChild(civElement);
    });
}

function renderNeutralCivs() {
    const neutralColumn = document.getElementById('neutralCivsColumn');
    neutralColumn.innerHTML = '';

    const neutralCivs = JSON.parse(localStorage.getItem('neutralCivs')) || [];

    // Filtrar civilizaciones neutrales que tienen un actionType válido
    const filteredNeutralCivs = neutralCivs.filter(civ => civ.actionType);

    filteredNeutralCivs.forEach(civ => {
        const civElement = document.createElement('div');
        civElement.classList.add('civ', 'neutral-civ');
        civElement.innerHTML = `<span>${civ.name}</span>`;
        neutralColumn.appendChild(civElement);

          });
}

function markAsWinner(civName, isWinner) {
    const civsData = JSON.parse(localStorage.getItem('civsData'));
    const civ = civsData.find(c => c.name === civName);
    if (civ) civ.won = isWinner;
    localStorage.setItem('civsData', JSON.stringify(civsData));
    renderCivs();
}

function markAsLoser(civName, isLoser) {
    const civsData = JSON.parse(localStorage.getItem('civsData'));
    const civ = civsData.find(c => c.name === civName);
    if (civ) civ.lost = isLoser;
    localStorage.setItem('civsData', JSON.stringify(civsData));
    renderCivs();
}

function actualizarDatos() {
    const nuevosDatos = obtenerDatosActualizados(); // Esta función debe estar definida en otro lugar
    localStorage.setItem('civsData', JSON.stringify(nuevosDatos));
    displayHostCivs(); // Esta función también debe estar definida en otro lugar
}

// Botón de actualizar
document.getElementById('btnActualizar').addEventListener('click', actualizarDatos);

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderCivs();
    renderNeutralCivs();
});
