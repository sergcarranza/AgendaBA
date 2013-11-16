/*
 * Copyright 2010-2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var content = { };

content.frame = undefined;

content.stack = [];

content.pushNew = function (div) {
    this.frame.appendChild(div);
    this.push(div);
};

content.push = function (div) {
    var topDiv = this.getCurrentDiv();
    // If div is already on top, do nothing
    if (topDiv === div) {
        return;
    }

    // Hide top-most div
    if (topDiv) {
        topDiv.style.display = "none";
    }

    // Push the new div and display it
    this.stack.push(div);
    div.style.display = "block";

    this.loadMenuItems();
};

content.pop = function () {
    // Pop the top-most div and display hide it
    var topDiv = this.stack.pop();
    if (topDiv) {
        topDiv.style.display = "none";
    }

    // Show the top-most div
    topDiv = this.getCurrentDiv();
    if (topDiv) {
        topDiv.style.display = "block";
    } else {
        this.onempty();
    }

    this.loadMenuItems();

    return topDiv;
};

content.popAll = function () {
    var div;
    while (this.stack.length > 0) {
        div = this.stack.pop();
        div.style.display = "none";
    }
};

content.loadMenuItems = function () {
    if (blackberry.ui.menu.getMenuItems().length > 0) {
        blackberry.ui.menu.clearMenuItems();
    }

    var currentDiv = this.getCurrentDiv();
    if (currentDiv) {
        if (currentDiv.addMenuItems) {
            currentDiv.addMenuItems();
        }
    }
};

content.getCurrentDiv = function () {
    var numDivs = this.stack.length;
    if (numDivs > 0) {
        return this.stack[numDivs - 1];
    } else {
        return undefined;
    }
};

/**
 * Called when the last div is popped from the stack.
 */
content.onempty = function () {
    blackberry.app.exit();
};

content.showStart = function () {
    content.popAll();
    content.push(document.getElementById("start"));
};

content.showDemoList = function () {
    content.popAll();
    content.push(document.getElementById("demo-list"));
};

content.showUserProfile = function () {
    content.push(document.getElementById("user-profile"));
    userProfile.populate();
};

content.showProfileBox = function () {
    content.push(document.getElementById("profile-box"));
    profileBox.populate();
};

content.showFileTransfer = function () {
    content.push(document.getElementById("file-transfer"));
};

content.showInviteToBBM = function () {
    content.push(document.getElementById("invite-to-bbm"));
};

content.showHost = function () {
    content.push(document.getElementById("host"));
    host.populateHostInfo();
    host.populateIncomingRequests();
};

content.showPeer = function () {
    content.push(document.getElementById("peer"));
    peer.populateOutgoingRequests();
};

content.showConnections = function () {
    content.push(document.getElementById("connections"));
    connections.populateConnections();
};

content.showShareContent = function () {
	content.push(document.getElementById("sharecontent"));
};

content.showSettings = function () {
	content.push(document.getElementById("about"));
	settings.populate();
};