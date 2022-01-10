formatTime = function (seconds) {
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  if (minutes < 10) minutes = '0' + minutes;
  if (secs < 10) secs = '0' + secs;
  return minutes + ':' + secs;
};
class audible extends HTMLElement {
  constructor() {
    super();
    const html = `
    <style>
      .btn-verde {
        font-weight: 400;
        line-height: 1.5;
        text-align: center;
        user-select: none;
        padding: 0.3rem 0.75rem;
        margin: 3px 3px 3px 3px;
        font-size: 1rem;
        border-radius: 0.25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        color:white; background-color: green; border-color:green;
        cursor:pointer;
      }
      .btn-rojo {
        font-weight: 400;
        line-height: 1.5;
        text-align: center;
        user-select: none;
        padding: 0.3rem 0.75rem;
        margin: 3px 3px 3px 3px;
        font-size: 1rem;
        border-radius: 0.25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        color:white; background-color: red; border-color:red;
        cursor:pointer;
      }
      .bottomRight{
        position:fixed;
        bottom:5px;
        right:5px;
      }
      .bottomLeft{
        position:fixed;
        bottom:5px;
        left:5px;
      }
      .topRight{
        position:fixed;
        top:20px;
        right:5px;
      }
      .topLeft{
        position:fixed;
        top:20px;
        left:5px;
      }

      .dropbtn {
        background-color: #3498DB;
        color: white;
        padding: 16px;
        font-size: 16px;
        border: none;
      }
      .dropup {
        position: relative;
        display: inline-block;
      }
      .dropup-content {
        display: none; right:0;
        position: absolute;
        background-color: #f1f1f1;
        min-width: 160px;
        bottom: 20px;
        z-index: 1;
      }
      .dropup-content a {
        color: black;
        padding: 6px 10px;
        text-decoration: none;
        display: block;
        text-align:left;
      }
      .dropup-content a:hover {background-color: #ccc}
      .dropup:hover .dropup-content {
        display: block;
      }
      .dropup:hover .dropbtn {
        background-color: #2980B9;
      }
    </style>
    <audio id="audible-id-audio">
       <source src="" id="audible-id-enlace">
    </audio>
    <table id="audible-id-posicion" style="padding: 0;border: 1px solid #ADADAD; background-color:#f1f1f1">
    <thead style="padding: 0; background-color: #f1f1f1; border: 0px solid;">
        <tr>
            <th colspan="6" id="audible-id-musica" style="text-align:left">&nbsp;</th>
        </tr>
    </thead>
    <tbody style="padding: 0.5rem 1rem; margin-bottom: 0; background-color: white;">
        <tr>
            <td colspan="6"><sub  style="color:blue" id="audible-id-nombre">&nbsp;</sub>
            <br><sup  style="color:red" id="audible-id-autor">&nbsp;</sup></td>
        </tr>
    </tbody>
    <tfoot style="padding: 0.5rem 1rem;  background-color:#f1f1f1">
        <tr>
            <td colspan="6">
                <input style="width: 100%" type="range" id="audible-id-avance" min="0" step="1" onchange="this.click(this.value)"/>
            </td>
        </tr>
        <tr>
            <td>
                <button class="btn-verde" type="button" id="audible-id-comenzar" title="Reiniciar" onclick="this.click();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                        <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>                        
                </button>
            </td>
            <td>
                <button class="btn-verde" type="button" id="audible-id-playPause" title="play" onclick="this.playAudio();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
                        <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                    </svg>
                </button>
            </td>
            <td>
                <button class="btn-verde" type="button" id="audible-id-terminar" title="Finalizar" onclick="this.click();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </td>
            <td>
                <button class="btn-verde" type="button" id="audible-id-subirVol" title="Volumen +" onclick="this.click();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-up" viewBox="0 0 16 16">
                        <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                        <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                        <path d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z"/>
                    </svg>
                </button>
            </td>
            <td>
                <button class="btn-verde" type="button" id="audible-id-bajarVol" title="Volumen -" onclick="this.click();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-down" viewBox="0 0 16 16">
                        <path d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12V4zM6.312 6.39 8 5.04v5.92L6.312 9.61A.5.5 0 0 0 6 9.5H4v-3h2a.5.5 0 0 0 .312-.11zM12.025 8a4.486 4.486 0 0 1-1.318 3.182L10 10.475A3.489 3.489 0 0 0 11.025 8 3.49 3.49 0 0 0 10 5.525l.707-.707A4.486 4.486 0 0 1 12.025 8z"/>
                    </svg>                        
                </button>
            </td>
            <td>
                <button class="btn-verde" type="button" id="audible-id-callar" title="Silenciar" onclick="this.click();">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute" viewBox="0 0 16 16">
                        <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                </button>
            </td>
        </tr>
        <tr>
            <td colspan="3" style="text-align:center;">
                <small><sub id="audible-id-avanceDuracion">&nbsp;</sub></small>
            </td>
            <td colspan="3">
                <input type="range" id="audible-id-rangoVolumen" min="0" max="1" step="0.1" onchange="this.change(this.value)">
            </td>
        </tr>
    </tfoot>
    </table>
        `;
    this.innerHTML = html;
    var oAudio = document.getElementById('audible-id-audio');
    oAudio.preload = 'auto';

    oAudio.comenzar = document.getElementById('audible-id-comenzar');
    oAudio.comenzar.click = function () {
      oAudio.currentTime = 0;
      oAudio.avance.value = 0;
    };

    oAudio.terminar = document.getElementById('audible-id-terminar');
    oAudio.terminar.click = function () {
      oAudio.currentTime = oAudio.duration;
      oAudio.avance.value = oAudio.duration;
      oAudio.playPause.className = 'btn-verde';
      oAudio.playPause.onclick = oAudio.playPause.playAudio;
      oAudio.playPause.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
      <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
  </svg>`;
    };

    oAudio.playPause = document.getElementById('audible-id-playPause');
    oAudio.playPause.playAudio = function () {
      oAudio.playPause.className = 'btn-rojo';
      oAudio.playPause.title = 'Pausa';
      oAudio.playPause.onclick = oAudio.playPause.pauseAudio;
      oAudio.playPause.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16">
      <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
    </svg>`;
      oAudio.play();
    };

    oAudio.playPause.pauseAudio = function () {
      oAudio.playPause.className = 'btn btn-verde';
      oAudio.playPause.title = 'Play';
      oAudio.playPause.onclick = oAudio.playPause.playAudio;
      oAudio.playPause.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
      <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
  </svg>`;
      oAudio.pause();
    };

    oAudio['avance'] = document.getElementById('audible-id-avance');
    oAudio['avanceDuracion'] = document.getElementById(
      'audible-id-avanceDuracion'
    );

    oAudio.rangoVolumen = document.getElementById('audible-id-rangoVolumen');
    oAudio.rangoVolumen.value = oAudio.volume;
    oAudio.rangoVolumen.change = function (valor) {
      oAudio.volume = valor;
    };

    oAudio.avance.max = oAudio.duration;
    oAudio.avance.value = oAudio.currentTime;
    oAudio.avanceDuracion.innerHTML =
      formatTime(oAudio.currentTime) + ' / ' + formatTime(oAudio.duration);

    oAudio['cambioAvance'] = function (valor) {
      oAudio.currentTime = valor;
      oAudio.avanceDuracion.innerHTML =
        formatTime(valor) + ' / ' + formatTime(oAudio.duration);
      oAudio.avance.max = oAudio.duration;
    };

    oAudio.addEventListener(
      'timeupdate',
      (event) => {
        var valor = Math.round(oAudio.currentTime);
        oAudio.avanceDuracion.innerHTML =
          formatTime(valor) + ' / ' + formatTime(oAudio.duration);
        oAudio.avance.value = valor;
        oAudio.avance.max = oAudio.duration;
      },
      false
    );

    oAudio.subirVol = document.getElementById('audible-id-subirVol');
    oAudio.subirVol.click = function () {
      var valor = oAudio.volume;
      if (valor < 1) {
        valor = Math.min(valor + 0.1, 1);
        oAudio.volume = valor;
        oAudio['rangoVolumen'].value = valor;
      }
    };

    oAudio.bajarVol = document.getElementById('audible-id-bajarVol');
    oAudio.bajarVol.click = function () {
      var valor = oAudio.volume;
      if (valor > 0) {
        valor = Math.max(valor - 0.1, 0);
        oAudio.volume = valor;
        oAudio['rangoVolumen'].value = valor;
      }
    };

    oAudio.callar = document.getElementById('audible-id-callar');
    oAudio.callar.click = function () {
      oAudio.volume = 0;
      oAudio['rangoVolumen'].value = 0;
    };
  }
  attributeChangedCallback(nameAtr, oldValue, newValue) {
    var obj = document.getElementById('audible-id-' + nameAtr);
    console.log(nameAtr + '; ' + newValue);
    if (nameAtr == 'posicion') {
      obj.setAttribute('class', newValue);
    } else {
      obj.innerHTML = newValue;
      const oMusica = catalogoMusica[newValue];
      if (oMusica) {
        obj.innerHTML = oMusica.elenco + ' - ' + newValue;
        document.getElementById('audible-id-nombre').innerHTML = oMusica.nombre;
        document.getElementById('audible-id-autor').innerHTML = oMusica.autor;
        //          document.getElementById('lineaVivencia').innerHTML=oMusica.lineaVivencia;
        //          document.getElementById('danzas').innerHTML='<li>'+oMusica.danzas.join('</li><li>')+'</li>';
        const oAudio = document.getElementById('audible-id-audio');
        oAudio.playPause.pauseAudio();
        var sources = '';
        for (var i = 0; i < oMusica.archivos.length; i++)
          sources +=
            '<source type="' +
            oMusica.archivos[i].tipo +
            '" src="' +
            'https://suarezfco65.github.io/amobiodanza/' +
            oMusica.archivos[i].archivo +
            '"></source>';
        oAudio.innerHTML = sources;
        oAudio.load();
        oAudio.playPause.playAudio();
      } else {
        document.getElementById('audible-id-nombre').innerHTML = '';
        document.getElementById('audible-id-autor').innerHTML =
          'Código no encontrado';
        //          document.getElementById('lineaVivencia').innerHTML='';
        //          document.getElementById('danzas').innerHTML='';
      }
    }
  }
  static get observedAttributes() {
    return ['posicion', 'musica'];
  }
}

customElements.define('audible-musica', audible);
