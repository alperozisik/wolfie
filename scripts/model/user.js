/* globals util*/
(function() {
    function User(userData) {
        this.imageURL = "";
        this.id = "";
        this.name = "";
        this.firstName = "";
        this.middleName = "";
        this.lastName = "";
        this.birthday = "";
        Object.assign(this, userData);
    }

    User.prototype.save = function saveUser(callback) {
        var me = this;
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            callback(null, me);
        };
        xhr.onerror = function() {
            callback(xhr.responseText || "failed to save user");
        };
        xhr.setRequestHeader("content-type", "application/json");
        xhr.open("PUT", "https://wolfie-alperozisik.c9users.io/user?id=" + this.id, true);
        xhr.send(JSON.stringify(this));
    };


    User.get = function getUser(id, callback) {

        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var userData = JSON.parse(xhr.responseText);
            callback(null, userData);
        };
        xhr.onerror = function() {
            callback(xhr.responseText || "failed to save user");
        };
        xhr.setRequestHeader("content-type", "application/json");
        xhr.open("GET", "https://wolfie-alperozisik.c9users.io/user?id=" + id, true);
        xhr.send();
    };

    User.currentUser = null;

    User.prototype.equals = function euqalsUser(otherUser) {
        return this.id === otherUser.id;
    };

    User.login = function loginUser(callback) {
        if (!util.facebook.isSessionActive()) {
            util.facebook.login(function(err, data) {
                if (err)
                    callback(err);
                else
                    getUserDetails(callback);
            });
        }
        else {
            getUserDetails(callback);
        }



    };

    function getUserDetails(callback) {
        util.facebook.userDetails(function(err, data) {
            if (err) {
                callback(err);
            }
            else {
                var user = new User(data);
                if (User.currentUser && User.currentUser.equals(user)) {
                    user = User.currentUser;
                    callback(null, user);
                }
                else {
                    User.currentUser = user;
                    user.save(callback);
                }

            }
        });
    }

    User.getCurrentUser = function getCurrentUser(callback) {
        if (User.currentUser) {
            callback(null, User.currentUser);
        }
        else {
            if (User.loginRequired()) {
                User.login(callback);
            }
            else {
                getUserDetails(
                    function(err, user) {
                        if (err)
                            callback(err);
                        else {
                            user.save(function(err, data) {
                                if (err) {
                                    callback(err);
                                }
                                else {
                                    callback(null, user);
                                }
                            });
                        }
                    }
                );
            }
        }
    };

    User.loginRequired = function userLoginRequired() {
        return !util.facebook.isSessionActive();
    };

    global.User = User;
})();