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
 * @returns {null} no return value
 */
exports.distance = (start, end) => new Promise((resolve, reject) => {
		const data = apiCall(start, end, function(err, data){
			if(err) reject(err)
			resolve(data.routes[0].legs[0].distance.value)
		})
})

exports.duration = (start, end) => new Promise((resolve, reject) => {
		const data = apiCall(start, end, function(err, data){
			if(err) reject(err)
			resolve(data.routes[0].legs[0].duration.value)
		})
})

exports.route = (start, end) => new Promise((resolve, reject) => {
		const data = apiCall(start, end, function(err, data){
			if(err) reject(err)
			resolve(data.routes[0].legs[0].steps)
		})
})

/**
 * @function apiCall
 * @param {string} start - the starting location for the journey
 * @param {string} end - the ending location for the journey
 * @returns {null} no return value
 */
function apiCall(start, end, callback) {
		let url = 'https://maps.googleapis.com/maps/api/directions/json?origin='
		url = url+start+'&destination='+end
		const res = sync('GET', url)
		const json = JSON.parse(res.getBody().toString('utf8'))
		console.log(json)
		if(json.status === 'NOT_FOUND') return callback('Google Maps Error: '+json.status)
		return callback(null, json)
}