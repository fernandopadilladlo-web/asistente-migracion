const direccionesOficinas = {
    "Phoenix": "123 North Central Ave, Phoenix, AZ",
    "Fontana": "456 Sierra Ave, Fontana, CA",
    "Santa Ana": "789 Main St, Santa Ana, CA",
    "Lynwood": "1011 Long Beach Blvd, Lynwood, CA"
};

// === 1. PROCESAR MENSALES CON ANIMACIÓN ===
document.getElementById("btnProcesar").addEventListener("click", function() {
    let boton = this;
    
    // Captura de datos
    let nombreCompleto = document.getElementById("nombre").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let oficinaSeleccionada = document.getElementById("oficina").value;
    let hora = document.getElementById("horaCita").value;
    let fechaCita = document.getElementById("fechaCita").value;
    let ticketId = document.getElementById("ticketId") ? document.getElementById("ticketId").value.trim() : "";
    let zohoUrl = document.getElementById("zohoUrl") ? document.getElementById("zohoUrl").value.trim() : "";
    let fechaNacimiento = document.getElementById("fechaNacimiento") ? document.getElementById("fechaNacimiento").value : "";
    let fechaEntrada = document.getElementById("fechaEntrada") ? document.getElementById("fechaEntrada").value : "";
    let estadoCivil = document.getElementById("estadoCivil") ? document.getElementById("estadoCivil").value : "";

    if (!nombreCompleto || !telefono || !oficinaSeleccionada || !hora || !fechaCita) {
        alert("❌ Error: Los campos Nombre, Teléfono, Oficina, Fecha y Hora de la cita son obligatorios.");
        return;
    }

    let filtroLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!filtroLetras.test(nombreCompleto)) {
        alert("❌ Error: El nombre solo puede contener letras y espacios.");
        return;
    }

    // EFECTO VISUAL: Activar animación de carga en el botón
    boton.disabled = true; // Evita que le den doble clic por error
    boton.innerHTML = `<span class="icono-carga"></span> Procesando Mensajes...`;

    // Procesamiento matemático de la hora
    let horaFormateada = "Hora no definida";
    if (hora) {
        let partesHora = hora.split(":");
        let hrs = parseInt(partesHora, 10);
        let mins = parseInt(partesHora, 10);
        let ampm = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        if (mins === 0) {
            horaFormateada = hrs + " " + ampm;
        } else {
            let minsLimpios = mins < 10 ? "0" + mins : mins;
            horaFormateada = hrs + ":" + minsLimpios + " " + ampm;
        }
    }

    let primerNombre = nombreCompleto.split(" ") || "Cliente";
    let direccionExacta = direccionesOficinas[oficinaSeleccionada] || "Dirección no encontrada";
    let textoDeportaciones = document.getElementById("deportaciones").checked ? "SI" : "NO";

    let tagCita = `${horaFormateada}/IMMI/${nombreCompleto.toUpperCase()}/${telefono}/FERNANDO PADILLA`;
    let mensajeSms = `SomosDienerLaw Hola ${primerNombre} soy Fernando Padilla confirmando tu cita del ${fechaCita} a las ${horaFormateada} en oficina ${direccionExacta} Manda STOP para darte de baja`;
    let historialCompleto = `HISTORIAL DE CONVERSACIÓN DE LA LLAMADA\n----------------------------------------\nNAME: ${nombreCompleto.toUpperCase()}\nCELPHONE: ${telefono}\nDATE OF BIRTH: ${fechaNacimiento}\nESTADO CIVIL: ${estadoCivil.toUpperCase()}\nENTRADAS: ${fechaEntrada}\nDETENCIONES O DEPORTACIONES: ${textoDeportaciones}\nPRÓXIMAS CORTES: NO\n\n${tagCita}\n\nCita Confirmada: Sr/a ${nombreCompleto.toUpperCase()}, le esperamos en la oficina de ${oficinaSeleccionada} el ${fechaCita} a las ${horaFormateada}.`;
    let filaExcelFormateada = `${fechaCita}\t${horaFormateada}\tNUEVO\t\t${telefono}\t${oficinaSeleccionada}\tFERNANDO PADILLA\t${ticketId}\t${zohoUrl}`;

    // setTimeout simula el tiempo de procesamiento (500 milisegundos = medio segundo)
    setTimeout(function() {
        // Inyectar en interfaz
        document.getElementById("resultadoTag").innerText = tagCita;
        document.getElementById("resultadoSms").innerText = mensajeSms;
        document.getElementById("resultadoHistorial").value = historialCompleto;
        document.getElementById("resultadoFilaExcel").value = filaExcelFormateada;

        // Restaurar el botón original
        boton.disabled = false;
        boton.innerHTML = "Procesar Mensajes Automáticos";
    }, 500);
});

// === 2. SISTEMA DE COPIADO ASOCIADO A LOS BOTONES ===
function activarBotonCopiado(idBotón, idElementoTexto, idSpanAlerta) {
    document.getElementById(idBotón).addEventListener("click", function() {
        let elemento = document.getElementById(idElementoTexto);
        let textoACopiar = elemento.value || elemento.innerText;
        
        if (!textoACopiar) return;

        navigator.clipboard.writeText(textoACopiar).then(() => {
            let alerta = document.getElementById(idSpanAlerta);
            alerta.innerText = "¡✅ Copiado exitosamente al portapapeles!";
            alerta.style.color = "#2f855a";
            
            setTimeout(function() {
                alerta.innerText = "";
            }, 2000);
        });
    });
}

activarBotonCopiado("btnCopiarTag", "resultadoTag", "alertaTag");
activarBotonCopiado("btnCopiarSms", "resultadoSms", "alertaSms");
activarBotonCopiado("btnCopiarExcel", "resultadoFilaExcel", "alertaExcel");
activarBotonCopiado("btnCopiarHistorial", "resultadoHistorial", "alertaHistorial"); // Activación Notas

// === 3. BOTÓN LIMPIAR ===
document.getElementById("btnLimpiar").addEventListener("click", function() {
    document.getElementById("formularioMigracion").reset();
    document.getElementById("resultadoTag").innerText = "";
    document.getElementById("resultadoSms").innerText = "";
    document.getElementById("resultadoHistorial").value = "";
    document.getElementById("resultadoFilaExcel").value = "";
    alert("Formulario limpio.");
});
