var latitude, longitude, acurracy, lang, config, urlBase, urlModif, acercaDe, lDesde, lHasta;
var orden, estado;

var hoy = new Date();

localStorage.setItem("acercaDe", 'Aplicación gratuita creada por B+C Consultores, pero en un futuro podrá tener, auspiciantes, publicidad o contenido adicional pago. La información aquí contenida es libre y publica provista por el gobierno de la Ciudad Autonoma de Buenos Aires.');
acercaDe = localStorage.getItem('acercaDe');

var diccionario= {
	indice: 0, //ProcLang,//0, //mi idioma
	lenguajes: ["Español","English","Portugueis"],
	frases: [
			["","",""]
			["Prueba","Prueba","Prueba"],
			["Si","Yes","Sim"],
			["No","Not","Não"],
			["Ubicar","Locate","Localizar"],
			["Portugues","Portuguese","Portugueis"],
			["Ingles","English","Ingles"],
			["Español","Spanish","Espanhol"],
			["Configurar","Setting","Configuraçaõ"],
			["Refrescar","Refresh","Refrescar"],
			["Invitar a descargar","Invite to download","Convidar para baixar"],
			["Cerrar","Close","Fechar"],
			["cargando","loading","carregamento"],
			["Volver","Back","Voltar"],
			["Atras","Back","Voltar"],
			["Calificación","Score","Qualificação"],
			["Distancia","Distance","Distância"],
			["Llamar","Call","Ligar"],
			["Registrar en BBM","Register in BBM","Registre-se em BBM"],
			["Obteniendo información del GPS","Getting information from the GPS","Obtendo informações do GPS"],
			["Mi ubicación","My location","Meu localização"],
			["Idioma","Language","Linguagem"],
			["Lugar","Place","lugar"],
			["Lugares","Places","lugares"],
			["Permiso denegado","Permission denied","Permissão negada"],
			["Posición no disponible","Position unavailable","Posição não disponível"],
			["Tiempo de espera","Timeout","Timeout"],
			["Código de error desconocido","Unknown error code","Código de erro desconhecido"],
			["Compartir","Share","Ação"],
			["Acerca de","About","Sobre"],
			["Preferencias","Preferencies","Preferenças"],
			["Guardando los cambios","Saving Changes","Salvando alterações"],
			["Usar mi ubicación","Use my location","Usar minha localização"],
			["Cantidad de eventos","Number of events","Número de eventos"],
			["Ordenar de","Order","Ordem"],
			["Hasta: ","To: ","a: "],
			["Desde: ","From: ","De: "],
			["Cargando el mapa","Loading map","Carregando o mapa"],
			["Ver mapa","View map","Ver mapa"],
			["Guardar","Save","Salvar"],
			["Aumentar","Increase","Aumentar"],
			["Disminuir","Decrease","Diminuir"],
			["Restablecer","Restore","Restaurar"],
			["Suspendido","suspended","Suspenso"],
			["Mapa de Google","Google Map","Mapa do Google"],
			["Mapa de BlackBerry","BlackBerry Map","Mapa do BlackBerry"],
			[" desde el obelisco","from the Obelisco","a partir do obelisco"],
			["Ir a configuración","Go to Settings","Ir a configuración"],
			["No hay eventos para hoy","No events today","Não há eventos hoje"],
			["Probando -Agenda BA- en mi BlackBerry Z10","Testing -Agenda BA- on my BlackBerry Z10","Teste -Agenda BA- no meu BlackBerry Z10"],
			["Agenda cultural BA te recomienda","BA Cultural Agenda recommends","Agenda cultural BA recomenda"],
			["Aplicación gratuita creada por B+C Consultores, pero en un futuro podrá tener, auspiciantes, publicidad o contenido adicional pago. La información aquí contenida es libre y publica provista por el gobierno de la Ciudad Autonoma de Buenos Aires.","Free application created by B + C Consultants, but in the future may have, sponsors, advertising or additional content payment. The information contained herein is provided free and published by the government of the Autonomous City of Buenos Aires.","Aplicativo gratuito criado pela B + C Consultores, mas no futuro pode ter, patrocinadores, publicidade ou pagamento de conteúdo adicional. As informações contidas neste documento é fornecido gratuitamente e publicado pelo governo da Cidade Autônoma de Buenos Aires."],
			["","",""]
	],
	getLngActualTxt: function (){return this.lenguajes[this.indice];},
	traducir: function (Frase) {
				if (this.indice == 0){
					return Frase;}
				else {
					var fraseNro = 0;
					for (var f=1;f< this.frases.length;f++){
						if (Frase == this.frases[f][0]){
							if (this.frases[f][this.indice]!== ""){
								return this.frases[f][this.indice];
								}
							};
						};
					if (fraseNro == 0) {return Frase;};
					};
				}
	};

var dic = diccionario;

miIdioma = localStorage.getItem("lang");
if (miIdioma > 0) {dic.indice = miIdioma};

function idioma(nroIdioma){
	diccionario.indice = nroIdioma;
	localStorage.setItem("lang", nroIdioma);
	//para no recargar actualizo etiquetas
	setContent('lblShare', dic.traducir("Compartir")+'<img src="img/ico/ic_share.png" class="ui-li-thumb">');
	setContent('lblInvite', dic.traducir("Invitar a descargar")+'<img src="img/ico/ic_forward_as_bbm.png" class="ui-li-thumb">');
	setContent('lblswpPt', dic.traducir("Portugues"));
	setContent('lblswpEn',dic.traducir("Ingles"));
	setContent('lblswpEs',dic.traducir("Español"));
	setContent('lblUbicar',dic.traducir("Ubicar"));
	setContent('lblRefrescar',dic.traducir("Refrescar"));
	setContent('lblClose',dic.traducir("Cerrar")+'<img src="img/ico/ic_previous.png" class="ui-li-thumb">');
	setContent('lblswpConfig',dic.traducir("Configurar"));
	setContent('lblswpInfo',dic.traducir("Acerca de"));
	setContent('lblCalif',dic.traducir("Calificación"));
	setContent('lblDistancia',dic.traducir("Distancia"));
	setContent('lblabout',dic.traducir(acercaDe));
	setContent('btnCloseAbout',dic.traducir("Cerrar"));
	setContent('lblConfigTipoEvento',dic.traducir("Preferencias"));
	setContent('lblconfGps',dic.traducir("Usar mi ubicación"));
	setContent('lblConfCant',dic.traducir("Cantidad de eventos"));
	setContent('lblGpsOptNo', dic.traducir("No"));
	setContent('lblGpsOptSi', dic.traducir("Si"));
	setContent('lblconfOrden', dic.traducir("Ordenar"));
	setContent('lblVermapa', dic.traducir("Ver mapa"));
	setContent('lblConfHasta', dic.traducir("Hasta: "));
	setContent('lblConfDesde', dic.traducir("Desde: "));
	setContent('lblIncrease', dic.traducir("Aumentar")+'<img src="img/ico/ic_font_increase.png" class="ui-li-thumb">');
	setContent('lblDecrease', dic.traducir("Disminuir")+'<img src="img/ico/ic_font_decrease.png" class="ui-li-thumb">');
	setContent('lblRestore', dic.traducir("Restablecer")+'<img src="img/ico/ic_font_normal.png" class="ui-li-thumb">');
	setContent('lblCloseZpanel',dic.traducir("Cerrar")+'<img src="img/ico/ic_previous.png" class="ui-li-thumb">');
	setContent('shareNoti', dic.traducir("Compartir")+'<img src="img/ico/ic_forward_as_bbm.png" class="ui-li-thumb">');
	lDesde = dic.traducir("Desde: ");
	lHasta = dic.traducir("Hasta: ");
	setContent('lblMapGoogle', dic.traducir("Mapa de Google"));
	setContent('lblMapBB', dic.traducir("Mapa de BlackBerry"));
	setContent('lblConfMapa', dic.traducir("Ver mapa"));
	setContent('lblConfSave', dic.traducir("Guardar"));
	setContent('lblLugares', dic.traducir("Lugares"));
	$('#desdehasta').trigger('refresh');

//	  showCustomToast(diccionario.getLngActualTxt());
	setContent('btnBackLabel', dic.traducir("Atras"));
	setContent('Back', dic.traducir("Atras"));
	//bb.pushScreen('dummy.htm','dummy');
}// JavaScript Document
var btnBackLabel = dic.traducir("Atras"); //una variable global para todos los botones de regreso

function addZero(i) {
	if (i<10) {
		  i="0" + i;
  	}
	return i;
}

function verHora(dd){
	var d = new Date(dd);
	var h = d.getHours() ;
	var m = d.getMinutes() ;
	var STR = addZero(h) + ":" + addZero(m);
	return STR;
}
function verFecha(hoy){
	var d = new Date(fh);
	var dd = hoy.getDate() ;
	var mm = hoy.getMonth()+1 ;
	var yy = hoy.getFullYear() ;
	var STR = addZero(yy) + "/" + addZero(mm) + "/" + addZero(dd);
	return STR;
}
function verFecha2(dd){
	var d = new Date(fh);
	var dd = d.getDate() ;
	var mm = d.getMonth()+1 ;
	var yy = d.getFullYear() ;
	var STR = addZero(dd) + "/" + addZero(mm) + "/" + addZero(yy);
	return STR;
}

function parsePage(){
	saber_idioma();	
/*	setContent('lblShare', dic.traducir("Compartir"));
	setContent('lblInvite', dic.traducir("Invitar a descargar"));
	setContent('lblswpPt',dic.traducir("Portugues"));
	setContent('lblswpEn',dic.traducir("Ingles"));
	setContent('lblswpEs',dic.traducir("Español"));
	setContent('lblUbicar',dic.traducir("Ubicar"));
	setContent('lblRefrescar',dic.traducir("Refrescar"));
	setContent('lblswpConfig',dic.traducir("Configurar"));
	setContent('lblswpInfo',dic.traducir("Acerca de"));
	setContent('lblabout',dic.traducir(acercaDe));
	setContent('btnCloseAbout',dic.traducir("Cerrar"));
	setContent('lblCloseZpanel',dic.traducir("Cerrar"));
	setContent('lblClose',dic.traducir("Cerrar"));
	setContent('lblConfigTipoEvento',dic.traducir("Preferencias"));
	setContent('lblconfGps',dic.traducir("Usar mi ubicación"));
	setContent('lblConfCant',dic.traducir("Cantidad de eventos"));
	setContent('btnBackLabel', dic.traducir("Atras"));
	setContent('lblGpsOptNo', dic.traducir("No"));
	setContent('lblGpsOptSi', dic.traducir("Si"));
	setContent('lblconfOrden', dic.traducir("Ordenar"));
	setContent('lblVermapa', dic.traducir("Ver mapa"));
	setContent('lblConfHasta', dic.traducir("Hasta: "));
	prependContent('lblConfDesde', dic.traducir("Desde: "));
	setContent('lblIncrease', dic.traducir("Aumentar"));
	setContent('lblDecrease', dic.traducir("Disminuir"));
	setContent('lblRestore', dic.traducir("Restablecer"));
	setContent('shareNoti', dic.traducir("Compartir"));
	lDesde = dic.traducir("Desde: ");
	lHasta = dic.traducir("Hasta: ");
	setContent('lblMapGoogle', dic.traducir("Mapa de Google"));
	setContent('lblMapBB', dic.traducir("Mapa de BlackBerry"));
	setContent('lblConfMapa', dic.traducir("Ver mapa"));
	setContent('lblConfSave', dic.traducir("Guardar"));
	setContent('backConfig p', dic.traducir("Atras"));
	setContent('lblLugares', dic.traducir("Lugares"));
*/
}
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
        var map = new google.maps.Map(document.getElementById("content_map"),myOptions);
	//	var marker = new google.maps.Marker({position:latlng,map:map,title:address});
	})
	hideLoading();
  }
	
function new_config(){
	showToast3(dic.traducir('Guardando los cambios'));
	cargar_variables();
//	alert('c');
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
function setConfDesde(){
	var mydate=document.getElementById('confDesde').value;
	localStorage.setItem("desde", mydate);
}
function setConfHasta(){
	var mydate=document.getElementById('confHasta').value;
	localStorage.setItem("hasta", mydate);
}
/*
function cargar_config(){

}
*/
//cover
function myCover() {
  cover = new Object();
  cover.photo = 'local:///img/icon.png';
// falta ver share  
//  cover.label = 'Titulares';
  updateCover();
  // reset the cover settings upon maximizing the app
  blackberry.event.addEventListener("exitcover", function() {
    blackberry.ui.cover.resetCover();
  });
}
// setup the cover
function updateCover() {
  // set cover photo
  blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_IMAGE, {
    path: cover.photo
  });

  // set cover label
/*  blackberry.ui.cover.labels.push({
    label: cover.label,
    size: 10,
    wrap: true
  });
*/
// update the cover
  blackberry.ui.cover.updateCover();
  showToast('Cover Updated!');
//  bb.pushScreen('app.html', 'app');

  // minimize the app
  setTimeout(function(){
    blackberry.app.minimize();
  }, 1000);
}
var bbm = {
	registered: false,

	/**
	 * Registers this application with the blackberry.bbm.platform APIs.
	 *
	 * NOTE: This is NOT required for the invoke APIs.
	 */
	register: function () {
		blackberry.event.addEventListener('onaccesschanged', function (accessible, status) {
			if (status === 'unregistered') {
				blackberry.bbm.platform.register({
					// TODO You must define your own UUID
					// http://www.guidgenerator.com/online-guid-generator.aspx
					uuid: '75dee3e1-e5b9-4846-a4bb-bedf2865ae09',
					// Enable splatting of application icon when shared content is received
	        		shareContentSplat: true
				});
			} else if (status === 'allowed') {
				bbm.registered = accessible;
			}
		}, false);
	},

	/**
	 * setDisplayPicture: Sets the BBM profile display picture.
	 */
	setDisplayPicture: function () {
		blackberry.bbm.platform.self.setDisplayPicture('local:///img/icon32.png');
	},

	/**
	 * inviteToDownload: Displays a BBM list of existing users that can be
	 * contacted to also download this application.
	 */
	inviteToDownload: function () {
		blackberry.bbm.platform.users.inviteToDownload();
	},

	/**
	 * inviteToBBM: Invokes the invite to BBM functionality to add BBM contacts.
	 */
	inviteToBBM: function () {
		blackberry.invoke.invoke({
			action: 'bb.action.INVITEBBM',
			uri: 'pin:2100000A'
		});
	},

	/**
	 * setAvatarLocal: Invokes the avatar selector on the specified local:// image.
	 */
	setAvatarLocal: function () {
		blackberry.invoke.invoke({
			target: 'sys.bbm.imagehandler',
			action: 'bb.action.SET',
			uri: 'local:///img/icon32.png'
		});
	},

	/**
	 * setAvatarShared: Invokes the avatar selector on the specified file:// image.
	 */
	setAvatarShared: function () {
		blackberry.invoke.card.invokeFilePicker({
			mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
			type: [blackberry.invoke.card.FILEPICKER_TYPE_PICTURE, blackberry.invoke.card.FILEPICKER_TYPE_MUSIC]
		}, function (path) {
			blackberry.invoke.invoke({
				target: 'sys.bbm.imagehandler',
				action: 'bb.action.SET',
				uri: 'file://' + path[0]
			});
		}, function (reason) {
			/* Cancelled. */
			console.log(reason);
		}, function (error) {
			/* Error. */
			console.log(error);
		});
	},

	/**
	 * startChat: Invokes a BBM chat with an existing BBM contact.
	 *
	 * Specifying a PIN that is not already in the user's contacts will result in the Invite To BBM screen.
	 *
	 * Specifying a PIN that is in the user's contacts will immediately start a chat with that person.
	 *
	 * Specifying no PIN should invoke the Contact Picker, but currently does not. However, shareText with empty data string should do the job.
	 */
	startChat: function (pin) {
		pin = prompt('Contact PIN (Ex. 2100000A)', pin);

		/* null is returned on Cancel or empty string; check valid text first. */
		if (pin !== null) {
			if (/^[A-Fa-f0-9]{8}$/.test(pin)) {
				/* Valid PIN format: Invoke Chat/Invite. */
				blackberry.invoke.invoke({
					action: 'bb.action.BBMCHAT',
					uri: 'pin:' + pin
				});
			} else {
				/* Invalid PIN: Prompt to Retry. */
				blackberry.ui.toast.show(
					'Invalid PIN',
					{
						buttonText: 'Retry',
						buttonCallback: function () {
							bbm.startChat(pin);
						},
						dismissCallback: function () {
						}
					}
				);
			}
		} else {
			/* Confirm Cancel or empty string. */
			blackberry.ui.toast.show(
				'Invoke chat with empty string?',
				{
					buttonText: 'Yes',
					buttonCallback: function () {
						/* Empty PIN: Invoke Contact Picker. */
						blackberry.invoke.invoke({
							action: 'bb.action.BBMCHAT'
						});
					},
					dismissCallback: function () {
					}
				}
			);
		}
	},

	/**
	 * shareText: Starts a chat session with pre-populated text.
	 */
	shareText: function () {
		var text = prompt(dic.traducir("Probando -Agenda BA- en mi BlackBerry Z10"), '');

		if (text !== null) {
			blackberry.invoke.invoke({
				target: 'sys.bbm.sharehandler',
				action: 'bb.action.SHARE',
				data: text,
				mimeType: 'text/plain'
			});
		} else {
			/* Confirm Cancel or empty string. */
			blackberry.ui.toast.show(
				'Invoke share with empty string?',
				{
					buttonText: 'Yes',
					buttonCallback: function () {
						blackberry.invoke.invoke({
							target: 'sys.bbm.sharehandler',
							action: 'bb.action.SHARE',
							data: '',
							mimeType: 'text/plain'
						});
					},
					dismissCallback: function () {
					}
				}
			);
		}
	},
//Share title and link
	shareText2: function () {
		var text = prompt("Agenda cultural BA te recomienda");
		
		if (text !== null) {
			blackberry.invoke.invoke({
				target: 'sys.bbm.sharehandler',
				action: 'bb.action.SHARE',
				data: text,
				mimeType: 'text/plain'
			});
		} else {
			/* Confirm Cancel or empty string. */
			blackberry.ui.toast.show(
				'Invoke share with empty string?',
				{
					buttonText: 'Yes',
					buttonCallback: function () {
						blackberry.invoke.invoke({
							target: 'sys.bbm.sharehandler',
							action: 'bb.action.SHARE',
							data: '',
							mimeType: 'text/plain'
						});
					},
					dismissCallback: function () {
					}
				}
			);
		}
	},

	/**
	 * shareImage: Starts a chat session with attached image.
	 * Must be a file:// uri.
	 */
	shareImage: function () {
		blackberry.invoke.card.invokeFilePicker({
			mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
			type: [blackberry.invoke.card.FILEPICKER_TYPE_PICTURE, blackberry.invoke.card.FILEPICKER_TYPE_MUSIC]
		}, function (path) {
			blackberry.invoke.invoke({
				target: 'sys.bbm.sharehandler',
				action: 'bb.action.SHARE',
				uri: 'file://' + path[0]
			});
		}, function (reason) {
			/* Cancelled. */
			console.log(reason);
		}, function (error) {
			/* Error. */
			console.log(error);
		});
	},

	/**
	 * populate: Retrieve BBM profile information and populate a BBUI screen.
	 */
	populate: function (element) {
		element.querySelector('#displayname').setCaption(blackberry.bbm.platform.self.displayName);

		element.querySelector('#available').setChecked(
			blackberry.bbm.platform.self.status === 'available' ? true : false
		);

		element.querySelector('#statusmessage').value		= blackberry.bbm.platform.self.statusMessage;
		element.querySelector('#personalmessage').value		= blackberry.bbm.platform.self.personalMessage;
		element.querySelector('#ppid').value				= blackberry.bbm.platform.self.ppid;
		element.querySelector('#handle').value				= blackberry.bbm.platform.self.handle;
		element.querySelector('#applicationversion').value	= blackberry.bbm.platform.self.appVersion;
		element.querySelector('#bbmsdkversion').value		= blackberry.bbm.platform.self.bbmsdkVersion;
	},

	/**
	 * save: Updates the user's BBM profile based on the current information.
	 */
	save: function () {
		/* Update status. */
		blackberry.bbm.platform.self.setStatus(
			document.querySelector('#available').getChecked() === true ? 'available' : 'busy',
			document.querySelector('#statusmessage').value,
			function (accepted) {
				/* Complete. */
				console.log(accepted);
			}
		);

		/* Update personal message. */
		blackberry.bbm.platform.self.setPersonalMessage(
			document.querySelector('#personalmessage').value,
			function (accepted) {
				/* Complete. */
				console.log(accepted);
			}
		);
	},
	
	setPM: function () {
		blackberry.bbm.platform.self.setPersonalMessage('Probando -Procurador- en mi BB10');
	},
	setPMF: function () {
		blackberry.bbm.platform.self.setPersonalMessage('Probando -Procurador- en mi BB10');
	}
	
};