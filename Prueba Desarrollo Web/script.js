document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("consultaForm");
    const tablaBody = document.getElementById("tablaBody");

    // Cargar consultas desde LocalStorage
    const cargarConsultas = () => {
        const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
        
        // Ordenar las consultas por fecha ascendente
        consultas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        tablaBody.innerHTML = "";
        consultas.forEach((consulta, index) => {
            const row = `
                <tr data-index="${index}">
                    <td>${consulta.mascota}</td>
                    <td>${consulta.dueno}</td>
                    <td>${consulta.fecha}</td>
                    <td>${consulta.observaciones || "N/A"}</td>
                    <td>
                        <button class="btn-editar btn-sm editar">Editar</button>
                        <button class="btn-eliminar btn-sm eliminar">Eliminar</button>
                    </td>
                </tr>`;
            tablaBody.innerHTML += row;
        });

        // Añadir eventos de editar y eliminar a cada fila
        document.querySelectorAll(".editar").forEach(btn => {
            btn.addEventListener("click", editarConsulta);
        });

        document.querySelectorAll(".eliminar").forEach(btn => {
            btn.addEventListener("click", eliminarConsulta);
        });
    };

    // Guardar nueva consulta
    const guardarConsulta = (consulta) => {
        const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
        consultas.push(consulta);
        localStorage.setItem("consultas", JSON.stringify(consultas));
    };

    // Editar consulta
    const editarConsulta = (e) => {
        const fila = e.target.closest("tr");
        const index = fila.getAttribute("data-index");
        const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
        const consulta = consultas[index];

        // Prellenar el formulario con los datos de la consulta
        form.mascota.value = consulta.mascota;
        form.dueno.value = consulta.dueno;
        form.fecha.value = consulta.fecha;
        form.observaciones.value = consulta.observaciones || "";

        // Cambiar el botón de enviar para actualizar
        const submitButton = form.querySelector("button");
        submitButton.textContent = "Actualizar Consulta";
        submitButton.dataset.index = index; // Guardar el índice de la consulta a actualizar
        submitButton.removeEventListener("click", enviarFormulario);
        submitButton.addEventListener("click", actualizarConsulta);
    };

    // Actualizar consulta
    const actualizarConsulta = (e) => {
        e.preventDefault(); // Evitar la acción de recarga de página por defecto
        const index = e.target.dataset.index; // Obtener el índice de la consulta a actualizar
        const consulta = {
            mascota: form.mascota.value,
            dueno: form.dueno.value,
            fecha: form.fecha.value,
            observaciones: form.observaciones.value
        };

        const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
        consultas[index] = consulta; // Actualizar la consulta en el array
        localStorage.setItem("consultas", JSON.stringify(consultas));

        cargarConsultas(); // Recargar la tabla
        form.reset(); // Limpiar el formulario

        // Resetear el botón de actualización
        const submitButton = form.querySelector("button");
        submitButton.textContent = "Registrar Consulta";
        submitButton.removeEventListener("click", actualizarConsulta);
        submitButton.addEventListener("click", enviarFormulario);

        // Mostrar mensaje de éxito
        mostrarAlerta("Consulta actualizada exitosamente", "success");
    };

    // Eliminar consulta
    const eliminarConsulta = (e) => {
        const fila = e.target.closest("tr");
        const index = fila.getAttribute("data-index");
        const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
        consultas.splice(index, 1); // Eliminar la consulta del array
        localStorage.setItem("consultas", JSON.stringify(consultas));
        cargarConsultas(); // Recargar la tabla

        // Mostrar mensaje de éxito
        mostrarAlerta("Consulta eliminada exitosamente", "danger");
    };

    // Mostrar alerta centrada
    const mostrarAlerta = (mensaje, tipo) => {
        const alertContainer = document.createElement("div");
        alertContainer.className = `alert-container alert-${tipo}`; // Añadimos las clases para la alerta y el tipo
        alertContainer.textContent = mensaje;

        document.body.appendChild(alertContainer); // Añadir la alerta al cuerpo del documento

        // Desaparecer la alerta después de 3 segundos
        setTimeout(() => {
            alertContainer.style.opacity = '0'; // Hacerla desaparecer con una transición suave
            setTimeout(() => alertContainer.remove(), 300); // Eliminarla después de que desaparezca
        }, 3000);
    };

    // Evento al enviar el formulario para registrar una nueva consulta
    const enviarFormulario = (e) => {
        e.preventDefault(); // Evitar la recarga de página
        const consulta = {
            mascota: form.mascota.value,
            dueno: form.dueno.value,
            fecha: form.fecha.value,
            observaciones: form.observaciones.value
        };
        if (!consulta.mascota || !consulta.dueno || !consulta.fecha) {
            mostrarAlerta("Todos los campos son obligatorios", "warning");
            return;
        }

        guardarConsulta(consulta);
        cargarConsultas(); // Recargar la tabla
        form.reset(); // Limpiar el formulario
        mostrarAlerta("Consulta registrada exitosamente", "success");
    };

    form.addEventListener("submit", enviarFormulario);

    cargarConsultas(); // Cargar las consultas al inicio
});
