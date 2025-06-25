document.addEventListener("DOMContentLoaded", async () => {
  const content = document.getElementById("torneo-internacional-content");

  try {
    const res = await fetch("https://aldeanooscar.onrender.com/api/torneo-actual");
    if (!res.ok) throw new Error("No se pudo obtener el torneo actual");

    const torneo = await res.json();
    const inicio = new Date(torneo.start).toLocaleDateString();
    const fin = new Date(torneo.end).toLocaleDateString();

    const imagen = torneo.league?.image || "";
    const premio = torneo.prizePool ? `${torneo.prizePool.amount} ${torneo.prizePool.code}` : "No informado";
    const ubicacion = torneo.location?.name || "Desconocida";

    content.innerHTML = `
      <div class="torneo-internacional-box">
        <img src="${imagen}" alt="${torneo.name}" class="torneo-img"
             onerror="this.onerror=null; this.src='img/default-tournament.png';" />
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
