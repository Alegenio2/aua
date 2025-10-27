async function cargarTorneo() {
  try {
    // Cargar el JSON local del torneo
    const response = await fetch('../torneos/torneo_uruguay_open_cup_2v2.json');
    const data = await response.json();

    document.getElementById('info-categoria').style.display = 'block';

    if (data.grupos && data.rondas_grupos) {
      mostrarGrupos(data);
      mostrarTablaPosiciones(data);
    }

    if (data.eliminatorias) {
      mostrarEliminatorias(data.eliminatorias);
    }

  } catch (error) {
    console.error('Error al cargar el torneo:', error);
  }
}

function mostrarGrupos(data) {
  const contenedor = document.getElementById('partidas');
  contenedor.innerHTML = '';

  const titulo = document.createElement('h2');
  titulo.textContent = 'Fase de Grupos';
  contenedor.appendChild(titulo);

  data.grupos.forEach(grupo => {
    const grupoDiv = document.createElement('div');
    grupoDiv.className = 'grupo';

    const nombreGrupo = document.createElement('h3');
    nombreGrupo.textContent = grupo.nombre;
    grupoDiv.appendChild(nombreGrupo);

    // Buscar rondas del grupo
    const rondas = data.rondas_grupos.find(r => r.grupo === grupo.nombre.split(' ')[1]);
    if (rondas && rondas.partidos) {
      rondas.partidos.forEach(ronda => {
        const rondaDiv = document.createElement('div');
        rondaDiv.className = 'ronda';

        const tituloRonda = document.createElement('h4');
        tituloRonda.textContent = `Ronda ${ronda.ronda}`;
        rondaDiv.appendChild(tituloRonda);

        ronda.partidos.forEach(partido => {
          const partidoDiv = document.createElement('div');
          partidoDiv.className = 'partido';

          const info = document.createElement('p');
          const fecha = partido.fecha
            ? ` (${partido.diaSemana || ''} ${partido.fecha} - ${partido.horario || ''})`
            : '';
          info.textContent = `${partido.equipo1Nombre} 🆚 ${partido.equipo2Nombre}${fecha}`;

          partidoDiv.appendChild(info);
          rondaDiv.appendChild(partidoDiv);
        });

        grupoDiv.appendChild(rondaDiv);
      });
    }

    contenedor.appendChild(grupoDiv);
  });
}

// === TABLA DE POSICIONES ===
function mostrarTablaPosiciones(data) {
  const tablaPosiciones = document.getElementById('tabla-posiciones');
  tablaPosiciones.innerHTML = '<h2>Tabla de Posiciones</h2>';

  if (!data.grupos || !data.rondas_grupos) return;

  data.grupos.forEach(grupo => {
    const nombreGrupo = grupo.nombre;
    const equipos = grupo.equipos || []; // en tu JSON puede ser 'equipos' o 'participantes'
    const puntos = {};

    // Inicializar equipos
    equipos.forEach(equipo => {
      puntos[equipo.id] = {
        nombre: equipo.nombre,
        puntos: 0,
        jugadas: 0,
        ganadas: 0
      };
    });

    // Buscar rondas de este grupo
    const rondas = data.rondas_grupos.find(r => r.grupo === nombreGrupo.split(' ')[1]);
    if (!rondas || !rondas.partidos) return;

    // Recorrer partidos
    rondas.partidos.forEach(ronda => {
      ronda.partidos.forEach(p => {
        if (!p.resultado) return; // si no hay resultado aún, salta

        const id1 = p.equipo1Id;
        const id2 = p.equipo2Id;
        const s1 = p.resultado[id1] ?? 0;
        const s2 = p.resultado[id2] ?? 0;

        if (!puntos[id1] || !puntos[id2]) return;

        puntos[id1].puntos += s1;
        puntos[id2].puntos += s2;
        puntos[id1].jugadas += 1;
        puntos[id2].jugadas += 1;

        if (s1 > s2) puntos[id1].ganadas += 1;
        else if (s2 > s1) puntos[id2].ganadas += 1;
      });
    });

    const lista = Object.values(puntos).sort((a, b) => b.puntos - a.puntos);

    const titulo = document.createElement('h3');
    titulo.textContent = nombreGrupo;
    tablaPosiciones.appendChild(titulo);

    const tabla = document.createElement('table');
    tabla.classList.add('tabla-posiciones');
    tabla.innerHTML = `
      <tr><th>Pos</th><th>Equipo</th><th>Puntos</th><th>Jugadas</th><th>Ganadas</th></tr>
      ${lista.map((p, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${p.nombre}</td>
          <td>${p.puntos}</td>
          <td>${p.jugadas}</td>
          <td>${p.ganadas}</td>
        </tr>
      `).join('')}
    `;

    tablaPosiciones.appendChild(tabla);
  });
}

// === ELIMINATORIAS ===
function mostrarEliminatorias(eliminatorias) {
  const contenedor = document.getElementById('tabla-posiciones');
  const titulo = document.createElement('h2');
  titulo.textContent = 'Eliminatorias';
  contenedor.appendChild(titulo);

  eliminatorias.forEach(ronda => {
    const rondaDiv = document.createElement('div');
    rondaDiv.className = 'eliminatoria';

    const rondaTitulo = document.createElement('h3');
    rondaTitulo.textContent = ronda.ronda;
    rondaDiv.appendChild(rondaTitulo);

    if (!ronda.partidos || ronda.partidos.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'Próximamente se definirán los partidos.';
      rondaDiv.appendChild(p);
    } else {
      ronda.partidos.forEach(partido => {
        const partidoDiv = document.createElement('div');
        partidoDiv.className = 'match';
        partidoDiv.innerHTML = `
          <span class="equipo">${partido.equipo1Nombre}</span>
          <span class="vs">🆚</span>
          <span class="equipo">${partido.equipo2Nombre}</span>
        `;
        rondaDiv.appendChild(partidoDiv);
      });
    }

    contenedor.appendChild(rondaDiv);
  });
}

document.addEventListener('DOMContentLoaded', cargarTorneo);
