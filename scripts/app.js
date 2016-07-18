/* globals lang */
include('i18n/i18n.js');
Application.onStart = Application_OnStart;
Application.onUnhandledError = Application_OnError;
include("util/index.js");
include("libs/Smartface/polyfills.js");
include("libs/utils/JSON.prune.js");

/**
 * Triggered when application is started.
 * @param {EventArguments} e Returns some attributes about the specified functions
 * @this Application
 */
function Application_OnStart(e) {
	include("model/index.js");
	include("pages/index.js");
	Pages.start.show();
}

function Application_OnError(e) {
	switch (e.type) {
		case "Server Error":
		case "Size Overflow":
			alert(lang.networkError);
			break;
		default:
			//change the following code for desired generic error messsage
			alert({
				title: lang.applicationError,
				message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
			});
			break;
	}
}
