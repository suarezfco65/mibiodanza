var crearNavBar =   function (pagWeb, opcionActiva) {
    var opciones =  [
        {titulo:'Inicio', href:'index.html', hijos:[]},
        {titulo:'1er año', href:'#', hijos:[
          {titulo:'Definición y Modelo Teórico', href:'#', hijos:[]},
          {titulo:'Inconsciente Vital y Principio Biocéntrico', href:'#', hijos:[]},
          {titulo:'La Vivencia', href:'#', hijos:[]},
          {titulo:'Aspectos Biológicos', href:'#', hijos:[]},
          {titulo:'Aspectos Fisiológicos', href:'#', hijos:[]},
          {titulo:'Aspectos Psicológicos', href:'#', hijos:[]},
          {titulo:'Antecedentes Míticos y Fisiológicos', href:'#', hijos:[]},
          {titulo:'Identidaad e Integración', href:'#', hijos:[]},
          {titulo:'Trance y Regresión', href:'#', hijos:[]},
          {titulo:'Contacto y Caricias', href:'#', hijos:[]}
        ]},
        {titulo:'2do año', href:'#', hijos:[
          {titulo:'Movimiento Humano', href:'#', hijos:[]},
          {titulo:'Vitalidad', href:'#', hijos:[]},
          {titulo:'Sexualidad', href:'#', hijos:[]},
          {titulo:'Creatividad', href:'#', hijos:[]},
          {titulo:'Afectividad', href:'#', hijos:[]},
          {titulo:'Trascendencia', href:'#', hijos:[]},
          {titulo:'Mecanismos de Acción', href:'#', hijos:[]},
          {titulo:'Biodanza y Acción Social', href:'#', hijos:[]},
          {titulo:'Aplicaciones y Extensiones', href:'#', hijos:[]},
          {titulo:'Biodanza Ars Magna', href:'#', hijos:[]}
        ]},
        {titulo:'3er año', href:'#', hijos:[
          {titulo:'La Música', href:'#', hijos:[]},
          {titulo:'Metodología I (Semantica Músical)', href:'#', hijos:[]},
          {titulo:'Metodología II (La Sesión de Biodanza)', href:'#', hijos:[]},
          {titulo:'Metodología III (La Sesión de Biodanza II)', href:'#', hijos:[]},
          {titulo:'Metodología IV (Profundización)', href:'#', hijos:[]}
        ]},
        {titulo:'Sesión', href:'#', hijos:[
          {titulo:'Catalogo de Danzas', href:'catalogo.html', hijos:[]},
          {titulo:'Preparación de Clases', href:'#', hijos:[]}
        ]}
    ];
    document.write('<nav class="navbar navbar-inverse">');
    document.write('  <div class="container-fluid">');
    document.write('    <div class="navbar-header">');
    document.write('      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">');
    document.write('        <span class="icon-bar"></span>');
    document.write('        <span class="icon-bar"></span>');
    document.write('        <span class="icon-bar"></span>');
    document.write('      </button>');
    document.write('      <a class="navbar-brand" href="index.html">'+pagWeb+'</a>');
    document.write('    </div>');
    document.write('    <div class="collapse navbar-collapse" id="myNavbar">');
    document.write('      <ul class="nav navbar-nav">');
    for (var i=0; i<opciones.length; i++)   {
        var s = '<li';
        var cls = '';
        if (opciones[i].titulo == opcionActiva)     cls = ' class="active';
        if (opciones[i].hijos.length > 0)   {
            if (cls == "") cls = ' class="dropdown">'
            else    cls += ' dropdown">'
            s += cls
            s+= '<a class="dropdown-toggle" data-toggle="dropdown" href="'+opciones[i].href+'">'+opciones[i].titulo+'<span class="caret"></span></a>'
            s+= '<ul class="dropdown-menu">';
            for (var j=0; j<opciones[i].hijos.length; j++)  
                s+='<li><a href="'+opciones[i].hijos[j].href+'">'+opciones[i].hijos[j].titulo+'</a></li>';
            s+= '</ul></li>';
        }
        else   {
            if (cls!='') s+=cls+'"';
            s += '><a href="'+opciones[i].href+'">'+opciones[i].titulo+'</li>';   
        }
        document.write(s);
    }
    document.write('      </ul>');
    document.write('      <ul class="nav navbar-nav navbar-right">');
    document.write('        <li><a href="#"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>');
    document.write('        <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>');
    document.write('      </ul>');
    document.write('    </div>');
    document.write('  </div>');
    document.write('</nav>');
}
function cIcon(obj) {
    if (obj.innerHTML == '❥')   
        obj.innerHTML = '❤'
    else 
        obj.innerHTML = '❥';
}
function inicioContenido(titulo, h, id, c=true) {
    var color = (h==4) ? 'red': ((h==5) ? 'blue' : 'green');
    var sc= c ? '❥' : '❤';
    var scoll = c ? 'collapse' : 'collapse in';
    var sty = (h==5) ? ' style="margin-left:5%"':'';
    var s= '<h'+h+sty+'>'+titulo+' <sub data-toggle="collapse" data-target="#c'+id+'" onclick="cIcon(this);" style="color:'+color+'; cursor:pointer">'+sc+'</sub></h'+h+'>';
    s+='<div id="c'+id+'" class="'+scoll+'"'+sty+'>';
    document.write(s);
}
function finContenido(titulo, h, id) {
    document.write('</div>')
}
