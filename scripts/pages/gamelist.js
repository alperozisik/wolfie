/* globals Game, util, getDPI, Player*/
//TODO: include this file in onStart in pages/index.js Use the code below:
//include("pages/gamelist.js");
(function() {
    var gamelist = Pages.gamelist = new SMF.UI.Page({
        name: "gamelist",
        onKeyPress: gamelist_onKeyPress,
        onShow: gamelist_onShow
    });

    /**
     * Creates action(s) that are run when the user press the key of the devices.
     * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
     * @this Pages.gamelist
     */
    function gamelist_onKeyPress(e) {
        if (e.keyCode === 4) {
            Application.exit();
        }
    }

    var rbGameList = new SMF.UI.RepeatBox({
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        enablePullDownToRefresh: true,
        useActiveItem: true,
        onRowRender: util.rboxDataRowRender,
        visible: false,
        borderWidth: 0,
        onPullDown: fetchGames,
        onSelectedItem: rbGameListSelected
    });
    fillRbGameListTemplate(rbGameList.itemTemplate, "item");
    fillRbGameListTemplate(rbGameList.activeItemTemplate, "active");

    //bug android rbox seçimi çok zor çalışıyor
    function rbGameListSelected(e) {
        var game = this.dataSource[e.rowIndex];
        if(!(game instanceof Game)) {
            game = new Game(game);
        }
        game.join(function(err, player) {
            if(err) return alert(err);
            Pages.wait.showWait();
        });
    }

    function fillPullItem(pullItem) {
        if (Device.deviceOS === "Android") {
            pullItem.height = getDPI(60);
        }
        var activityIndicator = new SMF.UI.ActivityIndicator({
            style: SMF.UI.ActivityIndicatorStyle.gray
        });
        pullItem.add(activityIndicator);
        activityIndicator.top = (pullItem.height - activityIndicator.height) / 2;
        activityIndicator.left = (Device.screenWidth - activityIndicator.width) / 2;
        //bug, cannot set color
        Device.deviceOS === "iOS" && (pullItem.backgroundColor = "white");
    }
    fillPullItem(rbGameList.pullDownItem);
    

    gamelist.add(rbGameList);

    function fillRbGameListTemplate(templateItem, type) {
        templateItem = templateItem || new SMF.UI.RepeatBoxRowTemplate;
        templateItem.fillColor = type === "active" ? "white" : "#DDDDDD";
        templateItem.height = getDPI(64);

        var imgUser = new SMF.UI.Image({
            height: getDPI(58),
            width: getDPI(58),
            left: getDPI(3),
            top: getDPI(3),
            image: "",
            name: "userImg",
            touchEnabled: false
        });
        templateItem.add(imgUser);

        var lblGameName = new SMF.UI.Label({
            backgroundTransparent: true,
            top: getDPI(3),
            height: getDPI(58),
            left: getDPI(72),
            name: "lblGameName",
            width: "100%",
            changeAnimation: "",
            touchEnabled: false
        });
        templateItem.add(lblGameName);

        imgUser.dataKey = "owner.imageURL";
        lblGameName.dataKey = "name";
    }

    /**
     * Creates action(s) that are run when the page is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.gamelist
     */
    function gamelist_onShow() {
        fetchGames();
        if (Device.deviceOS === "Android") {
            this.actionBar.visible = true;
            this.actionBar.titleView = {
                type: SMF.UI.TitleViewType.TEXT,
                text: "Game List",
                textSize: 20,
                textColor: "white",
                alignment: SMF.UI.Alignment.CENTER,
                left: 10,
                top: 10
            };
            this.actionBar.backgroundColor = "black";
            btnAdd.top = Device.screenHeight - getDPI(61) - this.actionBar.height;
        }
        else {
            SMF.UI.iOS.NavigationBar.visible = true;
            this.navigationItem.title = "Game List";
            var nbbAddGame = new SMF.UI.iOS.BarButtonItem({
                systemItem: SMF.UI.iOS.BarButtonType.ADD,
                tintColor: "#000000",
                onSelected: function() {
                    addGame();
                }
            });
            this.navigationItem.rightBarButtonItems = [nbbAddGame];
        }
    }


    var lblNoGames = new SMF.UI.Label({
        name: "lblNoGames",
        left: "15%",
        top: "45%",
        width: "70%",
        height: "15%",
        multipleLine: true,
        textAlignment: "center",
        text: "No available games to join.\nYou can create a new one",
        visible: false,
        //bug lbl touch ended does not work for android
        onTouchEnded: fetchGames
    });
    Device.deviceOS === "Android" && (lblNoGames.effects.ripple.enabled = true);

    gamelist.add(lblNoGames);

    function fetchGames() {
        Game.getAllAvailable(function(err, gameList) {
            rbGameList.closePullItems();
            if (err) {
                return alert(err);
            }
            if (gameList) {
                if (!(gameList instanceof Array)) {
                    gameList = [gameList];
                }
                rbGameList.dataSource = gameList;
                rbGameList.visible = true;
                lblNoGames.visible = false;
                rbGameList.refresh();
            }
            else {
                rbGameList.visible = false;
                lblNoGames.visible = true;
            }
        });
    }
    var btnAdd;
    if (Device.deviceOS === "Android") {
        btnAdd = new SMF.UI.ImageButton({
            name: "btnAdd",
            defaultImage: "addgame.png",
/*            focusedImage: "addgame.png",
            highlightedImage: "addgame.png",*/
            imageFillType: SMF.UI.ImageFillType.ASPECTFIT,
            text: "",
            left: Device.screenWidth - getDPI(61),
            width: getDPI(56),
            height: getDPI(56),
            onPressed: addGame,
            z: 2
        });
        gamelist.add(btnAdd);

    }

    function addGame() {
        var game = new Game();
        game.save(function(err, data) {
            if (err) {
                alert("There has been an error while registering game");
            }
            else {
                Pages.gameowner.showGame(game);
            }
        });
    }

})();