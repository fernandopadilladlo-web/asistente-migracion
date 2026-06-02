const direccionesOficinas = {
    "Phoenix": "123 North Central Ave, Phoenix, AZ",
    "Fontana": "456 Sierra Ave, Fontana, CA",
    "Santa Ana": "789 Main St, Santa Ana, CA",
    "Lynwood": "1011 Long Beach Blvd, Lynwood, CA"
};

// === 1. PROCESAR E INYECTAR TEXTOS ===
document.getElementById("btnProcesar").addEventListener("click", function() {
    
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

    // CORRECCIÓN MATEMÁTICA DE LA HORA (Limpia formatos extraños de ceros y comas)
    let horaFormateada = "Hora no definida";
    if (hora) {
        let partesHora = hora.split(":");
        let hrs = parseInt(partesHora[0], 10);
        let mins = parseInt(partesHora[1], 10);
        let ampm = hrs >= 12 ? "PM" : "AM";
        
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12; // Si da 0, cambia a 12
        
        // Si los minutos son 0, se muestra directo como "10 AM". Si lleva minutos, como "10:15 AM"
        if (mins === 0) {
            horaFormateada = hrs + " " + ampm;
        } else {
            // Agrega un cero a la izquierda si el minuto es menor a 10 (ej: 10:05)
            let minsLimpios = mins < 10 ? "0" + mins : mins;
            horaFormateada = hrs + ":" + minsLimpios + " " + ampm;
        }
    }

    let primerNombre = nombreCompleto.split(" ")[0] || "Cliente";
    let direccionExacta = direccionesOficinas[oficinaSeleccionada] || "Dirección no encontrada";
    let textoDeportaciones = document.getElementById("deportaciones").checked ? "SI" : "NO";

    // Construcción de textos
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

    let filaExcelFormateada = `${fechaCita}\t${horaFormateada}\tNUEVO\t\t${telefono}\t${oficinaSeleccionada}\tFERNANDO PADILLA\t${ticketId}\t${zohoUrl}`;

    // Inyectar en interfaz
    document.getElementById("resultadoTag").innerText = tagCita;
    document.getElementById("resultadoSms").innerText = mensajeSms;
    document.getElementById("resultadoHistorial").value = historialCompleto;
    document.getElementById("resultadoFilaExcel").value = filaExcelFormateada;
});

// === 2. SISTEMA DE COPIADO ASOCIADO A LOS NUEVOS BOTONES ===
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

// Vinculamos cada botón pequeño con su respectivo campo de texto y alerta
activarBotonCopiado("btnCopiarTag", "resultadoTag", "alertaTag");
activarBotonCopiado("btnCopiarSms", "resultadoSms", "alertaSms");
activarBotonCopiado("btnCopiarExcel", "resultadoFilaExcel", "alertaExcel");

// NUEVA LÍNEA: Vincula el botón de las notas de la llamada
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
