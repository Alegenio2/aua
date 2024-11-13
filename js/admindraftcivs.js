async function fetchAndSaveDraftData() {
    const draftCode = document.getElementById('draftCode').value;
    if (!draftCode) {
        alert("Por favor, ingresa un código de draft.");
        return;
    }

    try {
        const response = await fetch(`https://aoe2cm.net/api/draft/${draftCode}`);
        const data = await response.json();

        const civsData = data.events.map(event => ({
            name: event.chosenOptionId,
            player: event.player,
            actionType: event.actionType,
            won: false,
            lost: false
        }));

        localStorage.setItem('civsData', JSON.stringify(civsData));
        alert("Datos cargados y guardados en localStorage.");

        renderCivs();

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
          // Filtra las civilizaciones que tienen el jugador como "NONE"
        if (civ.player === 'NONE') return;
        const column = civ.player === 'HOST'
            ? (civ.actionType === 'ban' ? hostBansColumn : hostPicksColumn)
            : (civ.actionType === 'ban' ? guestBansColumn : guestPicksColumn);

        const civElement = document.createElement('div');
        civElement.classList.add('civ');
        if (civ.actionType === 'ban') civElement.classList.add('civ-ban');
        console.log();
        // Si la civilización ganó, se agrega la imagen de 'gano.svg'
        if (civ.won) {
            console.log(civ.won);
            const wonImage = document.createElement('img');
            wonImage.src = 'img/gano.svg';  // Asegúrate de que esta ruta sea correcta
            
            wonImage.alt = 'Ganador';
            wonImage.classList.add('status-image');

            civElement.appendChild(wonImage); // Agregar la imagen encima de la civilización
        }
        if (civ.lost) {
            const lostImage = document.createElement('img');
            lostImage.src = 'img/perdio.svg';  // Asegúrate de que esta ruta sea correcta
            lostImage.alt = 'Perdio';
            lostImage.classList.add('status-image');
            civElement.appendChild(lostImage); // Agregar la imagen encima de la civilización
        }

        civElement.innerHTML = `
            <span>${civ.name}</span>
            ${civ.actionType !== 'ban' ? `
                <label><input type="checkbox" ${civ.won ? 'checked' : ''} onchange="markAsWinner('${civ.name}', this.checked)"> Ganador</label>
                <label><input type="checkbox" ${civ.lost ? 'checked' : ''} onchange="markAsLoser('${civ.name}', this.checked)"> Perdedor</label>
            ` : ''}
        `;
        column.appendChild(civElement);
    });
}

// Función para marcar como ganador y actualizar en localStorage
function markAsWinner(civName, isWinner) {
    const civsData = JSON.parse(localStorage.getItem('civsData'));
    const civ = civsData.find(c => c.name === civName);
    if (civ) civ.won = isWinner;
    localStorage.setItem('civsData', JSON.stringify(civsData));

    // Actualizar la visualización en la interfaz sin recargar la página
    renderCivs();
}

// Función para marcar como perdedor y actualizar en localStorage
function markAsLoser(civName, isLoser) {
    const civsData = JSON.parse(localStorage.getItem('civsData'));
    const civ = civsData.find(c => c.name === civName);
    if (civ) civ.lost = isLoser;
    localStorage.setItem('civsData', JSON.stringify(civsData));

    // Actualizar la visualización en la interfaz sin recargar la página
    renderCivs();
}

// Actualiza los datos y notifica a las otras pestañas o ventanas
function actualizarDatos() {
const nuevosDatos = obtenerDatosActualizados(); // Obtén los datos actualizados
localStorage.setItem('civsData', JSON.stringify(nuevosDatos));

// Forzar la actualización en la misma pestaña, si es necesario
displayHostCivs(); // Actualiza el DOM en la misma página sin recargar
}



// Ejemplo de uso del botón
document.getElementById('btnActualizar').addEventListener('click', actualizarDatos);

document.addEventListener("DOMContentLoaded", renderCivs);