const direccionesOficinas = {
    "Phoenix": "123 North Central Ave, Phoenix, AZ",
    "Fontana": "456 Sierra Ave, Fontana, CA",
    "Santa Ana": "789 Main St, Santa Ana, CA",
    "Lynwood": "1011 Long Beach Blvd, Lynwood, CA"
};

// === 1. ESCUCHAR EL CLICK EN PROCESAR ===
document.getElementById("btnProcesar").addEventListener("click", function() {
    
    // Captura de datos individuales para las validaciones locales
    let nombreCompleto = document.getElementById("nombre").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let oficinaSeleccionada = document.getElementById("oficina").value;
    let hora = document.getElementById("horaCita").value;
    let fechaCita = document.getElementById("fechaCita").value;
    let ticketId = document.getElementById("ticketId").value.trim();
    let zohoUrl = document.getElementById("zohoUrl").value.trim();
    let fechaNacimiento = document.getElementById("fechaNacimiento").value;
    let fechaEntrada = document.getElementById("fechaEntrada").value;
    let estadoCivil = document.getElementById("estadoCivil").value;

    // VALIDACIONES OBLIGATORIAS
    if (!nombreCompleto || !telefono || !oficinaSeleccionada || !hora || !fechaCita) {
        alert("❌ Error: Los campos Nombre, Teléfono, Oficina, Fecha y Hora de la cita son obligatorios.");
        return;
    }

    let filtroLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!filtroLetras.test(nombreCompleto)) {
        alert("❌ Error: El nombre solo puede contener letras y espacios.");
        return;
    }

    // PROCESAMIENTO DE TEXTOS
    let primerNombre = nombreCompleto.split(" ") || "Cliente";
    let direccionExacta = direccionesOficinas[oficinaSeleccionada] || "Dirección no encontrada";

    let horaFormateada = "Hora no definida";
    if (hora) {
        let partesHora = hora.split(":");
        let hrs = parseInt(partesHora);
        let mins = partesHora;
        let ampm = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        horaFormateada = hrs + ":" + mins + " " + ampm;
    }

    let tieneDeportaciones = document.getElementById("deportaciones").checked;
    let textoDeportaciones = tieneDeportaciones ? "SI" : "NO";

    let tagCita = `${horaFormateada}/IMMI/${nombreCompleto.toUpperCase()}/${telefono}/FERNANDO PADILLA`;
    let mensajeSms = `SomosDienerLaw Hola ${primerNombre} soy Fernando Padilla confirmando tu cita del ${fechaCita} a las ${horaFormateada} en oficina ${direccionExacta} Manda STOP para darte de baja`;

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

Cita Confirmada: Sr/a ${nombreCompleto.toUpperCase()}, le esperamos en la oficina de ${oficinaSeleccionada} el ${fechaCita} a las ${horaFormateada}.`;

    // Pintar resultados en pantalla inmediatamente
    document.getElementById("resultadoTag").innerText = tagCita;
    document.getElementById("resultadoSms").innerText = mensajeSms;
    document.getElementById("resultadoHistorial").value = historialCompleto;

	    // === NUEVA LÓGICA: FILA DE EXCEL MANUAL CON TABULACIONES (\t) ===
    // El orden de tus columnas es: Call Date (A) | Appt date (B) | Hour (C) | STAGE (D) | Update Appt (E) | Phone (F) | Office (G) | PC Name (H) | TIKD (I) | Zoho ID (J) | Outcome (K) | Payment Note (L)
    // Como la fecha de la llamada (A) la puedes poner arrastrando en Excel, esta línea llenará desde la B hasta la J de un solo golpe.
    
    let columnaB_apptDate = fechaCita;
    let columnaC_hour = horaFormateada;
    let columnaD_stage = "NUEVO";
    let columnaE_updateAppt = ""; // Vacío por el momento
    let columnaF_phone = telefono;
    let columnaG_office = oficinaSeleccionada;
    let columnaH_pcName = "FERNANDO PADILLA";
    let columnaI_tikd = ticketId;
    let columnaJ_zohoId = zohoUrl;

    // Unimos todos los datos separados por la tabulación (\t)
    let filaExcelFormateada = `${columnaB_apptDate}\t${columnaC_hour}\t${columnaD_stage}\t${columnaE_updateAppt}\t${columnaF_phone}\t${columnaG_office}\t${columnaH_pcName}\t${columnaI_tikd}\t${columnaJ_zohoId}`;

    // Inyectamos la línea en el nuevo campo verde de la pantalla
    document.getElementById("resultadoFilaExcel").value = filaExcelFormateada;


    // ================= CONEXIÓN DIRECTA A GOOGLE SHEETS =================
    // REEMPLAZA las X con tu URL real de Apps Script terminada en /exec
    const urlGoogleSheets = "https://google.com";

    if (urlGoogleSheets.includes("https://script.google.com/macros/s/AKfycbxCXadGazzK7QqkwT_tCIjuurx5lybg3fWmWZoMytOjGnlgIdSxILB-Hg3VGoM8_wR-Jw/exec")) {
        alert("⚠️ Textos creados locales. Recuerda añadir tu URL real de Google para guardarlos en la nube.");
        return;
    }

    // Recolectamos de forma automática todo lo que tenga un atributo "name" en el HTML
    const formularioElemento = document.getElementById("formularioMigracion");
    const datosFormulario = new FormData(formularioElemento);

    // Añadimos manualmente la hora formateada (AM/PM) al paquete para que Google la reciba limpia
    datosFormulario.set("horaCita", horaFormateada);

    // Convertimos los datos al formato de transmisión directa estándar de internet
    const datosConvertidos = new URLSearchParams(datosFormulario);

    // Enviamos los datos en un segundo plano discreto
    fetch(urlGoogleSheets, {
        method: "POST",
        body: datosConvertidos,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    .then(() => {
        alert("✅ ¡Registrado! Textos generados e información guardada en Google Sheets.");
    })
    .catch(err => {
        console.error("Error de red:", err);
        alert("❌ Error: Los textos se generaron pero la base de datos no respondió.");
    });
});

// === ESCUCHAR EL CLIC DENTRO DEL CUADRO VERDE ===
document.getElementById("resultadoFilaExcel").addEventListener("click", function() {
    
    // 1. Obtener el texto que está guardado dentro de la casilla
    let textoA_Copiar = this.value;
    
    // Validar que la casilla no esté vacía antes de copiar
    if (!textoA_Copiar) {
        return; 
    }

    // 2. Guardar el texto automáticamente en el portapapeles del sistema (PC o Celular)
    navigator.clipboard.writeText(textoA_Copiar).then(() => {
        
        // 3. EFECTO VISUAL: Cambiar la etiqueta para avisar que ya se copió
        let etiqueta = document.getElementById("etiquetaExcel");
        etiqueta.innerText = "¡✅ Copiado al portapapeles!";
        etiqueta.style.color = "#319795"; // Cambia el texto a color verde cian
        
        // 4. Regresar la etiqueta a su estado original después de 2 segundos (2000 milisegundos)
        setTimeout(function() {
            etiqueta.innerText = "Línea para Google Sheets (Haz clic abajo para copiar):";
            etiqueta.style.color = "#4a5568"; // Regresa al color gris original
        }, 2000);
        
    }).catch(err => {
        console.error("No se pudo copiar automáticamente: ", err);
    });
});


// === 2. ESCUCHAR EL BOTÓN LIMPIAR (UBICADO AL FINAL) ===
document.getElementById("btnLimpiar").addEventListener("click", function() {
    document.getElementById("formularioMigracion").reset();
    document.getElementById("resultadoTag").innerText = "";
    document.getElementById("resultadoSms").innerText = "";
    document.getElementById("resultadoHistorial").value = "";
    alert("Formulario limpio para la siguiente llamada.");
});
