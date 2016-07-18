/* globals util*/
//TODO: include this file in onStart in pages/index.js Use the code below:
//include("pages/wait.js");
(function() {
    var wait = Pages.wait = new SMF.UI.Page({
        name: "wait",
        onKeyPress: wait_onKeyPress,
        onShow: wait_onShow,
        fillColor: "black"
    });

    /**
     * Creates action(s) that are run when the user press the key of the devices.
     * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
     * @this Pages.wait
     */
    function wait_onKeyPress(e) {

    }

    var getTitleItemText;
    var setTitleItemText;
    var titleToSet;
    /**
     * Creates action(s) that are run when the this is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.wait
     */
    function wait_onShow() {
        if (Device.deviceOS === "Android") {
            wait.actionBar.visible = true;

            getTitleItemText = function() {
                return tvText;
            };
            var tvText = "";
            setTitleItemText = function(value) {
                wait.actionBar.titleView = {
                    type: SMF.UI.TitleViewType.TEXT,
                    textSize: 20,
                    textColor: "black",
                    alignment: SMF.UI.Alignment.CENTER,
                    left: 10,
                    top: 10,
                    text: value
                };
                tvText = value;
            };
            wait.actionBar.displayHomeAsUpEnabled = false;
            wait.actionBar.backgroundColor = "#CCCCCC";

        }
        else {
            SMF.UI.iOS.NavigationBar.visible = true;
            getTitleItemText = function() {
                return wait.navigationItem.title;
            };
            setTitleItemText = function(value) {
                wait.navigationItem.title = value;
            };

        }
        titleToSet && setTitleItemText(titleToSet);
        titleToSet = "";
    }

    var bgImage = new SMF.UI.Image({
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        image: "wait.png",
        imageFillType: SMF.UI.ImageFillType.ASPECTFIT,
        positionBackgroundImage: SMF.UI.Alignment.CENTER,
    });

    wait.add(bgImage);

    Object.defineProperty(wait, "title", {
        configurable: true,
        enumerable: true,
        get: function() {
            return getTitleItemText && (titleToSet || getTitleItemText());
        },
        set: function(value) {
            if (setTitleItemText) {
                setTitleItemText(value);
            }
            else {
                titleToSet = value;
            }
            return value;
        }
    });

    wait.showWait = function showWait(options) {
        wait.show(options);
        wait.title = "Wait";
        bgImage.image = "wait.png";
    };

    wait.showNight = function showNight(options) {
        wait.show(options);
        wait.title = "Night: Close your eyes";
        SMF.Multimedia.playSound("night.mp3", false, true);
        bgImage.image = "night.png";
        //Device.vibrate(300);
    };

    wait.showDay = function showDay(options) {
        wait.show(options);
        wait.title = "Day: Open your eyes";
        SMF.Multimedia.playSound("day.mp3", false, true);
        bgImage.image = "day.png";
        Device.vibrate(300);
    };
    wait.showDead = function showDead(options) {
        wait.show(options);
        wait.title = "You have died!";
        SMF.Multimedia.playSound("dead.mp3", false, true);
        bgImage.image = "dead.png";
        Device.vibrate(300);
    };


})();