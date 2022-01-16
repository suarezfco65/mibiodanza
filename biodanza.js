var script = document.createElement("script");  // create a script DOM node
script.src = "amoBiodanzaAudio.js";  // set its src to the provided URL
document.head.appendChild(script);

const procesaSesion = {
    carpeta : 'https://suarezfco65.github.io/amobiodanza/',
    tiempoTotal: 0,
    audio: function (codigo)    {
        return catalogoMusica[codigo].audio
    },
    crearAudio : function (codigo, contador)    {
        const omusica = catalogoMusica[codigo];
        const oaudio = document.createElement("audio");
        oaudio.setAttribute("is","amo-biodanza-audio");
        for (var i=0; i<catalogoMusica[codigo].archivos.length; i++)    {
            const osource = document.createElement("source");
            osource.setAttribute('src',procesaSesion.carpeta+omusica.archivos[i].archivo);
            osource.setAttribute('type',omusica.archivos[i].tipo);
            oaudio.appendChild(osource);
        }
        oaudio['idDuracion'] = 'bd-id-duracion-'+contador; 
        oaudio.ondurationchange = function() {
            var segs = Math.round(this.duration);
            procesaSesion.tiempoTotal += segs + 60;
            const mins = Math.trunc(segs / 60);
            segs = segs - (mins * 60);
            var minutos = Math.trunc(procesaSesion.tiempoTotal / 60);
            const segundos = procesaSesion.tiempoTotal - minutos * 60;
            const horas = Math.trunc(minutos/60);
            minutos = minutos - horas * 60;
            document.getElementById(oaudio['idDuracion']).innerHTML = mins+':'+(segs < 10 ? ("0"+segs) : segs);
            document.getElementById("bd-id-tiempoTotal").innerHTML = horas+":"+(minutos < 10 ? ("0"+ minutos) : minutos)+":"+(segundos < 10 ? ("0"+segundos) : segundos);
          };
        return oaudio
    },
    agregarAudio : function(codigo, contador) {
        if (catalogoMusica[codigo].audio == null)    {
            catalogoMusica[codigo].audio = this.crearAudio(codigo, contador);
            this.miLista.push(codigo);
        }
    },
    miLista: [],
    play : function (id,codigo)    {
        if (this.sonando != null)    {
            catalogoMusica[this.sonando].audio.controls=false;
            catalogoMusica[this.sonando].audio.pause();
            catalogoMusica[this.sonando].audio.currentTime=0;
            document.getElementById(this.idActual).style.backgroundColor = this.bgcolor;
        }
        this.sonando = codigo;
        this.idActual = id;
        this.bgcolor = document.getElementById(this.idActual).style.backgroundColor;
        catalogoMusica[this.sonando].audio.controls=true;
        catalogoMusica[this.sonando].audio.play()
        document.getElementById(this.idActual).style.backgroundColor = "#D0D0FF";
    },
    stop : function ()  {
        if (this.sonando != null)    {
            catalogoMusica[this.sonando].audio.controls=false;
            catalogoMusica[this.sonando].audio.pause();
            catalogoMusica[this.sonando].audio.currentTime=0;
            document.getElementById(this.idActual).style.backgroundColor = this.bgcolor;
            this.sonando=null
            this.idActual=null
            this.bgcolor=null
        }
    },
    prueba : false,
    pruebaControlada : function ()  {
        this.stop();
        obutton = document.getElementById('bd-id-prueba-Iniciar');
        if (this.prueba) {
            for (var i=0; i<this.miLista.length; i++)   {
                catalogoMusica[this.miLista[i]].audio.ontimeupdate   =   null;
                catalogoMusica[this.miLista[i]].audio.onended = null;
                document.getElementById('bd-play-'+(i+1)).disabled =false;
            }
            this.prueba=false;
            obutton.innerHTML = 'Iniciar';
            obutton.setAttribute('class','btn btn-success');
            document.getElementById('bd-id-ejecutar-Iniciar').disabled =false;
            document.getElementById('bd-id-playAll').disabled = false;
            return
        }
        document.getElementById('bd-id-ejecutar-Iniciar').disabled =true;
        document.getElementById('bd-id-playAll').disabled = true;
        for (var i=0; i<this.miLista.length; i++)   document.getElementById('bd-play-'+(i+1)).disabled =true;
        this.prueba     = true;
        obutton.innerHTML   = 'Detener';
        obutton.setAttribute('class','btn btn-danger');
        const oDesde    = document.getElementById('bd-id-prueba-desde');
        const oHasta    = document.getElementById('bd-id-prueba-hasta');
        var prueba      = new Object();
        prueba.desde    = Number(oDesde.options[oDesde.selectedIndex].value);
        prueba.hasta    = Number(oHasta.options[oHasta.selectedIndex].value);
        prueba.inicio   = Number(document.getElementById('bd-id-prueba-durInicio').value);
        prueba.medio    = Number(document.getElementById('bd-id-prueba-durMedio').value);
        prueba.final    = Number(document.getElementById('bd-id-prueba-durFinal').value);
        prueba.pos      = prueba.desde;
        for (var i  = prueba.pos; i<prueba.hasta; i++) {
            catalogoMusica[procesaSesion.miLista[i-1]].audio.ontimeupdate   =   function()    {
                var tm  = (this.duration/2) - (prueba.medio/2) ;
                var ct  = this.currentTime;
                if ((ct > prueba.inicio) && (ct < tm) )  {
                    this.currentTime = tm;
                } else    if ((ct > (tm + prueba.medio)) && (ct < (this.duration - prueba.final)))  {
                    this.currentTime = this.duration - prueba.final;
                }
            };
            catalogoMusica[this.miLista[i-1]].audio.onended = function() {
                prueba.pos++;
                if (prueba.pos > prueba.hasta) {
                    procesaSesion.pruebaControlada();
                }   else    {
                    procesaSesion.play('bd-id-danza-'+prueba.pos, procesaSesion.miLista[prueba.pos-1]);
                }
            };
        }
        this.play('bd-id-danza-'+prueba.pos, this.miLista[prueba.pos-1]);
    },
    ejecucion: false,
    ejecucionControlada:    function()  {
        this.stop();
        obutton = document.getElementById('bd-id-ejecutar-Iniciar');
        if (this.ejecutar) {
            for (var i  = 0; i<this.miLista.length; i++)   {
                catalogoMusica[this.miLista[i]].audio.onended = null;
                document.getElementById('bd-play-'+(i+1)).disabled =false;
            }
            this.ejecutar       = false;
            obutton.innerHTML   = 'Iniciar';
            obutton.setAttribute('class', 'btn btn-success');
            document.getElementById('bd-id-prueba-Iniciar').disabled    = false;
            document.getElementById('bd-id-playAll').disabled = false;
            return
        }
        document.getElementById('bd-id-prueba-Iniciar').disabled =true;
        document.getElementById('bd-id-playAll').disabled = true;
        for (var i  = 0; i < this.miLista.length; i++)  document.getElementById('bd-play-'+(i+1)).disabled = true;
        this.ejecutar       = true;
        obutton.innerHTML   = 'Detener';
        obutton.setAttribute('class', 'btn btn-danger');
        const oDesde    = document.getElementById('bd-id-ejecutar-desde');
        const oHasta    = document.getElementById('bd-id-ejecutar-hasta');
        var ejecucion   = new Object();
        ejecucion.desde = Number(oDesde.options[oDesde.selectedIndex].value);
        ejecucion.hasta = Number(oHasta.options[oHasta.selectedIndex].value);
        ejecucion.pos   = ejecucion.desde;
        for (var i  = ejecucion.pos; i < ejecucion.hasta; i++) {
            const oBt = document.getElementById('bd-tg-consigna-'+(i));
            if (oBt.innerHTML == '❥')
                bd_toggleCollapse(oBt, 'bd-consigna-'+(i));
            console.log(this.miLista[i-1]);
            catalogoMusica[this.miLista[i-1]].audio.onended = function() {
                ejecucion.pos++;
                if (ejecucion.pos > ejecucion.hasta) {
                    procesaSesion.ejecucionControlada();
                }   else    {
                    ejecucion.play();
                }
            };
        }

        ejecucion.play = function ()  {
            var obt;
            /*
            for (var i = 0; i < procesaSesion.miLista.length; i++) {
                oBt = document.getElementById('bd-tg-consigna-'+(i+1));
                if (ejecucion.pos == (i+1)) {
                    if (oBt.innerHTML == '❥')
                        bd_toggleCollapse(oBt, 'bd-consigna-'+(i+1))
                } else {
                    if (oBt.innerHTML == '❤')
                        bd_toggleCollapse(oBt, 'bd-consigna-'+(i+1));
                }
            }
            */
            alert('Indique la consigna, para la siguiente danza...');
            var mostrar = confirm('¿Acepta realizar muestra para ésta danza?');
            if (mostrar)    {
                alert('Al darle Click, la música iniciará en 10 segundos, y podrá iniciar la muestra de la danza')
                setTimeout(function(){ 
                    procesaSesion.play('bd-id-danza-'+ejecucion.pos, procesaSesion.miLista[ejecucion.pos-1])
                    setTimeout(function(){ 
                        alert('De click para detener la musica, una vez haya terminado la muestra de la danza');
                        var volumen = catalogoMusica[procesaSesion.miLista[ejecucion.pos-1]].audio.volume;
                        procesaSesion.fade(procesaSesion.miLista[ejecucion.pos-1],3);
                        setTimeout(function(){
                            catalogoMusica[procesaSesion.miLista[ejecucion.pos-1]].audio.pause()
                            catalogoMusica[procesaSesion.miLista[ejecucion.pos-1]].audio.currentTime = 0;
                            catalogoMusica[procesaSesion.miLista[ejecucion.pos-1]].audio.volume=volumen;
                            alert('A continuación, invite a danzar...');
                            catalogoMusica[procesaSesion.miLista[ejecucion.pos-1]].audio.play();    
                        }, 3500);
                    }, 15000);
                }, 10000);
            }   else    {
                alert('Invite a danzar')
                procesaSesion.play('bd-id-danza-'+ejecucion.pos, procesaSesion.miLista[ejecucion.pos-1]);
            }
        }        
        ejecucion.play();
    },
    playAllSt:false,
    playAll: function () {
        this.stop();
        obutton = document.getElementById('bd-id-playAll');
        if (this.playAllSt) {
            for (var i  = 0; i<this.miLista.length; i++)   {
                catalogoMusica[this.miLista[i]].audio.onended = null;
                document.getElementById('bd-play-'+(i+1)).disabled =false;
            }
            this.playAllSt      = false;
            obutton.innerHTML   = 'Escuchar Todas';
            obutton.setAttribute('class', 'btn btn-success');
            document.getElementById('bd-id-prueba-Iniciar').disabled    = false;
            document.getElementById('bd-id-ejecutar-Iniciar').disabled  = false;
            return
        }
        document.getElementById('bd-id-prueba-Iniciar').disabled    = true;
        document.getElementById('bd-id-ejecutar-Iniciar').disabled  = true;
        for (var i  = 0; i < this.miLista.length; i++)  document.getElementById('bd-play-'+(i+1)).disabled = true;
        this.playAllSt      = true;
        obutton.innerHTML   = 'Detener';
        obutton.setAttribute('class', 'btn btn-danger');
        var playAll   = new Object();
        playAll.desde = 1;
        playAll.hasta = this.miLista.length;
        playAll.pos   = playAll.desde;
        for (var i  = playAll.pos; i <= playAll.hasta; i++) {
            catalogoMusica[this.miLista[i-1]].audio.onended = function() {
                playAll.pos++;
                if (playAll.pos > playAll.hasta) {
                    procesaSesion.playAll();
                }   else    {
                    procesaSesion.play('bd-id-danza-'+playAll.pos, procesaSesion.miLista[playAll.pos-1])
                }
            };
        };
        procesaSesion.play('bd-id-danza-'+playAll.pos, procesaSesion.miLista[playAll.pos-1])
    },
    sonando:null,
    idActual:null,
    bgcolor:null,
    fade : function (codigo, segundos)   {
        var audioElement = catalogoMusica[codigo].audio;
        var subir = (audioElement.volume < 0.2); 
        var decimo = audioElement.volume / 10;
        var decima = segundos * 1000 / 10
        setTimeout(function() {
            audioElement.volume = (subir) ? 0.1 : 9*decimo;
            setTimeout(function() {
                audioElement.volume = (subir) ? 0.2 : 8*decimo;
                setTimeout(function() {
                    audioElement.volume = (subir) ? 0.3 : 7*decimo;
                    setTimeout(function() {
                        audioElement.volume = (subir) ? 0.4 : 6*decimo;
                        setTimeout(function() {
                            audioElement.volume = (subir) ? 0.5 : 5*decimo;
                            setTimeout(function() {
                                audioElement.volume = (subir) ? 0.6 : 4*decimo;
                                setTimeout(function() {
                                    audioElement.volume = (subir) ? 0.7 : 3*decimo;
                                    setTimeout(function() {
                                        audioElement.volume = (subir) ? 0.8 : 2*decimo;
                                        setTimeout(function() {
                                            audioElement.volume = (subir) ? 0.9 : decimo;
                                            setTimeout(function() {
                                                audioElement.volume = (subir) ? 1 : 0;
                                            }, decima);
                                        }, decima);                                   
                                    }, decima);                                   
                                }, decima);                                   
                            }, decima);                                   
                        }, decima);                                   
                    }, decima);                                   
                }, decima);                                   
            }, decima);                       
        }, decima);
    },
    modoDocumento: function (obj)  {
        var desplegar ="none";
        if (obj.innerHTML == "Modo Ejecución") desplegar = "block";  
        const arrayNoImp = document.getElementsByClassName("no-imprimir");
        for (var i=0; i<arrayNoImp.length; i++)    arrayNoImp[i].style.display = desplegar;
        if (desplegar == "none")
            obj.innerHTML = "Modo Ejecución"
        else
            obj.innerHTML = "Modo Documento";
    },
    danzas:[],
    copiarWhatsApp: function    (){
        var strMensaje = '*'+this.sesion.tema+'* \n'+
        'Realizado por: '+this.sesion.autor+'\n';
        var minutos = Math.trunc(this.tiempoTotal / 60);
        const segundos = this.tiempoTotal - minutos * 60;
        const horas = Math.trunc(minutos/60);
        minutos = minutos - horas * 60;
        strMensaje += 'Duración Estimada: '+(horas>0 ? horas+":" : "")+(minutos < 10 ? ("0"+ minutos) : minutos)+":"+(segundos < 10 ? ("0"+segundos) : segundos)+'\n\n ';
        for (var i=0;i<this.danzas.length;i++)    {
            const musica = catalogoMusica[this.danzas[i].musica];
            strMensaje += '_'+(i+1)+'. '+this.danzas[i].nombre+' ('+this.danzas[i].presenta+')_\n'+
            '*'+this.danzas[i].musica+'*: '+musica.autor+'\n'+
            musica.nombre+'\n\n';
        }
        var otext = document.createElement('textarea');
        otext.innerHTML=strMensaje;
        document.body.appendChild(otext);
        otext.select();
        document.execCommand("copy");
        document.body.removeChild(otext);
        alert('Copiado el texto, con el formato para el WhatsApp')        
    }
} 

function bd_toggleCollapse(obj, id)  {
    obj.innerHTML = (obj.innerHTML == '❤') ? '❥' : '❤'
    const oId = document.getElementById(id);
    const attr = oId.getAttribute('class');
    oId.setAttribute('class', (attr == "collapse") ? "collapse in" : "collapse")
}

function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
} 
function drag_over(event) { 
    event.preventDefault(); 
    return false; 
} 
function drop(event) { 
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var dm = document.getElementById('bd-id-audios');
    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    dm.style.bottom = 'auto';
    event.preventDefault();
    return false;
} 

class sesionBiodanza extends HTMLElement {
    constructor() {
        super();
        const html = {
            encabezado:`
            <div class="row">
                <div class="col-12 text-primary"><h1><b id="bd-id-tema"></b></h1></div>
            </div>
            <div class="row">
                <div class="col-12 text-info">Realizado por: <b id="bd-id-autor"></b></div>
            </div>
            <div class="row">
                <div class="col-12 text-info">Duración Estimada: <b id="bd-id-tiempoTotal"></b></div>
            </div>
            `,
            pruebas:`
            <div class="no-imprimir">
                <h4><span onclick="bd_toggleCollapse(this, 'bd-prueba')" style="color:red; cursor:pointer">❥</span> Prueba Controlada</h4>
                <div id="bd-prueba" class="collapse">
                    <form class="form-inline">
                        <div class="input-group">
                            <span class="input-group-addon" style="font-family:monospace;">Desde&nbsp;</span>
                            <select class="form-control input-sm" id="bd-id-prueba-desde"></select>
                        </div>
                    </form>
                    <form class="form-inline">
                        <div class="input-group">
                            <span class="input-group-addon" style="font-family:monospace;">Hasta&nbsp;</span>
                            <select class="form-control input-sm" id="bd-id-prueba-hasta"></select>
                        </div>
                    </form>
                    <form class="form-inline">
                        <div class="input-group">
                            <span class="input-group-addon" style="font-family:monospace;">Inicio</span>
                            <input id="bd-id-prueba-durInicio" type="text" class="form-control input-sm" size="3" value="40">
                        </div>
                        <div class="input-group">
                            <span class="input-group-addon" style="font-family:monospace;">Medio&nbsp;</span>
                            <input id="bd-id-prueba-durMedio" type="text" class="form-control input-sm" size="3" value="40">
                        </div>
                        <div class="input-group">
                            <span class="input-group-addon" style="font-family:monospace;">Final&nbsp;</span>
                            <input id="bd-id-prueba-durFinal" type="text" class="form-control input-sm" size="3" value="40">
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-success" onclick="procesaSesion.pruebaControlada()" id="bd-id-prueba-Iniciar">Iniciar</button>
                        </div>
                    </form>
                </div>
            </div>
            `,
            ejecucion:`
            <div class="no-imprimir">
                <h4><span onclick="bd_toggleCollapse(this, 'bd-ejecutar')" style="color:red; cursor:pointer">❥</span> Ejecución Controlada</h4>
                <div id="bd-ejecutar" class="collapse">
                    <form class="form-inline">
                        <div class="input-group">
                            <span class="input-group-addon" style="font-family:monospace;">Desde&nbsp;</span>
                            <select class="form-control input-sm" id="bd-id-ejecutar-desde"></select>
                        </div>
                    </form>
                    <form class="form-inline">
                        <div class="input-group">
                            <span class="input-group-addon" style="font-family:monospace;">Hasta&nbsp;</span>
                            <select class="form-control input-sm" id="bd-id-ejecutar-hasta"></select>
                        </div>
                    </form>
                    <form class="form-inline">
                        <div class="form-group">
                            <button type="button" class="btn btn-success" onclick="procesaSesion.ejecucionControlada()" id="bd-id-ejecutar-Iniciar">Iniciar</button>
                        </div>
                    </form>
                </div>
            </div>
            `,
            otrosControles:`
            <div class="no-imprimir">
                <h4><span onclick="bd_toggleCollapse(this, 'bd-otrosctrls')" style="color:red; cursor:pointer">❥</span> Otros Controles</h4>
                <div id="bd-otrosctrls" class="collapse">
                    <div class="btn-group">
                        <button id="bd-id-playAll" type="button" class="btn btn-success" onclick="procesaSesion.playAll()">Escuchar Todas</button>
                        <button type="button" class="btn btn-success" onclick="procesaSesion.copiarWhatsApp()">Copiar para WhatsApp</button>
                        <button type="button" class="btn btn-success" onclick="procesaSesion.modoDocumento(this)">Modo Documento</button>
                    </div>
                </div>
            </div>
            `,
            tabla:`
            <table  class="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Danza</th>
                    <th>Evolución</th>
                    <th colspan="2" class="no-imprimir">&nbsp;Controles</th>
                </tr>
            </thead>
            <tbody id="bd-id-danzas">
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" id="bd-id-chart" style="height:700px">
                    </td>
                </tr>
            </tfoot>
            </table>
            `,
            audios:`
            <div id="bd-id-audios" draggable="true" style="position:fixed; bottom:10px; right: 5px;"></div>
            `
        }
        procesaSesion.sesion = {tema:this.getAttribute('tema'), autor:this.getAttribute('autor')};
        procesaSesion.danzas = [];
        this.danzas =   [];
        this.evolucion = [];
        this.addDanza   =   function(danza) {
            for (const key in danza)    danza[key] = danza[key] == null ? '' : danza[key];
            const otbody = document.getElementById('bd-id-danzas');
            const contador = (otbody.children.length/2)+1;
            var musica = catalogoMusica[danza.musica];
            if (musica == undefined) musica = {autor:"<b>MUSICA NO ENCONTRADA<b>", nombre:"<b>MUSICA NO ENCONTRADA<b>"}
            otbody.innerHTML = otbody.innerHTML+`
            <tr id="bd-id-danza-${contador}">
                <td valign="top">${contador}</td>
                <td><span>${danza.nombre}</span>&nbsp;<div style="float:right; text-align:right"><span class="bg-primary">${danza.presenta}</span><br><small>${danza.linea}</small><br><small>${danza.clasificacion}</small><br><small class="text-info">${danza.objetivo}</small></div><br>
                    <i>${danza.musica}</i>;
                    <span class="text-success">${musica.autor}</span><br>
                    <span class="text-danger">${musica.nombre}</span>
                </td>
                <td valign="top" align="center"><b>${danza.evolucion}</b><br><span id="bd-id-duracion-${contador}"></span></td>
                <td class="no-imprimir" valign="top"><button id="bd-play-${contador}" type="button" class="btn btn-success" onclick="procesaSesion.play('bd-id-danza-${contador}','${danza.musica}');">&#9835;</button></td>
                <td class="no-imprimir" valign="top"><button id="bd-tg-consigna-${contador}" type="button" class="btn btn-success" onclick="bd_toggleCollapse(this, 'bd-consigna-${contador}')">❥</button></td>
            </tr>
            <tr id="bd-consigna-${contador}" class="collapse"><td>&nbsp;</td>
            <td colspan="4" class="text-justify">${danza.consigna}</td>
            </tr>
            `;
            procesaSesion.danzas.push(danza);
            this.danzas.push(danza.nombre);
            this.evolucion.push(Number(danza.evolucion));
            const cats = this.danzas;
            const datos = this.evolucion;
            const tema = this.getAttribute('tema')
            const autor = this.getAttribute('autor')
            var opcionesDesde = '';
            var opcionesHasta = '';
            for (var i=0; i<cats.length; i++)
                if (i==0)   {
                    opcionesDesde += '<option selected value="'+(i+1)+'">'+(i+1)+'. '+cats[i]+' ('+datos[i]+')</select>';
                    opcionesHasta += '<option value="'+(i+1)+'">'+(i+1)+'. '+cats[i]+' ('+datos[i]+')</select>'
                } else if((i+1)==cats.length)   {
                    opcionesHasta += '<option selected value="'+(i+1)+'">'+(i+1)+'. '+cats[i]+' ('+datos[i]+')</select>';
                    opcionesDesde += '<option value="'+(i+1)+'">'+(i+1)+'. '+cats[i]+' ('+datos[i]+')</select>'
                } else {
                    opcionesDesde += '<option value="'+(i+1)+'">'+(i+1)+'. '+cats[i]+' ('+datos[i]+')</select>'
                    opcionesHasta += '<option value="'+(i+1)+'">'+(i+1)+'. '+cats[i]+' ('+datos[i]+')</select>'
                }
            document.getElementById('bd-id-prueba-desde').innerHTML=opcionesDesde;
            document.getElementById('bd-id-prueba-hasta').innerHTML=opcionesHasta;
            document.getElementById('bd-id-ejecutar-desde').innerHTML=opcionesDesde;
            document.getElementById('bd-id-ejecutar-hasta').innerHTML=opcionesHasta;
            Highcharts.chart('bd-id-chart', {
                chart:    { type: 'spline' },
                title:    { text: tema     },
                subtitle: { text: 'Realizado por: '+autor },
                xAxis:    { categories: cats,
                            labels: {  rotation:-90 }
                            },
                yAxis:    { title: { text: 'Nivel Adrenérgico/Colinérgico' }},
                tooltip: { crosshairs: true,    shared: true },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    }
                },
                series: [{
                    name: 'Nivel',
                    marker: { symbol: 'square'},
                    data: datos
                }]
            });
            procesaSesion.agregarAudio(danza.musica, contador);
            document.getElementById('bd-id-audios').appendChild(procesaSesion.audio(danza.musica));
            return contador;
        }
        for (const key in html)    this.innerHTML += html[key];
        var dm = document.getElementById('bd-id-audios'); 
        dm.addEventListener('dragstart',drag_start,false); 
        document.body.addEventListener('dragover',drag_over,false); 
        document.body.addEventListener('drop',drop,false);        
    }
    attributeChangedCallback(nameAtr, oldValue, newValue)    {
        document.getElementById("bd-id-"+nameAtr).innerHTML = newValue;
    }
    static  get observedAttributes()    {
        return ["tema", "autor"];
    }
}
class danzaBiodanza extends HTMLElement {
    static get observedAttributes() {
        return ["nombre", "musica", "evolucion", "presenta", "linea-vivencia", "clasificacion", "objetivo"];
    }
    constructor()   {
        super();
    }
    connectedCallback() {
        const oSesion = document.getElementsByTagName('bd-sesion')[0];
        const consigna = this.innerHTML;
        this.innerHTML="";
        this.nroDanza = oSesion.addDanza({
            nombre :    this.getAttribute('nombre'),
            musica :    this.getAttribute('musica'),
            evolucion : this.getAttribute('evolucion'),
            presenta :  this.getAttribute('presenta'),
            linea :  this.getAttribute('linea-vivencia'),
            clasificacion :  this.getAttribute('clasificacion'),
            objetivo :  this.getAttribute('objetivo'),
            consigna :  consigna
        })
    }
}
customElements.define('bd-sesion', sesionBiodanza);
customElements.define('bd-danza', danzaBiodanza);

