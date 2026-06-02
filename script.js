const direccionesOficinas = {
    "Phoenix": "123 North Central Ave, Phoenix, AZ",
    "Fontana": "456 Sierra Ave, Fontana, CA",
    "Santa Ana": "789 Main St, Santa Ana, CA",
    "Lynwood": "1011 Long Beach Blvd, Lynwood, CA"
};

// === 1. PROCESAR E INYECTAR TEXTOS ===
document.getElementById("btnProcesar").addEventListener("click", function() {
    
    // Captura obligatoria y opcional cuidando que existan los elementos
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

    // Validaciones estrictas de campos requeridos
    if (!nombreCompleto || !telefono || !oficinaSeleccionada || !hora || !fechaCita) {
        alert("❌ Error: Los campos Nombre, Teléfono, Oficina, Fecha y Hora de la cita son obligatorios.");
        return;
    }

    let filtroLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!filtroLetras.test(nombreCompleto)) {
        alert("❌ Error: El nombre solo puede contener letras y espacios.");
        return;
    }

    // Formatear la hora a 12 Horas (AM/PM)
    let horaFormateada = "Hora no definida";
    if (hora) {
        let partesHora = hora.split(":");
        let hrs = parseInt(partesHora[0]);
        let mins = partesHora[1];
        let ampm = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12; 
        horaFormateada = hrs + ":" + mins + " " + ampm;
    }

    let primerNombre = nombreCompleto.split(" ")[0] || "Cliente";
    let direccionExacta = direccionesOficinas[oficinaSeleccionada] || "Dirección no encontrada";
    let textoDeportaciones = document.getElementById("deportaciones").checked ? "SI" : "NO";

    // Construcción de los tres bloques de texto
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

    // Armado de la fila de Excel usando tabulaciones (\t)
    let filaExcelFormateada = `${fechaCita}\t${horaFormateada}\tNUEVO\t\t${telefono}\t${oficinaSeleccionada}\tFERNANDO PADILLA\t${ticketId}\t${zohoUrl}`;

    // Inyectar todo en la interfaz gráfica
    document.getElementById("resultadoTag").innerText = tagCita;
    document.getElementById("resultadoSms").innerText = mensajeSms;
    document.getElementById("resultadoHistorial").value = historialCompleto;
    document.getElementById("resultadoFilaExcel").value = filaExcelFormateada; // Inyección de la caja verde
});

// === 2. SISTEMA DE COPIADO AUTOMÁTICO TRIPLE ===
function configurarCopiadoRapido(idElemento, idEtiqueta, textoOriginal) {
    document.getElementById(idElemento).addEventListener("click", function() {
        // En los <div> usamos .innerText, en los <input> usamos .value
        let textoACopiar = this.value || this.innerText;
        
        if (!textoACopiar) return;

        navigator.clipboard.writeText(textoACopiar).then(() => {
            let etiqueta = document.getElementById(idEtiqueta);
            etiqueta.innerText = "¡✅ Texto copiado al portapapeles!";
            etiqueta.style.color = "#319795";
            
            setTimeout(function() {
                etiqueta.innerText = textoOriginal;
                etiqueta.style.color = "#4a5568";
            }, 2000);
        });
    });
}

// Activamos el copiado automático para los tres campos asignando sus etiquetas correspondientes
configurarCopiadoRapido("resultadoTag", "etiquetaTag", "Tag de Cita (Haz clic abajo para copiar):");
configurarCopiadoRapido("resultadoSms", "etiquetaSms", "Mensaje SMS de Confirmación (Haz clic abajo para copiar):");
configurarCopiadoRapido("resultadoFilaExcel", "etiquetaExcel", "Línea para Google Sheets (Haz clic abajo para copiar):");

// === 3. BOTÓN LIMPIAR ===
document.getElementById("btnLimpiar").addEventListener("click", function() {
    document.getElementById("formularioMigracion").reset();
    document.getElementById("resultadoTag").innerText = "";
    document.getElementById("resultadoSms").innerText = "";
    document.getElementById("resultadoHistorial").value = "";
    document.getElementById("resultadoFilaExcel").value = "";
    alert("Formulario limpio.");
});
