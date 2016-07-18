/* globals util, User */
//TODO: include this file in onStart in pages/index.js Use the code below:
//include("pages/start.js");
(function() {
    var start = Pages.start = new SMF.UI.Page({
        name: "start",
        onKeyPress: start_onKeyPress,
        onShow: start_onShow
    });


    /**
     * Creates action(s) that are run when the user press the key of the devices.
     * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
     * @this Pages.start
     */
    function start_onKeyPress(e) {
        if (e.keyCode === 4) {
            Application.exit();
        }
    }

    /**
     * Creates action(s) that are run when the page is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.start
     */
    function start_onShow() {
        //type your here code
    }


    var bgImage = new SMF.UI.Image({
        height: Device.screenHeight,
        width: Device.screenHeight,
        top: 0,
        left: (Device.screenWidth - Device.screenHeight) / 2,
        imageFillType: SMF.UI.ImageFillType.STRETCH,
        image: "startbg.png"
    });

    start.add(bgImage);

    var fbLoginBtn = new SMF.UI.ImageButton({
        name: "fbLoginBtn",
        text: "",
        onPressed: function(e) {
            User.login(function(err, data) {
                if (err) {
                    return alert(err);
                } else {
                    loadUserDetails();
                }
            });
        },
        left: "15%",
        top: "70%",
        width: "70%",
        height: "10%",
        defaultImage: "fblogin.png",
        imageFillType: SMF.UI.ImageFillType.ASPECTFIT
    });
    if (User.loginRequired()) {
        start.add(fbLoginBtn);
    }
    else {
        loadUserDetails();
    }

    function loadUserDetails() {
        User.getCurrentUser(function(err, user) {
            if (err) {
                alert(err);
                return;
            }
            if (start.controls.indexOf(fbLoginBtn) > -1) {
                start.remove(fbLoginBtn);
            }

            var userImg = new SMF.UI.Image({
                name: "img",
                image: user.imageURL,
                left: "15%",
                top: "20%",
                width: "70%",
                height: "30%",
                imageFillType: SMF.UI.ImageFillType.ASPECTFIT
            });

            start.add(userImg);

            var btnContinue = new SMF.UI.TextButton({
                text: "Continue as " + user.name,
                left: "15%",
                top: "70%",
                width: "70%",
                height: "10%",
                onPressed: function(e) {
                    Pages.gamelist.show();
                }
            });

            start.add(btnContinue);
        });
    }


})();