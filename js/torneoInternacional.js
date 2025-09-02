document.addEventListener("DOMContentLoaded", async () => {
  const content = document.getElementById("torneo-internacional-content");

  try {
    const res = await fetch("https://aldeanooscar.onrender.com/api/torneos");
    if (!res.ok) throw new Error("No se pudo obtener el torneo actual");

    const torneo = await res.json();

    const ahora = new Date();
    const fechaInicio = new Date(torneo.start);
    const fechaFin = new Date(torneo.end);

    // Verificar si el torneo está en curso
    if (ahora < fechaInicio || ahora > fechaFin) {
      content.innerHTML = `<p>No hay torneos internacionales en curso.</p>`;
      return;
    }

    const inicio = fechaInicio.toLocaleDateString();
    const fin = fechaFin.toLocaleDateString();
    const premio = torneo.prizePool ? `${torneo.prizePool.amount} ${torneo.prizePool.code}` : "No informado";
    const ubicacion = torneo.location?.name || "Desconocida";

    // Verificación de imagen
    const testImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    const imagenUrl = torneo.league?.image || "";
    const imagenOK = await testImage(imagenUrl);
    const imagenFinal = imagenOK ? imagenUrl : "img/default-tournament.png";

    content.innerHTML = `
      <div class="torneo-internacional-box">
        <img src="${imagenFinal}" alt="${torneo.name}" class="torneo-img" />
        <div class="torneo-datos">
          <h4>${torneo.name}</h4>
          <p><strong>Inicio:</strong> ${inicio}</p>
          <p><strong>Fin:</strong> ${fin}</p>
          <p><strong>Premio:</strong> ${premio}</p>
          <p><strong>Ubicación:</strong> ${ubicacion}</p>
        </div>
      </div>
    `;

  } catch (error) {
    console.error("Error al obtener el torneo internacional:", error);
    content.innerHTML = `<p>No hay torneos internacionales en curso.</p>`;
  }
});


