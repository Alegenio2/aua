fetch('json/divisiones.json')
    .then(response => response.json())
    .then(data => {
        const divisionList = document.getElementById('division-list');
        
        data.forEach(division => {
            const divisionItem = document.createElement('li');
            const img = document.createElement('img');
            img.src = division.image;
            img.alt = division.name;
            img.classList.add('division-image'); // Clase para estilos, si es necesario
            
            const link = document.createElement('a');
            link.href = division.link;
           

            divisionItem.appendChild(img);
            divisionItem.appendChild(link);
            divisionList.appendChild(divisionItem);
            
            // Añadir una clase para animación al cargar
            divisionItem.classList.add('fade-in'); 
        });
    })
    .catch(error => console.error('Error loading divisions:', error));
