/* globals util*/
(function() {
    global.util = {};
    include("util/scriptloader.js");
    var sl = new util.ScriptLoader("util");

    sl.include("guid")
        .include("facebook")
        .include("uifactory")
        .include("rboxDataRowRender")
        .include("getdpi")
        .include("buttonicon")
        .include("poolxhr")
        .include("stringformat")
        .include("fillwithcardview")
})();