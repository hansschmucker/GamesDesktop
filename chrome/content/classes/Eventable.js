/**
 * An Eventable may have eventListeners of any type attached to it and may dispatch
 * events to those event listeners
 * @constructor
 */
var Eventable = function(){
	this._eventableEventListeners = {};
};

/**
 * Dictionary of Arrays containing attached event listers for each event type.
 * @type {object}
 * @private
 */
Eventable.prototype._eventableEventListeners = null;

/**
 * Registers a callback to be run when a certain type of event is dispatched by the
 * instance. Adding the same type and callback a second time will result in the call
 * being ignored.
 * If a registered listener points to a Bound object, then the new listener will only
 * be added if target or scope are different.
 * If the new listener points to a function while the existing one points to a Bound
 * object, the previous listener will prevail if the Bound points to the same function.
 * The new listener will not be added.
 *
 * @param {string} type A user-defined string indicating the type of event that should cause the callback to be run.
 * @param {(function|Bound)} cb The function to be run when an event of the given type is dispatched.
 */
Eventable.prototype.addEventListener = function(type,cb){
	if(!this._eventableEventListeners[type])
		this._eventableEventListeners[type]=[];
	
	for(var i=0;i<this._eventableEventListeners[type].length;i++)
		if(
			this._eventableEventListeners[type][i]==cb
				|| (
				(this._eventableEventListeners[type][i] instanceof Bound)
					&& (cb instanceof Bound)
					&& this._eventableEventListeners[type][i].func == cb.func
					&& this._eventableEventListeners[type][i].scope == cb.scope
				)
				|| (
				(this._eventableEventListeners[type][i] instanceof Bound)
					&& typeof(cb)=="function"
					&& this._eventableEventListeners[type][i].func == cb
				)
				|| (
				(cb instanceof Bound)
					&& typeof(this._eventableEventListeners[type][i])=="function"
					&& this._eventableEventListeners[type][i] == cb.func
				)
			)
			return;
	this._eventableEventListeners[type].push(cb);
};

/**
 * Causes a certain event to no longer execute a given callback. Only listeners matching BOTH criteria
 * will be removed.
 * If the stored listener is a Bound object, it will be removed if removeEventListener is called with the target function
 * of that bound object.
 * If the given callback is a Bound object, it will remove all listeners pointing to the same function as the listener.
 * It will however not remove listeners pointing to another Bound object unless function and scope are identical
 *
 * @param {string} type A user-defined string indicating the type of event that caused the callback to be run.
 * @param {(function|Bound)} cb The function that ran when an event of the given type is dispatched.
 */
Eventable.prototype.removeEventListener = function(type,cb){
	if(!this._eventableEventListeners[type])
		return;

	for(var i=0;i<this._eventableEventListeners[type].length;i++)
		if(
			this._eventableEventListeners[type][i]==cb
			|| (
				(this._eventableEventListeners[type][i] instanceof Bound)
				&& (cb instanceof Bound)
				&& this._eventableEventListeners[type][i].func == cb.func
				&& this._eventableEventListeners[type][i].scope == cb.scope
			)
			|| (
				(this._eventableEventListeners[type][i] instanceof Bound)
				&& typeof(cb)=="function"
				&& this._eventableEventListeners[type][i].func == cb
			)
			|| (
			(cb instanceof Bound)
				&& typeof(this._eventableEventListeners[type][i])=="function"
				&& this._eventableEventListeners[type][i] == cb.func
			)
		){
			this._eventableEventListeners[type].splice(i,1);
			return;
		}

	return;
};

/**
 * Calls all registered listener functions of the given type with the given event as argument0
 *
 * @param {string} type A user-supplied string. Only listeners registered with the same string will be called.
 * @param {?object} evt The argument passed to all registered listener functions.
 */
Eventable.prototype.dispatchEvent = function(type,evt){
	if(!this._eventableEventListeners[type])
		return;

	for(var i=0;i<this._eventableEventListeners[type].length;i++)
		this._eventableEventListeners[type][i].call(null,evt);

};

