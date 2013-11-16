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

window.onload = function () {
    document.body.style.height = screen.height + 'px';
    refresco();
    bbmUtil.init();
    blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK, function () {
        content.pop();
    });
};

var bbmUtil = { };

bbmUtil.accessible = false;

/**
 * Performs steps necessary to start using BBM Platform.
 * 
 * Steps necessary:
 * - Sets static BBM platform callbacks which the application wishes to use.
 * - Call blackberry.bbm.platform.register() with your UUID.
 */
bbmUtil.init = function () {
    // This is called when:
	// - Properties on the current user or other users' profile changes.
	// - Other users install/uninstall this application.
	// - The current user receives an invitation in BBM.
    blackberry.bbm.platform.users.onupdate = function (user, event) {
        if (event === "invited") {
            alert("You were invited to a chat. Go to BBM to accept it.");
        } else if (user.handle === blackberry.bbm.platform.self.handle) {
            userProfile.populate();
        }
    };
    // This is called in certain cases when the application is invoked from within BBM.
    // You can optionally handle these invocations to provide better integration, and interesting use cases.
    blackberry.bbm.platform.onappinvoked = function (reason, param, user) {
        var displayName, message;
        // Get display name
        if (user === blackberry.bbm.platform.self) {
            displayName = "your";
        } else {
            displayName = user.displayName + "'s";
        }

        // Create message for dialog based on reason
        message = "App invoked by " + displayName + " "; 
        if (reason === "profilebox") {
            var profileBoxItem = param;
            message += " profile box item:\n" + profileBoxItem.text;
            content.showProfileBox();
        } else if (reason === "profileboxtitle") {
            message += " profile box title";
            content.showProfileBox();
        } else if (reason === "personalmessage") {
            var personalMsg = param;
            message += "personal message:\n" + personalMsg;
        } else if (reason === "chatmessage") {
            message += "chat message";
        } else {
            // If unknown reason, do nothing
            return;
        }

        alert(message);
    };
    sharecontent.init(); // Set callbacks for share content
    connections.init();  // Set callbacks for connections

    /*
     * Finally the application should register with the platform.
     */
    bbmUtil.register();
};

/**
 * Registers the application with BBM. Static callbacks should be set before this method is called.
 * Called by {@link bbmUtil.init()}.
 * @see bbmUtil.init()
 */
bbmUtil.register = function () {
	/**
     * Required
     * This is called when the application's access to BBM platform changes.
     */
    blackberry.bbm.platform.onaccesschanged = function (accessible, status) {
        bbmUtil.accessible = accessible; // Save the accessible state

        // If allowed, initialize the application
        if (status === "allowed") {
            content.showDemoList();
        // If not allowed, show error screen
        } else {
            content.showStart();
            var startDiv = document.getElementById("start");
            startDiv.innerHTML = "<h3>Connect to BBM failed</h3>" + bbmUtil.getStatusMessage(status);

            /*
             * If blocked by the user, add a button to prompt the user to reconnect to BBM.
             * See bbmUtil.requestPermissionAndRegister()
             */
            if (status === "user") {
                startDiv.innerHTML += "<button onclick='bbmUtil.showBBMAppOptionsAndRegister()'>Connect to BBM</button>";
            }
        }
    };

    try {
        blackberry.bbm.platform.register({
        // TODO You must define your own UUID
		// http://www.guidgenerator.com/online-guid-generator.aspx
	        uuid: "db85376c-75f3-4549-b66a-d0d07f6f45c6",

	        // Enable splatting of application icon when shared content is received
	        shareContentSplat: true
	    });
    } catch (e) {
        alert("You must define your own UUID. See bbmUtil.register() in code.js.");
    }
};

/**
 * Invoked by a "Connect to BBM" button which appears when registration fails due to the user blocking
 * the application.
 * 
 * Prompts the user to connect the application to BBM, which brings the user to the application's
 * BBM Options screen to connect it.
 */
bbmUtil.showBBMAppOptionsAndRegister = function () {
    blackberry.bbm.platform.showBBMAppOptions(function () {
        bbmUtil.register();
    });
};

/**
 * Shows a Contact Picker allowing the user to invite contacts to download the application.
 */
bbmUtil.inviteToDownload = function () {
    blackberry.bbm.platform.users.inviteToDownload(function (result) {
        if (result === "limitreached") {
            // Download invitation limit reached
        } else {
            // User finished inviting
        }
    });
};

/**
 * Shows a Contact Picker allowing the user to start a chat with other users within BBM.
 */
bbmUtil.startBBMChat = function () {
    blackberry.bbm.platform.users.startBBMChat(function () {
        // Continue with application...
    }, "Have you tried " + blackberry.app.name + "?");
};

/**
 * Returns an access status message to be displayed to the user.
 * @param {String} status The status code.
 */
bbmUtil.getStatusMessage = function (status) {
    if (status === "user") {
        return "You decided not to connect " + blackberry.app.name + " to BBM";
    } else if (status === "rim") {
        return blackberry.app.name + " has been banned by RIM.";
    } else if (status === "resetrequired") {
        return "A device restart is required to use this application.";
    } else if (status === "nodata") {
        return "There was no data coverage. Please try again when you are in data coverage.";
    } else if (status === "temperror") {
        return "A temporary error occured. Please try again in 30 minutes.";
    }
};

bbmUtil.getJoinRequestDeclinedReason = function (reason) {
    if (reason === "hostdeclined") {
        return "The host declined your join request";
    } else if (reason === "hostppidinvalid") {
        return "The host PPID was invalid";
    } else if (reason === "appnotrunning") {
        return "The host was not running " + blackberry.app.name;
    } else if (reason === "connectionnotfound") {
        return "The user was not hosting a connection";
    } else if (reason === "connectionfull") {
        return "The host's connection was full";
    }
};

bbmUtil.getJoinRequestCanceledReason = function (reason) {
    if (reason === "peercanceled") {
        return "The peer canceled the request";
    } else if (reason === "peerleft") {
        return "The peer exited " + blackberry.app.name;
    }
};

/**
 * Returns string for a number of users.
 * @param {blackberry.bbm.platform.users.BBMPlatformUser[]} users The users.
 */
bbmUtil.getUsersString = function (users) {
    var usersStr, i;
    if (users.length === 0) {
        return "no users";
    } else {
        usersStr = users[0].displayName;
        for (i = 1; i < users.length; i++) {
            usersStr += ", " + users[i].displayName;
        }
        return usersStr;
    }
};

var util = { };

/**
 * Allows the user to select a local icon.
 */
util.selectIcon = function (cancelChoice) {
    var choices = ["Orange", "Apple", "Pear", cancelChoice],
        choice = blackberry.ui.dialog.customAsk("Select an icon", choices),
        icons =   ["orange.png", "apple.png", "pear.png"];
    if (choice >= icons.length) {
        return undefined;
    } else {
        return "local:///images/icons/" + icons[choice];
    }
};

/**
 * Manages the user profile content div.
 */
var userProfile = { };

userProfile.populate = function () {
    var self = blackberry.bbm.platform.self;
    this.populateBasics(self);
    this.populateLocation(self.location);
};

userProfile.populateBasics = function (self) {
    var displayPictureImg =  document.getElementById("user-profile-display-picture"),
        displayNameDiv =     document.getElementById("user-profile-display-name"),
        personalMessageDiv = document.getElementById("user-profile-personal-message"),
        appVersionDiv =      document.getElementById("user-profile-app-version"),
        bbmsdkVersionDiv =   document.getElementById("user-profile-bbmsdk-version");

    // Default display picture if not found
    var displayPicture = self.displayPicture;
    if (!displayPicture) {
        displayPicture = "icon.png";
    }

    displayPictureImg.src =        displayPicture;
    displayNameDiv.innerHTML =     self.displayName;
    personalMessageDiv.innerHTML = self.personalMessage;
    appVersionDiv.innerHTML =      self.appVersion;
    bbmsdkVersionDiv.innerHTML =   self.bbmsdkVersion;
};

userProfile.populateLocation = function (location) {
    var locationDisabledMessage = document.getElementById("user-profile-location-disabled"),
        locationDetails =         document.getElementById("user-profile-location-details"),
        locationFlag =     document.getElementById("user-profile-location-flag"),
        locationCountry =  document.getElementById("user-profile-location-country"),
        locationTimezone = document.getElementById("user-profile-location-timezone");

    if (location) {  // User has enabled location on their BBM profile
        locationDisabledMessage.style.display = "none";
        locationDetails.style.display = "block";

        locationFlag.src =           location.flag;
        locationCountry.innerHTML =  location.countryCode;
        locationTimezone.innerHTML = "GMT " + (location.timezoneOffset / 60);
    } else {        // User has disabled location on their BBM profile
        locationDisabledMessage.style.display = "block";
        locationDetails.style.display = "none";
    }
};

userProfile.selectDisplayPicture = function () {
    var displayPicture = util.selectIcon("Cancel");
    if (displayPicture) {
        blackberry.bbm.platform.self.setDisplayPicture(displayPicture, function (accepted) {
            if (accepted) {
                // User allowed change
            } else {
                // User denied change
            }
        });
    }
};

userProfile.setPersonalMessage = function () {
    var personalMessageTxt = document.getElementById("user-profile-set-message"),
        personalMessage = personalMessageTxt.value;
    personalMessageTxt.value = "";
    blackberry.bbm.platform.self.setPersonalMessage(personalMessage, function (accepted) {
        if (accepted) {
            // User allowed change
        } else {
            // User denied change
        }
    });
};

userProfile.setStatus = function () {
    // Get status code from selector: "available" or "busy"
    var statusSelect = document.getElementById("user-profile-set-status"),
        statusIndex = statusSelect.selectedIndex,
        status = statusSelect.options[statusIndex].text,
    // Get status message
        statusMsgTxt = document.getElementById("user-profile-set-status-message"),
        statusMsg = statusMsgTxt.value;
    if (statusMsg && statusMsg.length === 0) {
        statusMsg = undefined;
    }
    statusMsgTxt.value = "";

    // Request change to user
    blackberry.bbm.platform.self.setStatus(status, statusMsg, function (accepted) {
        if (accepted) {
            // User allowed change
        } else {
            // User denied change
        }
    });
};

/**
 * Manages the profile box content div.
 */
var profileBox = { };

profileBox.itemIcon = "";

profileBox.populate = function () {
    var itemsDiv = document.getElementById("profile-box-items"),
        items = blackberry.bbm.platform.self.profilebox.items,
        i,
        itemDiv,
        icon;
    if (items.length === 0) {
        itemsDiv.innerHTML = "There are no profile box items.";
    } else {
        itemsDiv.innerHTML = "Select a profile box item to delete it.";
        for (i = items.length - 1; i >= 0; i--) {
            itemDiv = document.createElement("div");
            icon = items[i].icon;
            if (!icon) {
                icon = "";
            }
            itemDiv.innerHTML = '<div x-blackberry-focusable="true" class="profile-box-item" onclick="profileBox.removeItem(' + items[i].id + ');"><img class="profile-box-icon" src="' + icon + '"/><div class="profile-box-text">' + items[i].text + '</div></div>';
            itemsDiv.appendChild(itemDiv);
        }
    }
};

profileBox.removeItem = function (id) {
    var answer = blackberry.ui.dialog.standardAsk(blackberry.ui.dialog.D_OK_CANCEL, "Delete this item?"),
        items,
        i;
    if (answer === blackberry.ui.dialog.D_OK) {
        items = blackberry.bbm.platform.self.profilebox.items;
        for (i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                blackberry.bbm.platform.self.profilebox.removeItem(items[i]);
                this.populate();
                break;
            }
        }
    }
};

profileBox.selectItemIcon = function () {
    var itemIcon = util.selectIcon("No Icon"),
        itemIconImg = document.getElementById("profile-box-add-icon");
    itemIconImg.src = itemIcon;
    this.itemIcon = itemIcon;
};

profileBox.addItem = function () {
    var itemTextElem = document.getElementById("profile-box-add-text"),
        itemText = itemTextElem.value,
        itemIcon,
        itemOptions;
    itemTextElem.value = "";
    if (itemText.length === 0) {
        alert("Enter some text");
    } else {
        itemIcon = this.itemIcon;
        if (itemIcon === "") {
            itemIcon = undefined;
        }
        itemOptions = { text: itemText, icon: itemIcon };
        blackberry.bbm.platform.self.profilebox.addItem(itemOptions);
        this.populate();
    }
};

/**
 * Manages the invite to BBM content div.
 */
var inviteToBBM = { };

/**
 * A list of the contact invitations to be sent.
 * @type blackberry.bbm.platform.users.ContactInvitation[]
 */
inviteToBBM.invitations = [];

/**
 * Adds a contact invitation to inviteToBBM.invitations.
 */
inviteToBBM.addContact = function () {
    if (this.invitations.length > 24) {
        alert("You may not invite more than 24 contacts at a time.");
        return;
    }

    var form = document.getElementById("invite-to-bbm-form"),
        nameVal = form.name.value,
        pinVal =  form.pin.value,
        invitation,
        contactDiv,
        contactsDiv;
    if (nameVal.length === 0) {
        alert("Name cannot be empty");
        return;
    }
    if (pinVal.length !== 8) {
        alert("PIN must be 8 characters long");
        return;
    }

    invitation = { pin: pinVal, name: nameVal };
    this.invitations.push(invitation);

    form.pin.value = "";
    form.name.value = "";

    contactDiv = document.createElement("div");
    contactDiv.innerHTML = '<div x-blackberry-focusable="true" class="contact-invitation"><img class="contact-picture" src="images/user.png"/><div class="contact-details">' + nameVal + '<br/>' + pinVal + '</div></div>';

    contactsDiv = document.getElementById("invite-to-bbm-contacts");
    contactsDiv.appendChild(contactDiv);
};

/**
 * Sends the invitations in inviteToBBM.invitations.
 */
inviteToBBM.invite = function () {
    if (this.invitations.length === 0) {
        alert("You have not selected any users to invite");
        return;
    }

    blackberry.bbm.platform.users.inviteToBBM(function () {
        // Continue with application...
    }, this.invitations);
    this.invitations = [];
    var contactsDiv = document.getElementById("invite-to-bbm-contacts");
    contactsDiv.innerHTML = "";
};

/**
 * Manages the file transfer content div.
 */
var fileTransfer = { };
fileTransfer.sendFile = function () {
    var file = document.getElementById("file-transfer-file");
    blackberry.bbm.platform.users.sendFile(file.value, "Check out this file.", function (reason) {
        var message = fileTransfer.getFailureMessage(reason);
        if (message) {
            alert(message);
        }
    });
};
fileTransfer.getFailureMessage = function (reason) {
    if (reason === "filenotfound") {
        return "The file does not exist.";
    } else if (reason === "filetoolarge") {
        return "The file is too large.";
    } else if (reason === "fileforwardlocked") {
        return "The file is DRM protected.";
    } else if (reason === "filebadtype") {
        return "The user is unable to receive files of this type.";
    } else if (reason === "fileempty") {
        return "The file is empty and cannot be sent.";
    } else if (reason === "usercanceled") {
        return "You canceled the file transfer.";
    } else if (reason === "noncontact") {
        return "You may only send files to your BBM contacts.";
    }
};

/**
 * Manages the peer content div.
 */
var peer = { };

peer.joinHost = function () {
    // Get PIN and PPID from the form
    // TODO: Your application should download host PIN and PPID from your discovery service. For the
    // purpose of this sample app, the user acts as the discovery service.
    var form = document.getElementById("peer-form"),
        pin =  form.pin.value,
        ppid = form.ppid.value,
        onComplete,
        onHostAccepted,
        onHostDeclined;
    if (pin.length !== 8) {
        alert("PIN must be 8 characters long");
        return;
    }
    if (ppid.length === 0) {
        alert("Enter PPID");
        return;
    }

    // Make the join request
    // Create the callbacks
    onComplete = function (request) {
        if (request) {
            peer.populateOutgoingRequests();
        } else {
            alert("You aborted the request.");
        }
    };
    onHostAccepted = function (request, cookie) {
        peer.populateOutgoingRequests();
        alert("Join request to " + request.host.displayName + " was accepted! (" + request.id + ")");
    };
    onHostDeclined = function (request, reason) {
        peer.populateOutgoingRequests();
        alert("Join request to " + request.host.displayName + " failed: " + bbmUtil.getJoinRequestDeclinedReason(reason) + ". (" + request.id + ")");
    };

    // Make the request
    try {
        blackberry.bbm.platform.io.joinHost(pin, ppid, onComplete, onHostAccepted, onHostDeclined);
    } catch (e) {
        alert("Joining host failed: " + e);
        return;
    }
};

peer.clearForm = function () {
    var form = document.getElementById("peer-form");
    form.pin.value = "";
    form.ppid.value = "";
};

peer.populateOutgoingRequests = function () {
    var joinHostRequests = document.getElementById("peer-requests"),
        requests = blackberry.bbm.platform.io.joinHostRequests,
        i,
        requestDiv;
    if (requests.length === 0) {
        joinHostRequests.innerHTML = "There are no outgoing join requests";
    } else {
        joinHostRequests.innerHTML = "";
        for (i = 0; i < requests.length; i++) {
            requestDiv = peer.createRequestDiv(requests[i]);
            joinHostRequests.appendChild(requestDiv);
        }
    }
};

peer.createRequestDiv = function (request) {
    var requestDiv = document.createElement("div");
    requestDiv.innerHTML = '<div x-blackberry-focusable="true" class="contact-invitation" onclick="peer.cancelRequest(' + request.id + ');"><img class="contact-picture" src="images/user.png"/><div class="contact-details">' + request.host.displayName + '<br/>' + request.id + '</div></div>';
    return requestDiv;
};

peer.cancelRequest = function (requestID) {
    var request = this.getRequestById(requestID),
        result;
    if (request) {
        result = blackberry.ui.dialog.standardAsk(blackberry.ui.dialog.D_YES_NO, "Cancel this join request?");
        if (result === blackberry.ui.dialog.C_YES) {
            try {
                request.cancel();
            } catch (e) {
                // Request may already have been accepted/declined by host
            }
            peer.populateOutgoingRequests();
        }
    } else {
        alert("Request " + requestID + " could was not found. The host may have already accepted/declined the request.");
    }
};

peer.getRequestById = function (requestID) {
    var requests = blackberry.bbm.platform.io.joinHostRequests,
        request,
        i;

    for (i = 0; i < requests.length; i++) {
        request = requests[i];
        if (request.id === requestID) {
            return request;
        }
    }
    return undefined;
};

/**
 * Manages the host content div.
 */
var host = {};

host.startHosting = function (chat, conn) {
    var onComplete, onRequestReceived, onRequestCanceled;
    onComplete = function (hosting) {
        if (hosting) {
            content.loadMenuItems();
            chat.messageList.appendSystemMessage("You started hosting a public chat");
            alert("You are now hosting a public chat.\n\nSelect 'View Join Requests' from the menu to accept/decline peers.");
            // TODO: Your application should now post the host PIN and PPID to your discovery service
        } else {
            alert("You aborted hosting a public chat.");
        }
    };
    onRequestReceived = function (request) {
        chat.messageList.appendSystemMessage("You received a join request from " + request.peer.displayName + "(" + request.id + ")");
        host.populateIncomingRequests();
    };
    onRequestCanceled = function (request, reason) {
        chat.messageList.appendSystemMessage(request.peer.displayName + " canceled join request " + request.id + ": " + bbmUtil.getJoinRequestCanceledReason(reason));
        host.populateIncomingRequests();
    };

    blackberry.bbm.platform.io.host(conn, onComplete, onRequestReceived, onRequestCanceled);
};

host.stopHosting = function (chat) {
    if (!blackberry.bbm.platform.io.hostedConnection) {
        alert("You are not hosting on a connection");
    } else {
        blackberry.bbm.platform.io.host(); // Stops hosting
        content.loadMenuItems();
        host.populateIncomingRequests();
        chat.messageList.appendSystemMessage("You stopped hosting a public chat.\n\nThose who joined the connection will remain.");
    }
};

host.populateHostInfo = function () {
    var hostPINDiv = document.getElementById("host-pin"),
        hostPPIDDiv = document.getElementById("host-ppid");
    hostPINDiv.innerHTML = blackberry.identity.PIN;
    hostPPIDDiv.innerHTML = blackberry.bbm.platform.self.ppid;
};

host.populateIncomingRequests = function () {
    var joinHostRequests = document.getElementById("host-requests"),
        noRequestsMsg = "There are no incoming join requests",
        requests,
        requestDiv,
        requestsDiv,
        i;
    if (blackberry.bbm.platform.io.hostedConnection) {
        requests = blackberry.bbm.platform.io.hostRequests;
        if (requests.length === 0) {
            joinHostRequests.innerHTML = noRequestsMsg;
        } else {
            joinHostRequests.innerHTML = "";
            for (i = 0; i < requests.length; i++) {
                requestDiv = host.createRequestDiv(requests[i]);
                joinHostRequests.appendChild(requestDiv);
            }
        }
    } else {
        joinHostRequests.innerHTML = noRequestsMsg;
    }

    requestsDiv =  document.getElementById("host-requests-container");
    if (blackberry.bbm.platform.io.hostedConnection) {
        requestsDiv.style.display = "block";
    } else {
        requestsDiv.style.display = "none";
    }
};

host.createRequestDiv = function (request) {
    var requestDiv = document.createElement("div");
    requestDiv.innerHTML = '<div x-blackberry-focusable="true" class="contact-invitation" onclick="host.handleRequest(' + request.id + ');"><img class="contact-picture" src="images/user.png"/><div class="contact-details">' + request.peer.displayName + '<br/>' + request.id + '</div></div>';
    return requestDiv;
};

host.handleRequest = function (requestID) {
    var request = host.getRequestById(requestID),
        message,
        result;

    // Found the request. Ask the user what they want to do.
    if (request) {
        message = "Accept join request from " + request.peer.displayName + "?";
        result = blackberry.ui.dialog.customAsk(message, ["Accept", "Decline"], 0, false);
        if (result === 0) {
            try {
                request.accept();
                bbmChat.messageList.appendSystemMessage("You accepted join request " + request.id + " from " + request.peer.displayName);
            } catch (e1) {
             // Accept failed: The peer may have already canceled the request
            }
        } else if (result === 1) {
            try {
                request.decline();
                bbmChat.messageList.appendSystemMessage("You declined join request " + request.id + " from " + request.peer.displayName);
            } catch (e2) {
                // Decline failed: The peer may have already canceled the request
            }
        }
    // Could not find request: The peer may have already canceled the request
    } else {
        alert("Request " + requestID + " could was not found. The peer may have already canceled the request.");
    }

    host.populateIncomingRequests();
};

host.getRequestById = function (requestID) {
    var requests = blackberry.bbm.platform.io.hostRequests,
        request,
        i;
    for (i = 0; i < requests.length; i++) {
        request = requests[i];
        if (request.id === requestID) {
            return request;
        }
    }
    return undefined;
};

/**
 * Manages the Share Content div.
 */
var sharecontent = {};

/**
 * Setup callbacks required for share content. 
 */
sharecontent.init = function () {
	// This will be invoked on the receiver's side. This should be set before the call to register()
	blackberry.bbm.platform.users.onsharecontent = function (sender, content, description, timestamp) {
		alert(sender.displayName + " shared content with you...\n" +
				"Description: " + description + "\n" +
				"Timestamp: " + timestamp.toDateString() + "\n" +
				"Content: " + content);
	};
};

/**
 * Shares content from the share content div.
 */
sharecontent.share = function () {
	// Get values from the form
	var form = document.getElementById("sharecontent-form"),
	    title =               form.title.value,
	    description =         form.description.value,
	    content =             form.content.value,
	    onlyContactsWithApp = form.contactsWithApp.checked,
	    options;

	// Clear values on the form
	form.title.value = "";
	form.description.value = "";
	form.content.value = "";
	form.contactsWithApp.checked = false;

	// Create options object. Only required if title or users are provided
	if ((title && title.length > 0) || onlyContactsWithApp) {
		options = {};
		if (title) {
			options.title = title;
		}
		if (onlyContactsWithApp) {
			options.users = blackberry.bbm.platform.users.contactsWithApp;
		}
	} else {
		options = undefined;
	}
	
	// Allow user to pick contacts to send content
	try {
		if (options) {
			blackberry.bbm.platform.users.shareContent(content, description, function () {
				// User finished sharing...
			}, options);
		} else {
			blackberry.bbm.platform.users.shareContent(content, description, function () {
				// User finished sharing...
			});
		}
	} catch (e) {
		alert("Problem occurred while sharing content: " + e);
	}
};

/**
 * Manages the settings content div.
 */
var settings = {};

/**
 * Brings up the BBM options screen for this application.
 */
settings.showSettings = function () {
	blackberry.bbm.platform.showBBMAppOptions(function () {
		// Repopulate when user returns from options screen
		settings.populate();
	});
};

/**
 * Populates the settings in the settings div.
 */
settings.populate = function () {
	var form = document.getElementById("settings-form");
	form.profilebox.checked =  blackberry.bbm.platform.settings.profileboxEnabled;
	form.publicconns.checked = blackberry.bbm.platform.settings.alwaysAllowPublicConns;
};

var connections = {};

connections.list = [];

/**
 * Setup required/optional callbacks for connections.
 */
connections.init = function () {
	// Required 
	// This is invoked when the application receives a connection. This can happen in two cases:
	// 1. On the invitee's side when the user accepts an invitation within BBM.
	// 2. On the peer's side when a host accepts a peer's request to join a hosted connection.
	blackberry.bbm.platform.io.onconnectionaccepted = function (type, connection) {
        connections.setupConnection(type, connection);
    };
    // Optional
    // This is invoked when an unreachable user becomes reachable again.
    blackberry.bbm.platform.io.onuserreachable = function (user) {
        alert(user.displayName + " was unreachable, but can now receive messages.");
    };
    // Optional
    // This is invoked when pending data for an unreachable contact expires.
    blackberry.bbm.platform.io.ondataexpired = function (user, data) {
        alert(user.displayName + " did not receive all messages");
    };
};

/**
 * Setup a new connection with an embedded BBM chat.
 */
connections.createConnection = function (type) {
    var conn = blackberry.bbm.platform.io.createConnection(type);
    this.setupConnection(type, conn);
};

/**
 * Setup a connection. This will be specific to your application.
 * 
 * Generates HTML for an embedded BBM chat for this connection and adds it to the DOM.
 * Assigns callbacks to the connection events and ties those back to the elements for this chat,
 * thus keeping chats distinct.
 */
connections.setupConnection = function (type, conn) {
    var chat = bbmChatUtil.createBasicChat(type, conn);

    // Add connection and type properties to the chat.Used to display the connections in connections.populateConnections() 
    chat.conn = conn;
    chat.type = type;

    // Add new connection to the list, the re-populate the list
    this.list.push(chat);
    this.populateConnections();

    // Push the new chat div asynchronously. Pushing synchronously was causing the application to freeze.
    setTimeout(function () {
        content.pushNew(chat.frame);
    }, 100);
};

connections.populateConnections = function () {
    var connList = document.getElementById("connections-list"),
        numConns = this.list.length,
        i,
        chat,
        connDiv;

    if (numConns === 0) {
        connList.innerHTML = "There are no connections.";
    } else {
        connList.innerHTML = "";

        for (i = 0; i < numConns; i++) {
            chat = this.list[i];
            connDiv = this.createConnectionDiv(chat.type, chat.conn.id);
            connList.appendChild(connDiv);
        }
    }
};

connections.createConnectionDiv = function (type, id) {
    var typeStr, connDiv;

    if (type === "channel") {
        typeStr = "Channel";
    } else if (type === "session") {
        typeStr = "Session";
    } else {
        return;
    }

    connDiv = document.createElement("div");
    connDiv.innerHTML = '<div x-blackberry-focusable="true" class="contact-invitation" onclick="connections.showConn(' + id + ');"><img class="contact-picture" src="images/user.png"/><div class="contact-details">' + typeStr + '<br/>' + id + '</div></div>';
    return connDiv;
};

connections.showConn = function (id) {
    var numConns = this.list.length,
        i,
        chat;
    for (i = 0; i < numConns; i++) {
        chat = this.list[i];
        if (chat.conn.id === id) {
            content.push(chat.frame);
            break;
        }
    }
};

var bbmChatUtil = {};

/**
 * Generates basic BBM chat content.
 * @returns a BBMChat object, whose 'frame' property is the BBM chat div.
 */
bbmChatUtil.createBasicChatContent = function () {
    var frame, msgList, filler, footer, controls, reply, toggle, chat;

    frame = document.createElement("div");
    frame.className = "content";
    frame.setAttribute("id", "bbm-embedded-chat");
    frame.innerHTML = '<div name="message-list" class="bbm-chat-message-list"></div><div name="filler"></div><div name="footer" class="bbm-chat-footer"><div name="controls" class="bbm-chat-controls"><div class="bbm-chat-reply-frame"><input name="reply" class="bbm-chat-reply" type="text"/></div><div class="bbm-chat-reply-separator"></div></div><div name="toggle" class="bbm-chat-toggle"><img /></div></div>';

    msgList =  bbmChatUtil.getElementByName(frame, "message-list");
    filler =   bbmChatUtil.getElementByName(frame, "filler");
    footer =   bbmChatUtil.getElementByName(frame, "footer");
    controls = bbmChatUtil.getElementByName(frame, "controls");
    reply =    bbmChatUtil.getElementByName(frame, "reply");
    toggle =   bbmChatUtil.getElementByName(frame, "toggle");

    // Set solid background in BB5 browser, since it does not support gradient backgrounds
    if (navigator.appVersion.indexOf('5.0.0') >= 0) {
        toggle.style.backgroundColor = "#303943";
    }

    return new BBMChat(frame, msgList, filler, footer, reply, controls, toggle);
};

bbmChatUtil.createBasicChat = function (connType, conn) {
    var chat = this.createBasicChatContent();
    this.setupChat(chat, connType, conn);
    return chat;
};

/**
 * Sets up a BBMChat object and a connection.
 */
bbmChatUtil.setupChat = function (chat, connType, conn) {
    // Set up connection events to post back to the chat
    bbmChatUtil.setConnectionCallbacks(chat, connType, conn);

    // Assign addMenuItems() callback to chat frame div. The content.js framework will call this
    // method to add menu items when the div becomes the visible screen.
    chat.frame.addMenuItems = function () {
        // Add chat command menu items
        bbmChatUtil.addMenuItems(chat, connType, conn);
    };

    // Trigger reply when enter key is pressed in chat input field.
    chat.replyInput.onkeypress = function (evn) {
        if (chat.showing) {
            // Enter
            if ((window.event && window.event.keyCode === 13) ||
                    (evn && evn.keyCode === 13)) {
                bbmChatUtil.reply(chat, connType, conn);
            }
        }
    };

    return chat;
};

/**
 * Adds BBM chat menu items for the a chat and a connection.
 */
bbmChatUtil.addMenuItems = function (chat, connType, conn) {
    var item;

    // Channel/Session menu items
    item = new blackberry.ui.menu.MenuItem(false, 0, "Invite Contacts", function () {
        if (blackberry.bbm.platform.users.contactsWithApp.length === 0) {
            alert("No contacts have " + blackberry.app.name + " installed");
        } else {
            conn.inviteContacts("Would you like to chat?");
        }
    });
    blackberry.ui.menu.addMenuItem(item);
    item = new blackberry.ui.menu.MenuItem(false, 1, "Remove Users", function () {
        if (!conn || conn.joinedUsers.length === 0) {
            alert("There are no users in the chat.");
        } else {
            blackberry.bbm.platform.users.pickUsers({
                title: "Select users to remove",
                users:  conn.joinedUsers,
                multiSelect: true,
                showSelectAll: true
            }, function (users) {
                if (users.length > 0) {
                    conn.remove(users);
                }
            });
        }
    });
    blackberry.ui.menu.addMenuItem(item);
    item = new blackberry.ui.menu.MenuItem(false, 3, "Leave Chat", function () {
        conn.leave();
        chat.messageList.appendSystemMessage("You left the chat.");
    });
    blackberry.ui.menu.addMenuItem(item);
    item = new blackberry.ui.menu.MenuItem(false, 4, "Clear Chat", function () {
        chat.messageList.clear();
    });
    blackberry.ui.menu.addMenuItem(item);
    item = new blackberry.ui.menu.MenuItem(false, 5, "Ping", function () {
        var displayName, pingObj, pingStr;

        displayName = blackberry.bbm.platform.self.displayName;
        chat.messageList.appendOutMessage(displayName, "PING!!!");

        pingObj = { id: 'ping' };
        pingStr = JSON.stringify(pingObj);

        bbmChatUtil.sendToAll(connType, conn, pingStr);
    });
    blackberry.ui.menu.addMenuItem(item);

    // Session only menu items
    if (connType === "session") {
        item = new blackberry.ui.menu.MenuItem(false, 2, "End Chat", function () {
            conn.end();
            chat.messageList.appendSystemMessage("You ended the chat.");
        });
        blackberry.ui.menu.addMenuItem(item);
    }

    // Hosting menu items differ if this connection is hosted or not
    if (conn === blackberry.bbm.platform.io.hostedConnection) {
        item = new blackberry.ui.menu.MenuItem(false, 6, "Stop Hosting", function () {
            host.stopHosting(chat);
        });
        blackberry.ui.menu.addMenuItem(item);
        item = new blackberry.ui.menu.MenuItem(false, 7, "View Join Requests", function () {
            content.showHost();
        });
        blackberry.ui.menu.addMenuItem(item);
    } else {
        item = new blackberry.ui.menu.MenuItem(false, 6, "Start Hosting", function () {
            host.startHosting(chat, conn);
        });
        blackberry.ui.menu.addMenuItem(item);
    }
};

/**
 * Sends a reply using a BBM Platform Connection. Extracts the reply text, posts it to the
 * <code>chat.messageList</code>, then sends it over <code>conn</code>.
 */
bbmChatUtil.reply = function (chat, connType, conn) {
    var replyText, displayName, msgObj, msgStr;

    replyText = chat.extractReplyText();
    if (replyText && replyText.length > 0) {
        // Post to the message list
        displayName = blackberry.bbm.platform.self.displayName;
        chat.messageList.appendOutMessage(displayName, replyText);

        // Send to all users on connection
        msgObj = { id: 'msg', value: replyText };
        msgStr = JSON.stringify(msgObj);
        try {
            bbmChatUtil.sendToAll(connType, conn, msgStr);
        } catch (e) {
            alert("Error occurred while sending data: " + e);
        }
    }
};

/**
 * Sends a message to all users on the connection.
 * For Channel, uses send() to send to all participants.
 * For Session, uses broadcast() to send to all participants.
 */
bbmChatUtil.sendToAll = function (connType, conn, msgStr) {
    // Send/broadcast for channel/session
    if (connType === "channel") {
        conn.send(msgStr, conn.joinedUsers);
    } else if (connType === "session") {
        conn.broadcast(msgStr);
    }
};

/**
 * Sets up connection events to post back to <code>chat.messageList</code>.
 */
bbmChatUtil.setConnectionCallbacks = function (chat, connType, conn) {
    var parseData = function (data) {
        var dataObj = JSON.parse(data),
            dataID = dataObj.id;

        if (dataID === "msg") {
            return dataObj.value;
        } else if (dataID === "ping") {
            return "PING!!!";
        }
    };

    conn.onusersinvited = function (users) {
        chat.messageList.appendSystemMessage(bbmUtil.getUsersString(users) + " invited to the chat");
    };
    conn.onusersjoined = function (users, type, cookie) {
        chat.messageList.appendSystemMessage(bbmUtil.getUsersString(users) + " joined the chat");
    };
    conn.onuserdeclined = function (user) {
        chat.messageList.appendSystemMessage(user.displayName + " declined the chat");
    };
    conn.onuserleft = function (user) {
        chat.messageList.appendSystemMessage(user.displayName + " left the chat");
    };
    conn.ondata = function (user, data) {
        var message = parseData(data);
        chat.messageList.appendInMessage(user.displayName, message);
    };
    // NOTE: The following callbacks only apply to Session connections
    if (connType === "session") {
        conn.onbroadcastdata = function (user, data) {
            var message = parseData(data);
            chat.messageList.appendInMessage(user.displayName, message);
        };
        conn.onusersremoved = function (user, users) {
            chat.messageList.appendSystemMessage(user.displayName + " removed " + bbmUtil.getUsersString(users) + " from the chat");
        };
        conn.onended = function (user) {
            chat.messageList.appendSystemMessage(user.displayName + " ended the chat");
        };
    }
};

bbmChatUtil.getElementByName = function (root, name) {
    var children, i, elem;

    if (root.getAttribute("name") === name) {
        return root;
    } else {
        children = root.childNodes;
        for (i = 0; i < children.length; i++) {
            elem = bbmChatUtil.getElementByName(children[i], name);
            if (elem) {
                return elem;
            }
        }
    }
};