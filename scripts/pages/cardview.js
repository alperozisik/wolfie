/* globals User, Player*/
//TODO: include this file in onStart in pages/index.js Use the code below:
//include("pages/cardview.js");
(function() {
    var cardview = Pages.cardview = new SMF.UI.Page({
        name: "cardview",
        onKeyPress: cardview_onKeyPress,
        onShow: cardview_onShow,
        fillColor: "black"
    });

    /**
     * Creates action(s) that are run when the user press the key of the devices.
     * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
     * @this Pages.cardview
     */
    function cardview_onKeyPress(e) {
        if (e.keyCode === 4) {
            goBack();
        }
    }

    /**
     * Creates action(s) that are run when the page is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.cardview
     */
    function cardview_onShow() {
        if (Device.deviceOS === "Android") {
            this.actionBar.visible = true;
            this.actionBar.titleView = {
                type: SMF.UI.TitleViewType.TEXT,
                text: this.userName,
                textSize: 20,
                textColor: "black",
                alignment: SMF.UI.Alignment.CENTER,
                left: 10,
                top: 10
            };
            this.actionBar.displayHomeAsUpEnabled = true;
            this.actionBar.onHomeIconItemSelected = function() {
                goBack();
            };
            this.actionBar.backgroundColor = "#CCCCCC";
        }
        else {
            SMF.UI.iOS.NavigationBar.visible = true;
            this.navigationItem.title = this.userName;
            var nbbClose = new SMF.UI.iOS.BarButtonItem({
                systemItem: SMF.UI.iOS.BarButtonType.DONE,
                tintColor: "#000000",
                onSelected: function() {
                    goBack();
                }
            });
            this.navigationItem.rightBarButtonItems = [nbbClose];
        }
    }

    var goBack = function goBack() {
        Pages.back();
    };

    function showCard(player, showOptions, callback, showNextPage) {
        goBack = function goBack() {
            if (!showNextPage) {
                Pages.back();
            }
            else {
                showNextPage();
            }
        };
        User.get(player.userId, function(err, user) {
            if (err) {
                callback && callback(err);
                return;
            }
            cardview.userName = user.name;
            AssignPicture(player);

            cardview.show(showOptions);

            callback && callback(null, this);
        });
    }

    var imgCharacterPicture = new SMF.UI.Image({
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        image: "",
        imageFile: SMF.UI.ImageFillType.ASPECTFIT
    });
    cardview.add(imgCharacterPicture);


    function AssignPicture(player) {
        var character = player.character;
        var imgPath = "";
        switch (character) {
            case Player.WEREWOLF:
                imgPath = "werewolf.png";
                break;
            case Player.WITCH:
                imgPath = "witch.png";
                break;
            case Player.PEASANT:
                imgPath = "peasant.png";
                break;
            case Player.SEER:
                imgPath = "seer.png";
                break;
        }
        imgCharacterPicture.image = imgPath;
    }

    cardview.showCard = showCard;


})();