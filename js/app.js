function saber_idioma(){
	if (navigator.appName == 'Netscape')
		var lenguage = navigator.language;
	else
	var lenguage = navigator.browserLanguage;
	if (lenguage.indexOf('en') > -1){
		ProcLang = 1;
		idioma(1);
	}
	else if (lenguage.indexOf('es') > -1){
		ProcLang = 0;
		idioma(0);
	}
	else if (lenguage.indexOf('fr') > -1){
		ProcLang = 1; //luego cambiamos a Frances
		idioma(1);
	}
	else if (lenguage.indexOf('pt') > -1){
		ProcLang = 2;
		idioma(2);
	}
	else{
  		ProcLang = 1; //otro idioma ingles
		idioma(1);
	}

}

function showLoading(text) {
	text = text || dic.traducir('cargando')+'...';
	$("body").append('<div data-role="bb-activity-indicator" data-size="large" class="modalWindow"/>');
	$.mobile.loadingMessageTextVisible = true;
	$.mobile.showPageLoadingMsg('c', text);
}

function hideLoading() {
	$(".modalWindow").remove();
	$.mobile.hidePageLoadingMsg();
}

function cargar_gps() {	 
	var startPos;
	showToast3(dic.traducir('Obteniendo información del GPS'));
	 navigator.geolocation.getCurrentPosition(
    	 function(position) {

        	startPos = position;
	        latitude = startPos.coords.latitude;
			longitude = startPos.coords.longitude;
			acurracy = startPos.coords.acurracy
//			alert(lat+'- '+long)
			localStorage.setItem("latitude", latitude);
			localStorage.setItem("longitude", longitude);
			localStorage.setItem("acurracy", acurracy);
			cargar_agenda();
//			$.mobile.hidePageLoadingMsg();

	     },
    	 function(error) {

        	 switch(error.code) {
            	  case error.PERMISSION_DENIED :
                	showToast3('Error. '+dic.traducir('Permiso denegado'));
	                break;
    	          case error.POSITION_UNAVAILABLE:
        	        showToast3('Error. '+dic.traducir('Posición no disponible'));
            	    break;
				  case error.TIMEOUT:
                	showToast3('Error. '+dic.traducir('Tiempo de espera'));
	                break;
    	          default:
	                showToast3(dic.traducir('Código de error desconocido'));
    	      }
     	} 
	);
}

function cargar_variables(){
	urlModif = localStorage.getItem("url");
	urlModif += localStorage.getItem("destacado");
	urlModif += localStorage.getItem("orden");
	urlModif += localStorage.getItem("estado");
	urlModif += '&FechaInicio='+localStorage.getItem("desde");
	urlModif += '&FechaFin='+localStorage.getItem("hasta");
	urlModif += '&Limit='+localStorage.getItem("cant");
	localStorage.setItem("urlModif", urlModif);
}
function cargar_lugares(){
	showLoading(dic.traducir('cargando'));
	var str, IdLugar, IdBarrio, Nombre, Direccion, Subte, Tren, Colectivo, Parking, Resumen, Descripcion;
	var Imagen, Flirck, Facebook, Youtube, Twitter, DestacarHome, IdLugarPadre, Longitud, Latitud, NombreUrl;
	var Web, Temporal;
	str='';
	var link='http://agendacultural.buenosaires.gob.ar/webservice/response/client.php?Method=GetLugaresListFiltered&IdLugar=&IdBarrio=&Nombre=&Direccion=&Subte=&Tren=&Colectivo=&Estacionamientos=&Resumen=&Descripcion=&Imagen=&AlbumFlickr=&Youtube=&Facebook=&Twitter=&DestacarHome=&IdLugarPadre=&Longitud=&Latitud=&NombreUrl=&Web=&Temporal=&OrdenarPor=NombreUrl&Orden=ASC&Limit='+sessionStorage.getItem("cant")+'&Offset=0';
	$.ajax({
  		url: link,
  		type: "GET",
  		dataType: "xml",
  		crossDomain:true,
  		async:false,  //estaba en true
  		cache: false,
  		success: function(xml) {
  			$(xml).find('Item').each(function(){
  				str +='<div class="BB10Container" style="border-left-width: 25px; border-right-width: 25px;">';
  				$(this).find("IdLugar").each(function(){
					IdLugar = $(this).text();
				});
				$(this).find("IdBarrio").each(function(){
					IdBarrio = $(this).text();
				});
				$(this).find("Nombre").each(function(){
					Nombre = $(this).text();
				});
				$(this).find("Direccion").each(function(){
					Direccion = $(this).text();
				});
				$(this).find("Subte").each(function(){
					Subte = $(this).text();
				});
				$(this).find("Tren").each(function(){
					Tren = $(this).text();
				});
				$(this).find("Colectivo").each(function(){
					Colectivo = $(this).text();
				});
				$(this).find("Estacionamientos").each(function(){
					Parking = $(this).text();
				});
				$(this).find("Resumen").each(function(){
					Resumen = $(this).text();
				});
				$(this).find("Descripcion").each(function(){
					Descripcion = $(this).text();
				});
				$(this).find("Imagen").each(function(){
					Imagen = $(this).text();
				});
				$(this).find("AlbumFlickr").each(function(){
					Flirck = $(this).text();
				});
				$(this).find("Youtube").each(function(){
					Youtube = $(this).text();
				});
				$(this).find("Facebook").each(function(){
					Facebook = $(this).text();
				});
				$(this).find("Twitter").each(function(){
					Twitter = $(this).text();
				});
				$(this).find("DestacarHome").each(function(){
					DestacarHome = $(this).text();
				});
				$(this).find("IdLugarPadre").each(function(){
					IdLugarPadre = $(this).text();
				});
				$(this).find("Longitud").each(function(){
					Longitud = $(this).text();
				});
				$(this).find("Latitud").each(function(){
					Latitud = $(this).text();
				});
				$(this).find("NombreUrl").each(function(){
					NombreUrl = $(this).text();
				});
				$(this).find("Web").each(function(){
					Web = $(this).text();
				});
				$(this).find("Temporal").each(function(){
					Temporal = $(this).text();
				});
				var Mdata = new Object();
					Mdata["idLugar"] = IdLugar;
					Mdata["barrio"] = IdBarrio;
					Mdata["nom"] = Nombre;
					Mdata["dire"] = Direccion;
					Mdata["subte"] = Subte;
					Mdata["tren"] = Tren;
					Mdata["parking"] = Parking;
					Mdata["resumen"] = Resumen;
					Mdata["desc"] = Descripcion;
					Mdata["flirck"] = Flirck;
					Mdata["img"] = Imagen;
					Mdata["you"] = Youtube;
					Mdata["face"] = Facebook;
					Mdata["twit"] = Twitter;
					Mdata["destaca"] = DestacarHome;
					Mdata["padre"] = IdLugarPadre;
					Mdata["lng"] = Longitud;
					Mdata["lat"] = Latitud;
					Mdata["nomurl"] = NombreUrl;
					Mdata["web"] = Web;
					Mdata["temp"] = Temporal;

					sessionStorage.setItem(IdLugar, JSON.stringify(Mdata));

				str +='<a class="ui-link-inherit" href="#noticia" data-transition="cover" onClick="verLugar(&quot;'+IdLugar+'&quot;)">';
				str +='<img  class="ui-li-thumb"  src="http://fotos.agendacultural.buenosaires.gob.ar/visitas-guiadas-al-museo-mamba/imagegallery/'+Imagen+' " alt="'+Nombre+'">'
				str += '<h1 style="margin-top:-15px;">'+Nombre+'</h1>';
				str += '<p>'+Resumen+'</p>';
				str +='</div>';
  		
  			});	
  			str +='';
			setContent('contenPage1', str)
			hideLoading();
  		},
	  	error: function(jqXHR, textStatus, errorThrown) {
			$('#contenPage1').html(textStatus + ' | ' + errorThrown);
			hideLoading();
	  	}
  	});
}

function cargar_agenda() {
	showLoading(dic.traducir('cargando'));
	cargar_variables(); //ver si es por el tipo de boton en config
	sessionStorage.clear();
	str ='';
//	urlModif = window.localStorage.getItem("urlModif");
	var IdEvento, IdEstadoEvento, Titulo, calif, pasos, Resumen, Descripcion, Imagen, Twitter, Facebook, YouTube, FechaInicio, FechaFin, str;
//	alert(urlModif);
//	$("#divRss").empty();
	lat = localStorage.getItem("latitude");
	if (lat == null) {
		lat= -34.6034947;
	}
	long = localStorage.getItem("longitude");
	if (long == null) {
		long = 	-58.3812529;
	}
	$.ajax({
  url: urlModif+'&Latitud='+lat+'&Longitud='+long,
  type: "GET",
  dataType: "xml",
  crossDomain:true,
  async:false,  //estaba en true
  cache: false,
  success: function(xml) { //tenía data
	
	$(xml).find('Item').each(function(){
			
		str +='<div class="BB10Container" style="border-left-width: 25px; border-right-width: 25px;">';
		$(this).find("IdEvento").each(function(){
			IdEvento = $(this).text();
		});
		$(this).find("IdEstadoEvento").each(function(){
			IdEstadoEvento = $(this).text();
		});
		$(this).find("FechaInicio").each(function(){
			FechaInicio = $(this).text();
		});
		$(this).find("FechaFin").each(function(){
			FechaFin = $(this).text();
		});
		$(this).find("Titulo").each(function(){
			Titulo = $(this).text();
		});
		$(this).find("Calificacion").each(function(){
			calif = $(this).text();
//			for (var i=0;i<=calif;i++) { $('#divRss').append('<img width="18" src="img/star.gif" />'); } 
//			$('#divRss').append('<h4>Calificaci&oacute;n: '+calif+'/5<br />');
		});
		$(this).find("Lugares").each(function(){
			pasos = $(this).text();
//			for (var i=0;i<=calif;i++) { $('#divRss').append('<div><img width="18" src="img/star.gif" /></div>'); } 
		});
		$(this).find("Resumen").each(function(){
			Resumen = $(this).text();
		});
		$(this).find("Descripcion").each(function(){
			Descripcion = $(this).text();
		});
		$(this).find("Imagen").each(function(){
			 Imagen = $(this).text();
		});
		$(this).find("Twitter").each(function(){
			 Twitter = $(this).text();
		});
		$(this).find("Facebook").each(function(){
			 Facebook = $(this).text();
		});
		$(this).find("Youtube").each(function(){
			 YouTube = $(this).text();
		});
			var Mdata = new Object();
			Mdata["id"] = IdEvento;
			Mdata["dia"] = FechaInicio;
			Mdata["tit"] = Titulo;
			Mdata["pas"] = pasos;
			Mdata["res"] = Resumen;
			Mdata["img"] = Imagen;
			Mdata["des"] = Descripcion;
			Mdata["twit"] = Twitter;
			Mdata["face"] = Facebook;
			Mdata["you"] = YouTube;

			sessionStorage.setItem(IdEvento, JSON.stringify(Mdata));
			
			str +='<a class="ui-link-inherit" href="#noticia" data-transition="cover" onClick="verNota(&quot;'+IdEvento+'&quot;)">';
			str +='<img  class="ui-li-thumb"  src="http://fotos.agendacultural.buenosaires.gob.ar/visitas-guiadas-al-museo-mamba/imagegallery/'+Imagen+' " alt="'+Titulo+'">'
			str += '<h1 style="margin-top:-15px;">'+Titulo+'</h1>';
			str += '<p>'+Resumen+'</p>';
			str +='<p style="font-size:16px;" id="desdehasta">'+lDesde+FechaInicio;
			str +='  '+lHasta+FechaFin+'</p>';
			if (pasos){
			str +='<p>'+pasos+dic.traducir(" desde el obelisco")+'</p>';
			}
			if(IdEstadoEvento==3){
				str +='<p style="color="red";" id="suspendido">'+dic.traducir("Suspendido")+'</p>';
			}
			str +='</div>';
  });
  	str +='';
	setContent('contenPage1', str)

	hideLoading();
//	$('#contenido').listview('refresh');
  },
	  error: function(jqXHR, textStatus, errorThrown) {
		$('#contenPage1').html(textStatus + ' | ' + errorThrown);
		hideLoading();
	  }
  });
}
function limpiarVerNota(){
	$('#tituNoticia').empty();
	$('#resNoticia').empty();
	$('#imgNoticia').empty();
	$('#descNoticia').empty();
	$('#socNoticia').empty();
	$('#videoNoticia').empty();
}
function replaceAll( text, busca, reemplaza ){
  while (text.toString().indexOf(busca) != -1)
      text = text.toString().replace(busca,reemplaza);
  return text;
}
function verNota(e) {
/*
	$.ajax({
  		url: urlModif+'&Latitud='+lat+'&Longitud='+long,
  		type: "GET",
  		dataType: "xml",
  		crossDomain:true,
  		async:false,  //estaba en true
  		cache: false,
  		success: function(xml) {

  		},
	  error: function(jqXHR, textStatus, errorThrown) {
		$('#contenPage1').html(textStatus + ' | ' + errorThrown);
		hideLoading();
	  }
  });
*/
	limpiarVerNota()
	var obj = JSON.parse(sessionStorage.getItem(e));
	setContent('tituNoticia', obj.tit);
	setContent('resNoticia', obj.res);
	if (obj.img!=null) {
	setContent('imgNoticia', '<img  width="100%" src="http://fotos.agendacultural.buenosaires.gob.ar/visitas-guiadas-al-museo-mamba/imagegallery/'+obj.img+' " alt="'+obj.tit+'" id="image">');	
	}
//	$('#descNoticia').html(obj.des);
//	alert(replaceAll( obj.des, '\n', '<br>' ));
	appendContent('descNoticia', replaceAll( obj.des, '\n', '<br>' ));
	$('#descNoticia a').attr('target','_blank');
	
	var faceTw; 
	
	if (obj.twit!="") {
		faceTw = '<img src="img/twitter.png" width="50px">Ver perfil <a href="#" onClick="invokeTwitterProfile('+obj.twit.substring(20)+')">'+obj.twit.substring(20)+'</a><br /><br />'
//		appendContent('socNoticia', '<img src="img/twitter.png" width="30px">Ver perfil <a href="#" onClick="invokeTwitterProfile('+obj.twit.substring(20)+')">'+obj.twit.substring(20)+'</a><br>');
		//onclick="'+invokeTwitterProfile(obj.twit.substring(20))+'"
	}
	if (obj.face!="") {
		faceTw += '<a href="http://'+obj.face+'" target="_blank">'+obj.face+'</a><br /><br />';
//		setContent('socNoticia', '<a href="http://'+obj.face+'" target="_blank">'+obj.face+'</a>');
	}
	
	if (obj.you!="") {
		
		faceTw +='<a href="http://'+obj.you+'" target="_blank">'+obj.you+'</a>';
//		appendContent('videoNoticia', '<a href="http://'+obj.you+'" target="_blank">'+obj.you+'</a>');
	} 
	faceTw +='<br />';
	setContent('socNoticia', faceTw);
	if (obj.pas!="") {
		var pos1 = obj.pas.indexOf("(");
		var str1 = obj.pas.substring( 0, (pos1-1) );
		
		if(localStorage.getItem("mapa")=="google"){
			$('a#verMapa').attr('onClick','cargarMapa("'+str1+'");');
			$('a#verMapa').attr('href','#mapa');
		}
		if(localStorage.getItem("mapa")=="bb"){
			$('a#verMapa').attr('onClick','navigateTo("'+str1+'");');
			$('a#verMapa').attr('href','#');
		}
		
	}
	$('a#shareNoti').attr('onClick','invokeShare("'+ obj.tit+'", "'+ obj.res+'\n'+obj.desde+'");');
}
//ver lugar
function verLugar(e) {
/*
Mdata["idLugar"] = IdLugar;
					Mdata["barrio"] = IdBarrio;
					Mdata["nom"] = Nombre;
					Mdata["dire"] = Direccion;
					Mdata["subte"] = Subte;
					Mdata["tren"] = Tren;
					Mdata["parking"] = Parking;
					Mdata["resumen"] = Resumen;
					Mdata["desc"] = Descripcion;
					Mdata["img"] = Imagen;
					Mdata["flirck"] = Flirck;
					Mdata["you"] = Youtube;
					Mdata["face"] = Facebook;
					Mdata["twit"] = Twitter;
					Mdata["destaca"] = DestacarHome;
					Mdata["padre"] = IdLugarPadre;
					Mdata["lng"] = Longitud;
					Mdata["lat"] = Latitud;
					Mdata["nomurl"] = NombreUrl;
					Mdata["web"] = Web;
					Mdata["temp"] = Temporal;
*/
	limpiarVerNota()
	var obj = JSON.parse(sessionStorage.getItem(e));
	setContent('tituNoticia', obj.nom);
	setContent('resNoticia', obj.resumen);
	if (obj.img!=null) {
	setContent('imgNoticia', '<img  width="100%" src="http://fotos.agendacultural.buenosaires.gob.ar/visitas-guiadas-al-museo-mamba/imagegallery/'+obj.img+' " alt="'+obj.nom+'" id="image">');	
	}
//	$('#descNoticia').html(obj.des);
//	alert(replaceAll( obj.des, '\n', '<br>' ));
	if(obj.desc!=""){
		appendContent('descNoticia', replaceAll( obj.desc, '\n', '<br>' ));
		$('#descNoticia a').attr('target','_blank');
	}
	var faceTw; 
	
	if (obj.twit!="") {
		faceTw = '<img src="img/twitter.png" width="50px">Ver perfil <a href="#" onClick="invokeTwitterProfile('+obj.twit.substring(20)+')">'+obj.twit.substring(20)+'</a><br /><br />'
//		appendContent('socNoticia', '<img src="img/twitter.png" width="30px">Ver perfil <a href="#" onClick="invokeTwitterProfile('+obj.twit.substring(20)+')">'+obj.twit.substring(20)+'</a><br>');
		//onclick="'+invokeTwitterProfile(obj.twit.substring(20))+'"
	}
	if (obj.face!="") {
		faceTw += '<a href="http://'+obj.face+'" target="_blank">'+obj.face+'</a><br /><br />';
//		setContent('socNoticia', '<a href="http://'+obj.face+'" target="_blank">'+obj.face+'</a>');
	}
	
	if (obj.you!="") {
		
		faceTw +='<a href="http://'+obj.you+'" target="_blank">'+obj.you+'</a>';
//		appendContent('videoNoticia', '<a href="http://'+obj.you+'" target="_blank">'+obj.you+'</a>');
	} 
	faceTw +='<br />';
	setContent('socNoticia', faceTw);
		
	if(localStorage.getItem("mapa")=="google"){
		$('a#verMapa').attr('onClick','cargarMapa("'+obj.dire+', Buenos Aires");');
		$('a#verMapa').attr('href','#mapa');
	}
	if(localStorage.getItem("mapa")=="bb"){
		$('a#verMapa').attr('onClick','navigateTo("'+obj.dire+', Buenos Aires");');
		$('a#verMapa').attr('href','#');
	}
		
	
	$('a#shareNoti').attr('onClick','invokeShare("'+ obj.nom+'", "'+ obj.img+'");');
}
// evento click de la imagen
var estadoImg =0;
function imageOverflow() {
	if (estadoImg == 1){
		imgNoticia.style.overflow = "hidden";
		imgNoticia.style.height="200px";
		estadoImg=0;
	} else {
		imgNoticia.style.overflow = "visible";
		imgNoticia.style.height="100%";
		estadoImg=1;
	}
}
function initMap() {
	showLoading();
	setContent('map_canvas', '<h1 style="text-align="center";">'+dic.traducir('Cargando el mapa')+'</h1>');
	var lat = localStorage.getItem("latitude");
	if (lat == null) {
		lat= -34.6034947;
	}
	var lon = localStorage.getItem("longitude");
	if (lon == null) {
		lon = 	-58.3812529;
	}
	var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(lat, lon),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  
	hideLoading();
}
function cargar_config() {
	if(localStorage.getItem("cant") == 5 ){
		$('radio1_0').attr('checked', true)
	}
	if(localStorage.getItem("cant") == 10 ){
		$('radio1_1').attr('checked', true)
	}
	if(localStorage.getItem("cant") == 15 ){
		$('radio1_2').attr('checked', true)
	}
	$('#confDesde').val(localStorage.getItem('desde'));
	$('#confHasta').val(localStorage.getItem('hasta'));
	
//	$('#top').panel('close');
}