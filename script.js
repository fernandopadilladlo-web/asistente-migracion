// === DICCIONARIO DE OFICINAS ===
const direccionesOficinas = {
    "Phoenix": "123 North Central Ave, Phoenix, AZ",
    "Fontana": "456 Sierra Ave, Fontana, CA",
    "Santa Ana": "789 Main St, Santa Ana, CA",
    "Lynwood": "1011 Long Beach Blvd, Lynwood, CA"
};

// === 1. CONTROLADORES MÁGICOS DE PANTALLA ===
function controlarBloqueDinamico(idRadioSi, idRadioNo, idBloqueExtra, idBloqueOpcionalNo) {
    document.getElementById(idRadioSi).addEventListener("change", function() {
        if (this.checked) {
            document.getElementById(idBloqueExtra).style.display = "block";
            if (idBloqueOpcionalNo) document.getElementById(idBloqueOpcionalNo).style.display = "none";
        }
    });
    document.getElementById(idRadioNo).addEventListener("change", function() {
        if (this.checked) {
            document.getElementById(idBloqueExtra).style.display = "none";
            if (idBloqueOpcionalNo) document.getElementById(idBloqueOpcionalNo).style.display = "block";
        }
    });
}

// Inicializar vigilantes principales de los Radios
controlarBloqueDinamico("peticion_si", "peticion_no", "bloque_peticion_extra", null);
controlarBloqueDinamico("detenciones_si", "detenciones_no", "bloque_detenciones_extra", null);
controlarBloqueDinamico("fam_ciu_si", "fam_ciu_no", "bloque_fam_ciu_si", "bloque_fam_ciu_no_comentarios");
controlarBloqueDinamico("fam_res_si", "fam_res_no", "bloque_fam_res_si", "bloque_fam_res_no_comentarios");

// Vigilantes secundarios internos (Evidencia e Hijos)
document.getElementById("tiene_evidencia").addEventListener("change", function() {
    document.getElementById("bloque_detalle_evidencia").style.display = this.checked ? "block" : "none";
});
document.getElementById("orden_dep_si").addEventListener("change", function() {
    if(this.checked) document.getElementById("bloque_fecha_deportacion").style.display = "block";
});
document.getElementById("orden_dep_no").addEventListener("change", function() {
    if(this.checked) document.getElementById("bloque_fecha_deportacion").style.display = "none";
});
document.getElementById("fam_ciu_hijos").addEventListener("change", function() {
    document.getElementById("bloque_hijos_ciu_detalles").style.display = this.checked ? "block" : "none";
});
document.getElementById("fam_res_hijos").addEventListener("change", function() {
    document.getElementById("bloque_hijos_res_detalles").style.display = this.checked ? "block" : "none";
});

// === NUEVO: VIGILANTE MATEMÁTICO DE FECHA DE CITA (Lógica de 3 días) ===
document.getElementById("fechaCita").addEventListener("change", function() {
    let fechaElegidaString = this.value; // Formato AAAA-MM-DD
    if (!fechaElegidaString) return;

    // Crear las fechas a la medianoche local para comparar solo días exactos
    let fechaActual = new Date();
    fechaActual.setHours(0,0,0,0);

    let fechaCita = new Date(fechaElegidaString + "T00:00:00");

    // Calcular la diferencia en milisegundos y convertir a días
    let diferenciaMilisegundos = fechaCita - fechaActual;
    let diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

    let bloqueJustificacion = document.getElementById("bloque_justificacion_fecha");
    
    // Si la cita es a más de 3 días a futuro, abrimos el campo obligatorio
    if (diferenciaDias > 3) {
        bloqueJustificacion.style.display = "block";
    } else {
        bloqueJustificacion.style.display = "none";
        document.getElementById("justificacionFecha").value = ""; // Limpiamos el texto si regresa a rango válido
    }
});

// === 2. PROCESAR MENSAJES (INICIO) ===
document.getElementById("btnProcesar").addEventListener("click", function() {
    let boton = this;
    
    let nombreCompleto = document.getElementById("nombre").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let oficinaSeleccionada = document.getElementById("oficina").value;
    let hora = document.getElementById("horaCita").value;
    let fechaCitaInput = document.getElementById("fechaCita").value;
    
    let ticketId = document.getElementById("ticketId").value.trim();
    let zohoUrl = document.getElementById("zohoUrl").value.trim();
    let fechaNacimiento = document.getElementById("fechaNacimiento").value;
    let fechaEntrada = document.getElementById("fechaEntrada").value;
    let estadoCivil = document.getElementById("estadoCivil").value;
    let justificacionFecha = document.getElementById("justificacionFecha").value.trim();

    // Validar campos requeridos base
    if (!nombreCompleto || !telefono || !oficinaSeleccionada || !hora || !fechaCitaInput) {
        alert("❌ Error: Los campos Nombre, Teléfono, Oficina, Fecha y Hora de la cita son obligatorios.");
        return;
    }

    // Validar si el campo de justificación está abierto y viene vacío
    let bloqueJustificacion = document.getElementById("bloque_justificacion_fecha");
    if (bloqueJustificacion.style.display === "block" && !justificacionFecha) {
        alert("❌ Error: Al programar una cita a más de 3 días de distancia, debes escribir obligatoriamente la Justificación.");
        return;
    }

    let filtroLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!filtroLetras.test(nombreCompleto)) {
        alert("❌ Error: El nombre solo puede contener letras y espacios.");
        return;
    }

    boton.disabled = true;
    boton.innerHTML = `<span class="icono-carga"></span> Procesando Mensajes...`;

    let ahoraMismo = new Date();
    let fechaLlamadaAutomatica = `${String(ahoraMismo.getDate()).padStart(2, '0')}/${String(ahoraMismo.getMonth() + 1).padStart(2, '0')}/${ahoraMismo.getFullYear()}`;

    let horaFormateada = "Hora no definida";
    if (hora) {
        let partesHora = hora.split(":");
        let hrs = parseInt(partesHora[0], 10);
        let mins = parseInt(partesHora[1], 10);
        let ampm = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        horaFormateada = (mins === 0) ? `${hrs} ${ampm}` : `${hrs}:${mins < 10 ? "0" + mins : mins} ${ampm}`;
    }

    let fechaCitaFormateada = fechaCitaInput;
    if (fechaCitaInput) {
        let partesFecha = fechaCitaInput.split("-");
        fechaCitaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
    }
    // --- RECOPILACIÓN DE LOS APARTADOS MIGRATORIOS CONDICIONALES ---
    let notaPeticion = "PETICIÓN: NO";
    if (document.getElementById("peticion_si").checked) {
        let quePet = document.getElementById("que_peticion").value || "No especificada";
        let fechaPet = document.getElementById("fecha_peticion").value || "Sin fecha";
        let tieneEv = document.getElementById("tiene_evidencia").checked;
        let detEv = tieneEv ? ` (Evidencia SÍ: ${document.getElementById("que_evidencia").value || "No detallada"})` : " (Evidencia: NO)";
        notaPeticion = `PETICIÓN: SÍ (${quePet} iniciado el ${fechaPet}${detEv})`;
    }

    let notaDetenciones = "DETENCIONES: NO";
    if (document.getElementById("detenciones_si").checked) {
        let tiempoDet = document.getElementById("tiempo_detencion").value || "No especificado";
        let fechaDet = document.getElementById("fecha_detencion").value || "Sin fecha";
        let ordenDep = document.getElementById("orden_dep_si").checked;
        let detOrden = ordenDep ? ` Emitió Orden de Deportación SÍ (Fecha: ${document.getElementById("fecha_deportacion_orden").value || "Sin fecha"})` : " Emitió Orden de Deportación: NO";
        notaDetenciones = `DETENCIONES: SÍ (Tiempo: ${tiempoDet}, Fecha: ${fechaDet},${detOrden})`;
    }

    let notaFamiliaCiu = "FAMILIARES CIUDADANOS: NO";
    if (document.getElementById("fam_ciu_si").checked) {
        let seleccionadosCiu = [];
        document.querySelectorAll(".check-familiar-ciu:checked").forEach(cb => seleccionadosCiu.push(cb.value));
        let subDetalles = "";
        if (document.getElementById("fam_ciu_hijos").checked) {
            let edadH = document.getElementById("hijos_ciu_edad").value || "No especificada";
            let milH = document.getElementById("hijos_ciu_ejercito").checked ? "SÍ" : "NO";
            let medH = document.getElementById("hijos_ciu_medico").checked ? "SÍ" : "NO";
            subDetalles = ` [Hijos Edad: ${edadH}, Ejército: ${milH}, Problema Médico/Autismo: ${medH}]`;
        }
        notaFamiliaCiu = `FAMILIARES CIUDADANOS: SÍ (${seleccionadosCiu.join(", ") || "Ninguno"}${subDetalles})`;
    } else {
        notaFamiliaCiu = `FAMILIARES CIUDADANOS: NO (Notas: ${document.getElementById("comentarios_fam_ciu").value || "Sin comentarios"})`;
    }

    let notaFamiliaRes = "FAMILIARES RESIDENTES: NO";
    if (document.getElementById("fam_res_si").checked) {
        let seleccionadosRes = [];
        document.querySelectorAll(".check-familiar-res:checked").forEach(cb => seleccionadosRes.push(cb.value));
        let subDetallesRes = "";
        if (document.getElementById("fam_res_hijos").checked) {
            let edadH = document.getElementById("hijos_res_edad").value || "No especificada";
            let milH = document.getElementById("hijos_res_ejercito").checked ? "SÍ" : "NO";
            let medH = document.getElementById("hijos_res_medico").checked ? "SÍ" : "NO";
            subDetallesRes = ` [Hijos Edad: ${edadH}, Ejército: ${milH}, Problema Médico/Autismo: ${medH}]`;
        }
        notaFamiliaRes = `FAMILIARES RESIDENTES: SÍ (${seleccionadosRes.join(", ") || "Ninguno"}${subDetallesRes})`;
    } else {
        notaFamiliaRes = `FAMILIARES RESIDENTES: NO (Notas: ${document.getElementById("comentarios_fam_res").value || "Sin comentarios"})`;
    }

    // --- CONSTRUCCIÓN DE TEXTOS AUTOMÁTICOS ---
    let primerNombre = nombreCompleto.split(" ")[0] || "Cliente";
    let direccionExacta = direccionesOficinas[oficinaSeleccionada] || "Dirección no encontrada";
    
    let tagCita = `${horaFormateada}/IMMI/${nombreCompleto.toUpperCase()}/${telefono}/FERNANDO PADILLA`;
    
    // OPTIMIZACIÓN SMS: Variación formal corta (F. Padilla) para ahorrar longitud
    let mensajeSms = `SomosDienerLaw Hola ${primerNombre} soy F. Padilla confirmando tu cita del ${fechaCitaFormateada} a las ${horaFormateada} en oficina ${direccionExacta} Manda STOP para darte de baja`;

    // OPTIMIZACIÓN HISTORIAL: Se eliminó la inyección de ${tagCita} aquí adentro
    let historialCompleto = `HISTORIAL DE CONVERSACIÓN DE LA LLAMADA
----------------------------------------
NAME: ${nombreCompleto.toUpperCase()}
CELPHONE: ${telefono}
DATE OF BIRTH: ${fechaNacimiento}
ESTADO CIVIL: ${estadoCivil.toUpperCase()}
ENTRADAS: ${fechaEntrada}

${notaPeticion}
${notaDetenciones}
${notaFamiliaCiu}
${notaFamiliaRes}
PRÓXIMAS CORTES: NO
JUSTIFICACIÓN FECHA: ${justificacionFecha || "N/A"}

Cita Confirma: Sr/a ${nombreCompleto.toUpperCase()}, le esperamos en la oficina de ${oficinaSeleccionada} el ${fechaCitaFormateada} a las ${horaFormateada}.`;

    let filaExcelFormateada = `${fechaLlamadaAutomatica}\t${fechaCitaFormateada}\t${horaFormateada}\tNUEVO\t\t${telefono}\t${oficinaSeleccionada}\tFERNANDO PADILLA\t${ticketId}\t${zohoUrl}`;

    setTimeout(function() {
        document.getElementById("resultadoTag").innerText = tagCita;
        document.getElementById("resultadoSms").innerText = mensajeSms;
        document.getElementById("resultadoHistorial").value = historialCompleto;
        document.getElementById("resultadoFilaExcel").value = filaExcelFormateada;

        // EJECUCIÓN DEL CONTADOR: Contar los caracteres que tiene el SMS generado
        let totalCaracteres = mensajeSms.length;
        let contenedorContador = document.getElementById("contadorCaracteres");
        contenedorContador.innerText = totalCaracteres;

        // Alerta visual de color si excede el estándar de un SMS (160)
        if (totalCaracteres > 160) {
            contenedorContador.style.color = "#e53e3e"; // Rojo
        } else {
            contenedorContador.style.color = "#2f855a"; // Verde
        }

        boton.disabled = false;
        boton.innerHTML = "Procesar Mensajes Automáticos";
    }, 500);
});

// === 3. MOTOR UNIVERSAL DE COPIADO ===
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

activarBotonCopiado("btnCopiarTag", "resultadoTag", "alertaTag");
activarBotonCopiado("btnCopiarSms", "resultadoSms", "alertaSms");
activarBotonCopiado("btnCopiarExcel", "resultadoFilaExcel", "alertaExcel");
activarBotonCopiado("btnCopiarHistorial", "resultadoHistorial", "alertaHistorial");

// === 4. BOTÓN LIMPIAR TODO ===
document.getElementById("btnLimpiar").addEventListener("click", function() {
    document.getElementById("formularioMigracion").reset();
    
    // Forzar ocultamiento estricto de todas las secciones
    document.getElementById("bloque_justificacion_fecha").style.display = "none";
    document.getElementById("bloque_peticion_extra").style.display = "none";
    document.getElementById("bloque_detalle_evidencia").style.display = "none";
    document.getElementById("bloque_detenciones_extra").style.display = "none";
    document.getElementById("bloque_fecha_deportacion").style.display = "none";
    document.getElementById("bloque_fam_ciu_si").style.display = "none";
    document.getElementById("bloque_hijos_ciu_detalles").style.display = "none";
    document.getElementById("bloque_fam_ciu_no_comentarios").style.display = "none";
    document.getElementById("bloque_fam_res_si").style.display = "none";
    document.getElementById("bloque_hijos_res_detalles").style.display = "none";
    document.getElementById("bloque_fam_res_no_comentarios").style.display = "none";

    // Limpiar resultados
    document.getElementById("resultadoTag").innerText = "";
    document.getElementById("resultadoSms").innerText = "";
    document.getElementById("resultadoHistorial").value = "";
    document.getElementById("resultadoFilaExcel").value = "";
    document.getElementById("contadorCaracteres").innerText = "0";
    document.getElementById("contadorCaracteres").style.color = "#4a5568";
    alert("Formulario limpio y apartados ocultados con éxito.");
});
