
'use strict'

/**
 * events module.
 * @module events
 */

/**
 * Callback used by apiCall
 * @callback apiCallback
 * @param {error} err - error returned (null if no error)
 * @param {data} events - the data returned as an object
 */

const request = require('request')

/**
 * returns all events on given day for given location
 * @param {string} town - the location where the events are
 * @param {string} date - the date that the events are held on
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
exports.getFor = (town, date, callback) => {
	const eventList = []
	apiCall(town, date, (err, allEvents) => {
		if (err) return eventList//callback(err)
			allEvents.forEach(function(event){
				const eventItem = {name: event.name.text, description: event.description.text, dateTime: event.start.local, url: event.url}
				eventList.push(eventItem)
			})
		callback(eventList)
	})
}

/**
 * @function apiCall
 * @param {string} town - the location to search for events
 * @param {string} date - the date to search for events
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
function apiCall(town, date, callback) {
	const startDate = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}T${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`
	const endDate = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()+1}T${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`
	const url = `https://www.eventbriteapi.com/v3/events/search/?location.address=${town}&start_date.range_start=${startDate}&start_date.range_end=${endDate}&token=C5P7GDUFXHJ2ZNMFFEDV`
	console.log(url)
	request.get(url, (err, res, body) => {
		if (err) return callback(new Error('EventBrite API Error'))
		const json = JSON.parse(body)
		if(json.error_code) return callback(new Error('Invalid Location or Date/Time'))
		const eventList = json.events
		return callback(null, eventList)
	})
}
