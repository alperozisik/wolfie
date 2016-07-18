/* globals util*/
(function() {
    var sl = new util.ScriptLoader("pages");
    sl.include("start")
        .include("gamelist")
        .include("gameowner")
        .include("choose")
        .include("wait")
        .include("cardview")
})();