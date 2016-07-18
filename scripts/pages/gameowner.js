/* globals Game, ButtonIcon, getDPI, Player*/
//TODO: include this file in onStart in pages/index.js Use the code below:
//include("pages/gameowner.js");
(function() {
    var gameowner = Pages.gameowner = new SMF.UI.Page({
        name: "gameowner",
        onKeyPress: gameowner_onKeyPress,
        onShow: gameowner_onShow
    });

    /**
     * Creates action(s) that are run when the user press the key of the devices.
     * @param {KeyCodeEventArguments} e Uses to for key code argument. It returns e.keyCode parameter.
     * @this Pages.gameowner
     */
    function gameowner_onKeyPress(e) {
        if (e.keyCode === 4) {
            goBack();
        }
    }

    /**
     * Creates action(s) that are run when the page is appeared
     * @param {EventArguments} e Returns some attributes about the specified functions
     * @this Pages.gameowner
     */
    var ownerTextPrefix = "Owner: ";

    function gameowner_onShow() {
        if (Device.deviceOS === "Android") {
            this.actionBar.visible = true;
            this.actionBar.titleView = {
                type: SMF.UI.TitleViewType.TEXT,
                text: ownerTextPrefix + gameowner.game.name,
                textSize: 20,
                textColor: "black",
                alignment: SMF.UI.Alignment.CENTER,
                left: 10,
                top: 10
            };
            this.actionBar.displayHomeAsUpEnabled = true;
            this.actionBar.onHomeIconItemSelected = function() {
                goBack();
            };
            this.actionBar.backgroundColor = "#CCCCCC";
        }
        else {
            SMF.UI.iOS.NavigationBar.visible = true;
            this.navigationItem.title = ownerTextPrefix + gameowner.game.name;

            var nbbGameList = new SMF.UI.iOS.BarButtonItem({
                title: "Game List",
                tintColor: "black",
                onSelected: function() {
                    goBack();
                }
            });
            this.navigationItem.leftBarButtonItems = [nbbGameList];
        }

        setPlayerReady(0);
        gameowner.game.join(function(err, player) {
            if (err) return alert(err);
            Player.currentPlayer = player;
        });
    }

    function goBack() {
        gameowner.game.state = Game.ENDED;
        gameowner.game.save(function(err) {
            if (err) {
                return alert("game closing failed");
            }
            Pages.back();
        });
    }

    gameowner.players = [];
    gameowner.showGame = function showGame(game) {
        gameowner.game = game;
        game.watchPlayers(function watchPlayers(err, players) {
            if (err) {
                return alert(err);
            }
            else {
                if (game.state === Game.NEW) {
                    gameowner.players = players;
                    setPlayerReady(players.length);
                }
            }
        });
        this.show();
    };

    var fullPageContanierTemplate = {
        borderWidth: 0,
        backgroundTransparent: true,
        width: "100%",
        height: "100%",
        left: 0,
        top: 0
    };

    var cntBeforeStart = new SMF.UI.Container(fullPageContanierTemplate);


    var btnStartGame = new ButtonIcon({
        left: "15%",
        top: "70%",
        width: "70%",
        height: "10%",
        image: "iconstart.png",
        text: "Start Game",
        onPressed: function(e) {
            Pages.wait.showWait();
            var me = this;
            me.enabled = false;
            var game = gameowner.game;
            game.stopWatchForNewPlayers();
            game.state = Game.RUNNING;
            setupPlayers();


            function setupPlayers() {
                var players = gameowner.players;
                var numberOfWolves = 2;
                if (players.length >= 12)
                    numberOfWolves = 3;
                if (players.length >= 18)
                    numberOfWolves = 4;
                var cloneArray = players.slice(0);

                for (var i = 0; i < cloneArray.length; i++) {
                    cloneArray[i] = new Player(cloneArray[i]);
                }

                var seer = cloneArray.splice(getRandomInt(cloneArray.length), 1)[0];
                seer.character = Player.SEER;


                seer.save(function(err, player) {
                    if (err) return alert(err);
                    var witch = cloneArray.splice(getRandomInt(cloneArray.length), 1)[0];
                    witch.character = Player.WITCH;
                    witch.poison = 1;
                    witch.cure = 1;
                    witch.save(saveWereWolves);
                });

                function saveWereWolves(err, callback) {
                    if (err) return alert(err);
                    var werewolf = cloneArray.splice(getRandomInt(cloneArray.length), 1)[0];
                    werewolf.character = Player.WEREWOLF;
                    numberOfWolves--;
                    if (numberOfWolves > 0)
                        werewolf.save(saveWereWolves);
                    else
                        werewolf.save(startGame);
                }

            }

            function startGame(err) {
                if (err) return alert(err);
                game.save(function(err) {
                    if (err) {
                        me.enabled = true;
                        return alert(err);
                    }
                    cntBeforeStart.visible = false;
                    cntInGame.visible = true;
                    game.currentGame.watchPlayers(gameLogic);
                    Player.currentPlayer.update(function(err, player) {
                        if (err) return alert(err);
                        Pages.cardview.showCard(Player.currentPlayer, {}, function(err, player) {
                            if (err) return alert(err);
                        }, function nextPage() {
                            Player.currentPlayer.isReady = true;
                            Player.currentPlayer.save(function(err, player) {
                                if (err) return alert(err);
                            });
                        });
                    });
                });
            }
        }
    });
    cntBeforeStart.add(btnStartGame);


    var waitBetweenPhases = "5000"; //ms
    var phaseHandler = phaseAllReadyCheck;
    var skipAction = false;

    function gameLogic(err, players) {
        if (skipAction)
            return;
        if (err) return alert(err);
        for (var i = 0; i < players.length; i++) {
            players[i] = new Player(players[i]);
        }
        phaseHandler(players);
    }

    function phaseAllReadyCheck(players) {
        var allReady = 1;
        for (var i = 0; i < players.length; i++) {
            allReady = players[i].isReady && allReady;
        }
        if (allReady) {
            phaseHandler = phaseNight;
            phaseHandler(players);
        }

    }

    function phaseNight(players) {
        var game = Game.currentGame;
        game.phase = "night";
        game.save(function(err, game) {
            if (err) return alert(err);
            phaseHandler = phaseSeer;
            setTimeout(function() {
                phaseHandler(players);
            }, waitBetweenPhases);
        });
    }

    function phaseSeer(players) {
        var game = Game.currentGame,
            p, seer;
        for (var i = 0; i < players.length; i++) {
            p = players[i];
            if (p.condition !== Player.DEAD && p.character === Player.SEER) {
                seer = p;
                break;
            }
        }
        if (seer) {
            game.phase = Player.SEER;
            game.save(function(err, game) {
                if (err) return alert(err);
                phaseHandler = phaseSeerComplete;
            });
        }
        else {
            phaseWereWolves(players);
        }
    }

    function phaseSeerComplete(players) {
        phaseHandler = phaseWereWolves;
        setTimeout(function() {
            phaseHandler(players);
        }, waitBetweenPhases);
    }


    function phaseWereWolves(players) {
        var game = Game.currentGame,
            p, werewolf;
        for (var i = 0; i < players.length; i++) {
            p = players[i];
            if (p.condition !== Player.DEAD && p.character === Player.SEER) {
                werewolf = p;
                break;
            }
        }
        if (werewolf) {
            game.phase = Player.WEREWOLF;
            game.save(function(err, game) {
                if (err) return alert(err);
                phaseHandler = phaseWereWolfVotes;
                phaseHandler(players);
            });
        }
        else {
            phaseWitch(players);
        }
    }

    function phaseWereWolfVotes(players) {
        var p, werewolves = [],
            votes = {},
            voteCount, maximumVote = 0,
            selections = [],
            victim,
            votesCast = 0;
        for (var i = 0; i < players.length; i++) {
            p = players[i];
            if (p.condition !== Player.DEAD && p.character === Player.WEREWOLF) {
                werewolves.push(p);
                if (p.vote) {
                    voteCount = votes[p.vote] || 0;
                    voteCount++;
                    votes[p.vote] = voteCount;
                    if (voteCount > maximumVote)
                        maximumVote = voteCount;
                    votesCast++;
                }
            }
        }
        if (votesCast === werewolves.length) {
            for (var v in votes) {
                if (votes[v] === maximumVote) {
                    selections.push(v);
                }
            }
            if (selections.length === 1) {
                victim = selections[0];
                for (i = 0; i < players.length; i++) {
                    p = players[i];
                    if (p.userId === victim) {
                        skipAction = true;
                        p.condition = Player.ABOUT_TO_DIE;
                        p.save(function(err, player) {
                            skipAction = false;
                            if (err) return alert(err);
                            goNext();
                        });
                        break;
                    }
                }
            }
            else {
                goNext();
            }
        }

        function goNext() {
            phaseHandler = phaseWitch;
            setTimeout(function() {
                phaseHandler(players);
            }, waitBetweenPhases);
        }

    }

    function phaseWitch(players) {
        var game = Game.currentGame,
            p, witch;
        for (var i = 0; i < players.length; i++) {
            p = players[i];
            if (p.condition !== Player.DEAD && p.character === Player.WITCH) {
                witch = p;
                break;
            }
        }
        if (witch) {
            if (witch.posion || witch.cure) {
                game.phase = Player.WITCH;
                game.save(function(err, game) {
                    if (err) return alert(err);
                    phaseHandler = phaseWitchPotion;
                    phaseHandler(players);
                });
                return;
            }
        }
        phaseDay(players);
    }

    function phaseWitchPotion(players) {
        var p, witch, target;
        for (var i = 0; i < players.length; i++) {
            p = players[i];
            if (p.condition !== Player.DEAD && p.character === Player.WITCH) {
                witch = p;
                break;
            }
        }
        if (witch) {
            switch (witch.action) {
                case "poison":
                    target = findPlayerById(witch.vote);
                    if (target.condition !== Player.ABOUT_TO_DIE) {
                        skipAction = true;
                        target.condition = Player.ABOUT_TO_DIE;
                        target.save(function(err, player) {
                            skipAction = false;
                            if (err) return alert(err);
                            goNext();
                        });
                    }
                    break;
                case "cure":
                    target = findPlayerById(witch.vote);
                    if (target.condition === Player.ABOUT_TO_DIE) {
                        skipAction = true;
                        target.condition = Player.ALIVE;
                        target.save(function(err, player) {
                            skipAction = false;
                            if (err) return alert(err);
                            goNext();
                        });
                    }
                    break;
                case "sustain":
                    goNext();
                    break;
            }
        }
        else {
            goNext();
        }

        function goNext() {
            phaseHandler = phaseDay;
            setTimeout(function() {
                phaseHandler(players);
            }, waitBetweenPhases);
        }
    }

    function findPlayerById(players, id) {
        var p;
        for (var i = 0; i < players.length; i++) {
            p = players[i];
            if (p.userId === id)
                return p;
        }
        return null;
    }

    function phaseDay(players) {
        var endMessage = checkEndGame(players);
        if (endMessage) {
            return endGame(endMessage);
        }
        var game = Game.currentGame;
        var cloneArray = players.slice(0);
        game.phase = "day";
        skipAction = true;
        killPlayers(cloneArray, players);
    }

    function makeMorning(players) {
        skipAction = false;
        var game = Game.currentGame;
        game.save(function(err, game) {
            if (err) return alert(err);
            phaseHandler = phaseLynch;
            setTimeout(function() {
                phaseHandler(players);
            }, waitBetweenPhases);
        });
    }


    function killPlayers(clonePlayers, players) {
        var game = Game.currentGame;
        var p = clonePlayers.pop();
        if (p) {
            if (p.condition === Player.ABOUT_TO_DIE) {
                p.condition = Player.DEAD;
                p.save(function(err, player) {
                    if (err) return alert(err);
                    killPlayers(clonePlayers, players);
                });
            }
        }
        else {
            if (game.phase === "day") {
                makeMorning(players);
            }
        }
    }

    function endGame(message) {
        skipAction = true;
        Game.stopWatchForNewPlayers();
        var game = Game.currentGame;
        game.state = Game.ENDED;
        game.result = message;
        game.save(function(err) {
            if (err) return alert(err);
        });
    }

    function checkEndGame(players) {
        var i, werewolves = [],
            villagers = [],
            p;
        for (i = 0; i < players.length; i++) {
            p = players[i];
            if (p.condition === Player.ALIVE) {
                if (p.character === Player.WEREWOLF) {
                    werewolves.push(p);
                }
                else {
                    villagers.push(p);
                }
            }
        }
        if (werewolves.length > 0 && villagers.length > 0)
            return false;
        if (werewolves.length === 0 && villagers.length > 0)
            return "Villagers have won the game";
        if (werewolves.length > 0 && villagers.length === 0)
            return "Werewolves have won the game";
        if (werewolves.length === 0 && villagers.length === 0)
            return "It is a Tie. No body wins!";
    }

    function phaseLynch(players) {
        var game = Game.currentGame;
        game.phase = "lynch";
        game.save(function(err, game) {
            if (err) return alert(err);
            phaseHandler = phaseLynchVotes;
            phaseHandler(players);
        });
    }

    function phaseLynchVotes(players) {
        var p, villagers = [],
            votes = {},
            voteCount, maximumVote = 0,
            selections = [],
            victim,
            votesCast = 0;
        for (var i = 0; i < players.length; i++) {
            p = players[i];
            if (p.condition !== Player.DEAD) {
                villagers.push(p);
                if (p.vote) {
                    voteCount = votes[p.vote] || 0;
                    voteCount++;
                    votes[p.vote] = voteCount;
                    if (voteCount > maximumVote)
                        maximumVote = voteCount;
                    votesCast++;
                }
            }
        }
        if (votesCast === villagers.length) {
            for (var v in votes) {
                if (votes[v] === maximumVote) {
                    selections.push(v);
                }
            }
            if (selections.length === 1) {
                victim = selections[0];
                for (i = 0; i < players.length; i++) {
                    p = players[i];
                    if (p.userId === victim) {
                        skipAction = true;
                        p.condition = Player.DEAD;
                        p.save(function(err, player) {
                            skipAction = false;
                            if (err) return alert(err);
                            goNext();
                        });
                        break;
                    }
                }
            }
            else {
                goNext();
            }
        }

        function goNext() {
            var endMessage = checkEndGame(players);
            if (endMessage) {
                return endGame(endMessage);
            }
            phaseHandler = phaseNight;
            setTimeout(function() {
                phaseHandler(players);
            }, waitBetweenPhases);
        }
    }


    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    var lblPlayerReadyStatus = new SMF.UI.Label({
        name: "lblPlayerReadyStatus",
        text: "",
        left: "15%",
        top: "35%",
        width: "70%",
        height: "15%",
        multipleLine: true,
        textAlignment: "center"
    });

    cntBeforeStart.add(lblPlayerReadyStatus);

    gameowner.add(cntBeforeStart);


    var cntInGame = new SMF.UI.Container(Object.assign({
        visible: false
    }, fullPageContanierTemplate));

    function setPlayerReady(numberOfPlayers) {
        var str = numberOfPlayers +
            (numberOfPlayers < 2 ? " player has" : " players have") +
            " joined your game.\n";
        if (numberOfPlayers < 8) {
            str += "This game is played with 8 or more players.\n" +
                "You will need " + (8 - numberOfPlayers) + " player" +
                (numberOfPlayers > 7 ? "" : "s") +
                " to start game.";
            btnStartGame.setEnabled(false);
        }
        else {
            str += "You can start the game";
            btnStartGame.setEnabled(true);
        }
        lblPlayerReadyStatus.text = str;
    }



})();