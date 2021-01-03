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
                        <input id="bd-id-prueba-durInicio" type="text" class="form-control input-sm" size="3" value="20">
                    </div>
                    <div class="input-group">
                        <span class="input-group-addon" style="font-family:monospace;">Medio&nbsp;</span>
                        <input id="bd-id-prueba-durMedio" type="text" class="form-control input-sm" size="3" value="20">
                    </div>
                    <div class="input-group">
                        <span class="input-group-addon" style="font-family:monospace;">Final&nbsp;</span>
                        <input id="bd-id-prueba-durFinal" type="text" class="form-control input-sm" size="3" value="20">
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-success" onclick="catalogoMusica.pruebaControlada()" id="bd-id-prueba-Iniciar">Iniciar</button>
                    </div>
                </form>
            </div>
            `,
            ejecucion:`
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
                        <button type="button" class="btn btn-success" onclick="catalogoMusica.ejecucionControlada()" id="bd-id-ejecutar-Iniciar">Iniciar</button>
                    </div>
                </form>
            </div>
            `,
            tabla:`
            <table  class="table table-striped" style="max-width:640px">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Danza</th>
                    <th>Evolución</th>
                    <th colspan="2">&nbsp;Controles</th>
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
            <div id="bd-id-audios" style="position:fixed; bottom:10px; right: 5px;"></div>
            `
        }
        this.danzas =   [];
        this.evolucion = [];
        this.addDanza   =   function(danza) {
            for (const key in danza)    danza[key] = danza[key] == null ? '' : danza[key];
            const otbody = document.getElementById('bd-id-danzas');
            const contador = (otbody.children.length/2)+1;
            var musica = catalogoMusica.musicas[danza.musica];
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
                <td valign="top"><button id="bd-play-${contador}" type="button" class="btn btn-success" onclick="catalogoMusica.play('bd-id-danza-${contador}','${danza.musica}');">&#9835;</button></td>
                <td valign="top"><button type="button" class="btn btn-success" onclick="bd_toggleCollapse(this, 'bd-consigna-${contador}')">❥</button></td>
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
            catalogoMusica.agregarAudio(this.carpeta_musica, danza.musica);
            document.getElementById('bd-id-audios').appendChild(catalogoMusica.audio(danza.musica));
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
        const consigna = this.innerHTML;
        this.innerHTML="";
        this.nroDanza = this.parentElement.addDanza({
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