/* globals User, Player, Game, util*/
//TODO: include this file in onStart in pages/index.js Use the code below:
//include("pages/choose.js");
(function() {
    var choose = Pages.choose = new SMF.UI.Page({
        name: "choose",
        onKeyPress: choose_onKeyPress,
        onShow: choose_onShow
    });

    /**
     * Creates action(s) that are run when the user press the key of the devices.
     * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
     * @this Pages.choose
     */
    function choose_onKeyPress(e) {}

    /**
     * Creates action(s) that are run when the page is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.choose
     */
    function choose_onShow() {
        //type your here code
    }


    choose.chooseForLynch = chooseForLynch;
    choose.chooseForWereWolfKill = chooseForWereWolfKill;
    choose.chooseForWitchPotion = chooseForWitchPotion;
    choose.chooseForSeer = chooseForSeer;

    function chooseForLynch() {
        btnAction.visible = true;
        cntWitch.visible = false;
        Player.getPlayersOfGame(Game.currentGame, {
            condition: Player.ALIVE,
            userId: "!" + User.currentUser.id
        }, function(err, players) {
            if (err) return alert(err);
            fillTargets("Choose possible werewolf among you", "Lynch {0}", players);
        });
    }

    function chooseForWereWolfKill() {
        btnAction.visible = true;
        cntWitch.visible = false;
        Player.getPlayersOfGame(Game.currentGame, {
            condition: Player.ALIVE,
            character: "!" + Player.WEREWOLF
        }, function(err, players) {
            if (err) return alert(err);
            fillTargets("Attack at night", "Kill {0}", players);
        });
    }

    function chooseForWitchPotion() {
        btnAction.visible = false;
        cntWitch.visible = true;
        var player = choose.player;
        btnCure.visible = !!player.cure;
        btnPoison.visible = !!player.posion;
        Player.getPlayersOfGame(Game.currentGame, {
            condition: Player.ALIVE,
            character: "!" + Player.WITCH
        }, function(err, players) {
            if (err) return alert(err);
            fillTargets("Use your potions at {0}", players);
        });
    }

    function chooseForSeer() {
        btnAction.visible = true;
        cntWitch.visible = false;
        Player.getPlayersOfGame(Game.currentGame, {
            condition: Player.ALIVE,
            character: "!" + Player.SEER
        }, function(err, players) {
            if (err) return alert(err);
            fillTargets("Use your globe to see the truth", "Take a look at {0}", players);
        });
    }

    function fillTargets(decription, actionFormat, targets) {
        svChoose.clear();
        lblDescription.text = decription;
        svChoose.pageIndex = svChoose.scrollX = 0;
        svChoose.targets = targets;
        if (targets.length === 0)
            throw Error("Targets are less then 1");
        svChoose.contentWidth = targets.length * Device.screenWidth;
        btnAction.actionFormat = actionFormat;
        btnAction.text = String.format(btnAction.actionFormat, svChoose.targets[svChoose.pageIndex].name);
        var imgList = [];
        for (var i = 0; i < targets.length; i++) {
            var imgPlayer = new SMF.UI.Image({
                imageFillType: SMF.UI.ImageFillType.ASPECTFIT,
                height: "100%",
                width: Device.screenWidth * 0.7,
                image: "",
                top: 0,
                left: (Device.screenWidth * 0.05) + i * (Device.screenWidth * 0.8)
            });
            imgList.push(imgPlayer);
            imgPlayer.userId = targets[i].userId;
            User.get(targets[i].userId, function(err, user) {
                if (err)
                    return alert(err);
                var imgPlayer;
                for (var i = 0; i < imgList.length; i++) {
                    imgPlayer = imgList[i];
                    if (imgPlayer.userId === user.id) {
                        imgPlayer.img = user.imageURL;
                    }
                }
            });
        }
    }

    var svChoose = new SMF.UI.ScrollView({
        height: "50%",
        top: "35%",
        left: 0,
        width: "100%",
        enableVerticalPaging: false,
        enableHorizontalPaging: true,
        enableHorizontalScrolling: true,
        enableVerticalScrolling: false,
        contentHeight: "100%",
        contentWidth: "100%",
        pageHeight: "100%",
        pageWidth: Device.screenWidth * 0.8,
        onPageChanged: function(e) {
            this.pageIndex = e.pageIndex;
            btnAction.text = String.format(btnAction.actionFormat, svChoose.targets[svChoose.pageIndex].name);
        }
    });
    choose.add(svChoose);


    var btnAction = new SMF.UI.TextButton({
        text: "Action",
        left: "15%",
        top: "89%",
        width: "70%",
        height: "10%",
        onPressed: function(e) {
            var target = svChoose.targets[svChoose.pageIndex];
            Pages.choose.player.vote = target.id;
            Pages.choose.player.save(function(err, player) {
                if (err) return alert(err);
                Pages.back();
            });
        }
    });

    var cntWitch = new SMF.UI.Container({
        left: "15%",
        top: "89%",
        width: "70%",
        height: "10%",
        borderWidth: 0,
        visible: false
    });

    var btnPoison = util.uiFactory(SMF.UI.TextButton, {
        left: "5%",
        top: 0,
        height: "100%",
        width: "25%",
        text: "Poison",
        onPressed: function(e) {
            witchAction("poison");
        }
    });
    cntWitch.add(btnPoison);

    var btnCure = util.uiFactory(SMF.UI.TextButton, {
        left: "33%",
        top: 0,
        height: "100%",
        width: "25%",
        text: "Cure",
        onPressed: function(e) {
            witchAction("cure");
        }
    });
    cntWitch.add(btnCure);

    var btnSustain = util.uiFactory(SMF.UI.TextButton, {
        left: "66%",
        top: 0,
        height: "100%",
        width: "25%",
        text: "Sustain",
        onPressed: function(e) {
            witchAction("sustain");
        }
    });
    cntWitch.add(btnSustain);

    var lblChooseOne = new SMF.UI.Label({
        text: "Choose one",
        top: "5%",
        left: 0,
        width: "100%",
        height: "12%"
    });
    lblChooseOne.font.size = "18pt";
    lblChooseOne.font.bold = true;
    choose.add(lblChooseOne);

    function witchAction(action) {
        var target = svChoose.targets[svChoose.pageIndex];
        var player  = Pages.choose.player;
        player.vote = target.id;
        player.action = action;
        if(action === "poison") {
            player.posion = 0;
        }
        if(action === "cure") {
            player.cure = 0;
        }
        Pages.choose.player.save(function(err, player) {
            if (err) return alert(err);
            Pages.back();
        });
    }

    var lblDescription = new SMF.UI.Label({
        text: "",
        top: "18%",
        left: 0,
        width: "100%",
        height: "10%"
    });
    choose.add(lblDescription);

    choose.add(btnAction);

    choose.add(cntWitch);

})();