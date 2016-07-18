/* globals User, util */
(function() {
    function Player(gameId, userId) {
        this.gameId = gameId;
        this.userId = userId;
        this.condition = Player.ALIVE;
        this.character = Player.PEASANT;
        this.isReady = 0;
        if (typeof gameId === "object") {
            Object.assign(this, gameId);
        }
    }

    Player.ALIVE = "alive";
    Player.ABOUT_TO_DIE = "about_to_die";
    Player.DEAD = "dead";
    Player.PEASANT = "peasant";
    Player.WEREWOLF = "werewolf";
    Player.SEER = "seer";
    Player.WITCH = "witch";

    function getPlayersOfGame(game, props, callback) {
        if (!callback && props) {
            callback = props;
            props = null; //any
        }
        var gameId = game.id || game;
        var xhr = new XMLHttpRequest();
        var url = "https://wolfie-alperozisik.c9users.io/player?gameId=" + gameId;
        var propsKeys = Object.keys(props);
        for (var i = 0; i < propsKeys.length; i++) {
            url += "?" + propsKeys[i] + "=" + props[propsKeys[i]];
        }
        xhr.onload = function() {
            var players = JSON.parse(xhr.responseText),
                i;
            if (players) {
                if (!(players instanceof Array)) {
                    players = [players];
                }
                for (i = 0; i < players.length; i++) {
                    players[i] = new Player(players[i]);
                }
            }
            callback(null, players);
        };
        xhr.onerror = function() {
            callback(xhr.responseText || "failed to list games");
        };
        xhr.setRequestHeader("content-type", "application/json");

        xhr.open("GET", url, true);
        xhr.send();
    }

    Player.getPlayersOfGame = getPlayersOfGame;

    Player.prototype.save = function savePlayer(callback) {
        var me = this;
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            callback && callback(null, me);
        };
        xhr.onerror = function() {
            callback && callback(xhr.responseText || "failed to save player");
        };
        xhr.setRequestHeader("content-type", "application/json");
        xhr.open("PUT", "https://wolfie-alperozisik.c9users.io/player?gameId=" + this.gameId +
            "&userId=" + this.userId, true);
        xhr.send(JSON.stringify(this));
    };
    global.Player = Player;

    Player.prototype.update = function update(callback) {
        var me = this;
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            Object.assign(me, JSON.parse(xhr.responseText));
            callback && callback(null, me);
        };
        xhr.onerror = function() {
            callback && callback(xhr.responseText || "failed to update player");
        };
        xhr.setRequestHeader("content-type", "application/json");
        xhr.open("GET", "https://wolfie-alperozisik.c9users.io/player?gameId=" + this.gameId +
            "&userId=" + this.userId, true);
        xhr.send();
    };

    Player.prototype.watch = function watchPlayer(callback) {
        var me = this;
        var xhrp = new util.XHRwithPool();
        xhrp.onerror = function() {
            xhrp.startPooling();
            callback.call(me, xhrp.responseText || "failed to watch players");
        };
        xhrp.open("GET", "https://wolfie-alperozisik.c9users.io/player?gameId=" + me.gameId +
            "&condition=!" + me.condition + "&me.userId=" + me.userId
        );
        xhrp.onchange = function(previous, current) {
            Object.assign(me, current);
            if(me.condition === Player.DEAD) {
                me.stopWatch();
            }
            callback(null, me);
        };

        var playerWatch = {
            xhrp: xhrp
        };

        Object.defineProperty(this, "playerWatch", {
            value: playerWatch,
            configurable: true,
            enumerable: false,
            writable: true
        });
        xhrp.startPooling();
    };

    Player.prototype.stopWatch = function stopWatchPlayer() {
       this.playerWatch && this.playerWatch.xhrp.stopPooling();
    };
    
    
    Player.prototype.equals = function playerEquals(other) {
      return this.gameId === other.gameId && this.userId === other.userId;
    };
})();