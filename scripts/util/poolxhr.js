/* globals util */
(function() {
    var poolRate = 300; //in ms
    function XHRwithPool() {
        var xhr = new XMLHttpRequest();
        xhr.setRequestHeader("accept", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    onLoaded.call(this);
                }
                else {
                    continuePool.call(this);
                }
            }
        };
        xhr.open2 = xhr.open;
        xhr.open = open;
        xhr.startPooling = startPooling;
        xhr.stopPooling = stopPooling;
        return xhr;
    }

    function startPooling(data) {
        this.pooling = true;
        this.data = data;
        this.send(data);
    }

    function stopPooling() {
        this.pooling = false;
        this.timerId && clearTimeout(this.timerId);
        delete this.data;
    }
    function onLoaded() {

        var previous = this.previous;
        if (previous !== this.responseText) {
            previous  && (previous = JSON.parse(previous));
            this.onchange && this.onchange.call(this, previous, JSON.parse(this.responseText));
            this.previous = this.responseText;
        }
        continuePool.call(this);
    }

    function continuePool() {
        var me = this;
        if (this.pooling) {
            this.timerId = setTimeout(function() {
                me.send(me.data);
            }, poolRate);
        }
    }

    function open(method, url) {
        if (method !== "GET" && method !== "OPTIONS")
            this.setRequestHeader("content-type", "application/json");
        return this.open2(method, url, true);
    }



    util.XHRwithPool = XHRwithPool;
})();