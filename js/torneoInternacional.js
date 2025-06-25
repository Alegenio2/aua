document.addEventListener("DOMContentLoaded", async () => {
  const content = document.getElementById("torneo-internacional-content");

  try {
    const res = await fetch("https://aldeanooscar.onrender.com/api/torneo-actual");
    if (!res.ok) throw new Error("No se pudo obtener el torneo actual");

    const torneo = await res.json();
    const inicio = new Date(torneo.start).toLocaleDateString();
    const fin = new Date(torneo.end).toLocaleDateString();
    const premio = torneo.prizePool ? `${torneo.prizePool.amount} ${torneo.prizePool.code}` : "No informado";
    const ubicacion = torneo.location?.name || "Desconocida";
    const imagen = torneo.league?.image || "img/default-tournament.png";
    console.log(imagen);
    // Crear contenedor principal
    const box = document.createElement("div");
    box.className = "torneo-internacional-box";

    // Crear imagen con fallback
    const img = document.createElement("img");
    img.src = imagen;
    img.alt = torneo.name;
    img.className = "torneo-img";
    img.onerror = function () {
      this.onerror = null;
      this.src = "img/default-tournament.png";
    };

    // Crear contenedor de datos
    const datos = document.createElement("div");
    datos.className = "torneo-datos";
    datos.innerHTML = `
      <h4>${torneo.name}</h4>
      <p><strong>Inicio:</strong> ${inicio}</p>
      <p><strong>Fin:</strong> ${fin}</p>
      <p><strong>Premio:</strong> ${premio}</p>
      <p><strong>Ubicación:</strong> ${ubicacion}</p>
    `;

    // Armar estructura final
    box.appendChild(img);
    box.appendChild(datos);
    content.innerHTML = "";
    content.appendChild(box);

  } catch (error) {
    console.error("Error al obtener el torneo internacional:", error);
    content.innerHTML = `<p>No hay torneos internacionales en curso.</p>`;
  }
});
