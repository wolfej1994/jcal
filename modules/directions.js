'use strict'

/**
 * directions module.
 * @module directions
 */

/**
 * Callback used by apiCall
 * @callback apiCallback
 * @param {error} err - error returned (null if no error)
 * @param {data} route - the data returned as an object
 */

const sync = require('sync-request')

/**
 * returns the driving distance between two locations
 * @param {string} start - the starting location for the journey
 * @param {string} end - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
exports.distance = (start, end, callback) => {
		const data = apiCall(start, end)
		return callback(null, data.routes[0].legs[0].distance.value)
}

exports.duration = (start, end, callback) => {
		const data = apiCall(start, end)
		return callback(null, data.routes[0].legs[0].duration.value)
}

exports.route = (start, end, callback) => {
		const data = apiCall(start, end)
		return callback(null, data.routes[0].legs[0].steps)
}

/**
 * @function apiCall
 * @param {string} start - the starting location for the journey
 * @param {string} end - the ending location for the journey
 * @returns {null} no return value
 */
function apiCall(start, end) {
		let url = 'https://maps.googleapis.com/maps/api/directions/json?origin='
		url = url+start+'&destination='+end
		const res = sync('GET', url)
		return JSON.parse(res.getBody().toString('utf8'))
}