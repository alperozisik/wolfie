/* globals */
(function() {
    function ScriptLoader(basePath) {
        if (!(this instanceof ScriptLoader)) {
            alert("this is wrong");
            // return new ScriptLoader(basePath);
        }
        this.basePath = basePath;
    }

    ScriptLoader.prototype.include = function includeScript(fileName) {
        var path = this.basePath + "/" + fileName + ".js";
        include(path);
        return this;
    };

    ScriptLoader.prototype.load = function loadScipt(fileName) {
        var path = this.basePath + "/" + fileName + ".js";
        load(path);
        return this;
    };

    global.util.ScriptLoader = ScriptLoader;
})();