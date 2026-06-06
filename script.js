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
controlarBloqueDinamico("cortes_si", "cortes_no", "bloque_cortes_si", "bloque_cortes_no");

// Vigilantes secundarios internos (Evidencia, Cortes e Hijos)
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

// CORRECCIÓN RADIAL MÉDICA: Vigilantes para activar el campo de diagnóstico
document.getElementById("med_ciu_si").addEventListener("change", function() {
    if(this.checked) document.getElementById("bloque_diag_ciu").style.display = "block";
});
document.getElementById("med_ciu_no").addEventListener("change", function() {
    if(this.checked) document.getElementById("bloque_diag_ciu").style.display = "none";
});
document.getElementById("med_res_si").addEventListener("change", function() {
    if(this.checked) document.getElementById("bloque_diag_res").style.display = "block";
});
document.getElementById("med_res_no").addEventListener("change", function() {
    if(this.checked) document.getElementById("bloque_diag_res").style.display = "none";
});

// Vigilantes secundarios internos de las cortes perdidas y órdenes
document.getElementById("perdido_si").addEventListener("change", function() {
    if(this.checked) document.getElementById("bloque_fecha_perdido").style.display = "block";
});
document.getElementById("perdido_no").addEventListener("change", function() {
    if(this.checked) document.getElementById("bloque_fecha_perdido").style.display = "none";
});
document.getElementById("rev_dep_si").addEventListener("change", function() {
    if(this.checked) document.getElementById("bloque_fecha_orden_corte").style.display = "block";
});
document.getElementById("rev_dep_no").addEventListener("change", function() {
    if(this.checked) document.getElementById("bloque_fecha_orden_corte").style.display = "none";
});

// Vigilante matemático de la fecha de la cita (Lógica de 3 días)
document.getElementById("fechaCita").addEventListener("change", function() {
    let fechaElegidaString = this.value;
    if (!fechaElegidaString) return;
    let fechaActual = new Date();
    fechaActual.setHours(0,0,0,0);
    let fechaCita = new Date(fechaElegidaString + "T00:00:00");
    let diferenciaDias = Math.floor((fechaCita - fechaActual) / (1000 * 60 * 60 * 24));
    let bloqueJustificacion = document.getElementById("bloque_justificacion_fecha");
    if (diferenciaDias > 3) {
        bloqueJustificacion.style.display = "block";
    } else {
        bloqueJustificacion.style.display = "none";
        document.getElementById("justificacionFecha").value = "";
    }
});

// === 2. PROCESAR MENSAJES (INICIO DE LA CAPTURA) ===
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

    if (!nombreCompleto || !telefono || !oficinaSeleccionada || !hora || !fechaCitaInput) {
        alert("❌ Error: Los campos Nombre, Teléfono, Oficina, Fecha y Hora de la cita son obligatorios.");
        return;
    }

    let bloqueJustificacion = document.getElementById("bloque_justificacion_fecha");
    if (bloqueJustificacion.style.display === "block" && !justificacionFecha) {
        alert("❌ Error: Al programar una cita a más de 3 días de distancia, debes escribir la Justificación.");
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
        let hrs = parseInt(partesHora, 10);
        let mins = parseInt(partesHora, 10);
        let ampm = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        horaFormateada = (mins === 0) ? `${hrs} ${ampm}` : `${hrs}:${mins < 10 ? "0" + mins : mins} ${ampm}`;
    }

    let fechaCitaFormateada = fechaCitaInput;
    if (fechaCitaInput) {
        let partesFecha = fechaCitaInput.split("-");
        fechaCitaFormateada = `${partesFecha}/${partesFecha}/${partesFecha}`;
    }
    // --- REDACCIÓN NATURAL: SECCIÓN 1: PETICIONES ---
    let notaPeticion = "El cliente no tiene registro de peticiones de inmigración anteriores.";
    if (document.getElementById("peticion_si").checked) {
        let quePet = document.getElementById("que_peticion").value || "no especificada";
        let fechaPet = document.getElementById("fecha_peticion").value || "sin fecha";
        let tieneEv = document.getElementById("tiene_evidencia").checked;
        let detalleEv = tieneEv ? `y cuenta con evidencia física (${document.getElementById("que_evidencia").value || "documentos por verificar"})` : "pero no cuenta con evidencia física en este momento";
        notaPeticion = `Previamente se inició una petición de inmigración tipo ${quePet} en la fecha ${fechaPet}, ${detalleEv}.`;
    }

    // --- REDACCIÓN NATURAL: SECCIÓN 2: DETENCIONES ---
    let notaDetenciones = "No reporta detenciones por parte de las autoridades de migración.";
    if (document.getElementById("detenciones_si").checked) {
        let tiempoDet = document.getElementById("tiempo_detencion").value || "no especificado";
        let fechaDet = document.getElementById("fecha_detencion").value || "sin fecha exacta";
        let ordenDep = document.getElementById("orden_dep_si").checked;
        let detalleOrden = ordenDep ? `, derivando en una orden de deportación emitida el ${document.getElementById("fecha_deportacion_orden").value || "sin fecha registrada"}` : ", y no se le emitió ninguna orden de deportación";
        notaDetenciones = `El cliente fue detenido por migración aproximadamente el ${fechaDet} por un lapso de ${tiempoDet}${detalleOrden}.`;
    }

    // --- REDACCIÓN NATURAL: SECCIÓN 3: FAMILIA CIUDADANA ---
    let notaFamiliaCiu = "No menciona tener familiares directos con ciudadanía estadounidense.";
    if (document.getElementById("fam_ciu_si").checked) {
        let seleccionadosCiu = [];
        document.querySelectorAll(".check-familiar-ciu:checked").forEach(cb => seleccionadosCiu.push(cb.value));
        let parientes = seleccionadosCiu.length > 0 ? seleccionadosCiu.join(", ") : "familiares directos";
        
        let subDetalles = "";
        if (document.getElementById("fam_ciu_hijos").checked) {
            let edadH = document.getElementById("hijos_ciu_edad").value || "no especificada";
            let milH = document.getElementById("hijos_ciu_ejercito").checked ? "sí han estado en el ejército" : "no tienen historial militar";
            let tieneMed = document.getElementById("med_ciu_si").checked;
            let medH = tieneMed ? `, confirmando un diagnóstico de: ${document.getElementById("diagnostico_ciu").value || "no detallado"}` : ", sin complicaciones médicas ni espectro autista";
            subDetalles = ` Específicamente sobre los hijos ciudadanos, reporta que tienen ${edadH} de edad, ${milH}${medH}.`;
        }
        notaFamiliaCiu = `Tiene familiares ciudadanos estadounidenses, incluyendo: ${parientes}.${subDetalles}`;
    } else {
        let comentarioCiu = document.getElementById("comentarios_fam_ciu").value.trim();
        if (comentarioCiu) notaFamiliaCiu = `No tiene familiares ciudadanos directos, pero menciona parientes lejanos: ${comentarioCiu}.`;
    }

    // --- REDACCIÓN NATURAL: SECCIÓN 4: FAMILIA RESIDENTE ---
    let notaFamiliaRes = "No menciona tener familiares directos con residencia legal permanente.";
    if (document.getElementById("fam_res_si").checked) {
        let seleccionadosRes = [];
        document.querySelectorAll(".check-familiar-res:checked").forEach(cb => seleccionadosRes.push(cb.value));
        let parientesRes = seleccionadosRes.length > 0 ? seleccionadosRes.join(", ") : "familiares directos";
        
        let subDetallesRes = "";
        if (document.getElementById("fam_res_hijos").checked) {
            let edadH = document.getElementById("hijos_res_edad").value || "no especificada";
            let milH = document.getElementById("hijos_res_ejercito").checked ? "sí cuentan con historial militar" : "no tienen historial militar";
            let tieneMed = document.getElementById("med_res_si").checked;
            let medH = tieneMed ? `, confirmando un diagnóstico de: ${document.getElementById("diagnostico_res").value || "no detallado"}` : ", sin complicaciones médicas ni espectro autista";
            subDetallesRes = ` En el caso de los hijos residentes, tienen ${edadH} de edad, ${milH}${medH}.`;
        }
        notaFamiliaRes = `Tiene familiares con residencia legal permanente, incluyendo: ${parientesRes}.${subDetallesRes}`;
    } else {
        let comentarioRes = document.getElementById("comentarios_fam_res").value.trim();
        if (comentarioRes) notaFamiliaRes = `No tiene familiares residentes directos, pero comenta lo siguiente: ${comentarioRes}.`;
    }

    // --- REDACCIÓN NATURAL: SECCIÓN 5: CORTES DE MIGRACIÓN ---
    let notaCortes = "Actualmente no tiene próximas cortes de migración programadas.";
    if (document.getElementById("cortes_si").checked) {
        let fechaCorteProxima = document.getElementById("fecha_corte_proxima").value || "sin fecha";
        let comentariosCorteSi = document.getElementById("comentarios_corte_si").value.trim() || "sin comentarios adicionales";
        notaCortes = `El cliente presenta una corte de migración próxima programada para el ${fechaCorteProxima} (${comentariosCorteSi}).`;
    } else {
        let haPerdidoCorte = document.getElementById("perdido_si").checked;
        let haRevisadoDeportacion = document.getElementById("rev_dep_si").checked;
        
        if (haPerdidoCorte || haRevisadoDeportacion) {
            let detallePerdido = haPerdidoCorte ? `Admite haber perdido una corte anteriormente alrededor del ${document.getElementById("fecha_corte_perdida").value || "sin fecha exacta"}. ` : "No reporta cortes perdidas en el pasado. ";
            let detalleOrden = haRevisadoDeportacion ? `Al verificar su estatus, confirma una orden de deportación registrada el ${document.getElementById("fecha_orden_corte_input").value || "sin fecha"}.` : "No tiene conocimiento de que se le haya abierto una orden de deportación por ausencia.";
            notaCortes = `No tiene próximas cortes. ${detallePerdido}${detalleOrden}`;
        } else {
            notaCortes = "No tiene próximas cortes programadas ni historial de cortes perdidas o el estatus de orden de deportación bajo este concepto.";
        }
    }
    // --- CONSTRUCCIÓN FINAL DEL HISTORIAL FLUIDO ---
    let tagCita = `${horaFormateada}/IMMI/${nombreCompleto.toUpperCase()}/${telefono}/FERNANDO PADILLA`;
    let mensajeSms = `SomosDienerLaw Hola ${primerNombre} soy F. Padilla confirmando tu cita del ${fechaCitaFormateada} a las ${horaFormateada} en oficina ${direccionExacta} Manda STOP para darte de baja`;

    let historialCompleto = `HISTORIAL DE CONVERSACIÓN DE LA LLAMADA
----------------------------------------
CLIENTE: ${nombreCompleto.toUpperCase()}
TELÉFONO: ${telefono}
FECHA DE NACIMIENTO: ${fechaNacimiento || "No registrada"}
ESTADO CIVIL: ${estadoCivil.toUpperCase() || "No registrado"}
FECHA DE ENTRADA A EE.UU: ${fechaEntrada || "No registrada"}

DETALLES DEL DIAGNÓSTICO MIGRATORIO:
- ${notaPeticion}
- ${notaDetenciones}
- ${notaFamiliaCiu}
- ${notaFamiliaRes}
- ${notaCortes}

JUSTIFICACIÓN DE AGENDAMIENTO: ${justificacionFecha || "Cita programada dentro del rango estándar."}

Confirmación de Cita: Sr/a ${nombreCompleto.toUpperCase()}, le esperamos en la oficina de ${oficinaSeleccionada} el ${fechaCitaFormateada} a las ${horaFormateada}.`;

    // Línea tabulada limpia para pegar desde la Columna A en Excel/Sheets
    let filaExcelFormateada = `${fechaLlamadaAutomatica}\t${fechaCitaFormateada}\t${horaFormateada}\tNUEVO\t\t${telefono}\t${oficinaSeleccionada}\tFERNANDO PADILLA\t${ticketId}\t${zohoUrl}`;

    // INYECCIÓN DE RESULTADOS A LA PANTALLA
    document.getElementById("resultadoTag").innerText = tagCita;
    document.getElementById("resultadoSms").innerText = mensajeSms;
    document.getElementById("resultadoHistorial").value = historialCompleto;
    document.getElementById("resultadoFilaExcel").value = filaExcelFormateada;

    // CONTADOR DE CARACTERES EN TIEMPO REAL PARA EL SMS SHORT
    let totalCaracteres = mensajeSms.length;
    let contenedorContador = document.getElementById("contadorCaracteres");
    contenedorContador.innerText = totalCaracteres;

    if (totalCaracteres > 160) {
        contenedorContador.style.color = "#e53e3e"; // Rojo si excede
    } else {
        contenedorContador.style.color = "#2f855a"; // Verde a salvo
    }

    setTimeout(function() {
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
    
    // Ocultar todas las secciones condicionales de golpe al resetear
    document.getElementById("bloque_justificacion_fecha").style.display = "none";
    document.getElementById("bloque_peticion_extra").style.display = "none";
    document.getElementById("bloque_detalle_evidencia").style.display = "none";
    document.getElementById("bloque_detenciones_extra").style.display = "none";
    document.getElementById("bloque_fecha_deportacion").style.display = "none";
    document.getElementById("bloque_fam_ciu_si").style.display = "none";
    document.getElementById("bloque_hijos_ciu_detalles").style.display = "none";
    document.getElementById("bloque_diag_ciu").style.display = "none";
    document.getElementById("bloque_fam_ciu_no_comentarios").style.display = "none";
    document.getElementById("bloque_fam_res_si").style.display = "none";
    document.getElementById("bloque_hijos_res_detalles").style.display = "none";
    document.getElementById("bloque_diag_res").style.display = "none";
    document.getElementById("bloque_fam_res_no_comentarios").style.display = "none";
    document.getElementById("bloque_cortes_si").style.display = "none";
    document.getElementById("bloque_cortes_no").style.display = "none";
    document.getElementById("bloque_fecha_perdido").style.display = "none";
    document.getElementById("bloque_fecha_orden_corte").style.display = "none";

    // Limpiar textos de resultados
    document.getElementById("resultadoTag").innerText = "";
    document.getElementById("resultadoSms").innerText = "";
    document.getElementById("resultadoHistorial").value = "";
    document.getElementById("resultadoFilaExcel").value = "";
    document.getElementById("contadorCaracteres").innerText = "0";
    document.getElementById("contadorCaracteres").style.color = "#4a5568";
    alert("Formulario limpio y apartados ocultados con éxito.");
});


