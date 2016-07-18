/* globals util*/
(function() {
    var sl = new util.ScriptLoader("model");
    sl.include("game")
        .include("user")
        .include("player")
})();