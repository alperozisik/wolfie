/* globals SMFFacebook, FBClass, lang*/
(function() {
    var facebook = {};
    global.util.facebook = facebook;
    var facebooAappId = "1111573615546690"; //"297266653942470"; 
    var facebookScope = ["public_profile", "email", "user_photos"];
    var fb;
    var setup = {
        Android: function androidSetup() {
            fb = new SMFFacebook("Landroid/app/Activity;", Number(facebooAappId));

            facebook.login = function login(callback) {
                fb.openSession(
                    facebookScope,
                    function(e) {
                        facebook.token = e.data;
                        callback(null, fb);
                    }, //onSuccess callback parameter
                    function(e) {
                        callback(e.message);
                    } //onError callback parameter
                );
            };

        },
        iOS: function iOSSetup() {
            fb = new FBClass();
            fb.setAppID(facebooAappId);

            fb.userDetails = function(onSuccess, onError) {
                fb.userDetailsOnSuccessOnError(onSuccess, onError);
            };


            facebook.login = function login(callback) {
                fb.openSessionOnSuccessOnError(
                    facebookScope,
                    function(e) {
                        // alert("Success");
                        facebook.token = e.data;
                        callback(null, fb);
                    },
                    function(e) {
                        // alert("Error");
                        callback(e.message);
                    });
            };
        }
    };

    facebook.isSessionActive = function isSessionActive(callback) {
        if (!callback) {
            return fb.isSessionActive();
        }
        else {
            callback(null, fb.isSessionActive());
        }

    };

    facebook.userDetails = function userDetails(callback) {
        fb.userDetails(
            function(e) {
                var fId = e.id;
                var response = Object.assign({
                    imageURL: "http://graph.facebook.com/" + fId + "/picture?width=200&height=200"
                }, e);
                callback(null, response);

            },
            function() {
                var message = "Cannot sign in with Facebook.";
                if (Device.deviceOS === "Android") {
                    message += "\r\nPlase modify Android manifest with valid Facebook App ID and this can be only tested on pusblished project.";
                }
                callback(message);
            });
    };
    setup[Device.deviceOS]();
})();