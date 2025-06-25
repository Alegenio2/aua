document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("torneos-globales-content");
  
    try {
      const res = await fetch("https://aldeanooscar.onrender.com/api/tournaments");
      if (!res.ok) throw new Error("No se pudo obtener la lista de torneos");
  
      const torneos = await res.json();
  
      if (!torneos || torneos.length === 0) {
        container.innerHTML = "<p>No hay torneos anunciados por ahora.</p>";
        return;
      }
  
      const lista = document.createElement("ul");
  
      torneos.slice(0, 5).forEach(torneo => {
        const startDate = new Date(torneo.start).toLocaleDateString();
  
        const item = document.createElement("li");
        item.innerHTML = `<strong>${torneo.name}</strong> - ${startDate}`;
        lista.appendChild(item);
      });
  
      container.innerHTML = ""; // Limpia el texto inicial
      container.appendChild(lista);
  
    } catch (error) {
      console.error("Error al cargar torneos globales:", error);
      container.innerHTML = "<p>No se pudieron cargar los torneos.</p>";
    }
  });
  