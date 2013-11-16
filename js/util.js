var procLang = document.getElementById("selectLang").value;
var procCountry = document.getElementById("paises").name;
var procCountryId = document.getElementById("paises").value;
var procFlag = document.getElementById("paises").value;
var procState = '';
var procStateId = '';
var procCity = '';
var procName = '';
var procLastName = '';
var procMat = '';
var procTwitter = 'alefcarranza';
var procFacebook = '';

if (procLang = '') {
	procLang = 'Es';
}
if (procCountry = '') {
	procCountry = 'ar';
	procCountryId = '1';
	procFlag = 'images/' + procCountry + '.png';
	procState = 'Capital Federal';
	procStateId = '1';
	procCity = '';
}

console.logOrig = console.log;
console.logData = [];

console.log = function(msg) {
	// this.logData.push(msg);
		this.logOrig(msg);
}

console.printLog = function(me) {
	var list = "<ul data-role='listview'><li>Log</li><li></li>";
	for ( var i = 0; i < this.logData.length; i++) {
		list += "<li>" + this.logData[i] + "</li>";
	}
	list += "</ul>";

	$(me).simpledialog({
		'mode' : 'blank',
		'prompt' : false,
		'cleanOnClose' : true,
		"buttons" : {
			hidden : true
		},
		'forceInput' : false,
		'useModal' : true,
		'fullHTML' : list + "<a rel='close' data-role='button' href='#'>Exit</a>" + //
		"<a rel='close' data-role='button' href='#' onclick='console.logData = [];'>Clean and Exit</a>"
	});
}

/**
 * Basic StringBuilder object:
 */
function StringBuilder(value) {
	this.strings = [];
	this.append(value);
}
StringBuilder.prototype.append = function(value) {
	if (value) {
		this.strings.push(value);
	}
};
StringBuilder.prototype.clear = function() {
	this.strings.length = 0;
};
StringBuilder.prototype.toString = function() {
	return this.strings.join("");
};

function isBlackBerrySmartphone() {
	var ua, isMIDP, isWebKit, isBlackBerry;
	ua = navigator.userAgent.toLowerCase();
	isMIDP = (ua.indexOf("midp") >= 0);
	isWebKit = (ua.indexOf("webkit") >= 0);
	isBlackBerry = (ua.indexOf("blackberry") >= 0);
	return ((isMIDP || isWebKit) && isBlackBerry);
}

function isBlackBerryPlayBook() {
	var ua, isWebKit, isTablet;
	ua = navigator.userAgent.toLowerCase();
	isWebKit = (ua.indexOf("webkit") >= 0);
	isTablet = (ua.indexOf("playbook") >= 0);
	return (isWebKit && isTablet);
}
function isBlackBerryBB10() {
	var ua, isWebKit, isTablet;
	ua = navigator.userAgent.toLowerCase();
	isWebKit = (ua.indexOf("webkit") >= 0);
	isTablet = (ua.indexOf("bb10") >= 0);
	return (isWebKit && isBB10);
}

function setContent(id, content) {
	var ele = document.getElementById(id);
	if (ele) {
		ele.innerHTML = content;
	}
}

function appendContent(id, content) {
	var ele = document.getElementById(id);
	if (ele) {
		ele.insertAdjacentHTML("beforeend", content); // try a faster
	}
}

function prependContent(id, content) {
	var ele = document.getElementById(id);
	if (ele) {
		ele.insertAdjacentHTML("afterbegin", content); // try a faster
	}
}

function howCallMe() {
	try {
		i.dont.exist += 0; // doesn't exist- that's the point
	} catch (e) {
		if (e.stack) {
			var lines = e.stack.split('\n');
			for ( var i = 3; i < lines.length; i++) {
				var init = lines[i].lastIndexOf("/") + 1;
				var end = lines[i].lastIndexOf(".js:");
				return lines[i].substring(init, end);
			}
		}
	}
	return null;
}

function loadComponentPhoto(component, origW, origH) {
	var ratioH = component.naturalHeight / component.naturalWidth * origW;
	var ratioW = component.naturalWidth / component.naturalHeight * origH;

	if (ratioH <= origH) {
		component.width = origW;
		component.height = ratioH;
	} else {
		component.width = ratioW;
		component.height = origH;
	}
};

function getcolorsRGB(imgEl) {

	var blockSize = 5; // only visit every 5 pixels
	var defaultRGB = {
		red : 0,
		green : 0,
		blue : 0,
		percent : 100,
	}; // for non-supporting envs

	var canvas = document.createElement('canvas');
	var context = canvas.getContext && canvas.getContext('2d');
	var data, width, height, length;
	var i = -4;
	var rgb = {
		red : 0,
		green : 0,
		blue : 0,
	};
	var count = 0;

	if (!context) {
		return [ defaultRGB ];
	}

	height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
	width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

	context.drawImage(imgEl, 0, 0);

	try {
		data = context.getImageData(0, 0, width, height);
	} catch (e) {
		/* security error, img on diff domain */
		return [ defaultRGB ];
	}

	length = data.data.length;

	while ((i += blockSize * 4) < length) {
		++count;
		rgb.red += data.data[i];
		rgb.green += data.data[i + 1];
		rgb.blue += data.data[i + 2];
	}

	// ~~ used to floor values
	rgb.red = ~~(rgb.red / count);
	rgb.green = ~~(rgb.green / count);
	rgb.blue = ~~(rgb.blue / count);
	rgb.percent = 100;

	return [ rgb ];

};

function showLoading(text) {
	text = text || 'cargando...';
	$("body").append('<div class="modalWindow"/>');
	$.mobile.loadingMessageTextVisible = true;
	$.mobile.showPageLoadingMsg('b', text);
}

function hideLoading() {
	$(".modalWindow").remove();
	$.mobile.hidePageLoadingMsg();
}

function Flagr(fnCallEnd) {
	this.fnCallEnd = fnCallEnd;

	var me = this;
	this.fnVerified = function() {
		if (me.count <= 0) {
			me.fnCallEnd();
		}
		me.onlyOneTimeout = false;
		console.log('fnVerified ' + me.onlyOneTimeout);
	}

	this.init();
}

Flagr.prototype.init = function() {
	this.count = 0;
	this.onlyOneTimeout = false;
}

Flagr.prototype.push = function() {
	this.count++;
}

Flagr.prototype.pull = function() {
	this.count--;

	if (this.count <= 0 && this.onlyOneTimeout == false) {
		this.onlyOneTimeout = true;
		console.log('Flagr.prototype.pull ' + this.onlyOneTimeout);
		setTimeout(this.fnVerified, 500);
	}
}