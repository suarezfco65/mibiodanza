class miAudio extends HTMLAudioElement {
  constructor() {
    super();
    this.aplicar = function (oAudio) {
      const html = {
        style: `
              .yab-modal-todo{
                background-color:#fff;
                width:300px;
                padding: 10px 20px;
                position: relative;
                left: 50%;
                top:57px;
                margin-left: -150px;
                border-radius:20px;
                font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
                font-size: 14px;
                line-height: 1.42857143;
                color: #333;
                --seek-before-width: 0%;
                --volume-before-width: 100%;
                --buffered-width: 0%;
              }
              .yab-modal-todo::before {
                position: absolute;
                content: '';
                width: calc(100% + 4px);
                height: calc(100% + 4px);
                left: -2px;
                top: -2px;
                background: linear-gradient(to left, #007db5, #ff8a00);
                z-index: -1;
                border-radius:20px;
              }
              .yab-modal{
                background-color: rgba(0,0,0,.8);
                position:fixed;
                top:0;
                right:0;
                bottom:0;
                left:0;
                opacity:0;
                pointer-events:none;
                transition: all 1s;
              }
              #yab-miModal:target{
                opacity:1;
                pointer-events:auto;
              }
              #yab-miModal-off:target{
                opacity:0;
                pointer-events:auto;
              }
              .yamp-button {
                padding: 0;
                border: 0;
                background: transparent;
                cursor: pointer;
                outline: none;
                width: 40px;
                height: 40px;
                float: left;
              }
              #audio-player-container {
                font-family: Arial, Helvetica, sans-serif;
                letter-spacing: -0.5px;
                --seek-before-width: 0%;
                --volume-before-width: 100%;
                --buffered-width: 0%;
                position: relative;
                margin: 20px;
                width: 95%;
                max-width: 320px;
                height: 122px;
                background: #fff;
                border-radius:20px;
              }
              #audio-player-container::before {
                position: absolute;
                content: '';
                width: calc(100% + 4px);
                height: calc(100% + 4px);
                left: -2px;
                top: -2px;
                background: linear-gradient(to left, #007db5, #ff8a00);
                z-index: -1;
                border-radius:20px;
              }
              #yoAmoMiPlayer {
                position: absolute;
                top: -18px;
                right: 5%;
                padding: 0 5px;
                margin: 0;
                font-size: 28px;
                background: #fff;
              }
              .yab-time {
                display: inline-block;
                width: 37px;
                text-align: center;
                font-size: 20px;
                margin: 28.5px 0 18.5px 0;
                float: left;
              }
              #yab-currentVolume {
                display: inline-block;
                width: 32px;
                text-align: center;
                font-size: 20px;
                margin: 10px 2.5% 0 5%;
                float: left;
                clear: left;
              }
              #yab-volumenSlider {
                margin: 10px 2.5%;
                width: 58%;
              }
              #yab-volumenSlider::-webkit-slider-runnable-track {
                background: rgba(0, 125, 181, 0.6);
              }
              #yab-volumenSlider::-moz-range-track {
                background: rgba(0, 125, 181, 0.6);
              }
              #yab-volumenSlider::-ms-fill-upper {
                background: rgba(0, 125, 181, 0.6);
              }
              #yab-volumenSlider::before {
                width: var(--volume-before-width);
              }
              input[type='range'] {
                position: relative;
                -webkit-appearance: none;
                width: 48%;
                margin: 0;
                padding: 0;
                height: 19px;
                margin: 30px 2.5% 20px 2.5%;
                float: left;
                outline: none;
              }
              input[type='range']::-webkit-slider-runnable-track {
                width: 100%;
                height: 3px;
                cursor: pointer;
                background: linear-gradient(
                  to right,
                  rgba(0, 125, 181, 0.6) var(--buffered-width),
                  rgba(0, 125, 181, 0.2) var(--buffered-width)
                );
              }
              input[type='range']::before {
                position: absolute;
                content: '';
                top: 8px;
                left: 0;
                width: var(--seek-before-width);
                height: 3px;
                background-color: #007db5;
                cursor: pointer;
              }
              input[type='range']::-webkit-slider-thumb {
                position: relative;
                -webkit-appearance: none;
                box-sizing: content-box;
                border: 1px solid #007db5;
                height: 15px;
                width: 15px;
                border-radius: 50%;
                background-color: #fff;
                cursor: pointer;
                margin: -7px 0 0 0;
              }
              input[type='range']:active::-webkit-slider-thumb {
                transform: scale(1.2);
                background: #007db5;
              }
              input[type='range']::-moz-range-track {
                width: 100%;
                height: 3px;
                cursor: pointer;
                background: linear-gradient(
                  to right,
                  rgba(0, 125, 181, 0.6) var(--buffered-width),
                  rgba(0, 125, 181, 0.2) var(--buffered-width)
                );
              }
              input[type='range']::-moz-range-progress {
                background-color: #007db5;
              }
              input[type='range']::-moz-focus-outer {
                border: 0;
              }
              input[type='range']::-moz-range-thumb {
                box-sizing: content-box;
                border: 1px solid #007db5;
                height: 15px;
                width: 15px;
                border-radius: 50%;
                background-color: #fff;
                cursor: pointer;
              }
              input[type='range']:active::-moz-range-thumb {
                transform: scale(1.2);
                background: #007db5;
              }
              input[type='range']::-ms-track {
                width: 100%;
                height: 3px;
                cursor: pointer;
                background: transparent;
                border: solid transparent;
                color: transparent;
              }
              input[type='range']::-ms-fill-lower {
                background-color: #007db5;
              }
              input[type='range']::-ms-fill-upper {
                background: linear-gradient(
                  to right,
                  rgba(0, 125, 181, 0.6) var(--buffered-width),
                  rgba(0, 125, 181, 0.2) var(--buffered-width)
                );
              }
              input[type='range']::-ms-thumb {
                box-sizing: content-box;
                border: 1px solid #007db5;
                height: 15px;
                width: 15px;
                border-radius: 50%;
                background-color: #fff;
                cursor: pointer;
              }
              input[type='range']:active::-ms-thumb {
                transform: scale(1.2);
                background: #007db5;
              }
                `,
        div: `
            <div id="audio-player-container">
            <p id="yoAmoMiPlayer">Yo<a href="#yab-miModal" style="color:red;text-decoration:none;">❤</a>Biodanza</p>
            <button
              id="yab-playPause"
              class="yamp-button"
              style="margin: 20px 2.5% 10px 2.5%;"
              onclick="this.play()"
              >
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fill-rule="evenodd"
                clip-rule="evenodd"
              >
                <path
                  d="M23 12l-22 12v-24l22 12zm-21 10.315l18.912-10.315-18.912-10.315v20.63z"
                />
              </svg>
            </button>
            <span id="yab-current-time" class="yab-time">0:00</span>
            <input type="range" id="yab-avance" max="100" value="0" onchange="this.click()"/>
            <span id="yab-duration" class="yab-time">0:00</span>
            <output id="yab-currentVolume">100</output>
            <input type="range" id="yab-volumenSlider" max="100" value="100" onchange="this.click()"/>
            <button id="yab-callar" class="yamp-button" style="margin: 0 2.5%;" onclick="this.click()">
            <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
            >
            <path
                d="M15 23l-9.309-6h-5.691v-10h5.691l9.309-6v22zm-9-15.009v8.018l8 5.157v-18.332l-8 5.157zm14.228-4.219c2.327 1.989 3.772 4.942 3.772 8.229 0 3.288-1.445 6.241-3.77 8.229l-.708-.708c2.136-1.791 3.478-4.501 3.478-7.522s-1.342-5.731-3.478-7.522l.706-.706zm-2.929 2.929c1.521 1.257 2.476 3.167 2.476 5.299 0 2.132-.955 4.042-2.476 5.299l-.706-.706c1.331-1.063 2.182-2.729 2.182-4.591 0-1.863-.851-3.529-2.184-4.593l.708-.708zm-12.299 1.299h-4v8h4v-8z"
            />
            </svg>
            </button>
          </div>
          <div id="yab-miModal" class="yab-modal">
              <div class="yab-modal-todo">
                <div id="yab-modal-encabezado" style="padding:0 5px; margin: 0; font-size:18px;"></div>
                <hr>
                <div id="yab-modal-contenido"></div>
                <hr>
                <div style="width:100%; text-align:right">
                  <a href="#yab-miModal-off" style="text-decoration:none;padding:0 5px; margin: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                  <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
                </svg></a>
                </div>
              </div>  
          </div>
            `,
      };
      const oDiv = document.createElement('div');
      oDiv.setAttribute('style', 'width:360px; ');
      oDiv.setAttribute('id', 'yab-main');
      oDiv.innerHTML = html.div;
      const oStyle = document.createElement('style');
      oStyle.setAttribute('id', 'yab-style');
      oStyle.innerHTML = html.style;
      oAudio.parentElement.appendChild(oStyle);
      oAudio.parentElement.appendChild(oDiv);
      oAudio.style.display = 'none';

      oAudio['playPause'] = document.getElementById('yab-playPause');
      oAudio['playPause'].play = function () {
        this.innerHTML = `<svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path
              d="M10 24h-6v-24h6v24zm10 0h-6v-24h6v24zm-11-23h-4v22h4v-22zm10 0h-4v22h4v-22z"
            />
          </svg>`;
        this.onclick = this.pause;
        oAudio.play();
      };
      oAudio['playPause'].pause = function () {
        this.innerHTML = `<svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fill-rule="evenodd"
              clip-rule="evenodd"
          >
              <path
              d="M23 12l-22 12v-24l22 12zm-21 10.315l18.912-10.315-18.912-10.315v20.63z"
              />
          </svg>
          `;
        this.onclick = this.play;
        oAudio.pause();
      };

      document.getElementById('yab-modal-encabezado').innerHTML =
        this.encabezado;
      document.getElementById('yab-modal-contenido').innerHTML = this.contenido;
      oAudio.avance = document.getElementById('yab-avance');
      oAudio.avance.mover = true;
      oAudio.cTime = document.getElementById('yab-current-time');
      oAudio.duracion = document.getElementById('yab-duration');

      oAudio.avance.addEventListener('mousedown', (event) => {
        oAudio.avance.mover = false;
      });
      oAudio.avance.addEventListener('mouseup', (event) => {
        oAudio.avance.mover = true;
      });
      oAudio.addEventListener(
        'timeupdate',
        (event) => {
          var valor = Math.round(oAudio.currentTime);
          oAudio.cTime.innerHTML = oAudio.avance.formatTime(valor);
          if (oAudio.avance.mover) {
            oAudio.avance.value = (valor * 100) / oAudio.duration;
            oAudio.duracion.value = oAudio.avance.formatTime(oAudio.duration);
          }
          if (
            !oAudio.paused &&
            oAudio['playPause'].innerHTML.indexOf('M10 ') < 0
          )
            oAudio['playPause'].play();
        },
        false
      );
            
      oAudio.avance.click = function () {
        oAudio.currentTime = (this.value * oAudio.duration) / 100;
        oAudio.cTime.innerHTML = this.formatTime(this.value);
        oAudio.duracion.innerHTML = this.formatTime(oAudio.duration);
      };
      oAudio.avance.formatTime = function (segundos) {
        const mins = Math.floor(segundos / 60);
        var segs = Math.floor(segundos % 60);
        segs = segs < 10 ? `0${segs}` : `${segs}`;
        return `${mins}:${segs}`;
      };
      oAudio.onloadeddata = function () {
        oAudio.duracion.innerHTML = oAudio.avance.formatTime(oAudio.duration);
      };

      oAudio.volumenSlider = document.getElementById('yab-volumenSlider');
      oAudio.cVolumen = document.getElementById('yab-currentVolume');
      oAudio.callar = document.getElementById('yab-callar');
      oAudio.callar.click = function () {
        oAudio.volume = 0;
        oAudio.cVolumen.innerHTML = 0;
        oAudio.volumenSlider.value = 0;
        this.innerHTML = `<svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fill-rule="evenodd"
              clip-rule="evenodd"
          >
              <path
              d="M18 23l-9.305-5.998.835-.651 7.47 4.815v-10.65l1-.781v13.265zm0-15.794l5.384-4.206.616.788-23.384 18.264-.616-.788 5.46-4.264h-2.46v-10h5.691l9.309-6v6.206zm-11.26 8.794l1.26-.984v-7.016h-4v8h2.74zm10.26-8.013v-5.153l-8 5.157v6.244l8-6.248z"
              />
          </svg>`;
      };

      oAudio.addEventListener("volumechange", {
         var valor = Math.round(oAudio.volume * 100);
         oAudio.cVolumen.innerHTML = valor;
         oAudio.volumenSlider.value = valor;
      });

      
      oAudio.volumenSlider.click = function () {
        oAudio.volume = this.value / 100;
        oAudio.cVolumen.innerHTML = this.value;
        if (oAudio.volume == 0) {
          oAudio.callar.innerHTML = `<svg
                      width="24"
                      height="24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                  >
                      <path
                      d="M18 23l-9.305-5.998.835-.651 7.47 4.815v-10.65l1-.781v13.265zm0-15.794l5.384-4.206.616.788-23.384 18.264-.616-.788 5.46-4.264h-2.46v-10h5.691l9.309-6v6.206zm-11.26 8.794l1.26-.984v-7.016h-4v8h2.74zm10.26-8.013v-5.153l-8 5.157v6.244l8-6.248z"
                      />
                  </svg>`;
        } else {
          oAudio.callar.innerHTML = `<svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  >
                  <path
                      d="M15 23l-9.309-6h-5.691v-10h5.691l9.309-6v22zm-9-15.009v8.018l8 5.157v-18.332l-8 5.157zm14.228-4.219c2.327 1.989 3.772 4.942 3.772 8.229 0 3.288-1.445 6.241-3.77 8.229l-.708-.708c2.136-1.791 3.478-4.501 3.478-7.522s-1.342-5.731-3.478-7.522l.706-.706zm-2.929 2.929c1.521 1.257 2.476 3.167 2.476 5.299 0 2.132-.955 4.042-2.476 5.299l-.706-.706c1.331-1.063 2.182-2.729 2.182-4.591 0-1.863-.851-3.529-2.184-4.593l.708-.708zm-12.299 1.299h-4v8h4v-8z"
                  />
                  </svg>`;
        }
      };
    };
  }

  static get controles() {
    return 'amo-biodanza-audio';
  }

  get is() {
    return this.getAttribute('is');
  }

  set is(value) {
    console.log(value);
    this.setAttribute('is', value || this.controles);
  }
  static get observedAttributes() {
    return ['controls', 'encabezado', 'contenido'];
  }

  attributeChangedCallback(name, old, now) {
    console.log(
      `El atributo ${name} ha sido modificado de ${old} a <<${now}>>.`
    );
    if (name == 'controls') {
      if (now != null) {
        if (!this.aplicado) {
          this.aplicar(this);
          this.aplicado = true;
        }
      } else {
        if (this.aplicado) {
          const yabMain = this.parentElement.querySelector('#yab-main');
          const yabStyle = this.parentElement.querySelector('#yab-style');
          if (yabMain) {
            this.parentElement.removeChild(yabMain);
            this.parentElement.removeChild(yabStyle);
          }
          this.aplicado = false;
          this.style.display = 'block';
        }
      }
    } else {
      if (this.aplicado) {
        document.getElementById('yab-modal-' + name).innerHTML = now;
      } else this[name] = now;
    }
  }
}

customElements.define(miAudio.controles, miAudio, { extends: 'audio' });
