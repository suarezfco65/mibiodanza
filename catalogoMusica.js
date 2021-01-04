const catalogoMusica = {
    audio: function (codigo)    {
        return this.musicas[codigo].audio
    },
    crearAudio : function (carpeta,codigo)    {
        const omusica = this.musicas[codigo];
        const oaudio = document.createElement("audio");
        var osource = document.createElement("source");
        osource.setAttribute('src',carpeta+omusica.archivo.substr(0,omusica.archivo.length-3)+'ogg');
        osource.setAttribute('type','audio/ogg');
        oaudio.appendChild(osource);
        osource = document.createElement("source");
        osource.setAttribute('src',carpeta+omusica.archivo);
        osource.setAttribute('type','audio/mpeg');
        oaudio.appendChild(osource);
        return oaudio
    },
    agregarAudio : function(carpeta, codigo) {
        if (this.musicas[codigo].audio == null)    {
            this.musicas[codigo].audio = this.crearAudio(carpeta, codigo);
            this.miLista.push(codigo);
        }
    },
    miLista: [],
    play : function (id,codigo)    {
        if (this.sonando != null)    {
            this.musicas[this.sonando].audio.controls=false;
            this.musicas[this.sonando].audio.pause();
            this.musicas[this.sonando].audio.currentTime=0;
            document.getElementById(this.idActual).style.backgroundColor = this.bgcolor;
        }
        this.sonando = codigo;
        this.idActual = id;
        this.bgcolor = document.getElementById(this.idActual).style.backgroundColor;
        this.musicas[this.sonando].audio.controls=true;
        this.musicas[this.sonando].audio.play()
        document.getElementById(this.idActual).style.backgroundColor = "#D0D0FF";
    },
    stop : function ()  {
        if (this.sonando != null)    {
            this.musicas[this.sonando].audio.controls=false;
            this.musicas[this.sonando].audio.pause();
            this.musicas[this.sonando].audio.currentTime=0;
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
                this.musicas[this.miLista[i]].audio.ontimeupdate   =   null;
                this.musicas[this.miLista[i]].audio.onended = null;
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
        this.prueba = true;
        obutton.innerHTML = 'Detener';
        obutton.setAttribute('class','btn btn-danger');
        const oDesde = document.getElementById('bd-id-prueba-desde');
        const oHasta = document.getElementById('bd-id-prueba-hasta');
        var prueba  =   new Object();
        prueba.desde = Number(oDesde.options[oDesde.selectedIndex].value);
        prueba.hasta = Number(oHasta.options[oHasta.selectedIndex].value);
        prueba.inicio = Number(document.getElementById('bd-id-prueba-durInicio').value);
        prueba.medio = Number(document.getElementById('bd-id-prueba-durMedio').value);
        prueba.final = Number(document.getElementById('bd-id-prueba-durFinal').value);
        prueba.pos = prueba.desde;
        for (var i=prueba.pos; i<=prueba.hasta; i++) {
            this.musicas[catalogoMusica.miLista[i-1]].audio.ontimeupdate   =   function()    {
                var tm   =  (this.duration/2) - (prueba.medio/2) ;
                var ct  =   this.currentTime;
                if ((ct > prueba.inicio) && (ct < tm) )  {
                    this.currentTime = tm;
                } else    if ((ct > (tm + prueba.medio)) && (ct < (this.duration - prueba.final)))  {
                    this.currentTime = this.duration - prueba.final;
                }
            };
            this.musicas[this.miLista[i-1]].audio.onended = function() {
                prueba.pos++;
                if (prueba.pos > prueba.hasta) {
                    catalogoMusica.pruebaControlada();
                }   else    {
                    catalogoMusica.play('bd-id-danza-'+prueba.pos, catalogoMusica.miLista[prueba.pos-1]);
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
            for (var i=0; i<this.miLista.length; i++)   {
                this.musicas[this.miLista[i]].audio.onended = null;
                document.getElementById('bd-play-'+(i+1)).disabled =false;
            }
            this.ejecutar=false;
            obutton.innerHTML = 'Iniciar';
            obutton.setAttribute('class','btn btn-success');
            document.getElementById('bd-id-prueba-Iniciar').disabled =false;
            return
        }
        document.getElementById('bd-id-prueba-Iniciar').disabled =true;
        for (var i=0; i<this.miLista.length; i++)   document.getElementById('bd-play-'+(i+1)).disabled =true;
        this.ejecutar = true;
        obutton.innerHTML = 'Detener';
        obutton.setAttribute('class','btn btn-danger');
        const oDesde = document.getElementById('bd-id-ejecutar-desde');
        const oHasta = document.getElementById('bd-id-ejecutar-hasta');
        var ejecucion  =   new Object();
        ejecucion.desde = Number(oDesde.options[oDesde.selectedIndex].value);
        ejecucion.hasta = Number(oHasta.options[oHasta.selectedIndex].value);
        ejecucion.pos = ejecucion.desde;
        for (var i=ejecucion.pos; i<=ejecucion.hasta; i++) {
            this.musicas[this.miLista[i-1]].audio.onended = function() {
                ejecucion.pos++;
                if (ejecucion.pos > ejecucion.hasta) {
                    catalogoMusica.ejecucionControlada();
                }   else    {
                    ejecucion.play();
                }
            };
        }

        ejecucion.play = function ()  {
            const oBt = document.getElementById('bd-tg-consigna-'+ejecucion.pos);
            if (oBt.innerHTML == '❥')    bd_toggleCollapse(oBt, 'bd-consigna-'+ejecucion.pos);
            alert('Indique la consigna, para la siguiente danza...');
            var mostrar = confirm('¿Acepta realizar muestra para ésta danza?');
            if (mostrar)    {
                alert('Al darle Click, la música iniciará en 10 segundos, y podrá iniciar la muestra de la danza')
                setTimeout(function(){ 
                    catalogoMusica.play('bd-id-danza-'+ejecucion.pos, catalogoMusica.miLista[ejecucion.pos-1])
                    setTimeout(function(){ 
                        alert('De click para detener la musica, una vez haya terminado la muestra de la danza');
                        var volumen = catalogoMusica.musicas[catalogoMusica.miLista[ejecucion.pos-1]].audio.volume;
                        catalogoMusica.fade(catalogoMusica.miLista[ejecucion.pos-1],3);
                        setTimeout(function(){
                            catalogoMusica.musicas[catalogoMusica.miLista[ejecucion.pos-1]].audio.pause()
                            catalogoMusica.musicas[catalogoMusica.miLista[ejecucion.pos-1]].audio.currentTime = 0;
                            catalogoMusica.musicas[catalogoMusica.miLista[ejecucion.pos-1]].audio.volume=volumen;
                            alert('A continuación, invite a danzar...');
                            catalogoMusica.musicas[catalogoMusica.miLista[ejecucion.pos-1]].audio.play();    
                        }, 3500);
                    }, 15000);
                }, 10000);
            }   else    {
                alert('Invite a danzar')
                catalogoMusica.play('bd-id-danza-'+ejecucion.pos, catalogoMusica.miLista[ejecucion.pos-1]);
            }
        }        
        ejecucion.play();
    },
    sonando:null,
    idActual:null,
    bgcolor:null,
    fade : function (codigo, segundos)   {
        var audioElement = catalogoMusica.musicas[codigo].audio;
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
    },    
    musicas : {
        "IBF01-01":{nombre:"Free As a Bird",autor:"The Beatles",archivo:"IBF01 - 01 - The Beatles - Free As a Bird.mp3"},
        "IBF01-02":{nombre:"Let It Be",autor:"The Beatles",archivo:"IBF01 - 02 - The Beatles - Let It Be.mp3"},
        "IBF01-03":{nombre:"I Me Mine",autor:"The Beatles",archivo:"IBF01 - 03 - The Beatles - I Me Mine.mp3"},
        "IBF01-04":{nombre:"(Just Like) Starting Over",autor:"Lennon, John",archivo:"IBF01 - 04 - Lennon, John - (Just Like) Starting Over.mp3"},
        "IBF01-06":{nombre:"Behind That Locked Door",autor:"Harrison, George",archivo:"IBF01 - 06 - Harrison, George - Behind That Locked Door.mp3"},
        "IBF01-07":{nombre:"Ballad Of Sir Frankie Crisp (Let It Roll)",autor:"Harrison, George",archivo:"IBF01 - 07 - Harrison, George - Ballad Of Sir Frankie Crisp (Let It Roll).mp3"},
        "IBF01-08":{nombre:"Here Comes The Sun",autor:"The Beatles",archivo:"IBF01 - 08 - The Beatles - Here Comes The Sun.mp3"},
        "IBF01-09":{nombre:"Give Me Love (Give Me Peace On Earth)",autor:"Harrison, George",archivo:"IBF01 - 09 - Harrison, George - Give Me Love (Give Me Peace On Earth).mp3"},
        "IBF01-10":{nombre:"We've Only Just Begun",autor:"Carpenters",archivo:"IBF01 - 10 - Carpenters - We've Only Just Begun.mp3"},
        "IBF01-11":{nombre:"Tema de Amor de Gabriela",autor:"OST Gabriela (Costa, Gal & Jobim, Tom)",archivo:"IBF01 - 11 - OST Gabriela (Costa, Gal & Jobim, Tom) - Tema de Amor de Gabriela.mp3"},
        "IBF01-12":{nombre:"A Deusa Dos Orixas",autor:"Nunes, Clara",archivo:"IBF01 - 12 - Nunes, Clara - A Deusa Dos Orixas.mp3"},
        "IBF01-13":{nombre:"O mar Serenou",autor:"Nunes, Clara",archivo:"IBF01 - 13 - Nunes, Clara - O mar Serenou.mp3"},
        "IBF01-14":{nombre:"Fim de Reinado (ao vivo)",autor:"Carvalho, Beth",archivo:"IBF01 - 14 - Carvalho, Beth - Fim de Reinado (ao vivo).mp3"},
        "IBF01-15":{nombre:"Samba no quintal",autor:"Carvalho, Beth",archivo:"IBF01 - 15 - Carvalho, Beth - Samba no quintal.mp3"},
        "IBF01-16":{nombre:"Aquarela do Brasil",autor:"Santiago, Emilio",archivo:"IBF01 - 16 - Santiago, Emilio - Aquarela do Brasil.mp3"},
        "IBF01-17":{nombre:"To Voltando",autor:"Simone",archivo:"IBF01 - 17 - Simone - To Voltando.mp3"},
        "IBF01-18":{nombre:"A de o (Estamos chegando)",autor:"Nascimento, Milton",archivo:"IBF01 - 18 - Nascimento, Milton - A de o (Estamos chegando).mp3"},
        "IBF01-19":{nombre:"La primavera - 1.Allegro (Le quattro stagioni op.8-1, RV 269)",autor:"Vivaldi (The Royal Vivaldi Symphony)",archivo:"IBF01 - 19 - Vivaldi (The Royal Vivaldi Symphony) - La primavera - 1.Allegro (Le quattro stagioni op.8-1, RV 269).mp3"},
        "IBF01-20":{nombre:"Adagio Concerto per oboe e archi",autor:"A Marcello",archivo:"IBF01 - 20 - A Marcello - Adagio Concerto per oboe e archi.mp3"},
        "IBF01-21":{nombre:"Air (on the G-string), Suite No.3 in D",autor:"Bach (Henryk Szeryng & Sir Neville Marriner & Academy of St. Martin in the Fields)",archivo:"IBF01 - 21 - Bach (Henryk Szeryng & Sir Neville Marriner & Academy of St. Martin in the Fields) - Air (on the G-string), Suite No.3 in D.mp3"},
        "IBF02-01":{nombre:"Oh My Love",autor:"Lennon, John",archivo:"IBF02 - 01 - Lennon, John - Oh My Love.mp3"},
        "IBF02-02":{nombre:"Love",autor:"Lennon, John",archivo:"IBF02 - 02 - Lennon, John - Love.mp3"},
        "IBF02-03":{nombre:"Sete mil vezes",autor:"Veloso, Caetano",archivo:"IBF02 - 03 - Veloso, Caetano - Sete mil vezes.mp3"},
        "IBF02-04":{nombre:"Coqueiro de Itapoa",autor:"Veloso, Caetano",archivo:"IBF02 - 04 - Veloso, Caetano - Coqueiro de Itapoa.mp3"},
        "IBF02-05":{nombre:"Canto do Povo de um lugar",autor:"Veloso, Caetano",archivo:"IBF02 - 05 - Veloso, Caetano - Canto do Povo de um lugar.mp3"},
        "IBF02-06":{nombre:"Coisa mais linda",autor:"Veloso, Caetano",archivo:"IBF02 - 06 - Veloso, Caetano - Coisa mais linda.mp3"},
        "IBF02-07":{nombre:"I'd Have You Anytime",autor:"Harrison, George",archivo:"IBF02 - 07 - Harrison, George - I'd Have You Anytime.mp3"},
        "IBF02-09":{nombre:"Learning To Love You",autor:"Harrison, George",archivo:"IBF02 - 09 - Harrison, George - Learning To Love You.mp3"},
        "IBF02-10":{nombre:"We've Only Just Begun",autor:"Williams, Paul",archivo:"IBF02 - 10 - Williams, Paul - We've Only Just Begun.mp3"},
        "IBF02-11":{nombre:"Nice To Be Around",autor:"Williams, Paul",archivo:"IBF02 - 11 - Williams, Paul - Nice To Be Around.mp3"},
        "IBF02-12":{nombre:"Sleep Warm",autor:"Williams, Paul",archivo:"IBF02 - 12 - Williams, Paul - Sleep Warm.mp3"},
        "IBF02-13":{nombre:"(They Long To Be) Close To You",autor:"Carpenters",archivo:"IBF02 - 13 - Carpenters - (They Long To Be) Close To You.mp3"},
        "IBF02-14":{nombre:"Stewball",autor:"Baez, Joan",archivo:"IBF02 - 14 - Baez, Joan - Stewball.mp3"},
        "IBF02-15":{nombre:"Trem das cores",autor:"Veloso, Caetano",archivo:"IBF02 - 15 - Veloso, Caetano - Trem das cores.mp3"},
        "IBF02-16":{nombre:"Alta Noite",autor:"Monte, Marisa",archivo:"IBF02 - 16 - Monte, Marisa - Alta Noite.mp3"},
        "IBF02-17":{nombre:"Bem Leve",autor:"Monte, Marisa",archivo:"IBF02 - 17 - Monte, Marisa - Bem Leve.mp3"},
        "IBF02-18":{nombre:"Se todos fossem iguais a voce",autor:"de Moraes & Creuza & Toquinho",archivo:"IBF02 - 18 - de Moraes & Creuza & Toquinho - Se todos fossem iguais a voce.mp3"},
        "IBF02-19":{nombre:"Apos o Amanhecer",autor:"Mendes, Sergio",archivo:"IBF02 - 19 - Mendes, Sergio - Apos o Amanhecer.mp3"},
        "IBF02-20":{nombre:"Andanca",autor:"Carvalho, Beth",archivo:"IBF02 - 20 - Carvalho, Beth - Andanca.mp3"},
        "IBF02-21":{nombre:"Xote das meninas",autor:"Monte, Marisa",archivo:"IBF02 - 21 - Monte, Marisa - Xote das meninas.mp3"},
        "IBF02-23":{nombre:"Redescobrir",autor:"Regina, Elis",archivo:"IBF02 - 23 - Regina, Elis - Redescobrir.mp3"},
        "IBF03-01":{nombre:"Gracias a la vida",autor:"Regina, Elis",archivo:"IBF03 - 01 - Regina, Elis - Gracias a la vida.mp3"},
        "IBF03-02":{nombre:"Gracias a la vida",autor:"Sosa, Mercedes",archivo:"IBF03 - 02 - Sosa, Mercedes - Gracias a la vida.mp3"},
        "IBF03-03":{nombre:"Todo Cambia",autor:"Sosa, Mercedes",archivo:"IBF03 - 03 - Sosa, Mercedes - Todo Cambia.mp3"},
        "IBF03-04":{nombre:"Y dale alegria a mi corazon",autor:"Sosa, Mercedes",archivo:"IBF03 - 04 - Sosa, Mercedes - Y dale alegria a mi corazon.mp3"},
        "IBF03-05":{nombre:"Vientos del alma",autor:"Sosa, Mercedes",archivo:"IBF03 - 05 - Sosa, Mercedes - Vientos del alma.mp3"},
        "IBF03-06":{nombre:"Have You Ever Realy Loved A Woman",autor:"OST Don Juan de Marco (Adams, Bryan)",archivo:"IBF03 - 06 - OST Don Juan de Marco (Adams, Bryan) - Have You Ever Realy Loved A Woman.mp3"},
        "IBF03-07":{nombre:"My Sweet Lord",autor:"Harrison, George",archivo:"IBF03 - 07 - Harrison, George - My Sweet Lord.mp3"},
        "IBF03-08":{nombre:"Sing",autor:"Carpenters",archivo:"IBF03 - 08 - Carpenters - Sing.mp3"},
        "IBF03-09":{nombre:"Conto de Areia",autor:"Nunes, Clara",archivo:"IBF03 - 09 - Nunes, Clara - Conto de Areia.mp3"},
        "IBF03-10":{nombre:"Morena flor",autor:"Creuza, Maria",archivo:"IBF03 - 10 - Creuza, Maria - Morena flor.mp3"},
        "IBF03-11":{nombre:"Deixa a vida me levar",autor:"Pagodinho, Zeca",archivo:"IBF03 - 11 - Pagodinho, Zeca - Deixa a vida me levar.mp3"},
        "IBF03-12":{nombre:"Coisa de Pele",autor:"Carvalho, Beth",archivo:"IBF03 - 12 - Carvalho, Beth - Coisa de Pele.mp3"},
        "IBF03-13":{nombre:"Sonhando Eu Sou Feliz",autor:"Carvalho, Beth",archivo:"IBF03 - 13 - Carvalho, Beth - Sonhando Eu Sou Feliz.mp3"},
        "IBF03-14":{nombre:"Rumba Azul",autor:"Veloso, Caetano",archivo:"IBF03 - 14 - Veloso, Caetano - Rumba Azul.mp3"},
        "IBF03-15":{nombre:"Nao Enche",autor:"Veloso, Caetano",archivo:"IBF03 - 15 - Veloso, Caetano - Nao Enche.mp3"},
        "IBF03-16":{nombre:"O que e O que e",autor:"Gonzaguinha",archivo:"IBF03 - 16 - Gonzaguinha - O que e O que e.mp3"},
        "IBF03-17":{nombre:"Allegro - Concerto L'Amoroso - 1, RV 271",autor:"Vivaldi (Herbert von Karajan & Berliner Philharmoniker)",archivo:"IBF03 - 17 - Vivaldi (Herbert von Karajan & Berliner Philharmoniker) - Allegro - Concerto L'Amoroso - 1, RV 271.mp3"},
        "IBF03-19":{nombre:"Gloria in excelsis Deo - Gloria in Re Maggiore - 1, RV 589",autor:"Vivaldi (Riccardo Muti & New Philharmonia Orchestra & Chorus)",archivo:"IBF03 - 19 - Vivaldi (Riccardo Muti & New Philharmonia Orchestra & Chorus) - Gloria in excelsis Deo - Gloria in Re Maggiore - 1, RV 589.mp3"},
        "IBF03-20":{nombre:"Hallelujah - Messiah, HWV 56 - Part II-42",autor:"Haendel (Sir Georg Solti & Chicago Symphony Orchestra & Chorus)",archivo:"IBF03 - 20 - Haendel (Sir Georg Solti & Chicago Symphony Orchestra & Chorus) - Hallelujah - Messiah, HWV 56 - Part II-42.mp3"},
        "IBF04-01":{nombre:"Preciso me encontrar",autor:"Monte, Marisa",archivo:"IBF04 - 01 - Monte, Marisa - Preciso me encontrar.mp3"},
        "IBF04-02":{nombre:"Lenda das Sereias Rainha do Mar",autor:"Monte, Marisa",archivo:"IBF04 - 02 - Monte, Marisa - Lenda das Sereias Rainha do Mar.mp3"},
        "IBF04-03":{nombre:"Olho por Olho",autor:"Carvalho, Beth",archivo:"IBF04 - 03 - Carvalho, Beth - Olho por Olho.mp3"},
        "IBF04-04":{nombre:"Voce, Eu e a Orgia",autor:"Carvalho, Beth",archivo:"IBF04 - 04 - Carvalho, Beth - Voce, Eu e a Orgia.mp3"},
        "IBF04-05":{nombre:"Senhora rezadeira",autor:"Carvalho, Beth",archivo:"IBF04 - 05 - Carvalho, Beth - Senhora rezadeira.mp3"},
        "IBF04-06":{nombre:"Juizio Final",autor:"Nunes, Clara",archivo:"IBF04 - 06 - Nunes, Clara - Juizio Final.mp3"},
        "IBF04-07":{nombre:"Forza da imaginazao",autor:"Carvalho, Beth",archivo:"IBF04 - 07 - Carvalho, Beth - Forza da imaginazao.mp3"},
        "IBF04-08":{nombre:"Canta, Canta minha gente",autor:"da Vila, Martinho",archivo:"IBF04 - 08 - da Vila, Martinho - Canta, Canta minha gente.mp3"},
        "IBF04-10":{nombre:"Folhas secas (ao vivo)",autor:"Carvalho, Beth",archivo:"IBF04 - 10 - Carvalho, Beth - Folhas secas (ao vivo).mp3"},
        "IBF04-11":{nombre:"Pedi ao ceu",autor:"Carvalho, Beth",archivo:"IBF04 - 11 - Carvalho, Beth - Pedi ao ceu.mp3"},
        "IBF04-12":{nombre:"Vai ou Nao Vai",autor:"da Vila, Martinho",archivo:"IBF04 - 12 - da Vila, Martinho - Vai ou Nao Vai.mp3"},
        "IBF04-13":{nombre:"Toda menina baiana",autor:"Gil, Gilberto",archivo:"IBF04 - 13 - Gil, Gilberto - Toda menina baiana.mp3"},
        "IBF04-14":{nombre:"Quilombo, O Eldorado Negro",autor:"Gil, Gilberto",archivo:"IBF04 - 14 - Gil, Gilberto - Quilombo, O Eldorado Negro.mp3"},
        "IBF04-15":{nombre:"Isto Aqui O Que E-E",autor:"Santiago, Emilio",archivo:"IBF04 - 15 - Santiago, Emilio - Isto Aqui O Que E-E.mp3"},
        "IBF04-16":{nombre:"Na linha do mar",autor:"Nunes, Clara",archivo:"IBF04 - 16 - Nunes, Clara - Na linha do mar.mp3"},
        "IBF04-17":{nombre:"Queixa",autor:"Veloso, Caetano",archivo:"IBF04 - 17 - Veloso, Caetano - Queixa.mp3"},
        "IBF04-18":{nombre:"Um Canto de Afoxe Para O Bloco do Ile",autor:"Veloso, Caetano",archivo:"IBF04 - 18 - Veloso, Caetano - Um Canto de Afoxe Para O Bloco do Ile.mp3"},
        "IBF04-19":{nombre:"Portela na Avenida",autor:"Nunes, Clara",archivo:"IBF04 - 19 - Nunes, Clara - Portela na Avenida.mp3"},
        "IBF04-20":{nombre:"A sete chaves-Camarao que dorme a onda leva-Dor de amor (ao vivo)",autor:"Carvalho, Beth",archivo:"IBF04 - 20 - Carvalho, Beth - A sete chaves-Camarao que dorme a onda leva-Dor de amor (ao vivo).mp3"},
        "IBF04-21":{nombre:"Saco de Feijao-Corda no pescozo-Sonhando eu sou feliz (ao vivo)",autor:"Carvalho, Beth",archivo:"IBF04 - 21 - Carvalho, Beth - Saco de Feijao-Corda no pescozo-Sonhando eu sou feliz (ao vivo).mp3"},
        "IBF04-22":{nombre:"Meu Sapato Ja Furou",autor:"Nunes, Clara",archivo:"IBF04 - 22 - Nunes, Clara - Meu Sapato Ja Furou.mp3"},
        "IBF05-01":{nombre:"Bate Corazao",autor:"Ramalho, Elba",archivo:"IBF05 - 01 - Ramalho, Elba - Bate Corazao.mp3"},
        "IBF05-02":{nombre:"Esperando Na Janela",autor:"Gil, Gilberto",archivo:"IBF05 - 02 - Gil, Gilberto - Esperando Na Janela.mp3"},
        "IBF05-03":{nombre:"Paixao de Beata",autor:"do Acordeon, Pinto",archivo:"IBF05 - 03 - do Acordeon, Pinto - Paixao de Beata.mp3"},
        "IBF05-04":{nombre:"Que Nem Vem Vem",autor:"Ramalho, Elba",archivo:"IBF05 - 04 - Ramalho, Elba - Que Nem Vem Vem.mp3"},
        "IBF05-05":{nombre:"Mambo No. 5",autor:"Prado, Perez",archivo:"IBF05 - 05 - Prado, Perez - Mambo No. 5.mp3"},
        "IBF05-06":{nombre:"No Som da Sanfona",autor:"Ramalho, Elba",archivo:"IBF05 - 06 - Ramalho, Elba - No Som da Sanfona.mp3"},
        "IBF05-07":{nombre:"O Encanto do Gantois",autor:"Carvalho, Beth",archivo:"IBF05 - 07 - Carvalho, Beth - O Encanto do Gantois.mp3"},
        "IBF05-08":{nombre:"Valente Nordeste",autor:"Pereira, Nazare",archivo:"IBF05 - 08 - Pereira, Nazare - Valente Nordeste.mp3"},
        "IBF05-09":{nombre:"Eu quero mais",autor:"Carvalho, Beth",archivo:"IBF05 - 09 - Carvalho, Beth - Eu quero mais.mp3"},
        "IBF05-10":{nombre:"Feira de mangaio",autor:"Nunes, Clara & Sivuca",archivo:"IBF05 - 10 - Nunes, Clara & Sivuca - Feira de mangaio.mp3"},
        "IBF05-11":{nombre:"Fava de Cheiro",autor:"Sivuca",archivo:"IBF05 - 11 - Sivuca - Fava de Cheiro.mp3"},
        "IBF05-12":{nombre:"O Baile de Bio Laurinda",autor:"Sivuca",archivo:"IBF05 - 12 - Sivuca - O Baile de Bio Laurinda.mp3"},
        "IBF05-13":{nombre:"Eu quero meu amor",autor:"Ramalho, Elba",archivo:"IBF05 - 13 - Ramalho, Elba - Eu quero meu amor.mp3"},
        "IBF05-14":{nombre:"Feito de encomenda",autor:"Agepe",archivo:"IBF05 - 14 - Agepe - Feito de encomenda.mp3"},
        "IBF05-15":{nombre:"Me gusta tu rosa roja",autor:"Los Wawanco",archivo:"IBF05 - 15 - Los Wawanco - Me gusta tu rosa roja.mp3"},
        "IBF05-16":{nombre:"Me muero por ella",autor:"Cania Brava",archivo:"IBF05 - 16 - Cania Brava - Me muero por ella.mp3"},
        "IBF05-17":{nombre:"Folia Brasileira",autor:"Ramalho, Elba",archivo:"IBF05 - 17 - Ramalho, Elba - Folia Brasileira.mp3"},
        "IBF05-18":{nombre:"La Bilirrubina",autor:"Guerra, Juan Luis y 4.40",archivo:"IBF05 - 18 - Guerra, Juan Luis y 4.40 - La Bilirrubina.mp3"},
        "IBF05-19":{nombre:"Rodopiou",autor:"Pereira, Nazare",archivo:"IBF05 - 19 - Pereira, Nazare - Rodopiou.mp3"},
        "IBF05-20":{nombre:"Festa do interior",autor:"Costa, Gal",archivo:"IBF05 - 20 - Costa, Gal - Festa do interior.mp3"},
        "IBF05-21":{nombre:"Batuque",autor:"Mercury, Daniela",archivo:"IBF05 - 21 - Mercury, Daniela - Batuque.mp3"},
        "IBF05-22":{nombre:"Bumbo da Mangueira",autor:"Costa, Gal",archivo:"IBF05 - 22 - Costa, Gal - Bumbo da Mangueira.mp3"},
        "IBF05-23":{nombre:"Ciranda",autor:"Neri, Antonio ",archivo:"IBF05 - 23 - Neri, Antonio  - Ciranda.mp3"},
        "IBF06-01":{nombre:"Doctor Jazz",autor:"Traditional Jazz Band",archivo:"IBF06 - 01 - Traditional Jazz Band - Doctor Jazz.mp3"},
        "IBF06-02":{nombre:"Hello Dolly!",autor:"Traditional Jazz Band",archivo:"IBF06 - 02 - Traditional Jazz Band - Hello Dolly!.mp3"},
        "IBF06-03":{nombre:"Sweet Georgia Brown",autor:"The New Orleans Banjo Band",archivo:"IBF06 - 03 - The New Orleans Banjo Band - Sweet Georgia Brown.mp3"},
        "IBF06-04":{nombre:"Hello, Goodbye [Part]",autor:"The Beatles",archivo:"IBF06 - 04 - The Beatles - Hello, Goodbye [Part].mp3"},
        "IBF06-05":{nombre:"End Title [Part]",autor:"The New American Orchestra",archivo:"IBF06 - 05 - The New American Orchestra - End Title [Part].mp3"},
        "IBF06-06":{nombre:"The Man I Love",autor:"Antigua Jazz Band",archivo:"IBF06 - 06 - Antigua Jazz Band - The Man I Love.mp3"},
        "IBF06-07":{nombre:"Alexander's Rag Time",autor:"The New Orleans Banjo Band",archivo:"IBF06 - 07 - The New Orleans Banjo Band - Alexander's Rag Time.mp3"},
        "IBF06-08":{nombre:"Honey Pie [Part]",autor:"The Beatles",archivo:"IBF06 - 08 - The Beatles - Honey Pie [Part].mp3"},
        "IBF06-09":{nombre:"Who's Sorry Now",autor:"The New Orleans Banjo Band",archivo:"IBF06 - 09 - The New Orleans Banjo Band - Who's Sorry Now.mp3"},
        "IBF06-10":{nombre:"Mississippi Mud",autor:"Traditional Jazz Band",archivo:"IBF06 - 10 - Traditional Jazz Band - Mississippi Mud.mp3"},
        "IBF06-11":{nombre:"The Faithful Hussar",autor:"Armstrong, Louis",archivo:"IBF06 - 11 - Armstrong, Louis - The Faithful Hussar.mp3"},
        "IBF06-12":{nombre:"A Wink And A Smile",autor:"OST Sleepless In Seattle (Cormik Jr, Harry)",archivo:"IBF06 - 12 - OST Sleepless In Seattle (Cormik Jr, Harry) - A Wink And A Smile.mp3"},
        "IBF06-13":{nombre:"The Darktown Strutter's Ball",autor:"The New Orleans Banjo Band",archivo:"IBF06 - 13 - The New Orleans Banjo Band - The Darktown Strutter's Ball.mp3"},
        "IBF06-14":{nombre:"Ja-Da",autor:"The New Orleans Banjo Band",archivo:"IBF06 - 14 - The New Orleans Banjo Band - Ja-Da.mp3"},
        "IBF06-15":{nombre:"Ain't She Sweet",autor:"The New Orleans Banjo Band",archivo:"IBF06 - 15 - The New Orleans Banjo Band - Ain't She Sweet.mp3"},
        "IBF06-16":{nombre:"Japanese Sandman",autor:"Maddox, Johnny",archivo:"IBF06 - 16 - Maddox, Johnny - Japanese Sandman.mp3"},
        "IBF06-17":{nombre:"My Blue Heaven (vocal Betty Owens)",autor:"The Dukes Of Dixieland",archivo:"IBF06 - 17 - The Dukes Of Dixieland - My Blue Heaven (vocal Betty Owens).mp3"},
        "IBF06-18":{nombre:"Oh! Lady Be Good",autor:"Goodman, Benny",archivo:"IBF06 - 18 - Goodman, Benny - Oh! Lady Be Good.mp3"},
        "IBF06-19":{nombre:"Begin The Beguine",autor:"Light, Enoch & The Light Brigade",archivo:"IBF06 - 19 - Light, Enoch & The Light Brigade - Begin The Beguine.mp3"},
        "IBF06-20":{nombre:"In The Mood",autor:"Light, Enoch & The Light Brigade",archivo:"IBF06 - 20 - Light, Enoch & The Light Brigade - In The Mood.mp3"},
        "IBF06-21":{nombre:"Eh-la-Bas",autor:"Jazz Caliente",archivo:"IBF06 - 21 - Jazz Caliente - Eh-la-Bas.mp3"},
        "IBF06-22":{nombre:"When The Saints Go Marchin' In",autor:"The New Orleans Banjo Band",archivo:"IBF06 - 22 - The New Orleans Banjo Band - When The Saints Go Marchin' In.mp3"},
        "IBF07-01":{nombre:"La vie en rose [Part]",autor:"Jones, Grace",archivo:"IBF07 - 01 - Jones, Grace - La vie en rose [Part].mp3"},
        "IBF07-02":{nombre:"Missa Luba. Kyrie",autor:"Les troubadours du roi Baudoin",archivo:"IBF07 - 02 - Les troubadours du roi Baudoin - Missa Luba. Kyrie.mp3"},
        "IBF07-03":{nombre:"Tiger Rag",autor:"The New Orleans Banjo Band",archivo:"IBF07 - 03 - The New Orleans Banjo Band - Tiger Rag.mp3"},
        "IBF07-04":{nombre:"Be-Bop-A-Lula",autor:"Lennon, John",archivo:"IBF07 - 04 - Lennon, John - Be-Bop-A-Lula.mp3"},
        "IBF07-05":{nombre:"King Porter Stomp",autor:"Goodman, Benny",archivo:"IBF07 - 05 - Goodman, Benny - King Porter Stomp.mp3"},
        "IBF07-06":{nombre:"When You're Smiling",autor:"Maddox, Johnny",archivo:"IBF07 - 06 - Maddox, Johnny - When You're Smiling.mp3"},
        "IBF07-07":{nombre:"Dark Horse",autor:"Harrison, George",archivo:"IBF07 - 07 - Harrison, George - Dark Horse.mp3"},
        "IBF07-08":{nombre:"Rock Around The Clock",autor:"Haley, Bill & His Comets",archivo:"IBF07 - 08 - Haley, Bill & His Comets - Rock Around The Clock.mp3"},
        "IBF07-09":{nombre:"Can't Buy Me Love",autor:"The Beatles",archivo:"IBF07 - 09 - The Beatles - Can't Buy Me Love.mp3"},
        "IBF07-10":{nombre:"Medley. a) Rip It Up - b) Read Teddy",autor:"Lennon, John",archivo:"IBF07 - 10 - Lennon, John - Medley. a) Rip It Up - b) Read Teddy.mp3"},
        "IBF07-11":{nombre:"So pra te mostrar",autor:"Mercury, Daniela",archivo:"IBF07 - 11 - Mercury, Daniela - So pra te mostrar.mp3"},
        "IBF07-12":{nombre:"Riacho [Part]",autor:"Guem",archivo:"IBF07 - 12 - Guem - Riacho [Part].mp3"},
        "IBF07-13":{nombre:"Voyage dans l'au-dela",autor:"Baroty & Dieng",archivo:"IBF07 - 13 - Baroty & Dieng - Voyage dans l'au-dela.mp3"},
        "IBF07-14":{nombre:"Appel des esprits [Part]",autor:"Baroty & Dieng",archivo:"IBF07 - 14 - Baroty & Dieng - Appel des esprits [Part].mp3"},
        "IBF07-15":{nombre:"Ensaio Geral",autor:"Os Ritmistas Brasileiros",archivo:"IBF07 - 15 - Os Ritmistas Brasileiros - Ensaio Geral.mp3"},
        "IBF07-16":{nombre:"Tamborins",autor:"Os Ritmistas Brasileiros",archivo:"IBF07 - 16 - Os Ritmistas Brasileiros - Tamborins.mp3"},
        "IBF07-17":{nombre:"Cidade Vazia",autor:"Milton Banana Trio",archivo:"IBF07 - 17 - Milton Banana Trio - Cidade Vazia.mp3"},
        "IBF07-18":{nombre:"After You've Gone (Take 2)",autor:"Goodman, Benny",archivo:"IBF07 - 18 - Goodman, Benny - After You've Gone (Take 2).mp3"},
        "IBF07-19":{nombre:"Moonlight Serenade",autor:"Light, Enoch & The Light Brigade",archivo:"IBF07 - 19 - Light, Enoch & The Light Brigade - Moonlight Serenade.mp3"},
        "IBF07-20":{nombre:"Sweet Lorraine",autor:"Traditional Jazz Band",archivo:"IBF07 - 20 - Traditional Jazz Band - Sweet Lorraine.mp3"},
        "IBF07-21":{nombre:"An der schonen blauen Donau, op.314 [Part]",autor:"Strauss II, Johann",archivo:"IBF07 - 21 - Strauss II, Johann - An der schonen blauen Donau, op.314 [Part].mp3"},
        "IBF07-22":{nombre:"Kaiserwalzer, op.437",autor:"Strauss II, Johann",archivo:"IBF07 - 22 - Strauss II, Johann - Kaiserwalzer, op.437.mp3"},
        "IBF07-23":{nombre:"Valse - Ballet Coppelia - Acte I-2",autor:"Delibes (David Zinman & Rotterdam Philharmonic Orchestra)",archivo:"IBF07 - 23 - Delibes (David Zinman & Rotterdam Philharmonic Orchestra) - Valse - Ballet Coppelia - Acte I-2.mp3"},
        "IBF07-24":{nombre:"I've Got You Under My Skin",autor:"Fitzgerald, Ella",archivo:"IBF07 - 24 - Fitzgerald, Ella - I've Got You Under My Skin.mp3"},
        "IBF07-25":{nombre:"Harpa paraguaia",autor:"Bordon, Luis",archivo:"IBF07 - 25 - Bordon, Luis - Harpa paraguaia.mp3"},
        "IBF08-01":{nombre:"Hello, Dolly!",autor:"Armstrong, Louis",archivo:"IBF08 - 01 - Armstrong, Louis - Hello, Dolly!.mp3"},
        "IBF08-02":{nombre:"This Can't Be Love",autor:"Cole, Natalie",archivo:"IBF08 - 02 - Cole, Natalie - This Can't Be Love.mp3"},
        "IBF08-03":{nombre:"L-O-V-E",autor:"Cole, Natalie",archivo:"IBF08 - 03 - Cole, Natalie - L-O-V-E.mp3"},
        "IBF08-04":{nombre:"Mack The Knife (Live in Berlin)",autor:"Fitzgerald, Ella",archivo:"IBF08 - 04 - Fitzgerald, Ella - Mack The Knife (Live in Berlin).mp3"},
        "IBF08-05":{nombre:"What Is This Thing Called Love",autor:"Fitzgerald, Ella",archivo:"IBF08 - 05 - Fitzgerald, Ella - What Is This Thing Called Love.mp3"},
        "IBF08-06":{nombre:"Djobi Djoba",autor:"Gipsy Kings",archivo:"IBF08 - 06 - Gipsy Kings - Djobi Djoba.mp3"},
        "IBF08-07":{nombre:"Viento del Arena",autor:"Gipsy Kings",archivo:"IBF08 - 07 - Gipsy Kings - Viento del Arena.mp3"},
        "IBF08-08":{nombre:"Viva la vida",autor:"Chico & The Gipsies",archivo:"IBF08 - 08 - Chico & The Gipsies - Viva la vida.mp3"},
        "IBF08-09":{nombre:"Unforgettable (duet with Nat King Cole)",autor:"Cole, Natalie",archivo:"IBF08 - 09 - Cole, Natalie - Unforgettable (duet with Nat King Cole).mp3"},
        "IBF08-10":{nombre:"Unforgettable",autor:"Franklin, Aretha",archivo:"IBF08 - 10 - Franklin, Aretha - Unforgettable.mp3"},
        "IBF08-11":{nombre:"Years Of Solitude",autor:"Piazzolla-Mulligan",archivo:"IBF08 - 11 - Piazzolla-Mulligan - Years Of Solitude.mp3"},
        "IBF08-12":{nombre:"One (Finale)",autor:"OST A Chorus Line",archivo:"IBF08 - 12 - OST A Chorus Line - One (Finale).mp3"},
        "IBF08-13":{nombre:"My Little Brown Book [Part]",autor:"Coltrane, John & Ellington, Duke",archivo:"IBF08 - 13 - Coltrane, John & Ellington, Duke - My Little Brown Book [Part].mp3"},
        "IBF08-14":{nombre:"Europa (Earth's Cry Heaven's Smile)",autor:"Barbieri, Gato",archivo:"IBF08 - 14 - Barbieri, Gato - Europa (Earth's Cry Heaven's Smile).mp3"},
        "IBF08-15":{nombre:"Quintessence",autor:"Jones, Quincy & His Orchestra",archivo:"IBF08 - 15 - Jones, Quincy & His Orchestra - Quintessence.mp3"},
        "IBF08-16":{nombre:"Say It (Over and Over Again)",autor:"Coltrane, John",archivo:"IBF08 - 16 - Coltrane, John - Say It (Over and Over Again).mp3"},
        "IBF08-17":{nombre:"Love Theme",autor:"The New American Orchestra",archivo:"IBF08 - 17 - The New American Orchestra - Love Theme.mp3"},
        "IBF08-18":{nombre:"In A Sentimal Mood",autor:"Coltrane, John & Ellington, Duke",archivo:"IBF08 - 18 - Coltrane, John & Ellington, Duke - In A Sentimal Mood.mp3"},
        "IBF08-19":{nombre:"You Don't Know Me",autor:"James, Bob & Sanborn, David",archivo:"IBF08 - 19 - James, Bob & Sanborn, David - You Don't Know Me.mp3"},
        "IBF08-20":{nombre:"Theme From Taxi Driver (Sax Tom Scott)",autor:"OST Taxi Driver",archivo:"IBF08 - 20 - OST Taxi Driver - Theme From Taxi Driver (Sax Tom Scott).mp3"},
        "IBF09-01":{nombre:"Because",autor:"The Beatles",archivo:"IBF09 - 01 - The Beatles - Because.mp3"},
        "IBF09-03":{nombre:"Bilitis",autor:"Zamfir, Gheorghe",archivo:"IBF09 - 03 - Zamfir, Gheorghe - Bilitis.mp3"},
        "IBF09-04":{nombre:"Elsha",autor:"Zamfir, Gheorghe",archivo:"IBF09 - 04 - Zamfir, Gheorghe - Elsha.mp3"},
        "IBF09-05":{nombre:"She",autor:"Zamfir, Gheorghe",archivo:"IBF09 - 05 - Zamfir, Gheorghe - She.mp3"},
        "IBF09-06":{nombre:"Rosa",autor:"Poyares, Carlos",archivo:"IBF09 - 06 - Poyares, Carlos - Rosa.mp3"},
        "IBF09-07":{nombre:"Sweet Leilani",autor:"Addeo, Leo",archivo:"IBF09 - 07 - Addeo, Leo - Sweet Leilani.mp3"},
        "IBF09-08":{nombre:"Muito [Part]",autor:"Veloso, Caetano",archivo:"IBF09 - 08 - Veloso, Caetano - Muito [Part].mp3"},
        "IBF09-11":{nombre:"Be Here Now",autor:"Harrison, George",archivo:"IBF09 - 11 - Harrison, George - Be Here Now.mp3"},
        "IBF09-12":{nombre:"Ooh Baby (You Know That I Love You)",autor:"Harrison, George",archivo:"IBF09 - 12 - Harrison, George - Ooh Baby (You Know That I Love You).mp3"},
        "IBF09-13":{nombre:"Who Can See It",autor:"Harrison, George",archivo:"IBF09 - 13 - Harrison, George - Who Can See It.mp3"},
        "IBF09-14":{nombre:"The Answer's At The End",autor:"Harrison, George",archivo:"IBF09 - 14 - Harrison, George - The Answer's At The End.mp3"},
        "IBF09-15":{nombre:"The Light Thas Has Lighted The World",autor:"Harrison, George",archivo:"IBF09 - 15 - Harrison, George - The Light Thas Has Lighted The World.mp3"},
        "IBF09-16":{nombre:"Reigen Seliger Geister (From 'Orfeo ed Euridice') [Part 1]",autor:"Van Leer, Thijs",archivo:"IBF09 - 16 - Van Leer, Thijs - Reigen Seliger Geister (From 'Orfeo ed Euridice') [Part 1].mp3"},
        "IBF09-17":{nombre:"Reigen Seliger Geister (From 'Orfeo ed Euridice') [Part 2]",autor:"Van Leer, Thijs",archivo:"IBF09 - 17 - Van Leer, Thijs - Reigen Seliger Geister (From 'Orfeo ed Euridice') [Part 2].mp3"},
        "IBF09-18":{nombre:"Larghetto (Transcr for Flute-Organ) Violin sonata No 13 D Major - 3, op.11 HWV 371",autor:"Haendel",archivo:"IBF09 - 18 - Haendel - Larghetto (Transcr for Flute-Organ) Violin sonata No 13 D Major - 3, op.11 HWV 371.mp3"},
        "IBF09-19":{nombre:"Adagio - Concerto Brandebourgeois 1 - 2,  F-Dur BWV 1046",autor:"Bach (Herbert Munchner & Sudwest-Studioorchester)",archivo:"IBF09 - 19 - Bach (Herbert Munchner & Sudwest-Studioorchester) - Adagio - Concerto Brandebourgeois 1 - 2,  F-Dur BWV 1046.mp3"},
        "IBF09-20":{nombre:"Oxygene, Pt. 1",autor:"Jarre, Jean Michel",archivo:"IBF09 - 20 - Jarre, Jean Michel - Oxygene, Pt. 1.mp3"},
        "IBF10-01":{nombre:"The Man I Love",autor:"Shepherd, Dave & His Quintet",archivo:"IBF10 - 01 - Shepherd, Dave & His Quintet - The Man I Love.mp3"},
        "IBF10-02":{nombre:"The Man I Love (Live in Berlin)",autor:"Fitzgerald, Ella",archivo:"IBF10 - 02 - Fitzgerald, Ella - The Man I Love (Live in Berlin).mp3"},
        "IBF10-03":{nombre:"Laura",autor:"Fitzgerald, Ella",archivo:"IBF10 - 03 - Fitzgerald, Ella - Laura.mp3"},
        "IBF10-04":{nombre:"Blue Moon",autor:"Fitzgerald, Ella",archivo:"IBF10 - 04 - Fitzgerald, Ella - Blue Moon.mp3"},
        "IBF10-05":{nombre:"Goodbye",autor:"Goodman, Benny",archivo:"IBF10 - 05 - Goodman, Benny - Goodbye.mp3"},
        "IBF10-06":{nombre:"Mood Indigo",autor:"Traditional Jazz Band",archivo:"IBF10 - 06 - Traditional Jazz Band - Mood Indigo.mp3"},
        "IBF10-07":{nombre:"One More Kiss, Dear (Vocal John Bahler)",autor:"The New American Orchestra",archivo:"IBF10 - 07 - The New American Orchestra - One More Kiss, Dear (Vocal John Bahler).mp3"},
        "IBF10-08":{nombre:"Body And Soul (Take 1)",autor:"Goodman, Benny",archivo:"IBF10 - 08 - Goodman, Benny - Body And Soul (Take 1).mp3"},
        "IBF10-09":{nombre:"Moonglow (Take 1)",autor:"Goodman, Benny",archivo:"IBF10 - 09 - Goodman, Benny - Moonglow (Take 1).mp3"},
        "IBF10-10":{nombre:"Theme From Summer Of '42",autor:"Legrand, Michel",archivo:"IBF10 - 10 - Legrand, Michel - Theme From Summer Of '42.mp3"},
        "IBF10-11":{nombre:"Nobody Does It Better (vocal Carly Simon)",autor:"OST James Bond",archivo:"IBF10 - 11 - OST James Bond - Nobody Does It Better (vocal Carly Simon).mp3"},
        "IBF10-12":{nombre:"Feelings",autor:"Albert, Morris",archivo:"IBF10 - 12 - Albert, Morris - Feelings.mp3"},
        "IBF10-13":{nombre:"The Very Thought Of You",autor:"Cole, Natalie",archivo:"IBF10 - 13 - Cole, Natalie - The Very Thought Of You.mp3"},
        "IBF10-14":{nombre:"For Sentimental Reasons-Tenderly",autor:"Cole, Natalie",archivo:"IBF10 - 14 - Cole, Natalie - For Sentimental Reasons-Tenderly.mp3"},
        "IBF10-15":{nombre:"Fascinazao",autor:"Regina, Elis",archivo:"IBF10 - 15 - Regina, Elis - Fascinazao.mp3"},
        "IBF10-16":{nombre:"Moza",autor:"Wando",archivo:"IBF10 - 16 - Wando - Moza.mp3"},
        "IBF10-17":{nombre:"Improvisasion",autor:"Franz, Charles",archivo:"IBF10 - 17 - Franz, Charles - Improvisasion.mp3"},
        "IBF10-18":{nombre:"Poco Allegretto - Sinfonie 3 F-Dur - 3, op.90",autor:"Brahms (Christoph von Dohnanyi & The Cleveland Orchestra)",archivo:"IBF10 - 18 - Brahms (Christoph von Dohnanyi & The Cleveland Orchestra) - Poco Allegretto - Sinfonie 3 F-Dur - 3, op.90.mp3"},
        "IBF10-20":{nombre:"Poeme Op 41 No6",autor:"Fibich",archivo:"IBF10 - 20 - Fibich - Poeme Op 41 No6.mp3"},
        "IBF10-21":{nombre:"Largo - Prelude No4 en mi mineur - 24 Preludes, op. 28",autor:"Chopin",archivo:"IBF10 - 21 - Chopin - Largo - Prelude No4 en mi mineur - 24 Preludes, op. 28.mp3"},
        "IBF11-01":{nombre:"Tamba-Taja",autor:"de Belem, Fafa",archivo:"IBF11 - 01 - de Belem, Fafa - Tamba-Taja.mp3"},
        "IBF11-02":{nombre:"Pode entrar",autor:"de Belem, Fafa",archivo:"IBF11 - 02 - de Belem, Fafa - Pode entrar.mp3"},
        "IBF11-03":{nombre:"Araguaia",autor:"de Belem, Fafa",archivo:"IBF11 - 03 - de Belem, Fafa - Araguaia.mp3"},
        "IBF11-04":{nombre:"Little Girl Blue",autor:"Simone, Nina",archivo:"IBF11 - 04 - Simone, Nina - Little Girl Blue.mp3"},
        "IBF11-05":{nombre:"Evening Falls...",autor:"Enya",archivo:"IBF11 - 05 - Enya - Evening Falls....mp3"},
        "IBF11-06":{nombre:"The First Time Ever I Saw Your Face",autor:"Flack, Roberta",archivo:"IBF11 - 06 - Flack, Roberta - The First Time Ever I Saw Your Face.mp3"},
        "IBF11-07":{nombre:"Meditation de Thais (d'apres Jules Massenet)",autor:"Zamfir, Gheorghe",archivo:"IBF11 - 07 - Zamfir, Gheorghe - Meditation de Thais (d'apres Jules Massenet).mp3"},
        "IBF11-08":{nombre:"Magie d'amour",autor:"Posit, Jean Pierre",archivo:"IBF11 - 08 - Posit, Jean Pierre - Magie d'amour.mp3"},
        "IBF11-09":{nombre:"Earth Born",autor:"Kitaro",archivo:"IBF11 - 09 - Kitaro - Earth Born.mp3"},
        "IBF11-10":{nombre:"To Go Beyond, Pt. 2",autor:"Enya",archivo:"IBF11 - 10 - Enya - To Go Beyond, Pt. 2.mp3"},
        "IBF11-11":{nombre:"Watermark",autor:"Enya",archivo:"IBF11 - 11 - Enya - Watermark.mp3"},
        "IBF11-12":{nombre:"Liebestraum No3 in As-Dur - Liebestraume, S.541",autor:"Liszt (Daniel Barenboim)",archivo:"IBF11 - 12 - Liszt (Daniel Barenboim) - Liebestraum No3 in As-Dur - Liebestraume, S.541.mp3"},
        "IBF11-13":{nombre:"Impromptu No3 in Ges-Dur (Andante) - Impromptus op.90 D 899",autor:"Schubert (Krystian Zimerman)",archivo:"IBF11 - 13 - Schubert (Krystian Zimerman) - Impromptu No3 in Ges-Dur (Andante) - Impromptus op.90 D 899.mp3"},
        "IBF11-14":{nombre:"Consolation No3 en Re bemol Majeur (Lento placido) - Six consolations, S 172",autor:"Liszt (Daniel Barenboim)",archivo:"IBF11 - 14 - Liszt (Daniel Barenboim) - Consolation No3 en Re bemol Majeur (Lento placido) - Six consolations, S 172.mp3"},
        "IBF11-15":{nombre:"Andante con moto (Version 2) - Klaviertrio No2 in Es-Dur - 2, op.100 D 929",autor:"Schubert (OST The Hunger)",archivo:"IBF11 - 15 - Schubert (OST The Hunger) - Andante con moto (Version 2) - Klaviertrio No2 in Es-Dur - 2, op.100 D 929.mp3"},
        "IBF11-16":{nombre:"Imagine",autor:"Lennon, John",archivo:"IBF11 - 16 - Lennon, John - Imagine.mp3"},
        "IBF11-17":{nombre:"La Moldava",autor:"Smetana",archivo:"IBF11 - 17 - Smetana - La Moldava.mp3"},
        "IBF11-18":{nombre:"Photographs",autor:"Mouskouri, Nana",archivo:"IBF11 - 18 - Mouskouri, Nana - Photographs.mp3"},
        "IBF11-19":{nombre:"A noite do meu bem",autor:"Creuza, Maria",archivo:"IBF11 - 19 - Creuza, Maria - A noite do meu bem.mp3"},
        "IBF11-20":{nombre:"Pra dizer adeus",autor:"Jobim, Tom & Lobo, Edu",archivo:"IBF11 - 20 - Jobim, Tom & Lobo, Edu - Pra dizer adeus.mp3"},
        "IBF12-01":{nombre:"Eu sei que vou te amar",autor:"de Moraes&Creuza&Toquinho",archivo:"IBF12 - 01 - de Moraes&Creuza&Toquinho - Eu sei que vou te amar.mp3"},
        "IBF12-02":{nombre:"Minha Namorada",autor:"de Moraes&Creuza&Toquinho",archivo:"IBF12 - 02 - de Moraes&Creuza&Toquinho - Minha Namorada.mp3"},
        "IBF12-03":{nombre:"Eu e a brisa",autor:"Creuza, Maria",archivo:"IBF12 - 03 - Creuza, Maria - Eu e a brisa.mp3"},
        "IBF12-04":{nombre:"Comezaria tudo otra vez",autor:"Simone",archivo:"IBF12 - 04 - Simone - Comezaria tudo otra vez.mp3"},
        "IBF12-05":{nombre:"A noite do meu bem",autor:"Caymmi, Nana",archivo:"IBF12 - 05 - Caymmi, Nana - A noite do meu bem.mp3"},
        "IBF12-06":{nombre:"Manha de carnaval",autor:"Santiago, Emilio",archivo:"IBF12 - 06 - Santiago, Emilio - Manha de carnaval.mp3"},
        "IBF12-07":{nombre:"Insensatez",autor:"Santiago, Emilio",archivo:"IBF12 - 07 - Santiago, Emilio - Insensatez.mp3"},
        "IBF12-08":{nombre:"Corcovado",autor:"Santiago, Emilio",archivo:"IBF12 - 08 - Santiago, Emilio - Corcovado.mp3"},
        "IBF12-09":{nombre:"Simples carinho",autor:"Simone",archivo:"IBF12 - 09 - Simone - Simples carinho.mp3"},
        "IBF12-10":{nombre:"Jura secreta",autor:"Simone",archivo:"IBF12 - 10 - Simone - Jura secreta.mp3"},
        "IBF12-11":{nombre:"Eu disse adeus",autor:"Creuza, Maria",archivo:"IBF12 - 11 - Creuza, Maria - Eu disse adeus.mp3"},
        "IBF12-12":{nombre:"Grazas a deus",autor:"Creuza, Maria",archivo:"IBF12 - 12 - Creuza, Maria - Grazas a deus.mp3"},
        "IBF12-13":{nombre:"Pra voce",autor:"Caymmi, Nana",archivo:"IBF12 - 13 - Caymmi, Nana - Pra voce.mp3"},
        "IBF12-14":{nombre:"Doce Presenza",autor:"Caymmi, Nana",archivo:"IBF12 - 14 - Caymmi, Nana - Doce Presenza.mp3"},
        "IBF12-15":{nombre:"O Amor e chama",autor:"Caymmi, Nana",archivo:"IBF12 - 15 - Caymmi, Nana - O Amor e chama.mp3"},
        "IBF12-16":{nombre:"Someone To Watch Over Me",autor:"Peixoto, Araken",archivo:"IBF12 - 16 - Peixoto, Araken - Someone To Watch Over Me.mp3"},
        "IBF12-17":{nombre:"Estate",autor:"Peixoto, Araken",archivo:"IBF12 - 17 - Peixoto, Araken - Estate.mp3"},
        "IBF12-18":{nombre:"Nature Boy",autor:"Peixoto, Araken",archivo:"IBF12 - 18 - Peixoto, Araken - Nature Boy.mp3"},
        "IBF12-19":{nombre:"As Time Goes By",autor:"Peixoto, Araken",archivo:"IBF12 - 19 - Peixoto, Araken - As Time Goes By.mp3"},
        "IBF12-20":{nombre:"Flamingo",autor:"Peixoto, Araken",archivo:"IBF12 - 20 - Peixoto, Araken - Flamingo.mp3"},
        "IBF12-21":{nombre:"Who Needs Forever",autor:"Peixoto, Araken",archivo:"IBF12 - 21 - Peixoto, Araken - Who Needs Forever.mp3"},
        "IBF13-01":{nombre:"I Miss You So",autor:"Krall, Diana",archivo:"IBF13 - 01 - Krall, Diana - I Miss You So.mp3"},
        "IBF13-02":{nombre:"When I Fall In Love",autor:"Merrill, Helen",archivo:"IBF13 - 02 - Merrill, Helen - When I Fall In Love.mp3"},
        "IBF13-03":{nombre:"Atras da porta",autor:"Caymmi, Nana",archivo:"IBF13 - 03 - Caymmi, Nana - Atras da porta.mp3"},
        "IBF13-04":{nombre:"Apelo",autor:"Creuza, Maria",archivo:"IBF13 - 04 - Creuza, Maria - Apelo.mp3"},
        "IBF13-05":{nombre:"I Don't Stand A Ghost Of A Chance With You",autor:"Krall, Diana",archivo:"IBF13 - 05 - Krall, Diana - I Don't Stand A Ghost Of A Chance With You.mp3"},
        "IBF13-06":{nombre:"Almost Blue",autor:"Baker, Chet",archivo:"IBF13 - 06 - Baker, Chet - Almost Blue.mp3"},
        "IBF13-07":{nombre:"O que Sera",autor:"Simone",archivo:"IBF13 - 07 - Simone - O que Sera.mp3"},
        "IBF13-08":{nombre:"Isso e aquilo",autor:"Caymmi, Nana",archivo:"IBF13 - 08 - Caymmi, Nana - Isso e aquilo.mp3"},
        "IBF13-09":{nombre:"Voz e Suor",autor:"Caymmi, Nana",archivo:"IBF13 - 09 - Caymmi, Nana - Voz e Suor.mp3"},
        "IBF13-10":{nombre:"Velho Piano",autor:"Caymmi, Nana",archivo:"IBF13 - 10 - Caymmi, Nana - Velho Piano.mp3"},
        "IBF13-11":{nombre:"Neste mesmo lugar",autor:"Caymmi, Nana",archivo:"IBF13 - 11 - Caymmi, Nana - Neste mesmo lugar.mp3"},
        "IBF13-12":{nombre:"Por causa de voze",autor:"Caymmi, Nana",archivo:"IBF13 - 12 - Caymmi, Nana - Por causa de voze.mp3"},
        "IBF13-13":{nombre:"Por toda minha vida",autor:"Caymmi, Nana",archivo:"IBF13 - 13 - Caymmi, Nana - Por toda minha vida.mp3"},
        "IBF13-14":{nombre:"Valera a pena",autor:"Caymmi, Nana",archivo:"IBF13 - 14 - Caymmi, Nana - Valera a pena.mp3"},
        "IBF13-15":{nombre:"Nunca mais",autor:"Caymmi, Nana",archivo:"IBF13 - 15 - Caymmi, Nana - Nunca mais.mp3"},
        "IBF13-16":{nombre:"Rama de nuvens",autor:"Caymmi, Nana",archivo:"IBF13 - 16 - Caymmi, Nana - Rama de nuvens.mp3"},
        "IBF13-17":{nombre:"Medo de amar No 2",autor:"Creuza, Maria",archivo:"IBF13 - 17 - Creuza, Maria - Medo de amar No 2.mp3"},
        "IBF13-18":{nombre:"Proposta",autor:"Simone",archivo:"IBF13 - 18 - Simone - Proposta.mp3"},
        "IBF13-19":{nombre:"Summertime",autor:"Merrill, Helen",archivo:"IBF13 - 19 - Merrill, Helen - Summertime.mp3"},
        "IBF13-20":{nombre:"I See Your Face Before Me",autor:"Merrill, Helen",archivo:"IBF13 - 20 - Merrill, Helen - I See Your Face Before Me.mp3"},
        "IBF13-21":{nombre:"Angel Eyes",autor:"Merrill, Helen",archivo:"IBF13 - 21 - Merrill, Helen - Angel Eyes.mp3"},
        "IBF13-22":{nombre:"I'll Be Around",autor:"Merrill, Helen",archivo:"IBF13 - 22 - Merrill, Helen - I'll Be Around.mp3"},
        "IBF14-01":{nombre:"Samba em preludio",autor:"de Moraes&Creuza&Toquinho",archivo:"IBF14 - 01 - de Moraes&Creuza&Toquinho - Samba em preludio.mp3"},
        "IBF14-02":{nombre:"Corcovado (feat. Astrud Gilberto)",autor:"Getz, Stan & Gilberto, Joao",archivo:"IBF14 - 02 - Getz, Stan & Gilberto, Joao - Corcovado (feat. Astrud Gilberto).mp3"},
        "IBF14-03":{nombre:"The Girl From Ipanema (feat. Astrud Gilberto)",autor:"Getz, Stan & Gilberto, Joao",archivo:"IBF14 - 03 - Getz, Stan & Gilberto, Joao - The Girl From Ipanema (feat. Astrud Gilberto).mp3"},
        "IBF14-04":{nombre:"Anos dourados-Eu sei que vou te amar",autor:"Santiago, Emilio",archivo:"IBF14 - 04 - Santiago, Emilio - Anos dourados-Eu sei que vou te amar.mp3"},
        "IBF14-05":{nombre:"Nada por Mim-Fullgas",autor:"Santiago, Emilio",archivo:"IBF14 - 05 - Santiago, Emilio - Nada por Mim-Fullgas.mp3"},
        "IBF14-06":{nombre:"Ronda-Sampa",autor:"Santiago, Emilio",archivo:"IBF14 - 06 - Santiago, Emilio - Ronda-Sampa.mp3"},
        "IBF14-07":{nombre:"Verdade chinesa",autor:"Santiago, Emilio",archivo:"IBF14 - 07 - Santiago, Emilio - Verdade chinesa.mp3"},
        "IBF14-08":{nombre:"Perola Negra-Bem que se Quis",autor:"Santiago, Emilio",archivo:"IBF14 - 08 - Santiago, Emilio - Perola Negra-Bem que se Quis.mp3"},
        "IBF14-09":{nombre:"Mania de Voce-Lanza Perfume",autor:"Santiago, Emilio",archivo:"IBF14 - 09 - Santiago, Emilio - Mania de Voce-Lanza Perfume.mp3"},
        "IBF14-10":{nombre:"De onde vens",autor:"Creuza, Maria",archivo:"IBF14 - 10 - Creuza, Maria - De onde vens.mp3"},
        "IBF14-11":{nombre:"Queixas",autor:"Creuza, Maria",archivo:"IBF14 - 11 - Creuza, Maria - Queixas.mp3"},
        "IBF14-12":{nombre:"Mas que doidice",autor:"Creuza, Maria",archivo:"IBF14 - 12 - Creuza, Maria - Mas que doidice.mp3"},
        "IBF14-13":{nombre:"Foi a noite",autor:"Creuza, Maria",archivo:"IBF14 - 13 - Creuza, Maria - Foi a noite.mp3"},
        "IBF14-14":{nombre:"Voce abusou",autor:"Creuza, Maria",archivo:"IBF14 - 14 - Creuza, Maria - Voce abusou.mp3"},
        "IBF14-15":{nombre:"Uomo del Sud (Violin)",autor:"Piazzolla, Astor & Agri, Antonio",archivo:"IBF14 - 15 - Piazzolla, Astor & Agri, Antonio - Uomo del Sud (Violin).mp3"},
        "IBF14-16":{nombre:"Libertango",autor:"Piazzolla, Astor",archivo:"IBF14 - 16 - Piazzolla, Astor - Libertango.mp3"},
        "IBF14-17":{nombre:"What A Diff'rence A Day Made",autor:"Franklin, Aretha",archivo:"IBF14 - 17 - Franklin, Aretha - What A Diff'rence A Day Made.mp3"},
        "IBF14-18":{nombre:"Mood Indigo",autor:"Fitzgerald, Ella",archivo:"IBF14 - 18 - Fitzgerald, Ella - Mood Indigo.mp3"},
        "IBF14-19":{nombre:"Is He The One",autor:"OST Somewhere In Time",archivo:"IBF14 - 19 - OST Somewhere In Time - Is He The One.mp3"},
        "IBF15-01":{nombre:"Einleitung - Also sprach Zarathustra op.30",autor:"Strauss, Richard (Zubin Mehta & Los Angeles Philharmonic)",archivo:"IBF15 - 01 - Strauss, Richard (Zubin Mehta & Los Angeles Philharmonic) - Einleitung - Also sprach Zarathustra op.30.mp3"},
        "IBF15-02":{nombre:"Japanese Drums",autor:"Kitaro",archivo:"IBF15 - 02 - Kitaro - Japanese Drums.mp3"},
        "IBF15-03":{nombre:"Have A Cigar",autor:"Pink Floyd",archivo:"IBF15 - 03 - Pink Floyd - Have A Cigar.mp3"},
        "IBF15-04":{nombre:"Oikan Ayns Bethlehem",autor:"Christian, Emma",archivo:"IBF15 - 04 - Christian, Emma - Oikan Ayns Bethlehem.mp3"},
        "IBF15-05":{nombre:"Self Portrait (Of The Bean)",autor:"Ellington, Duke & Hawkins, Coleman",archivo:"IBF15 - 05 - Ellington, Duke & Hawkins, Coleman - Self Portrait (Of The Bean).mp3"},
        "IBF15-06":{nombre:"Day Dream",autor:"Ellington, Duke",archivo:"IBF15 - 06 - Ellington, Duke - Day Dream.mp3"},
        "IBF15-07":{nombre:"Negro Gato",autor:"Monte, Marisa",archivo:"IBF15 - 07 - Monte, Marisa - Negro Gato.mp3"},
        "IBF15-08":{nombre:"Adios Nonino",autor:"Piazzolla, Astor",archivo:"IBF15 - 08 - Piazzolla, Astor - Adios Nonino.mp3"},
        "IBF15-09":{nombre:"Zdrowas Mario",autor:"OST Chamanka (Korzinski, Andrzej)",archivo:"IBF15 - 09 - OST Chamanka (Korzinski, Andrzej) - Zdrowas Mario.mp3"},
        "IBF15-10":{nombre:"The More I See You",autor:"Montez, Chris",archivo:"IBF15 - 10 - Montez, Chris - The More I See You.mp3"},
        "IBF15-11":{nombre:"Crime Of The Century [Part, long]",autor:"Supertramp",archivo:"IBF15 - 11 - Supertramp - Crime Of The Century [Part, long].mp3"},
        "IBF15-12":{nombre:"Presto - Concerto 'L'estate' in sol minore - 3 (Le quattro stagioni Op.8-2, RV 315)",autor:"Vivaldi (The Royal Vivaldi Symphony)",archivo:"IBF15 - 12 - Vivaldi (The Royal Vivaldi Symphony) - Presto - Concerto 'L'estate' in sol minore - 3 (Le quattro stagioni Op.8-2, RV 315).mp3"},
        "IBF15-13":{nombre:"Danze Polovesiane del Principe",autor:"Igor  Borodin",archivo:"IBF15 - 13 - Igor  Borodin - Danze Polovesiane del Principe.mp3"},
        "IBF15-14":{nombre:"Allegro con brio [Part] - Sinfonie 5 c-moll op.67 - 1",autor:"Beethoven (William Bowles & Royal Festival Orchestra)",archivo:"IBF15 - 14 - Beethoven (William Bowles & Royal Festival Orchestra) - Allegro con brio [Part] - Sinfonie 5 c-moll op.67 - 1.mp3"},
        "IBF15-15":{nombre:"Argo La Primavera",autor:"Vivaldi",archivo:"IBF15 - 15 - Vivaldi - Argo La Primavera.mp3"},
        "IBF15-16":{nombre:"Adagio  L Autunno",autor:"Vivaldi",archivo:"IBF15 - 16 - Vivaldi - Adagio  L Autunno.mp3"},
        "IBF15-18":{nombre:"Reigen Seliger Geister (From 'Orfeo ed Euridice')",autor:"Van Leer, Thijs",archivo:"IBF15 - 18 - Van Leer, Thijs - Reigen Seliger Geister (From 'Orfeo ed Euridice').mp3"},
        "IBF15-19":{nombre:"Finlandia (Symphonic poem) op. 26",autor:"Sibelius (Marko Munih & Radio Sinfonie Orchester Ljubljana)",archivo:"IBF15 - 19 - Sibelius (Marko Munih & Radio Sinfonie Orchester Ljubljana) - Finlandia (Symphonic poem) op. 26.mp3"},
        "IBF15-20":{nombre:"The Great Gig In The Sky",autor:"Pink Floyd",archivo:"IBF15 - 20 - Pink Floyd - The Great Gig In The Sky.mp3"},
        "IBF16-01":{nombre:"Zorba's Dance",autor:"Theodorakis, Mikis",archivo:"IBF16 - 01 - Theodorakis, Mikis - Zorba's Dance.mp3"},
        "IBF16-02":{nombre:"Once again (Outre Vez)",autor:"Getz, Stan with Astrud & Joao Gilberto",archivo:"IBF16 - 02 - Getz, Stan with Astrud & Joao Gilberto - Once again (Outre Vez).mp3"},
        "IBF16-03":{nombre:"Insensatez",autor:"Getz, Stan with Astrud & Joao Gilberto",archivo:"IBF16 - 03 - Getz, Stan with Astrud & Joao Gilberto - Insensatez.mp3"},
        "IBF16-04":{nombre:"Miss Celie's Blues (Sister) (1922 Jook Joint) (Vocal Tata Vega)",autor:"OST The Color Purple",archivo:"IBF16 - 04 - OST The Color Purple - Miss Celie's Blues (Sister) (1922 Jook Joint) (Vocal Tata Vega).mp3"},
        "IBF16-05":{nombre:"I'm Just A Lucky So-And-So",autor:"Merrill, Helen",archivo:"IBF16 - 05 - Merrill, Helen - I'm Just A Lucky So-And-So.mp3"},
        "IBF16-06":{nombre:"Baby It's Cold Outside",autor:"Ray, Charles & Carter, Betty",archivo:"IBF16 - 06 - Ray, Charles & Carter, Betty - Baby It's Cold Outside.mp3"},
        "IBF16-07":{nombre:"Lost Mind",autor:"Krall, Diana",archivo:"IBF16 - 07 - Krall, Diana - Lost Mind.mp3"},
        "IBF16-08":{nombre:"Canzao de Amor - Floresta do Amazonas (Vocal Bidu Sayao)",autor:"Villa&Lobos, Heitor",archivo:"IBF16 - 08 - Villa&Lobos, Heitor - Canzao de Amor - Floresta do Amazonas (Vocal Bidu Sayao).mp3"},
        "IBF16-09":{nombre:"Ouverture [Part]",autor:"OST Le Grand Bleu",archivo:"IBF16 - 09 - OST Le Grand Bleu - Ouverture [Part].mp3"},
        "IBF16-10":{nombre:"Revolution, revolutions [Part]",autor:"Jarre, Jean Michel",archivo:"IBF16 - 10 - Jarre, Jean Michel - Revolution, revolutions [Part].mp3"},
        "IBF16-11":{nombre:"Revolution Industrielle. Ouverture",autor:"Jarre, Jean Michel",archivo:"IBF16 - 11 - Jarre, Jean Michel - Revolution Industrielle. Ouverture.mp3"},
        "IBF16-12":{nombre:"Revolution Industrielle, Pt.3",autor:"Jarre, Jean Michel",archivo:"IBF16 - 12 - Jarre, Jean Michel - Revolution Industrielle, Pt.3.mp3"},
        "IBF16-13":{nombre:"Allegronon moltoL inverno",autor:"Vivaldi",archivo:"IBF16 - 13 - Vivaldi - Allegronon moltoL inverno.mp3"},
        "IBF16-14":{nombre:"Vandana",autor:"Shankar, Ravi",archivo:"IBF16 - 14 - Shankar, Ravi - Vandana.mp3"},
        "IBF16-15":{nombre:"Raga Adana",autor:"Shankar, Ravi & Previn, Andre",archivo:"IBF16 - 15 - Shankar, Ravi & Previn, Andre - Raga Adana.mp3"},
        "IBF16-16":{nombre:"[Real World]",autor:"OST The Mahabharata",archivo:"IBF16 - 16 - OST The Mahabharata - [Real World].mp3"},
        "IBF16-17":{nombre:"Rosa das Rosas",autor:"Les Musiciens de Provence",archivo:"IBF16 - 17 - Les Musiciens de Provence - Rosa das Rosas.mp3"},
        "IBF16-18":{nombre:"Heaven & Hell, 3rd Movement - Theme From The TV Series 'Cosmos'",autor:"Vangelis",archivo:"IBF16 - 18 - Vangelis - Heaven & Hell, 3rd Movement - Theme From The TV Series 'Cosmos'.mp3"},
        "IBF16-19":{nombre:"Mandala",autor:"Kitaro",archivo:"IBF16 - 19 - Kitaro - Mandala.mp3"},
        "IBF16-20":{nombre:"Andante (La tempesta di Mare)",autor:"Salieri, Francesco (Claudio Scimone & I Solisti Veneti)",archivo:"IBF16 - 20 - Salieri, Francesco (Claudio Scimone & I Solisti Veneti) - Andante (La tempesta di Mare).mp3"},
        "IBF17-01":{nombre:"La petite fille de la mer",autor:"Vangelis",archivo:"IBF17 - 01 - Vangelis - La petite fille de la mer.mp3"},
        "IBF17-02":{nombre:"My Darling Child",autor:"O'Connor, Sinead",archivo:"IBF17 - 02 - O'Connor, Sinead - My Darling Child.mp3"},
        "IBF17-04":{nombre:"L'horloge de ma vie",autor:"Posit, Jean Pierre",archivo:"IBF17 - 04 - Posit, Jean Pierre - L'horloge de ma vie.mp3"},
        "IBF17-05":{nombre:"Ponteio",autor:"Branco, Waltel",archivo:"IBF17 - 05 - Branco, Waltel - Ponteio.mp3"},
        "IBF17-06":{nombre:"Blue Lotus",autor:"Berglund, Erik",archivo:"IBF17 - 06 - Berglund, Erik - Blue Lotus.mp3"},
        "IBF17-07":{nombre:"Clair de lune - Suite Bergamasque pour piano - 3, orchestral version",autor:"Debussy (Henrique Simonetti & Orquestra de Camera RGE)",archivo:"IBF17 - 07 - Debussy (Henrique Simonetti & Orquestra de Camera RGE) - Clair de lune - Suite Bergamasque pour piano - 3, orchestral version.mp3"},
        "IBF17-08":{nombre:"Amora",autor:"Creuza, Maria",archivo:"IBF17 - 08 - Creuza, Maria - Amora.mp3"},
        "IBF17-09":{nombre:"Meditation - Entracte de l'acte II (Opera Thais)",autor:"Massenet (Henrique Simonetti & Orquestra de Camera RGE)",archivo:"IBF17 - 09 - Massenet (Henrique Simonetti & Orquestra de Camera RGE) - Meditation - Entracte de l'acte II (Opera Thais).mp3"},
        "IBF17-10":{nombre:"Caravansary",autor:"Kitaro",archivo:"IBF17 - 10 - Kitaro - Caravansary.mp3"},
        "IBF17-11":{nombre:"September Fifteenth (dedicated to Bill Evans) [Part]",autor:"Metheny, Pat & Mays, Lyle",archivo:"IBF17 - 11 - Metheny, Pat & Mays, Lyle - September Fifteenth (dedicated to Bill Evans) [Part].mp3"},
        "IBF17-12":{nombre:"Adagietto [Part] - Sinfonie 5 cis-moll - 4",autor:"Mahler (Anton Nanut & Radio-Symphony Orchestra Lubljana)",archivo:"IBF17 - 12 - Mahler (Anton Nanut & Radio-Symphony Orchestra Lubljana) - Adagietto [Part] - Sinfonie 5 cis-moll - 4.mp3"},
        "IBF17-13":{nombre:"Suo Gan",autor:"OST Empire Of The Sun (Ambrosian Junior Choir)",archivo:"IBF17 - 13 - OST Empire Of The Sun (Ambrosian Junior Choir) - Suo Gan.mp3"},
        "IBF17-14":{nombre:"el-HADRA - The Mystic Dance [Part]",autor:"Wiese, Klaus",archivo:"IBF17 - 14 - Wiese, Klaus - el-HADRA - The Mystic Dance [Part].mp3"},
        "IBF17-15":{nombre:"Adagio - Streichquintett in C-Dur - 2, op.post.163 D 956 [Part]",autor:"Schubert (Miklos Perenyi & Bartok Quartet)",archivo:"IBF17 - 15 - Schubert (Miklos Perenyi & Bartok Quartet) - Adagio - Streichquintett in C-Dur - 2, op.post.163 D 956 [Part].mp3"},
        "IBF17-16":{nombre:"Ave Maria (after Johann Sebastian Bach)",autor:"Gounod (Henrique Simonetti & Orquestra de Camera RGE)",archivo:"IBF17 - 16 - Gounod (Henrique Simonetti & Orquestra de Camera RGE) - Ave Maria (after Johann Sebastian Bach).mp3"},
        "IBF17-19":{nombre:"Gloria in excelsis Deo - Gloria in RE Maggiore - 1, RV 589",autor:"Vivaldi (Trevor Pinnock & The English Concert & Choir)",archivo:"IBF17 - 19 - Vivaldi (Trevor Pinnock & The English Concert & Choir) - Gloria in excelsis Deo - Gloria in RE Maggiore - 1, RV 589.mp3"},
        "IBF18-01":{nombre:"Shine On You Crazy Diamond, Pts.1-5 [Part 1]",autor:"Pink Floyd",archivo:"IBF18 - 01 - Pink Floyd - Shine On You Crazy Diamond, Pts.1-5 [Part 1].mp3"},
        "IBF18-02":{nombre:"Selig sind, die da leid tragen [Part] - Ein deutsches Requiem op.45 - 1",autor:"Brahms",archivo:"IBF18 - 02 - Brahms - Selig sind, die da leid tragen [Part] - Ein deutsches Requiem op.45 - 1.mp3"},
        "IBF18-03":{nombre:"Largo Conc. No7",autor:"Vivaldi",archivo:"IBF18 - 03 - Vivaldi - Largo Conc. No7.mp3"},
        "IBF18-04":{nombre:"Prelude Electronique",autor:"OST 2001 Odyssee de l'espace",archivo:"IBF18 - 04 - OST 2001 Odyssee de l'espace - Prelude Electronique.mp3"},
        "IBF18-06":{nombre:"Rainbow Voice",autor:"The Harmonic Choir",archivo:"IBF18 - 06 - The Harmonic Choir - Rainbow Voice.mp3"},
        "IBF18-07":{nombre:"Eric's Theme",autor:"OST Chariots Of Fire (Vangelis)",archivo:"IBF18 - 07 - OST Chariots Of Fire (Vangelis) - Eric's Theme.mp3"},
        "IBF18-08":{nombre:"Finlandia (Symphonic poem) op. 26 [End Part]",autor:"Sibelius (Herbert von Karajan & Berliner Philharmoniker)",archivo:"IBF18 - 08 - Sibelius (Herbert von Karajan & Berliner Philharmoniker) - Finlandia (Symphonic poem) op. 26 [End Part].mp3"},
        "IBF18-09":{nombre:"I Want You (She's So Heavy)",autor:"The Beatles",archivo:"IBF18 - 09 - The Beatles - I Want You (She's So Heavy).mp3"},
        "IBF18-10":{nombre:"Bismillah ar-Rahman",autor:"Guvenz, Oruz & Tumata",archivo:"IBF18 - 10 - Guvenz, Oruz & Tumata - Bismillah ar-Rahman.mp3"},
        "IBF18-11":{nombre:"African Sanctus",autor:"Fanshawe, David",archivo:"IBF18 - 11 - Fanshawe, David - African Sanctus.mp3"},
        "IBF18-12":{nombre:"Song Of Lamentation [Part] {End Part of 'Sanctus. Bwala Dance'}",autor:"Fanshawe, David",archivo:"IBF18 - 12 - Fanshawe, David - Song Of Lamentation [Part] {End Part of 'Sanctus. Bwala Dance'}.mp3"},
        "IBF18-13":{nombre:"Shine On You Crazy Diamond, Pts.1-5 [Part 2]",autor:"Pink Floyd",archivo:"IBF18 - 13 - Pink Floyd - Shine On You Crazy Diamond, Pts.1-5 [Part 2].mp3"},
        "IBF18-14":{nombre:"Allegro [Part] - Sinfonie 6 F-Dur op.68 - 4 (Gewitter-Sturm)",autor:"Beethoven (Libor Pesek & Slovak Philharmonic Orchestra)",archivo:"IBF18 - 14 - Beethoven (Libor Pesek & Slovak Philharmonic Orchestra) - Allegro [Part] - Sinfonie 6 F-Dur op.68 - 4 (Gewitter-Sturm).mp3"},
        "IBF18-15":{nombre:"Andante - Ballet Don Juan - 3",autor:"Gluck (John Eliot Gardiner & English Baroque Soloists)",archivo:"IBF18 - 15 - Gluck (John Eliot Gardiner & English Baroque Soloists) - Andante - Ballet Don Juan - 3.mp3"},
        "IBF19-01":{nombre:"Presence",autor:"Guem",archivo:"IBF19 - 01 - Guem - Presence.mp3"},
        "IBF19-02":{nombre:"Down In Belgorod",autor:"Winter, Paul",archivo:"IBF19 - 02 - Winter, Paul - Down In Belgorod.mp3"},
        "IBF19-03":{nombre:"I Just Wanna Make Love To You",autor:"Hines, Earl",archivo:"IBF19 - 03 - Hines, Earl - I Just Wanna Make Love To You.mp3"},
        "IBF19-04":{nombre:"Ray's Blues",autor:"Charles, Ray",archivo:"IBF19 - 04 - Charles, Ray - Ray's Blues.mp3"},
        "IBF19-05":{nombre:"I Wanna Be Loved",autor:"Horn, Shirley",archivo:"IBF19 - 05 - Horn, Shirley - I Wanna Be Loved.mp3"},
        "IBF19-06":{nombre:"Danza ritual del fuego",autor:"de Falla (Garcia Navarro & London Symphony Orchestra)",archivo:"IBF19 - 06 - de Falla (Garcia Navarro & London Symphony Orchestra) - Danza ritual del fuego.mp3"},
        "IBF19-07":{nombre:"London Symphony Orchestra) - Cancion del amor dolido",autor:"de Falla (Teresa Berganza & Garcia Navarro",archivo:"IBF19 - 07 - de Falla (Teresa Berganza & Garcia Navarro - London Symphony Orchestra) - Cancion del amor dolido.mp3"},
        "IBF19-08":{nombre:"Daphnis et Chloe - Ballet, 3eme tableau - III. Danse finale Bacchanale",autor:"Ravel (Seiji Ozawa & Boston Symphony Orchestra)",archivo:"IBF19 - 08 - Ravel (Seiji Ozawa & Boston Symphony Orchestra) - Daphnis et Chloe - Ballet, 3eme tableau - III. Danse finale Bacchanale.mp3"},
        "IBF19-09":{nombre:"Floresta do Amazonas (Vocal Bidu Sayao)",autor:"Villa-Lobos, Heitor & Epilogo (Final)",archivo:"IBF19 - 09 - Villa-Lobos, Heitor & Epilogo (Final) - Floresta do Amazonas (Vocal Bidu Sayao).mp3"},
        "IBF19-10":{nombre:"Maybe God Is Tryin' To Tell You Somethin' (Vocal Tata Vega)",autor:"OST The Color Purple",archivo:"IBF19 - 10 - OST The Color Purple - Maybe God Is Tryin' To Tell You Somethin' (Vocal Tata Vega).mp3"},
        "IBF19-11":{nombre:"O fortuna - Fortuna Imperatrix Mundi - Carmina Burana - I-1",autor:"Orff, Carl (Eugen Jochum & Walter Hagen-Groll)",archivo:"IBF19 - 11 - Orff, Carl (Eugen Jochum & Walter Hagen-Groll) - O fortuna - Fortuna Imperatrix Mundi - Carmina Burana - I-1.mp3"},
        "IBF19-12":{nombre:"Sundance",autor:"Kitaro",archivo:"IBF19 - 12 - Kitaro - Sundance.mp3"},
        "IBF19-14":{nombre:"This Girl's In Love With You",autor:"Fitzgerald, Ella",archivo:"IBF19 - 14 - Fitzgerald, Ella - This Girl's In Love With You.mp3"},
        "IBF19-15":{nombre:"Vidala del cuculi",autor:"Cumbo, Jorge ~ Vitale, Lito ~ Gonzales, Lucho ",archivo:"IBF19 - 15 - Cumbo, Jorge ~ Vitale, Lito ~ Gonzales, Lucho  - Vidala del cuculi.mp3"},
        "IBF19-17":{nombre:"Joy",autor:"Mourashkin, Boris",archivo:"IBF19 - 17 - Mourashkin, Boris - Joy.mp3"},
        "IBF19-18":{nombre:"Abraham's Theme",autor:"OST Chariots Of Fire (Vangelis)",archivo:"IBF19 - 18 - OST Chariots Of Fire (Vangelis) - Abraham's Theme.mp3"},
        "IBF19-19":{nombre:"Cavalleria Rusticana, XVIII. Intermezzo sinfonico",autor:"Mascagni (Herbert von Karajan & Coro e Orchestra del Teatro alla Scala)",archivo:"IBF19 - 19 - Mascagni (Herbert von Karajan & Coro e Orchestra del Teatro alla Scala) - Cavalleria Rusticana, XVIII. Intermezzo sinfonico.mp3"},
        "IBFC20-01":{nombre:"Ay Fond Kiss",autor:"Fairground Attraction",archivo:"IBFC20 - 01 - Fairground Attraction - Ay Fond Kiss.mp3"},
        "IBFC20-02":{nombre:"Yellow Submarine",autor:"The Beatles",archivo:"IBFC20 - 02 - The Beatles - Yellow Submarine.mp3"},
        "IBFC20-03":{nombre:"All Together Now",autor:"The Beatles",archivo:"IBFC20 - 03 - The Beatles - All Together Now.mp3"},
        "IBFC20-04":{nombre:"With A Little Help From My Friends",autor:"The Beatles",archivo:"IBFC20 - 04 - The Beatles - With A Little Help From My Friends.mp3"},
        "IBFC20-05":{nombre:"When I'm Sixty-Four",autor:"The Beatles",archivo:"IBFC20 - 05 - The Beatles - When I'm Sixty-Four.mp3"},
        "IBFC20-06":{nombre:"I've Got A Woman",autor:"Charles, Ray",archivo:"IBFC20 - 06 - Charles, Ray - I've Got A Woman.mp3"},
        "IBFC20-07":{nombre:"A Mi Manera",autor:"Gipsy Kings",archivo:"IBFC20 - 07 - Gipsy Kings - A Mi Manera.mp3"},
        "IBFC20-08":{nombre:"That Old Feeling (live)",autor:"Fygi, Laura",archivo:"IBFC20 - 08 - Fygi, Laura - That Old Feeling (live).mp3"},
        "IBFC20-09":{nombre:"All Of Me (live)",autor:"Fygi, Laura",archivo:"IBFC20 - 09 - Fygi, Laura - All Of Me (live).mp3"},
        "IBFC20-10":{nombre:"Diamonds Are A Girl's Best Friend (live)",autor:"Fygi, Laura",archivo:"IBFC20 - 10 - Fygi, Laura - Diamonds Are A Girl's Best Friend (live).mp3"},
        "IBFC20-11":{nombre:"Koro",autor:"Koro",archivo:"IBFC20 - 11 - Koro - Koro.mp3"},
        "IBFC20-12":{nombre:"Corcovado (live)",autor:"Fygi, Laura",archivo:"IBFC20 - 12 - Fygi, Laura - Corcovado (live).mp3"},
        "IBFC20-14":{nombre:"Call Off The Search",autor:"Melua, Katie",archivo:"IBFC20 - 14 - Melua, Katie - Call Off The Search.mp3"},
        "IBFC20-15":{nombre:"Learnin' The Blues",autor:"Melua, Katie",archivo:"IBFC20 - 15 - Melua, Katie - Learnin' The Blues.mp3"},
        "IBFC20-16":{nombre:"My Aphrodisiac Is You",autor:"Melua, Katie",archivo:"IBFC20 - 16 - Melua, Katie - My Aphrodisiac Is You.mp3"},
        "IBFC20-17":{nombre:"Mockingbird Song",autor:"Melua, Katie",archivo:"IBFC20 - 17 - Melua, Katie - Mockingbird Song.mp3"},
        "IBFC20-18":{nombre:"Tan Xingquing Park",autor:"Shanti, Oliver & Friends",archivo:"IBFC20 - 18 - Shanti, Oliver & Friends - Tan Xingquing Park.mp3"},
        "IBFC21-01":{nombre:"Hello, Goodbye",autor:"The Beatles",archivo:"IBFC21 - 01 - The Beatles - Hello, Goodbye.mp3"},
        "IBFC21-02":{nombre:"Freude (Hymne a la joie) [Part] - Sinfonie 9 d-moll, op.125 - 4",autor:"Beethoven (Andre Cluytens & Berliner Philharmoniker)",archivo:"IBFC21 - 02 - Beethoven (Andre Cluytens & Berliner Philharmoniker) - Freude (Hymne a la joie) [Part] - Sinfonie 9 d-moll, op.125 - 4.mp3"},
        "IBFC21-03":{nombre:"Charleston",autor:"Light, Enoch & The Light Brigade",archivo:"IBFC21 - 03 - Light, Enoch & The Light Brigade - Charleston.mp3"},
        "IBFC21-04":{nombre:"El Dia en Que me Quieras",autor:"Barenboim&Mederos&Console",archivo:"IBFC21 - 04 - Barenboim&Mederos&Console - El Dia en Que me Quieras.mp3"},
        "IBFC21-06":{nombre:"Carnaval de Sao Vicente",autor:"Evora, Cesaria",archivo:"IBFC21 - 06 - Evora, Cesaria - Carnaval de Sao Vicente.mp3"},
        "IBFC21-07":{nombre:"When You Smile",autor:"Flack, Roberta",archivo:"IBFC21 - 07 - Flack, Roberta - When You Smile.mp3"},
        "IBFC21-08":{nombre:"When The Saints Go Marchin' In",autor:"Jackson, Mahalia",archivo:"IBFC21 - 08 - Jackson, Mahalia - When The Saints Go Marchin' In.mp3"},
        "IBFC21-09":{nombre:"My Way (live)",autor:"Presley, Elvis",archivo:"IBFC21 - 09 - Presley, Elvis - My Way (live).mp3"},
        "IBFC21-10":{nombre:"O Amanha",autor:"Simone",archivo:"IBFC21 - 10 - Simone - O Amanha.mp3"},
        "IBFC21-11":{nombre:"Danadinho Danado",autor:"Simone & da Vila, Martinho",archivo:"IBFC21 - 11 - Simone & da Vila, Martinho - Danadinho Danado.mp3"},
        "IBFC21-12":{nombre:"",autor:"Danse de Zorba.mp3",archivo:"IBFC21 - 12 - Danse de Zorba.mp3"},
        "IBFC21-13":{nombre:"Dream A Little Dream Of Me",autor:"Fygi, Laura",archivo:"IBFC21 - 13 - Fygi, Laura - Dream A Little Dream Of Me.mp3"},
        "IBFC21-14":{nombre:"Clair de lune - Suite Bergamasque pour piano, Harp transcription",autor:"Debussy (Anna Lelkes)",archivo:"IBFC21 - 14 - Debussy (Anna Lelkes) - Clair de lune - Suite Bergamasque pour piano, Harp transcription.mp3"},
        "IBFC21-15":{nombre:"All Souls Night",autor:"McKennitt, Loreena",archivo:"IBFC21 - 15 - McKennitt, Loreena - All Souls Night.mp3"},
        "IBFC21-16":{nombre:"Wild Is The Wind",autor:"Simone, Nina",archivo:"IBFC21 - 16 - Simone, Nina - Wild Is The Wind.mp3"},
        "IBFC21-17":{nombre:"Zorba's Dance",autor:"OST Zorba The Greek",archivo:"IBFC21 - 17 - OST Zorba The Greek - Zorba's Dance.mp3"},
        "IBFC21-18":{nombre:"Metello",autor:"OST Metello (Morricone, Ennio)",archivo:"IBFC21 - 18 - OST Metello (Morricone, Ennio) - Metello.mp3"}
    }
}
