// === CEREBRO DE BASE DE DATOS PORTÁTIL (LECTOR DE OFICINAS JSON) ===
let baseDatosOficinas = [];

// Descargar la base de datos automáticamente desde tu archivo oficinas.json
fetch("oficinas.json")
    .then(respuesta => respuesta.json())
    .then(datos => {
        baseDatosOficinas = datos;
        console.log("¡✅ Base de datos de Diener Law cargada con éxito!");
    })
    .catch(error => {
        console.log("Aviso local: Cargando respaldo de emergencia en memoria.");
        // Respaldo instantáneo por si el navegador bloquea el archivo localmente por seguridad
        baseDatosOficinas = [
            { "nombre": "Phoenix", "direccion": "3223 W Indian School Rd suite 110, Phoenix, AZ 85017" },
            { "nombre": "Santa Ana", "direccion": "1710 17th St D, Santa Ana, CA 92705" },
            { "nombre": "Fontana", "direccion": "16184 Foothill Blvd Ste I, Fontana, CA 92335" },
            { "nombre": "Lynwood", "direccion": "3837 Martin Luther King Jr Blvd St 101, Lynwood, CA 90262" },
            { "nombre": "Dallas", "direccion": "3420 W Illinois Ave Ste 700, Dallas, TX 75211" },
            { "nombre": "West Houston", "direccion": "5720 Bellaire Blvd Ste C1, Houston, TX 77081" },
            { "nombre": "South Houston", "direccion": "1611 Spencer Hwy Ste F, South Houston, TX 77587" },
            { "nombre": "Charlotte", "direccion": "3116 Milton Rd A, Charlotte, NC 28215" },
            { "nombre": "Greensboro", "direccion": "412 W Market St, Greensboro, NC 27401" },
            { "nombre": "Raleigh", "direccion": "421 Chapanoke Rd #161, Raleigh, NC 27603" },
            { "nombre": "Durham", "direccion": "2000 Avondale Dr W, Durham, NC 27704" },
            { "nombre": "Mount Olive", "direccion": "302 North Carolina Highway 55 W Ste 100, Mt Olive, NC 28365" },
            { "nombre": "Greenville", "direccion": "308 Greenville Blvd SE # A, Greenville, NC 27858" },
            { "nombre": "Wilmington", "direccion": "7627 Market St Suite 101, Wilmington, NC 28411" },
            { "nombre": "Virtual", "direccion": "Atención Telefónica / Videollamada" }
        ];
    });


// === 1. CONTROLADORES VISUALES DIRECTOS (APERTURA INSTANTÁNEA) ===

// LÓGICA DE FECHAS: Alerta al 3er día posterior de forma automática
function verificarFechaCita() {
    let fechaElegidaString = document.getElementById("fechaCita").value;
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
}

// === AQUÍ VA EXACTAMENTE EL CÓDIGO DE LA PAREJA ===
function verificarEstatusPareja() {
    let valorElegido = document.getElementById("estatusPareja").value;
    let bloqueExtra = document.getElementById("bloque_detalles_pareja_extra");

    if (valorElegido === "Ciudadano/a Estadounidense" || valorElegido === "Residente Legal Permanente") {
        bloqueExtra.style.display = "block";
    } else {
        bloqueExtra.style.display = "none";
        document.getElementById("fechaMatrimonio").value = "";
        document.getElementById("comentariosPareja").value = "";
    }
}


// Sección 1: Peticiones Anterior
function mostrarPeticionExtra() {
    document.getElementById("bloque_peticion_extra").style.display = "block";
}
function ocultarPeticionExtra() {
    document.getElementById("bloque_peticion_extra").style.display = "none";
    document.getElementById("que_peticion").value = "";
    document.getElementById("fecha_peticion").value = "";
    document.getElementById("tiene_evidencia").checked = false;
    document.getElementById("bloque_detalle_evidencia").style.display = "none";
    document.getElementById("que_evidencia").value = "";
}
function alternarEvidenciaDetalle() {
    let checkbox = document.getElementById("tiene_evidencia");
    document.getElementById("bloque_detalle_evidencia").style.display = checkbox.checked ? "block" : "none";
    if (!checkbox.checked) document.getElementById("que_evidencia").value = "";
}

// Sección 2: Detenciones
function mostrarDetencionesExtra() {
    document.getElementById("bloque_detenciones_extra").style.display = "block";
}
function ocultarDetencionesExtra() {
    document.getElementById("bloque_detenciones_extra").style.display = "none";
    document.getElementById("tiempo_detencion").value = "";
    document.getElementById("fecha_detencion").value = "";
    document.getElementById("orden_dep_no").checked = true;
    document.getElementById("bloque_fecha_deportacion").style.display = "none";
    document.getElementById("fecha_deportacion_orden").value = "";
}
function mostrarFechaDeportacionExtra() {
    document.getElementById("bloque_fecha_deportacion").style.display = "block";
}
function ocultarFechaDeportacionExtra() {
    document.getElementById("bloque_fecha_deportacion").style.display = "none";
    document.getElementById("fecha_deportacion_orden").value = "";
}

// Sección 3: Familiares Ciudadanos
function mostrarFamiliaCiuExtra() {
    document.getElementById("bloque_fam_ciu_si").style.display = "block";
    document.getElementById("bloque_fam_ciu_no_comentarios").style.display = "none";
    document.getElementById("comentarios_fam_ciu").value = "";
}
function ocultarFamiliaCiuExtra() {
    document.getElementById("bloque_fam_ciu_si").style.display = "none";
    document.getElementById("bloque_fam_ciu_no_comentarios").style.display = "block";
    document.getElementById("fam_ciu_hijos").checked = false;
    document.getElementById("bloque_hijos_ciu_detalles").style.display = "none";
    document.getElementById("hijos_ciu_edad").value = "";
    document.getElementById("hijos_ciu_ejercito").checked = false;
    document.getElementById("med_ciu_no").checked = true;
    document.getElementById("bloque_diag_ciu").style.display = "none";
    document.getElementById("diagnostico_ciu").value = "";
    let checks = document.querySelectorAll(".check-familiar-ciu");
    checks.forEach(cb => cb.checked = false);
}
function alternarHijosCiuDetalles() {
    let checkHijos = document.getElementById("fam_ciu_hijos");
    document.getElementById("bloque_hijos_ciu_detalles").style.display = checkHijos.checked ? "block" : "none";
    if (!checkHijos.checked) {
        document.getElementById("hijos_ciu_edad").value = "";
        document.getElementById("hijos_ciu_ejercito").checked = false;
        document.getElementById("med_ciu_no").checked = true;
        document.getElementById("bloque_diag_ciu").style.display = "none";
        document.getElementById("diagnostico_ciu").value = "";
    }
}
function mostrarDiagCiuExtra() {
    document.getElementById("bloque_diag_ciu").style.display = "block";
}
function ocultarDiagCiuExtra() {
    document.getElementById("bloque_diag_ciu").style.display = "none";
    document.getElementById("diagnostico_ciu").value = "";
}
// Sección 4: Familiares Residentes
function mostrarFamiliaResExtra() {
    document.getElementById("bloque_fam_res_si").style.display = "block";
    document.getElementById("bloque_fam_res_no_comentarios").style.display = "none";
    document.getElementById("comentarios_fam_res").value = "";
}
function ocultarFamiliaResExtra() {
    document.getElementById("bloque_fam_res_si").style.display = "none";
    document.getElementById("bloque_fam_res_no_comentarios").style.display = "block";
    document.getElementById("fam_res_hijos").checked = false;
    document.getElementById("bloque_hijos_res_detalles").style.display = "none";
    document.getElementById("hijos_res_edad").value = "";
    document.getElementById("hijos_res_ejercito").checked = false;
    document.getElementById("med_res_no").checked = true;
    document.getElementById("bloque_diag_res").style.display = "none";
    document.getElementById("diagnostico_res").value = "";
    let checks = document.querySelectorAll(".check-familiar-res");
    checks.forEach(cb => cb.checked = false);
}
function alternarHijosResDetalles() {
    let checkHijos = document.getElementById("fam_res_hijos");
    document.getElementById("bloque_hijos_res_detalles").style.display = checkHijos.checked ? "block" : "none";
    if (!checkHijos.checked) {
        document.getElementById("hijos_res_edad").value = "";
        document.getElementById("hijos_res_ejercito").checked = false;
        document.getElementById("med_res_no").checked = true;
        document.getElementById("bloque_diag_res").style.display = "none";
        document.getElementById("diagnostico_res").value = "";
    }
}
function mostrarDiagResExtra() {
    document.getElementById("bloque_diag_res").style.display = "block";
}
function ocultarDiagResExtra() {
    document.getElementById("bloque_diag_res").style.display = "none";
    document.getElementById("diagnostico_res").value = "";
}

// Sección 5: Cortes de Migración
function mostrarCortesExtra() {
    document.getElementById("bloque_cortes_si").style.display = "block";
    document.getElementById("bloque_cortes_no").style.display = "none";
    document.getElementById("fecha_corte_proxima").value = "";
    document.getElementById("comentarios_corte_si").value = "";
}
function ocultarCortesExtra() {
    document.getElementById("bloque_cortes_si").style.display = "none";
    document.getElementById("bloque_cortes_no").style.display = "block";
    document.getElementById("perdido_no").checked = true;
    document.getElementById("bloque_fecha_perdido").style.display = "none";
    document.getElementById("comentarios_perdido_nota").value = "";
    document.getElementById("rev_dep_no").checked = true;
    document.getElementById("bloque_fecha_orden_corte").style.display = "none";
    document.getElementById("fecha_orden_corte_input").value = "";
}
function mostrarFechaPerdidoExtra() {
    document.getElementById("bloque_fecha_perdido").style.display = "block";
}
function ocultarFechaPerdidoExtra() {
    document.getElementById("bloque_fecha_perdido").style.display = "none";
    document.getElementById("comentarios_perdido_nota").value = "";
}
function mostrarFechaOrdenCorteExtra() {
    document.getElementById("bloque_fecha_orden_corte").style.display = "block";
}
function ocultarFechaOrdenCorteExtra() {
    document.getElementById("bloque_fecha_orden_corte").style.display = "none";
    document.getElementById("fecha_orden_corte_input").value = "";
}

// === 2. PROCESAR MENSAJES AUTOMÁTICOS (MOTOR DE CÁLCULO GENERAL) ===
document.getElementById("btnProcesar").addEventListener("click", function() {
    let boton = this;
    
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
    let estatusPareja = document.getElementById("estatusPareja") ? document.getElementById("estatusPareja").value : "";

    let fechaMatrimonioInput = document.getElementById("fechaMatrimonio") ? document.getElementById("fechaMatrimonio").value : "";
    let comentariosPareja = document.getElementById("comentariosPareja") ? document.getElementById("comentariosPareja").value.trim() : "";

    // Convertidor estricto a formato americano (MM/DD/YYYY) para la fecha de matrimonio
    let fechaMatrimonioFormateada = "sin fecha registrada";
    if (fechaMatrimonioInput && fechaMatrimonioInput.includes("-")) {
        let partesM = fechaMatrimonioInput.split("-");
        fechaMatrimonioFormateada = `${partesM[1]}/${partesM[2]}/${partesM[0]}`; // Mes/Día/Año
    }


    let justificacionFecha = document.getElementById("justificacionFecha") ? document.getElementById("justificacionFecha").value.trim() : "";

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
    boton.innerHTML = `Procesando Mensajes...`;

    let ahoraMismo = new Date();
    let fechaLlamadaAutomatica = `${String(ahoraMismo.getMonth() + 1).padStart(2, '0')}/${String(ahoraMismo.getDate()).padStart(2, '0')}/${ahoraMismo.getFullYear()}`;

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

    // === ALGORITMO DE CONVERSIÓN ESTRICTO A FORMATO AMERICANO (MM/DD/YYYY) ===
    let fechaCitaFormateada = "Sin fecha";
    if (fechaCitaInput && fechaCitaInput.includes("-")) {
        let partes = fechaCitaInput.split("-");
        fechaCitaFormateada = `${partes[1]}/${partes[2]}/${partes[0]}`; 
    }

    let fechaNacimientoFormateada = "No registrada";
    if (fechaNacimiento && fechaNacimiento.includes("-")) {
        let partesNac = fechaNacimiento.split("-");
        fechaNacimientoFormateada = `${partesNac[1]}/${partesNac[2]}/${partesNac[0]}`; 
    }

    let fechaEntradaFormateada = "No registrada";
    if (fechaEntrada && fechaEntrada.includes("-")) {
        let partesEnt = fechaEntrada.split("-");
        fechaEntradaFormateada = `${partesEnt[1]}/${partesEnt[2]}/${partesEnt[0]}`; 
    }

    // --- ALGORITMO DE REDACCIÓN NATURAL PARA NOTAS ---
    let notaPeticion = "Él/Ella no registra ninguna petición de inmigración anterior en su historial.";
    if (document.getElementById("peticion_si").checked) {
        let quePet = document.getElementById("que_peticion").value || "no especificada";
        
        let fechaPetInput = document.getElementById("fecha_peticion").value;
        let fechaPetFormateada = "sin fecha";
        if (fechaPetInput && fechaPetInput.includes("-")) {
            let partesP = fechaPetInput.split("-");
            fechaPetFormateada = `${partesP[1]}/${partesP[2]}/${partesP[0]}`; 
        }

        let tieneEv = document.getElementById("tiene_evidencia").checked;
        let detalleEv = tieneEv ? `, y cuenta con evidencia física (${document.getElementById("que_evidencia").value || "documentos por verificar"})` : " pero aclara que no tiene documentos o evidencia física en este momento";
        
        notaPeticion = `Menciona que previamente se inició una petición de inmigración tipo ${quePet} en la fecha ${fechaPetFormateada}${detalleEv}.`;
    }
    let notaDetenciones = "No reporta haber tenido detenciones por parte de las autoridades de migración.";
    if (document.getElementById("detenciones_si").checked) {
        let tiempoDet = document.getElementById("tiempo_detencion").value || "un lapso no especificado";
        let fechaDet = document.getElementById("fecha_detencion").value || "sin fecha exacta";
        if (fechaDet && fechaDet.includes("-")) {
            let partesD = fechaDet.split("-");
            fechaDet = `${partesD[1]}/${partesD[2]}/${partesD[0]}`;
        }
        let ordenDep = document.getElementById("orden_dep_si").checked;
        let detalleOrden = ordenDep ? `, lo cual derivó en una orden de deportación emitida el ${document.getElementById("fecha_deportacion_orden").value || "sin fecha registrada"}` : ", y confirma que no se le emitió ninguna orden de deportación";
        notaDetenciones = `Informa que fue detenido por migración aproximadamente el ${fechaDet} por un lapso de ${tiempoDet}${detalleOrden}.`;
    }

    let notaFamiliaCiu = "No menciona tener familiares directos con ciudadanía estadounidense.";
    if (document.getElementById("fam_ciu_si").checked) {
        let seleccionadosCiu = [];
        document.querySelectorAll(".check-familiar-ciu:checked").forEach(cb => seleccionadosCiu.push(cb.value));
        let parientes = seleccionadosCiu.length > 0 ? seleccionadosCiu.join(", ") : "familiares directos";
        let subDetalles = "";
        if (document.getElementById("fam_ciu_hijos").checked) {
            let edadH = document.getElementById("hijos_ciu_edad").value || "no especificada";
            let milH = document.getElementById("hijos_ciu_ejercito").checked ? "quienes sí han estado en el ejército" : "quienes no tienen historial militar";
            let tieneMed = document.getElementById("med_ciu_si").checked;
            let medH = tieneMed ? `, confirmando un diagnóstico o tratamiento médico de: ${document.getElementById("diagnostico_ciu").value || "no detallado"}` : ", sin complicaciones médicas ni espectro autista";
            subDetalles = ` Explica detalladamente sobre sus hijos ciudadanos que tienen ${edadH} de edad, ${milH}${medH}.`;
        }
        notaFamiliaCiu = `Comenta que tiene familiares ciudadanos estadounidenses, incluyendo a: ${parientes}.${subDetalles}`;
    } else {
        let comentarioCiu = document.getElementById("comentarios_fam_ciu").value.trim();
        if (comentarioCiu) notaFamiliaCiu = `Indica que no tiene familiares ciudadanos directos, pero menciona la siguiente situación de parientes lejanos: ${comentarioCiu}.`;
    }

    let notaFamiliaRes = "No menciona tener familiares directos con residencia legal permanente.";
    if (document.getElementById("fam_res_si").checked) {
        let seleccionadosRes = [];
        document.querySelectorAll(".check-familiar-res:checked").forEach(cb => seleccionadosRes.push(cb.value));
        let parientesRes = seleccionadosRes.length > 0 ? seleccionadosRes.join(", ") : "familiares directos";
        let subDetallesRes = "";
        if (document.getElementById("fam_res_hijos").checked) {
            let edadH = document.getElementById("hijos_res_edad").value || "no especificada";
            let tieneMed = document.getElementById("med_res_si").checked;
            let medH = tieneMed ? `, confirmando un diagnóstico o tratamiento médico de: ${document.getElementById("diagnostico_res").value || "no detallado"}` : ", sin complicaciones médicas ni espectro autista";
            subDetallesRes = ` En el caso de sus hijos residentes, detalla que tienen ${edadH} de edad${medH}.`;
        }
        notaFamiliaRes = `Manifiesta que tiene familiares con residencia legal permanente, incluyendo a: ${parientesRes}.${subDetallesRes}`;
    } else {
        let comentarioRes = document.getElementById("comentarios_fam_res").value.trim();
        if (comentarioRes) notaFamiliaRes = `Señala que no tiene familiares residentes directos, pero comenta lo siguiente al respecto: ${comentarioRes}.`;
    }

    let notaCortes = "Actualmente confirma que no tiene próximas cortes de migración programadas.";
    if (document.getElementById("cortes_si").checked) {
        let fechaCorteInput = document.getElementById("fecha_corte_proxima").value;
        let fechaCorteFormateadaUsa = "sin fecha";
        if (fechaCorteInput && fechaCorteInput.includes("-")) {
            let partesC = fechaCorteInput.split("-");
            fechaCorteFormateadaUsa = `${partesC[1]}/${partesC[2]}/${partesC[0]}`; 
        }
        let comentariosCorteSi = document.getElementById("comentarios_corte_si").value.trim();
        let detalleComentario = comentariosCorteSi ? ` (${comentariosCorteSi})` : "";
        notaCortes = `Refiere que presenta una corte de migración próxima programada para el ${fechaCorteFormateadaUsa}${detalleComentario}.`;
    } else {
        let haPerdidoCorte = document.getElementById("perdido_si").checked;
        let haRevisadoDeportacion = document.getElementById("rev_dep_si").checked;
        if (haPerdidoCorte || haRevisadoDeportacion) {
            let detallePerdido = haPerdidoCorte ? `Admite haber perdido una corte anteriormente debido a: ${document.getElementById("comentarios_perdido_nota").value || "razón no especificada"}. ` : "Aclara que no reporta cortes perdidas en el pasado. ";
            let detalleOrden = haRevisadoDeportacion ? `Al verificar su estatus, confirma una orden de deportación registrada bajo el concepto o detalles de: ${document.getElementById("fecha_orden_corte_input").value.trim() || "sin detalles específicos"}.` : "Expresa que no tiene conocimiento de que se le haya abierto una orden de deportación.";
            notaCortes = `Indica que no tiene próximas cortes. ${detallePerdido}${detalleOrden}`;
        } else {
            notaCortes = "Asegura que no tiene próximas cortes programadas ni historial de cortes perdidas o estatus de orden de deportación bajo este concepto.";
        }
    }

              // === CONSTRUCCIÓN FINAL DE TEXTOS AUTOMÁTICOS (CONEXIÓN CON BASE DE DATOS JSON) ===
    let partesNombre = nombreCompleto.split(" ");
    let primerNombre = partesNombre[0] || "Cliente";

    // Buscar la dirección física exacta de forma inteligente dentro de la base de datos JSON
    let oficinaEncontrada = baseDatosOficinas.find(o => o.nombre === oficinaSeleccionada);
    let direccionExacta = oficinaEncontrada ? oficinaEncontrada.direccion : "Dirección no encontrada";

    let tagCita = `${horaFormateada}/IMMI/${nombreCompleto.toUpperCase()}/${telefono}/FERNANDO PADILLA`;
    let mensajeSms = `SomosDienerLaw Hola ${primerNombre} soy F. Padilla confirmando tu cita del ${fechaCitaFormateada} a las ${horaFormateada} en oficina ${direccionExacta} Manda STOP para darte de baja`;

    // Redacción inteligente en tercera persona según el estatus legal elegido
    let detallePareja = "";
    if (estatusPareja === "Ciudadano/a Estadounidense" || estatusPareja === "Residente Legal Permanente") {
        let notaNota = comentariosPareja ? ` teniendo como observación que ${comentariosPareja}` : "";
        detallePareja = `, quien reporta estar en matrimonio con una persona de estatus ${estatusPareja} desde el ${fechaMatrimonioFormateada}${notaNota}`;
    } else if (estatusPareja === "Inmigrante (Sin estatus)") {
        detallePareja = `, mencionando que su pareja actual es inmigrante sin estatus legal en el país`;
    } else {
        detallePareja = " (sin registro de pareja o datos conyugales en la llamada)";
    }

    let historialCompleto = `NOTAS DEL HISTORIAL DE LA LLAMADA
----------------------------------------
PC: ${nombreCompleto.toUpperCase()}${detallePareja}
TELÉFONO: ${telefono}
FECHA DE NACIMIENTO: ${fechaNacimientoFormateada}
ESTADO CIVIL: ${estadoCivil.toUpperCase() || "No registrado"}
FECHA DE ENTRADA A EE.UU: ${fechaEntradaFormateada}

DETALLES DEL DIAGNÓSTICO MIGRATORIO:
- ${notaPeticion}
- ${notaDetenciones}
- ${notaFamiliaCiu}
- ${notaFamiliaRes}
- ${notaCortes}

JUSTIFICACIÓN DE AGENDAMIENTO: ${justificacionFecha || "Cita programada dentro del rango estándar."}`;

    let filaExcelFormateada = `${fechaLlamadaAutomatica}\t${fechaCitaFormateada}\t${horaFormateada}\tNUEVO\t\t${telefono}\t${oficinaSeleccionada}\tFERNANDO PADILLA\t${ticketId}\t${zohoUrl}`;

    // INYECCIÓN INSTANTÁNEA EN CASILLAS
    document.getElementById("resultadoTag").innerText = tagCita;
    document.getElementById("resultadoSms").innerText = mensajeSms;
    document.getElementById("resultadoHistorial").value = historialCompleto;
    document.getElementById("resultadoFilaExcel").value = filaExcelFormateada;

    // CONTROL DEL CONTADOR EN TIEMPO REAL
    let totalCaracteres = mensajeSms.length;
    let contenedorContador = document.getElementById("contadorCharacters") || document.getElementById("contadorCaracteres");
    if (contenedorContador) {
        contenedorContador.innerText = totalCaracteres;
        contenedorContador.style.color = (totalCaracteres > 160) ? "#e53e3e" : "#2f855a";
    }

    setTimeout(function() {
        boton.disabled = false;
        boton.innerHTML = "Procesar Mensajes Automáticos";
    }, 50);
});


// === 3. MOTOR UNIVERSAL DE COPIADO ===
function activarBotonCopiado(idBotón, idElementoTexto, idSpanAlerta) {
    document.getElementById(idBotón).addEventListener("click", function() {
        let element = document.getElementById(idElementoTexto);
        let textoACopiar = element.value || element.innerText;
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

// === 4. BOTÓN LIMPIAR TODO (RESET COMPLETO DE CORTINAS) ===
document.getElementById("btnLimpiar").addEventListener("click", function() {
    document.getElementById("formularioMigracion").reset();
    
    // Ocultar absolutamente todas las secciones condicionales al resetear
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
    document.getElementById("bloque_detalles_pareja_extra").style.display = "none";


    // Limpiar textos de resultados
    document.getElementById("resultadoTag").innerText = "";
    document.getElementById("resultadoSms").innerText = "";
    document.getElementById("resultadoHistorial").value = "";
    document.getElementById("resultadoFilaExcel").value = "";
    document.getElementById("contadorCaracteres").innerText = "0";
    document.getElementById("contadorCaracteres").style.color = "#4a5568";

    alert("Formulario limpio y apartados ocultados con éxito.");
});
