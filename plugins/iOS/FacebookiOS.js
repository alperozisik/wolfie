if (Device.deviceOS === "IDE") {
	/**
	 * Creates a new FBClass.
	 * @class
	 */
	function FBClass() {}

	var fb = new FBClass();
	
	/**
	 * Sets applicationID of facebook
	 * @function
     * @param {string} applicationid , like "232459437090855"
	 */
	FBClass.prototype.setAppID = function setAppID(applicationid) {};

	/**
	 * This method lets user to login to facebook by opening browser.
	 * @function
	 * @param {string[]} permissions
	 * @param {openSessionOnSuccess} onSuccess
	 * @param {openSessionOnError} onError
	 */
	FBClass.prototype.openSessionOnSuccessOnError = function openSessionOnSuccessOnError(permissions, onSuccess, onError) {};

	/**
	 * This callback is called after onSuccess.
	 * @callback openSessionOnSuccess
	 * @param {object} e
	 * @param {string} e.data
	 */
	 
	/**
	 * This callback is called after onError.
	 * @callback openSessionOnError
	 * @param {object} e
	 * @param {string} e.message
	 */

	/**
	 * This method closes active session and cleares token data.
	 * @function
	 */
	FBClass.prototype.closeSession = function closeSession() {};

	/**
	 * This method sends a request for user details.
	 * @function
	 * @callback {userDetailsOnSuccess} onSuccess
	 * @callback {userDetailsOnError} onError
	 */
	FBClass.prototype.userDetailsOnSuccessOnError = function userDetailsOnSuccessOnError(onSuccess, onError) {};

	/**
	 * @typedef {object} user
	 * @property {string} name
	 * @property {string} id
	 * @property {string} firstName
	 * @property {string} middleName
	 * @property {string} lastName
	 * @property {string} username
	 * @property {string} birthday
	 */

	/**
	 * This callback is called after onSuccess.
	 * @callback userDetailsOnSuccess
	 * @param {user[]} e
	 */
	 
	/**
	 * This callback is called after onError.
	 * @callback userDetailsOnError
	 * @param {object} e
	 * @param {string} e.message
	 */

	/**
	 * This method posts a status update with given message. Callback functions returns whether posting is successful or not.
	 * @function
	 * @param {string} message 
	 * @callback {postStatusUpdateOnSuccess} onSuccess
	 * @callback {postStatusUpdateOnError} onError
	 */
	FBClass.prototype.postStatusUpdateOnSuccessOnError = function postStatusUpdateOnSuccessOnError(message, onSuccess, onError) {};
	
	/**
	 * This callback is called after onSuccess.
	 * @callback postStatusUpdateOnSuccess
	 */
	 
	/**
	 * This callback is called after onError.
	 * @callback postStatusUpdateOnError
	 * @param {object} e
	 * @param {string} e.message
	 */

	/**
	 * This method shows the friendPickerController of Facebook SDK.
	 * @function
	 * @param {boolean} allowMultiSelect
	 * @callback {showFriendPickerOnSelected} onSelected
	 * @callback {showFriendPickerOnCancelled} onCancelled
	 * @callback {showFriendPickerOnError} onError
	 */
	FBClass.prototype.showFriendPickerOnSelectedOnCancelledOnError = function showFriendPickerOnSelectedOnCancelledOnError(allowMultiSelect, onSelected, onCancelled, onError) {};

	/**
	 * This callback is called after onSuccess.
	 * @callback showFriendPickerOnSelected
	 * @param {user[]} e
	 */
	 
	/**
	 * This callback is called after onError.
	 * @callback showFriendPickerOnCancelled
	 */
	 
	/**
	 * This callback is called after onError.
	 * @callback showFriendPickerOnError
	 */



	/**
	 * This method gives the list of friends as an array. Callback functions return whether process is successful or not.
	 * @function
	 * @callback {getFriendsListOnSuccess} onSuccess
	 * @callback {getFriendsListOnError} onError
	 */
	FBClass.prototype.getFriendsListOnSuccessOnError = function getFriendsListOnSuccessOnError(onSuccess, onError) {};



	/**
	 * This callback is called after onSuccess.
	 * @callback getFriendsListOnSuccess
	 * @param {user[]} e
	 */
	 
	/**
	 * This callback is called after onError.
	 * @callback getFriendsListOnError
	 * @param {object} e
	 * @param {string} e.message
	 */


	/**
	 * This method allows user to perform FQL.
	 * @function
	 * @param {string} path
	 * @param {string} params
	 * @param {string} httpMethod
	 * @callback {requestWithPathParamsHttpMethodOnSuccess} onSuccess
	 * @callback {requestWithPathParamsHttpMethodOnError} onError
	 */
	FBClass.prototype.requestWithPathParamsHttpMethodOnSuccessOnError = function requestWithPathParamsHttpMethodOnSuccessOnError(path, params, httpMethod, onSuccess, onError) {};

	/**
	 * This callback is called after onSuccess.
	 * @callback requestWithPathParamsHttpMethodOnSuccess
	 * @param {object} e
	 * @param {object} e.result
	 */
	 
	/**
	 * This callback is called after onError.
	 * @callback requestWithPathParamsHttpMethodOnError
	 * @param {object} e
	 * @param {string} e.message
	 */

	/**
	 * This method lets user to login to facebook by opening browser.
	 * @function
	 * @returns {boolean} 
	 */
	FBClass.prototype.isSessionActive = function isSessionActive() {};

}