if (Device.deviceOS === "IDE") {
	/*SMFFacebook constructor
	 * @class
	 * @param @constant {string} activity , must be "Landroid/app/Activity;"
	 * @param {long} applicationid , like 232459437090855
	 */
	function SMFFacebook(activity,applicationid) {};

	/**
	 * Open facebook session
	 * @param {string[]} permissions
	 * @param {FacebookOpenSessionOnSuccess} onSuccess - Fired after successfuly opened session
	 * @param {FacebookOpenSessionOnError} onError
	 * @method openSession
	 * @example
	 * fb.openSession(
	 * 	["publish_actions","user_friends","user_about_me","user_status","email","user_posts"],
	 * 	function(e){ alert("login successful" + e.data);},//onSuccess callback parameter
	 * 	function(e){alert("error: " + e.message);}//onError callback parameter
	 * );
	 */
	SMFFacebook.prototype.openSession = function openSession(permissions, onSuccess, onError) {};

	/**
	 * @callback FacebookOpenSessionOnSuccess
	 * @param {object} e - Callback argument object
	 * @param {string} e.data - Access Token
	 */

	/**
	 * @callback FacebookOpenSessionOnError
	 * @param {object} e - Callback argument object
	 * @param {string} e.message - Reason of failure
	 */

	/**
	 * Facebook User
	 * @typedef {object} FacebookUser
	 * @prop {string} id - user's id
	 * @prop {string} name - user's name
	 * @prop {string} firstName - user's first name
	 * @prop {string} middleName - user's middle name
	 * @prop {string} lastName - user's last name
	 * @prop {string} birthday - user's birthday
	 */

	/**
	 * Gets user details
	 * @param {object} onSuccess
	 * @param {object} onError
	 * @method userDetails
	 * @example
	 * fb.userDetails(
	 * 	function(e){alert("name: " + e.name + " id: " + e.id);}, //onSuccess
	 * 	function(){alert("error: " + e.message);}//onError
	 * );
	 */
	SMFFacebook.prototype.userDetails = function userDetails(onSuccess, onError) {};

	/**
	 * @callback FacebookUserDetailsOnSuccess
	 * @param {FacebookUser} e - Callback argument object
	 */

	/**
	 * @callback FacebookUserDetailsOnError
	 * @param {object} e - Callback argument object
	 * @param {string} e.message - Reason of failure
	 */

	/**
	 * Gets list of friends using same app
	 * @param {object} onSuccess
	 * @param {object} onError
	 * @method getFriendsList
	 * @example
	 * fb.getFriendsList(
	 * function(e) { alert("facebook friends list : " + JSON.stringify(e)); }, //onSuccess
	 * function() { alert("error: " + e.message); }//onError
	 * );
	 */
	SMFFacebook.prototype.getFriendsList = function getFriendsList(onSuccess, onError) {};

	/**
	 * @callback FacebookGetFriendsListOnSuccess
	 * @param {FacebookUser[]} e - Callback argument array object
	 */

	/**
	 * @callback FacebookGetFriendsListOnError
	 * @param {object} e - Callback argument object
	 * @param {string} e.message - Reason of failure
	 */


	/**
	 * posts status
	 * @param {string} message
	 * @param {object} onSuccess
	 * @param {object} onError
	 * @method postStatusUpdate
	 * @example
	 * fb.postStatusUpdate(
	 * "This is a status update message.",
	 * function(e){alert("Post sent successfully!");},//onSuccess callback parameter
	 * function(e){alert("error: " + e.message);}//onError callback parameter
	 * );
	 */
	SMFFacebook.prototype.postStatusUpdate = function postStatusUpdate(message, onSuccess, onError) {};
	/**
	 * @callback FacebookPostStatusUpdateOnSuccess
	 */

	/**
	 * @callback FacebookPostStatusUpdateOnError
	 * @param {object} e - Callback argument object
	 * @param {string} e.message - Reason of failure
	 */



	/**
	 * posts status update
	 * @param {boolean} multiSelect
	 * @param {object} onSuccess
	 * @param {object} onCancel
	 * @param {object} onError
	 * @method showFriendsPicker
	 * @example
	 * fb.showFriendsPicker(
	 * false,
	 * function(e){
	 * alert(JSON.stringify(e));
	 * for (i = 0; i < e.length; i++){
	 * alert("selected friend name:" + e[i].name);
	 * }},//onSuccess callback parameter
	 * function(e){alert("picker cancelled");},//onCancel callback parameter
	 * function(e){alert("error: " + e.message);}//onError callback parameter
	 * );
	 */
	SMFFacebook.prototype.showFriendsPicker = function showFriendsPicker(multiSelection, onSuccess, onCancel, onError) {};
	/**
	 * @callback FacebookShowFriendsPickerOnSuccess
	 * @param {FacebookUser[]} e - Callback argument array object
	 */

	/**
	 * @callback FacebookShowFriendsPickerListOnCancel
	 */

	/**
	 * @callback FacebookShowFriendsPickerListOnError
	 * @param {object} e - Callback argument object
	 * @param {string} e.message - Reason of failure
	 */


	/**
	 * closes facebook session
	 * @method closeSession
	 * @example
	 * fb.closeSession();
	 */
	SMFFacebook.prototype.closeSession = function closeSession() {};

	/**
	 * check if facebook session is active or not
	 * @method isSessionActive
	 * @return {boolean} true for active false otherwise
	 * @example
	 * fb.isSessionActive();
	 */
	SMFFacebook.prototype.isSessionActive = function isSessionActive() {};

}