/* globals guid, User, Player, util*/
(function() {
    global.Game = Game;

    function Game(gameJson) {
        if (gameJson) {
            if (typeof gameJson === "string")
                gameJson = JSON.stringify(gameJson);
            Object.assign(this, gameJson);
        }
        else {
            this.id = guid();
            this.owner = User.currentUser;
            this.state = Game.NEW;
            this.name = this.owner.name + "'s game";
        }
    }

    Game.getAllAvailable = function getAllAvailableGames(callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var games = JSON.parse(xhr.responseText),
                i;
            if (games) {
                if (!(games instanceof Array)) {
                    games = [games];
                }
                for (i = 0; i < games.length; i++) {
                    games[i] = new Game(games[i]);
                }
            }
            callback(null, games);
        };
        xhr.onerror = function() {
            callback(xhr.responseText || "failed to list games");
        };
        xhr.setRequestHeader("content-type", "application/json");
        xhr.open("GET", "https://wolfie-alperozisik.c9users.io/game?state=" + Game.NEW, true);
        xhr.send();
    };

    Game.prototype.save = function saveGame(callback) {
        var me = this;
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            callback(null, me);
        };
        xhr.onerror = function() {
            callback(xhr.responseText || "failed to save game");
        };
        xhr.setRequestHeader("content-type", "application/json");
        xhr.open("PUT", "https://wolfie-alperozisik.c9users.io/game?id=" + this.id, true);
        xhr.send(JSON.stringify(this));
    };

    Game.get = function getGame(gameId, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var game = JSON.parse(xhr.responseText);
            if (game) {
                game = new Game(game);
            }
            callback(null, game);
        };
        xhr.onerror = function() {
            callback(xhr.responseText || "failed to list games");
        };
        xhr.setRequestHeader("content-type", "application/json");
        xhr.open("GET", "https://wolfie-alperozisik.c9users.io/game?id=" + gameId, true);
        xhr.send();
    };

    Game.prototype.join = function joinGame(callback) {
        var me = this;
        var player = new Player(this.id, User.currentUser.id);
        Game.currentGame = this;
        Player.currentPlayer = player;
        player.save(function(err, player) {
            if (err) return callback(err);
            me.watch(function(err, game) {
                if (err) return alert(err);
                Object.assign(me, game);
                if (game.state === Game.ENDED) {
                    game.endWatch();
                    Pages.start.show();
                    alert({
                        title: "Game has ended",
                        message: game.result
                    });
                }
                else if (game.state === Game.RUNNING) {
                    player.update(function(err, player) {
                        if (err) return alert(err);
                        if (player.condition === Player.DEAD) {
                            return Pages.wait.showDead();
                        }
                        if (!player.isReady) {
                            return Pages.cardview.showCard(player, {}, function() {}, function() {
                                player.isReady = true;
                                player.save(function(err, player) {
                                    if (err) return alert(err);
                                    Pages.wait.showNight();
                                });

                            });
                        }
                        switch (game.phase) {
                            case "day":
                                delete player.vote;
                                delete player.action;
                                player.save(function(err, player) {
                                    if (err) return alert(err);
                                    Pages.wait.showDay();
                                });
                                break;
                            case "night":
                                delete player.vote;
                                delete player.action;
                                player.save(function(err, player) {
                                    if (err) return alert(err);
                                    Pages.wait.showNight();
                                });
                                break;
                            case player.character:
                                switch (player.character) {
                                    case Player.WEREWOLF:
                                        Pages.choose.player = player;
                                        Pages.choose.chooseForWereWolfKill();
                                        break;
                                    case Player.WITCH:
                                        Pages.choose.player = player;
                                        Pages.choose.chooseForWitchPotion();
                                        break;
                                    case Player.SEER:
                                        Pages.choose.player = player;
                                        Pages.choose.chooseForSeer();
                                        break;
                                }
                                break;
                            case "lynch":
                                Pages.choose.player = player;
                                Pages.choose.chooseForLynch();
                                break;
                        }
                    });
                }
            });
            callback(null, player);
        });
    };

    Game.prototype.watchPlayers = function watchForNewPlayers(callback) {
        var me = this;
        var xhrp = new util.XHRwithPool();
        xhrp.onerror = function() {
            xhrp.startPooling();
            callback.call(me, xhrp.responseText || "failed to watch players");
        };
        xhrp.open("GET", "https://wolfie-alperozisik.c9users.io/player?gameId=" + this.id +
            "&condition=!" + Player.DEAD
        );
        xhrp.onchange = function(previous, current) {
            if (!(current instanceof Array)) {
                current = [current];
            }
            callback(null, current);
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

    Game.prototype.stopWatchForNewPlayers = function stopWatchForNewPlayers() {
        this.playerWatch && this.playerWatch.xhrp.stopPooling();
    };

    Game.prototype.watch = function gameWatch(callback) {
        var me = this;
        var xhrp = new util.XHRwithPool();
        xhrp.onerror = function() {
            xhrp.startPooling();
            callback.call(me, xhrp.responseText || "failed to watch players");
        };
        xhrp.open("GET", "https://wolfie-alperozisik.c9users.io/game?id=" + me.id);
        xhrp.onchange = function(previous, current) {
            Object.assign(me, current);
            callback(null, me);
        };

        var gameWatch = {
            xhrp: xhrp
        };

        Object.defineProperty(this, "gameWatch", {
            value: gameWatch,
            configurable: true,
            enumerable: false,
            writable: true
        });
        xhrp.startPooling();
    };

    Game.prototype.endWatch = function endGameWatch() {
        this.gameWatch && this.gameWatch.xhrp.stopPooling();
    };

    Game.NEW = "new";
    Game.RUNNING = "running";
    Game.ENDED = "ended";
})();