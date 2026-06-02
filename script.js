const direccionesOficinas = {
    "Phoenix": "123 North Central Ave, Phoenix, AZ",
    "Fontana": "456 Sierra Ave, Fontana, CA",
    "Santa Ana": "789 Main St, Santa Ana, CA",
    "Lynwood": "1011 Long Beach Blvd, Lynwood, CA"
};

// === 1. PROCESAR MENSAJES CON ANIMACIÓN ===
document.getElementById("btnProcesar").addEventListener("click", function() {
    let boton = this;
    
    // Captura de datos
    let nombreCompleto = document.getElementById("nombre").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let oficinaSeleccionada = document.getElementById("oficina").value;
    let hora = document.getElementById("horaCita").value;
    let fechaCitaInput = document.getElementById("fechaCita").value;
    
    let ticketId = document.getElementById("ticketId") ? document.getElementById("ticketId").value.trim() : "";
    let zohoUrl = document.getElementById("zohoUrl") ? document.getElementById("zohoUrl").value.trim() : "";
    let fechaNacimiento = document.getElementById("fechaNacimiento") ? document.getElementById("fechaNacimiento").value : "";
    let fechaEntrada = document.getElementById("fechaEntrada") ? document.getElementById("fechaEntrada").value : "";
    let estadoCivil = document.getElementById("estadoCivil") ? document.getElementById("estadoCivil").value : "";

    if (!nombreCompleto || !telefono || !oficinaSeleccionada || !hora || !fechaCitaInput) {
        alert("❌ Error: Los campos Nombre, Teléfono, Oficina, Fecha y Hora de la cita son obligatorios.");
        return;
    }

    let filtroLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!filtroLetras.test(nombreCompleto)) {
        alert("❌ Error: El nombre solo puede contener letras y espacios.");
        return;
    }

    // EFECTO VISUAL: Activar animación de carga en el botón
    boton.disabled = true;
    boton.innerHTML = `<span class="icono-carga"></span> Procesando Mensajes...`;

    // AUTOMATIZACIÓN: Calcular el día de la llamada en tiempo real (Formato DD/MM/AAAA)
    let ahoraMismo = new Date();
    let dia = String(ahoraMismo.getDate()).padStart(2, '0');
    let mes = String(ahoraMismo.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    let anio = ahoraMismo.getFullYear();
    let fechaLlamadaAutomatica = `${dia}/${mes}/${anio}`;

    // CORRECCIÓN DEL BUG DE LA HORA (Se agregaron los índices [0] y [1] correctamente)
    let horaFormateada = "Hora no definida";
    if (hora) {
        let partesHora = hora.split(":");
        let hrs = parseInt(partesHora[0], 10); // [0] extrae las horas
        let mins = parseInt(partesHora[1], 10); // [1] extrae los minutos
        let ampm = hrs >= 12 ? "PM" : "AM";
        
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12; // Convierte el 0 a 12 para formato 12 horas
        
        if (mins === 0) {
            horaFormateada = hrs + " " + ampm;
        } else {
            let minsLimpios = mins < 10 ? "0" + mins : mins;
            horaFormateada = hrs + ":" + minsLimpios + " " + ampm;
        }
    }

    // Cambiar formato de Fecha de la Cita de AAAA-MM-DD a DD/MM/AAAA para Sheets
    let fechaCitaFormateada = fechaCitaInput;
    if (fechaCitaInput) {
        let partesFecha = fechaCitaInput.split("-");
        fechaCitaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
    }

    let primerNombre = nombreCompleto.split(" ")[0] || "Cliente";
    let direccionExacta = direccionesOficinas[oficinaSeleccionada] || "Dirección no encontrada";
    let textoDeportaciones = document.getElementById("deportaciones").checked ? "SI" : "NO";

    // Construcción de textos automáticos
    let tagCita = `${horaFormateada}/IMMI/${nombreCompleto.toUpperCase()}/${telefono}/FERNANDO PADILLA`;
    let mensajeSms = `SomosDienerLaw Hola ${primerNombre} soy Fernando Padilla confirmando tu cita del ${fechaCitaFormateada} a las ${horaFormateada} en oficina ${direccionExacta} Manda STOP para darte de baja`;
    let historialCompleto = `HISTORIAL DE CONVERSACIÓN DE LA LLAMADA\n----------------------------------------\nNAME: ${nombreCompleto.toUpperCase()}\nCELPHONE: ${telefono}\nDATE OF BIRTH: ${fechaNacimiento}\nESTADO CIVIL: ${estadoCivil.toUpperCase()}\nENTRADAS: ${fechaEntrada}\nDETENCIONES O DEPORTACIONES: ${textoDeportaciones}\nPRÓXIMAS CORTES: NO\n\n${tagCita}\n\nCita Confirmada: Sr/a ${nombreCompleto.toUpperCase()}, le esperamos en la oficina de ${oficinaSeleccionada} el ${fechaCitaFormateada} a las ${horaFormateada}.`;
    
    // NUEVA CONFIGURACIÓN EXCEL: Llenará la fila completa iniciando desde la Columna A (Call Date)
    // Orden: Call Date (A) \t Appt date (B) \t Hour (C) \t STAGE (D) \t Update Appt (E) \t Phone (F) \t Office (G) \t PC Name (H) \t TIKD (I) \t Zoho ID (J)
    let filaExcelFormateada = `${fechaLlamadaAutomatica}\t${fechaCitaFormateada}\t${horaFormateada}\tNUEVO\t\t${telefono}\t${oficinaSeleccionada}\tFERNANDO PADILLA\t${ticketId}\t${zohoUrl}`;

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
activarBotonCopiado("btnCopiarHistorial", "resultadoHistorial", "alertaHistorial");

// === 3. BOTÓN LIMPIAR ===
document.getElementById("btnLimpiar").addEventListener("click", function() {
    document.getElementById("formularioMigracion").reset();
    document.getElementById("resultadoTag").innerText = "";
    document.getElementById("resultadoSms").innerText = "";
    document.getElementById("resultadoHistorial").value = "";
    document.getElementById("resultadoFilaExcel").value = "";
    alert("Formulario limpio.");
});
