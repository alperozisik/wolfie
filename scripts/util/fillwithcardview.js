/* globals util */
(function() {
    util.fillWithCardView = function fillWithCardView(page, player) {
        var onShow = page.onShow;
        var getTitleItemText;
        var setTitleItemText;
        var titleToSet;
        page.onShow = function pageOnShow(e) {
            if (Device.deviceOS === "Android") {
                page.actionBar.visible = true;
                page.actionBar.titleView = {
                    type: SMF.UI.TitleViewType.TEXT,
                    textSize: 20,
                    textColor: "black",
                    alignment: SMF.UI.Alignment.CENTER,
                    left: 10,
                    top: 10
                };
                getTitleItemText = function() {
                    return page.actionBar.titleView.text;
                };
                setTitleItemText = function(value) {
                    page.actionBar.titleView = value;
                };
                page.actionBar.displayHomeAsUpEnabled = false;
                page.actionBar.backgroundColor = "#CCCCCC";

                var item1 = new SMF.UI.Android.MenuItem({
                    id: "1", // unique id for the item
                    title: "VIEW YOUR CARD",
                    showAsAction: SMF.UI.Android.ShowAsAction.IFROOM, //Only place this item in the Action Bar if there is room for it.
                    onSelected: function(e) {
                        Pages.cardview.showCard(player, {
                            transitionEffect: SMF.UI.TransitionEffect.RIGHTTOLEFT
                        });
                    }
                });
                page.actionBar.menuItems = [item1];




            }
            else {
                SMF.UI.iOS.NavigationBar.visible = true;
                var nbbCurl = new SMF.UI.iOS.BarButtonItem({
                    title: "View Your Card",
                    //bug PAGECURL gözükmüyor
                    //systemItem: SMF.UI.iOS.BarButtonType.PAGECURL,
                    tintColor: "#000000",
                    onSelected: function() {
                        Pages.cardview.showCard(player, {
                            transitionEffect: SMF.UI.TransitionEffect.CURLDOWN
                        });
                    }
                });
                getTitleItemText = function() {
                    return page.navigationItem.title;
                };
                setTitleItemText = function(value) {
                    page.navigationItem.title = value;
                };
                page.navigationItem.rightBarButtonItems = [nbbCurl];
            }
            titleToSet && setTitleItemText(titleToSet);
            titleToSet = "";
            onShow(e);
        };

        Object.defineProperty(page, "title", {
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
    };
})();