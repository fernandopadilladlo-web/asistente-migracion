// === DICCIONARIO DE OFICINAS ESTABLE ===
const direccionesOficinas = {
    "Phoenix": "123 North Central Ave, Phoenix, AZ",
    "Fontana": "456 Sierra Ave, Fontana, CA",
    "Santa Ana": "789 Main St, Santa Ana, CA",
    "Lynwood": "1011 Long Beach Blvd, Lynwood, CA"
};

// === 1. PROCESAR MENSAJES AUTOMÁTICOS (INICIO) ===
document.getElementById("btnProcesar").addEventListener("click", function() {
    let boton = this;
    
    // Captura de datos desde las casillas estables del HTML
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

    // Validación estricta de campos requeridos vacíos
    if (!nombreCompleto || !telefono || !oficinaSeleccionada || !hora || !fechaCitaInput) {
        alert("❌ Error: Los campos Nombre, Teléfono, Oficina, Fecha y Hora de la cita son obligatorios.");
        return;
    }

    // Validación estricta contra números o símbolos en el nombre
    let filtroLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!filtroLetras.test(nombreCompleto)) {
        alert("❌ Error: El nombre solo puede contener letras y espacios.");
        return;
    }

    // Activar animación visual en el botón principal
    boton.disabled = true;
    boton.innerHTML = `<span class="icono-carga"></span> Procesando Mensajes...`;

    // AUTOMATIZACIÓN: Calcular el día de la llamada en tiempo real (DD/MM/AAAA)
    let ahoraMismo = new Date();
    let dia = String(ahoraMismo.getDate()).padStart(2, '0');
    let mes = String(ahoraMismo.getMonth() + 1).padStart(2, '0');
    let anio = ahoraMismo.getFullYear();
    let fechaLlamadaAutomatica = `${dia}/${mes}/${anio}`;

    // CORRECCIÓN MATEMÁTICA: Formatear la hora limpia a 12 horas (AM/PM) sin ceros extras
    let horaFormateada = "Hora no definida";
    if (hora) {
        let partesHora = hora.split(":");
        let hrs = parseInt(partesHora[0], 10);
        let mins = parseInt(partesHora[1], 10);
        let ampm = hrs >= 12 ? "PM" : "AM";
        
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12; // Si da 0, cambia a 12
        
        if (mins === 0) {
            horaFormateada = hrs + " " + ampm;
        } else {
            let minsLimpios = mins < 10 ? "0" + mins : mins;
            horaFormateada = hrs + ":" + minsLimpios + " " + ampm;
        }
    }

    // Formatear Fecha de la Cita de AAAA-MM-DD a DD/MM/AAAA para Excel
    let fechaCitaFormateada = fechaCitaInput;
    if (fechaCitaInput) {
        let partesFecha = fechaCitaInput.split("-");
        fechaCitaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
    }
    // --- RECOPILACIÓN ESTABLE DE DETENCIONES ---
    let tieneDeportaciones = document.getElementById("deportaciones").checked;
    let textoDeportaciones = tieneDeportaciones ? "SI" : "NO";

    // --- CONSTRUCCIÓN DE TEXTOS AUTOMÁTICOS ---
    let primerNombre = nombreCompleto.split(" ")[0] || "Cliente";
    let direccionExacta = direccionesOficinas[oficinaSeleccionada] || "Dirección no encontrada";

    let tagCita = `${horaFormateada}/IMMI/${nombreCompleto.toUpperCase()}/${telefono}/FERNANDO PADILLA`;
    let mensajeSms = `SomosDienerLaw Hola ${primerNombre} soy Fernando Padilla confirmando tu cita del ${fechaCitaFormateada} a las ${horaFormateada} en oficina ${direccionExacta} Manda STOP para darte de baja`;

    let historialCompleto = `HISTORIAL DE CONVERSACIÓN DE LA LLAMADA
----------------------------------------
NAME: ${nombreCompleto.toUpperCase()}
CELPHONE: ${telefono}
DATE OF BIRTH: ${fechaNacimiento}
ESTADO CIVIL: ${estadoCivil.toUpperCase()}
ENTRADAS: ${fechaEntrada}
DETENCIONES O DEPORTACIONES: ${textoDeportaciones}
PRÓXIMAS CORTES: NO

${tagCita}

Cita Confirmada: Sr/a ${nombreCompleto.toUpperCase()}, le esperamos en la oficina de ${oficinaSeleccionada} el ${fechaCitaFormateada} a las ${horaFormateada}.`;

    // Línea tabulada limpia para pegar desde la Columna A en Excel/Sheets
    let filaExcelFormateada = `${fechaLlamadaAutomatica}\t${fechaCitaFormateada}\t${horaFormateada}\tNUEVO\t\t${telefono}\t${oficinaSeleccionada}\tFERNANDO PADILLA\t${ticketId}\t${zohoUrl}`;

    // INYECCIÓN DE RESULTADOS A LA PANTALLA
    setTimeout(function() {
        document.getElementById("resultadoTag").innerText = tagCita;
        document.getElementById("resultadoSms").innerText = mensajeSms;
        document.getElementById("resultadoHistorial").value = historialCompleto;
        document.getElementById("resultadoFilaExcel").value = filaExcelFormateada;

        // Restaurar el botón principal
        boton.disabled = false;
        boton.innerHTML = "Procesar Mensajes Automáticos";
    }, 500);
});

// === 2. MOTOR UNIVERSAL DE COPIADO ===
function activarBotonCopiado(idBotón, idElementoTexto, idSpanAlerta) {
    document.getElementById(idBotón).addEventListener("click", function() {
        let elemento = document.getElementById(idElementoTexto);
        let textoACopiar = elemento.value || elemento.innerText;
        if (!textoACopiar) return;

        navigator.clipboard.writeText(textoACopiar).then(() => {
            let alerta = document.getElementById(idSpanAlerta);
            alerta.innerText = "¡✅ Copiado exitosamente al portapapeles!";
            alerta.style.color = "#2f855a";
            setTimeout(function() { alerta.innerText = ""; }, 2000);
        });
    });
}

// Vinculación de botones de copiado cortos
activarBotonCopiado("btnCopiarTag", "resultadoTag", "alertaTag");
activarBotonCopiado("btnCopiarSms", "resultadoSms", "alertaSms");
activarBotonCopiado("btnCopiarExcel", "resultadoFilaExcel", "alertaExcel");
activarBotonCopiado("btnCopiarHistorial", "resultadoHistorial", "alertaHistorial");

// === 3. BOTÓN LIMPIAR TODO ===
document.getElementById("btnLimpiar").addEventListener("click", function() {
    document.getElementById("formularioMigracion").reset();
    
    // Limpiar textos de resultados
    document.getElementById("resultadoTag").innerText = "";
    document.getElementById("resultadoSms").innerText = "";
    document.getElementById("resultadoHistorial").value = "";
    document.getElementById("resultadoFilaExcel").value = "";
    alert("Formulario limpio con éxito.");
});
