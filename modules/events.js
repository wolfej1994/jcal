
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

const sync = require('sync-request')

/**
 * returns all events on given day for given location
 * @param {string} town - the location where the events are
 * @param {string} date - the date that the events are held on
 * @returns {null} no return value
 */
exports.getFor = (town, date) => new Promise((resolve, reject) => {
	const eventList = []
	apiCall(town, date, function(err, allEvents){
		if (err) reject(err)
		allEvents.forEach(function(event){
			const eventItem = {name: event.name.text, description: event.description.text, dateTime: event.start.local, url: event.url}
			eventList.push(eventItem)
		})
		return resolve(eventList)
	})
})

/**
 * @function apiCall
 * @param {string} town - the location to search for events
 * @param {string} date - the date to search for events
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
function apiCall(town, date, callback) {
		const startDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}T00:00:00`
		const endDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+1}T00:00:00`
		let url = 'https://www.eventbriteapi.com/v3/events/search/?location.address='
		url = url+town+'&start_date.range_start='+startDate+'&start_date.range_end='+endDate+'&token=C5P7GDUFXHJ2ZNMFFEDV'
		const res = sync('GET', url)
		const data = JSON.parse(res.getBody().toString('utf8'))
		const eventList = data.events
		if(data.error_code) return callback('EventBrite Error: '+data.error_code, null)
		return callback(null, eventList)
	}
