// calendar.js

document.addEventListener("DOMContentLoaded", function () {
    const events = [
        { date: "2025-03-01T00:00:00", name: "Registro" },
        { date: "2025-03-30T00:00:00", name: "Fin de Registro" },
        { date: "2025-04-03T00:00:00", name: "Inicio Jornada 1" },
        { date: "2025-04-08T00:00:00", name: "Final Jornada 1" },
        { date: "2025-04-09T00:00:00", name: "Inicio Jornada 2" },
        { date: "2025-04-15T00:00:00", name: "Final Jornada 2" },
        { date: "2025-04-16T00:00:00", name: "Inicio Jornada 3" },
        { date: "2025-04-22T00:00:00", name: "Final Jornada 3" },
        { date: "2025-04-23T00:00:00", name: "Inicio Jornada 4" },
        { date: "2025-04-29T00:00:00", name: "Final Jornada 4" },
        { date: "2025-04-30T00:00:00", name: "Inicio Jornada 5" },
        { date: "2025-04-06T00:00:00", name: "Final Jornada 5" },
        { date: "2025-04-06T00:00:00", name: "Final Jornada 5" },
        { date: "2025-05-31T00:00:00", name: "Final del Torneo" },
    ];

    const now = new Date(new Date().setHours(0, 0, 0, 0));

    // Ordenamos todos los eventos por fecha
    const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Obtenemos el elemento de la lista de eventos
    const eventList = document.getElementById("event-list");
    
    // Limpia la lista antes de añadir nuevos elementos
    eventList.innerHTML = '';

    // Añadimos los eventos ordenados a la lista
    sortedEvents.forEach((event, index) => {
        const eventDate = new Date(event.date);
        const isToday = now.getTime() === eventDate.getTime();

        const eventItem = document.createElement("li");
        eventItem.classList.add("event");

        const dot = document.createElement("span");
        dot.classList.add(isToday ? "dot-today" : "dot");

        const dateText = document.createElement("span");
        dateText.innerHTML = `<b>${isToday ? "HOY" : `${eventDate.getDate()}/${eventDate.toLocaleString("default", { month: "short" })}`}</b>`;

        const nameText = document.createElement("span");
        nameText.classList.add("name"); // Agrega la clase 'name'
        nameText.textContent = event.name;

        eventItem.appendChild(dot);
        eventItem.appendChild(dateText);
        eventItem.appendChild(nameText);

        eventList.appendChild(eventItem);
    });
});

