/*
function loadConfig(){
	alert('Load');
	if (!localStorage.getItem('config')) {
		localStorage.setItem("lang", 0);
		urlBase='http://agendacultural.buenosaires.gob.ar/webservice/response/client.php?Method=GetEventosListFiltered';
		localStorage.setItem("url", urlBase);
		localStorage.setItem("destacado", '&DestacadoHome=true');
		localStorage.setItem("cant", '&Limit=5');
		localStorage.setItem("estado", '&EstadoEvento=');
		localStorage.setItem("orden", '&OrdenarPor=FechaFin&Orden=DESC');
		localStorage.setItem("desde", '');
		localStorage.setItem("hasta", '');
		//localStorage.setItem("acercaDe", 'Aplicación gratuita creada por B+C Consultores, pero en un futuro podrá tener, auspiciantes, publicidad o contenido adicional pago. La información aquí contenida es libre y publica provista por el gobierno de la Ciudad Autonoma de Buenos Aires.');
		localStorage.setItem("config", 1);
	
		cargar_variables();
		
		blackberry.event.addEventListener("invoked", function (onInvokedInfo) {
			var obj = document.getElementById('image');
			obj.src = onInvokedInfo.uri;
		});
		//findShareTargets();
	} 
	//cargar_agenda();
}
*/
/*
function cargar_variables(){
	urlModif = localStorage.getItem("url");
	urlModif += localStorage.getItem("destacado");
	urlModif += localStorage.getItem("orden");
	urlModif += localStorage.getItem("estado");
	urlModif += localStorage.getItem("desde");
	urlModif += localStorage.getItem("hasta");
	urlModif += localStorage.getItem("cant");
	localStorage.setItem("urlModif", urlModif);
}
*/
function new_config(){
	showToast3(dic.traducir('Guardando los cambios'));
	cargar_variables();
	alert('c');
	cargar_agenda();
}
//ProcLang = localStorage.getItem('lang');	
//acercaDe = localStorage.getItem('acercaDe');	

// display a simple toast message
function showToast3(msg) {
	blackberry.ui.toast.show(msg);
}


function zoomText(Action,Element) {
	var obj=document.getElementById(Element);
	var max = 300
	var min = 70

	if (obj.style.fontSize=="") { obj.style.fontSize="100%"; }

	actual=parseInt(obj.style.fontSize);
	increment=10;

	if( Action=="restore" ){ obj.style.fontSize="100%" }

	if( Action=="increase" && ((actual+increment) <= max )) {
		value=actual+increment;
		obj.style.fontSize=value+"%"
	}

	if( Action=="decrease" && ((actual+increment) >= min )) {
		value=actual-increment;
		obj.style.fontSize=value+"%"
	}

}

/*
function cargarMapa(address) {
	showLoading();
	var geoCoder = new google.maps.Geocoder(address)
	var request = {address:address};
	geoCoder.geocode(request, function(result, status){
		var latlng = new google.maps.LatLng(result[0].geometry.location.lat(), result[0].geometry.location.lng());
		var myOptions = {
		  zoom: 15,
		  center: latlng,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
        var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
		var marker = new google.maps.Marker({position:latlng,map:map,title:address});
	})
  }
	hideLoading();
} 
*/