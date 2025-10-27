async function cargarTorneo() {
  try {
    // Cargar el JSON del torneo
    const response = await fetch('https://raw.githubusercontent.com/Alegenio2/civs/refs/heads/main/torneos/torneo_uruguay_open_cup_2v2.json');
    const data = await response.json();

    // Mostrar la sección principal (ya que no hay categorías)
    document.getElementById('info-categoria').style.display = 'block';

    // Mostrar fase de grupos y eliminatorias
    if (data.grupos && data.rondas_grupos) {
      mostrarGrupos(data);
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
  contenedor.innerHTML = ''; // Limpiar contenido previo

  const titulo = document.createElement('h2');
  titulo.textContent = 'Fase de Grupos';
  contenedor.appendChild(titulo);

  data.grupos.forEach(grupo => {
    const grupoDiv = document.createElement('div');
    grupoDiv.className = 'grupo';

    const nombreGrupo = document.createElement('h3');
    nombreGrupo.textContent = grupo.nombre;
    grupoDiv.appendChild(nombreGrupo);

    // Buscar las rondas del grupo
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

function mostrarEliminatorias(eliminatorias) {
  const contenedor = document.getElementById('tabla-posiciones');
  contenedor.innerHTML = ''; // Limpiar contenido previo

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
        const partidoDiv = document.createElement('p');
        partidoDiv.textContent = `${partido.equipo1Nombre} 🆚 ${partido.equipo2Nombre}`;
        rondaDiv.appendChild(partidoDiv);
      });
    }

    contenedor.appendChild(rondaDiv);
  });
}

document.addEventListener('DOMContentLoaded', cargarTorneo);

