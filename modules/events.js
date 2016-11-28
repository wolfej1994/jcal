
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
		allEvents.events.forEach(function(events){
			const event = {name: events.name.text, description: events.description.text, dateTime: events.start.local, url: events.url};
			eventList.push(event)
		})
		return callback(null, eventList)
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
	const firstIndex = 0
	const url = 'https://www.eventbriteapi.com/v3/events/search/?location.address=${town}&start_date.range_start=${date}&start_date.keyword=today&token=C5P7GDUFXHJ2ZNMFFEDV'
	console.log(url)
	request.get(url, (err, res, body) => {
		if (err) return callback(new Error('Event Brite API Error'))
		const json = JSON.parse(body)
		if (json.status !== 'OK') return callback(new Error('invalid location/time'))
		const eventList = json.events[firstIndex]
		return callback(null, eventList)
	})
}
