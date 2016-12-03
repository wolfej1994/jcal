'use strict'

const directions = require('./modules/directions')
const events = require('./modules/events')
const rand = require('csprng')

let appointments = []

/**
 * Validates the appointment we're posting to the API.
 * @param {data} json The appointment to be validated.
 * @returns {boolean} Whether or not json is valid.
 */
function validateJson(json) {
	if (typeof json.name !== 'string') {
		console.log('name not a string')
		return false
	}
	if (!(json.date instanceof Date)) {
		console.log('date is not a date')
		return false
	}
  	if (typeof json.address !== 'string') {
      	console.log('address is not a string')
      	return false
  	}
  	if (typeof json.towncity !== 'string') {
    	console.log('townCity is not a string')
     	return false
	}
	if (typeof json.postcode !== 'string') {
		console.log('postcode is not a string')
		return false
	}
	return true
}

exports.count = function() {
	return appointments.length
}

exports.clear = function() {
	appointments = []
}

exports.add = function(body) {
	/*if (auth.basic === undefined) {
		console.log('missing basic auth')
		return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'missing basic auth' }}
	}
	if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {
		console.log('invalid credentials')
    	return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'invalid credentials' }}
	}*/
	const json = body
  	const valid = validateJson(json)
  	if (valid === false) {
    	return {code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'JSON data missing in request body' }}
  	}
  	const newId = rand(160, 36)
	const newAppointment = {id: newId, name: json.name, date: json.date, address: json.address, towncity: json.towncity, postcode: json.postcode}
	appointments.push(newAppointment)
	return {code: 201, contentType: 'application/json', response: { status: 'success', message: 'new appointment added', data: newAppointment }}
}

exports.getAll = function() {
	return appointments
}

exports.remove = function(id) {
	/*if (auth.basic === undefined) {
		console.log('missing basic auth')
		return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'missing basic auth' }}
	}
	if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {
		console.log('invalid credentials')
    	return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'invalid credentials' }}
	}*/
	const foundAppointment = appointments.find( function(value) {
		return value.id === id
	})
	if (foundAppointment === undefined) {
		return {code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found' }}
	}
	//Creates a new array of ids, in the same order. Get's the index of the ID, removes it from lists array.
	appointments.splice(appointments.map(function(appointment) {
		return appointment.id
	}).indexOf(id), 1)
	return {code: 200, contentType: 'json', response: { status: 'ok', message: 'List has been deleted'}}
}

exports.update = function(id, body) {
	const valid = validateJson(body)
  	if (valid === false) {
    	return {code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'JSON data missing in request body' }}
  	}
	const index = appointments.map(function(appointment) {
		return appointment.id
	}).indexOf(id)
	appointments[index] = {id: id, name: body.name, date: body.date, address: body.address, towncity: body.towncity, postcode: body.postcode}
	return {code: 200, contentType: 'json', response: {status: 'ok', message: `${id} has been updated`}}
}

exports.getDate = function(date) {
	if(!(date instanceof Date)){
		return {code: 400, contentType: 'json', response: {status: 'ok', message: 'date is the incorrect format'}}
	}
	const onDate = appointments.find( function(value) {
		if(value.date.getFullYear() === date.getFullYear() && value.date.getMonth() === date.getMonth() && value.date.getDate() === date.getDate())
		    return true
	})
	if(onDate === undefined)
		return {code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointments on given date/time'}}
	const appointmentDates = appointments.map(function(appointment) {
		return appointment.date
	})
	const foundAppointments = []
	appointmentDates.forEach(function(appointmentDate) {
		if(appointmentDate.getFullYear() === date.getFullYear() && appointmentDate.getMonth() === date.getMonth() && appointmentDate.getDate() === date.getDate()) {
			foundAppointments.push(appointments[appointmentDates.indexOf(appointmentDate)])
		}
	})
    //route through each appointmentDates check if yyyy/mm/dd matches, if so add appointment[appointmentDate.index] to array and return it
	return foundAppointments
}

exports.getEvents = function(id, callback) {
	const index = appointments.map(function(appointment) {
		return appointment.id
	}).indexOf(id)
	events.getFor(appointments[index].towncity, new Date(2016, 11, 10, 0, 0), function(err, data){
		return callback(err, data)
	})
}

exports.getDirections = function(currentLocation, id, callback) {
	const index = appointments.map(function(appointment) {
		return appointment.id
	}).indexOf(id)
	const destination = `${appointments[index].address}, ${appointments[index].towncity}, ${appointments[index].postcode}`
	directions.route(currentLocation, destination, function(err, data){
		return callback(err, data)
	})
}
