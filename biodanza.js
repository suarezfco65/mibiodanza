const procesaMusica = {
    audio: function (codigo)    {
        return catalogoMusica[codigo].audio
    },
    crearAudio : function (carpeta,codigo, contador)    {
        const omusica = catalogoMusica[codigo];
        const oaudio = document.createElement("audio");
        for (var i=0; i<catalogoMusica[codigo].archivos.length; i++)    {
            const osource = document.createElement("source");
            osource.setAttribute('src',carpeta+omusica.archivos[i].nombre);
            osource.setAttribute('type',omusica.archivos[i].tipo);
            oaudio.appendChild(osource);
        }
        oaudio['idDuracion'] = 'bd-id-duracion-'+contador; 
        oaudio.ondurationchange = function() {
            var segs = Math.round(this.duration);
            const mins = Math.trunc(segs / 60);
            segs = segs - (mins * 60);
            document.getElementById(oaudio['idDuracion']).innerHTML = mins+':'+(segs < 10 ? ("0"+segs) : segs);
          };
        return oaudio
    },
    agregarAudio : function(carpeta, codigo, contador) {
        if (catalogoMusica[codigo].audio == null)    {
            catalogoMusica[codigo].audio = this.crearAudio(carpeta, codigo, contador);
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
            return
        }
        document.getElementById('bd-id-ejecutar-Iniciar').disabled =true;
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
        for (var i  = prueba.pos; i<=prueba.hasta; i++) {
            catalogoMusica[procesaMusica.miLista[i-1]].audio.ontimeupdate   =   function()    {
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
                    procesaMusica.pruebaControlada();
                }   else    {
                    procesaMusica.play('bd-id-danza-'+prueba.pos, procesaMusica.miLista[prueba.pos-1]);
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
            return
        }
        document.getElementById('bd-id-prueba-Iniciar').disabled =true;
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
        for (var i  = ejecucion.pos; i <= ejecucion.hasta; i++) {
            catalogoMusica[this.miLista[i-1]].audio.onended = function() {
                ejecucion.pos++;
                if (ejecucion.pos > ejecucion.hasta) {
                    procesaMusica.ejecucionControlada();
                }   else    {
                    ejecucion.play();
                }
            };
        }

        ejecucion.play = function ()  {
            var obt;
            for (var i = 0; i < procesaMusica.miLista.length; i++) {
                oBt = document.getElementById('bd-tg-consigna-'+(i+1));
                if (ejecucion.pos != (i+1))
                    if (oBt.innerHTML != '❥')
                        bd_toggleCollapse(oBt, 'bd-consigna-'+(i+1))
                else
                    if (oBt.innerHTML == '❥')
                        bd_toggleCollapse(oBt, 'bd-consigna-'+(i+1));
            }
            alert('Indique la consigna, para la siguiente danza...');
            var mostrar = confirm('¿Acepta realizar muestra para ésta danza?');
            if (mostrar)    {
                alert('Al darle Click, la música iniciará en 10 segundos, y podrá iniciar la muestra de la danza')
                setTimeout(function(){ 
                    procesaMusica.play('bd-id-danza-'+ejecucion.pos, procesaMusica.miLista[ejecucion.pos-1])
                    setTimeout(function(){ 
                        alert('De click para detener la musica, una vez haya terminado la muestra de la danza');
                        var volumen = catalogoMusica[procesaMusica.miLista[ejecucion.pos-1]].audio.volume;
                        procesaMusica.fade(procesaMusica.miLista[ejecucion.pos-1],3);
                        setTimeout(function(){
                            catalogoMusica[procesaMusica.miLista[ejecucion.pos-1]].audio.pause()
                            catalogoMusica[procesaMusica.miLista[ejecucion.pos-1]].audio.currentTime = 0;
                            catalogoMusica[procesaMusica.miLista[ejecucion.pos-1]].audio.volume=volumen;
                            alert('A continuación, invite a danzar...');
                            catalogoMusica[procesaMusica.miLista[ejecucion.pos-1]].audio.play();    
                        }, 3500);
                    }, 15000);
                }, 10000);
            }   else    {
                alert('Invite a danzar')
                procesaMusica.play('bd-id-danza-'+ejecucion.pos, procesaMusica.miLista[ejecucion.pos-1]);
            }
        }        
        ejecucion.play();
    },
    sonando:null,
    idActual:null,
    bgcolor:null,
    fade : function (codigo, segundos)   {
        var audioElement = catalogoMusica[codigo].audio;
        var subir = (audioElement.volume < 0.2); 
        var decimo = audioElement.volume / 10;
        var decima = segundos * 1000 / 10
        setTimeout(function() {  audioElement.volume = (subir) ? 0.1 : 9*decimo;
        setTimeout(function() {  audioElement.volume = (subir) ? 0.2 : 8*decimo;
        setTimeout(function() {  audioElement.volume = (subir) ? 0.3 : 7*decimo;
        setTimeout(function() {  audioElement.volume = (subir) ? 0.4 : 6*decimo;
        setTimeout(function() {  audioElement.volume = (subir) ? 0.5 : 5*decimo;
        setTimeout(function() {  audioElement.volume = (subir) ? 0.6 : 4*decimo;
        setTimeout(function() {  audioElement.volume = (subir) ? 0.7 : 3*decimo;
        setTimeout(function() {  audioElement.volume = (subir) ? 0.8 : 2*decimo;
        setTimeout(function() {  audioElement.volume = (subir) ? 0.9 : decimo;
        setTimeout(function() {  audioElement.volume = (subir) ? 1 : 0;
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
    }
} 

function bd_toggleCollapse(obj, id)  {
    obj.innerHTML = (obj.innerHTML == '❤') ? '❥' : '❤'
    const oId = document.getElementById(id);
    const attr = oId.getAttribute('class');
    oId.setAttribute('class', (attr == "collapse") ? "collapse in" : "collapse")
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
                            <button type="button" class="btn btn-success" onclick="procesaMusica.pruebaControlada()" id="bd-id-prueba-Iniciar">Iniciar</button>
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
                            <button type="button" class="btn btn-success" onclick="procesaMusica.ejecucionControlada()" id="bd-id-ejecutar-Iniciar">Iniciar</button>
                        </div>
                    </form>
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
            <tfoot class="no-imprimir">
                <tr>
                    <td colspan="5" id="bd-id-chart" style="height:700px">
                    </td>
                </tr>
            </tfoot>
            </table>
            `,
            audios:`
            <div id="bd-id-audios" style="position:fixed; bottom:10px; right: 5px;"></div>
            `
        }
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
                <td><span>${danza.nombre}</span>&nbsp;<span style="float:right" class="bg-primary">${danza.presenta}</span><br>
                    <i>${danza.musica}</i>;
                    <span class="text-success">${musica.autor}</span><br>
                    <span class="text-danger">${musica.nombre}</span>
                </td>
                <td valign="top" align="center"><b>${danza.evolucion}</b><br><span id="bd-id-duracion-${contador}"></span></td>
                <td class="no-imprimir" valign="top"><button id="bd-play-${contador}" type="button" class="btn btn-success" onclick="procesaMusica.play('bd-id-danza-${contador}','${danza.musica}');">&#9835;</button></td>
                <td class="no-imprimir" valign="top"><button id="bd-tg-consigna-${contador}" type="button" class="btn btn-success" onclick="bd_toggleCollapse(this, 'bd-consigna-${contador}')">❥</button></td>
            </tr>
            <tr id="bd-consigna-${contador}" class="collapse"><td>&nbsp;</td>
            <td colspan="4" class="text-justify">${danza.consigna}</td>
            </tr>
            `;
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
            procesaMusica.agregarAudio(this.carpeta_musica, danza.musica, contador);
            document.getElementById('bd-id-audios').appendChild(procesaMusica.audio(danza.musica));
            return contador;
        }
        for (const key in html)    this.innerHTML += html[key];
    }
    attributeChangedCallback(nameAtr, oldValue, newValue)    {
        if (nameAtr == "carpeta-musica")    {
            this.carpeta_musica = newValue;
        } else
            document.getElementById("bd-id-"+nameAtr).innerHTML = newValue;
    }
    static  get observedAttributes()    {
        return ["tema", "autor", "carpeta-musica"];
    }
}
class danzaBiodanza extends HTMLElement {
    static get observedAttributes() {
        return ["nombre", "musica", "evolucion", "presenta"];
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
            consigna :  consigna
        })
    }
}
customElements.define('bd-sesion', sesionBiodanza);
customElements.define('bd-danza', danzaBiodanza);

