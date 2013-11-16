
// set filepicker options for images
function shareImage() {
var type = 'image';
var details = {
mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
filter: ["*.jpg", "*.png"]
};
invokeFilePicker(details, type);
}


// set filepicker options for documents
function shareDoc() {
var type = 'doc';
var details = {
mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
filter: ["*.pdf", "*.txt", "*.doc", "*.log"]
};
invokeFilePicker(details, type);
}


// set filepicker options for music
function shareMusic() {
var type = 'music';
var details = {
mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
filter: ["*.wav", "*.mp3"]
};
invokeFilePicker(details, type);
}


// set filepicker options for video
function shareVideo() {
var type = 'video';
var details = {
mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
filter: ["*.mp4", "*.m4v"]
};
invokeFilePicker(details, type);
}


// invoke the filepicker card
function invokeFilePicker(details, type) {
blackberry.invoke.card.invokeFilePicker(details, function(path) {

// image
if(type === 'image') {
var title = "Share Image";
var request = {
action: 'bb.action.SHARE',
uri: 'file://' + path,
target_type: ["CARD"]
};
loadShareCard(title, request);

// document
} else if(type === 'doc') {
var title = "Share Document";
var request = {
action: 'bb.action.SHARE',
uri: 'file://' + path,
target_type: ["APPLICATION", "VIEWER"]
};
loadShareCard(title, request);

// music
} else if(type === 'music') {
var title = "Share Music";
var request = {
action: 'bb.action.SHARE',
uri: 'file://' + path,
target_type: ["APPLICATION", "VIEWER", "CARD"]
};
loadShareCard(title, request);

// video
} else if(type === 'video') {
var title = "Share Video";
var request = {
action: 'bb.action.SHARE',
uri: 'file://' + path,
target_type: ["APPLICATION", "VIEWER", "CARD"]
};
loadShareCard(title, request);
}
},

// cancelled filepicker
function(reason) {
alert("cancelled " + reason);

// filepicker error
}, function(error) {
if(error) {
alert("invoke error " + error);
} else {
console.log("invoke success ");
}
});
}


// load the share card
function loadShareCard(title, request) {
blackberry.invoke.card.invokeTargetPicker(request, title,

// success
function() {},

// error
function(e) {
console.log(e);
});
}
