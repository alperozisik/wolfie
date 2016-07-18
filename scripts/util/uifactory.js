/* globals */
(function() {
    function uiFactory(uiClass, options) {
        var item = new uiClass(options);
        if (uiClass === SMF.UI.TextButton) {
            Device.deviceOS === "Android" && (item.effects.ripple.enabled = true);
        }
        return item;
    }
    global.util.uiFactory = uiFactory;
})();