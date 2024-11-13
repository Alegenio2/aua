// Función para cargar y guardar los mapas en localStorage
async function fetchAndSaveMapData() {
    const mapDraftCode = document.getElementById('mapDraftCode').value;
    if (!mapDraftCode) {
        alert("Por favor, ingresa un código de draft.");
        return;
    }

    try {
        const response = await fetch(`https://aoe2cm.net/api/draft/${mapDraftCode}`);
        const mapdata = await response.json();

        // Obtener la información de los mapas desde `events` y buscar la imagen en `preset.draftOptions`
        const mapasData = mapdata.events.map(event => {
            const mapOption = mapdata.preset.draftOptions.find(option => option.id === event.chosenOptionId);
            return {
                name: mapOption ? mapOption.name : event.chosenOptionId, // Nombre del mapa
                imageUrl: mapOption ? mapOption.imageUrls.emblem : '',    // URL de la imagen si está disponible
                player: event.player,
                actionType: event.actionType,
                won: false,
                lost: false
            };
        });

        // Guardar los mapas en localStorage
        localStorage.setItem('mapasData', JSON.stringify(mapasData));
        alert("Datos de mapas cargados y guardados en localStorage.");
        
        renderMaps();

    } catch (error) {
        console.error("Error al obtener los datos del draft:", error);
        alert("Error al obtener los datos del draft. Verifica el código e intenta nuevamente.");
    }
}

function renderMaps() {
    const hostMaps = document.getElementById('hostMaps');
    const guestMaps = document.getElementById('guestMaps');
    const neutralMaps = document.getElementById('neutralMaps');
    
    // Limpiar el contenido actual
    hostMaps.innerHTML = '';
    guestMaps.innerHTML = '';
    neutralMaps.innerHTML = '';

    const mapasData = JSON.parse(localStorage.getItem('mapasData')) || [];
    
    mapasData.forEach(map => {
        const mapElement = document.createElement('div');
        mapElement.className = `map-card ${map.actionType === 'ban' ? 'map-ban' : ''}`;

        mapElement.innerHTML = `
            <img src="https://aoe2cm.net${map.imageUrl}" alt="${map.name}" class="map-img">
            <span class="map-name">${map.name}</span>
            <div class="map-buttons">
                <button onclick="markWin('${map.name}')">🏆</button>
                <button onclick="markLoss('${map.name}')">❌</button>
            </div>
        `;

        if (map.player === 'HOST') {
            hostMaps.appendChild(mapElement);
        } else if (map.player === 'GUEST') {
            guestMaps.appendChild(mapElement);
        } else {
            neutralMaps.appendChild(mapElement);
        }
    });
}

// Funciones para marcar victoria o derrota
function markWin(mapName) {
    const mapasData = JSON.parse(localStorage.getItem('mapasData')) || [];
    mapasData.forEach(map => {
        if (map.name === mapName) {
            map.won = true;
            map.lost = false;
        }
    });
    localStorage.setItem('mapasData', JSON.stringify(mapasData));
    renderMaps();
}

function markLoss(mapName) {
    const mapasData = JSON.parse(localStorage.getItem('mapasData')) || [];
    mapasData.forEach(map => {
        if (map.name === mapName) {
            map.won = false;
            map.lost = true;
        }
    });
    localStorage.setItem('mapasData', JSON.stringify(mapasData));
    renderMaps();
}

function actualizarDatos() {
    const nuevosDatos = obtenerDatosActualizados(); // Obtén los datos actualizados
    localStorage.setItem('mapasData', JSON.stringify(nuevosDatos));
    
    // Forzar la actualización en la misma pestaña, si es necesario
    displayHostMaps(); // Actualiza el DOM en la misma página sin recargar
    }

// Llama a renderMaps al cargar la página para mostrar los mapas guardados
document.addEventListener("DOMContentLoaded", renderMaps);