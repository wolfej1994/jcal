
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

const request = require('request')

/**
 * returns the driving distance between two locations
 * @param {string} start - the starting location for the journey
 * @param {string} end - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
exports.distance = (start, end, callback) => {
	apiCall(start, end, (err, route) => {
		if (err) return callback(err)
		return callback(null, `${end} is ${route.distance.text} from ${start}`)
	})
}

exports.duration = (start, end, callback) => {
	apiCall(start, end, (err, route) => {
		if (err) return callback(err)
		return callback(null, `Travelling from ${start} to ${end} will take ${route.duration.text}`)
	})
}

exports.route = (start, end, callback) => {
	const directions = []
	apiCall(start, end, (err, route) => {
		if (err) return route
		route.steps.forEach(function(steps){
			directions.push(steps.html_instructions)
		})
		return callback(null, directions)
	})
}

/**
 * @function apiCall
 * @param {string} start - the starting location for the journey
 * @param {string} end - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
function apiCall(start, end, callback) {
	const firstIndex = 0
	const url = `https://maps.googleapis.com/maps/api/directions/json?region=gb&origin=${start}&destination=${end}`
	request.get(url, (err, res, body) => {
		if (err) return callback(new Error('Google API error'))
		const json = JSON.parse(body)
		if (json.status !== 'OK') return callback(new Error('invalid location'))
		const route = json.routes[firstIndex].legs[firstIndex]
		return callback(null, route)
	})
}