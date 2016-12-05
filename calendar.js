'use strict'

const directions = require('./modules/directions')
const events = require('./modules/events')
const rand = require('csprng')
const Appointment = require('./modules/database')

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

exports.count = () => new Promise((resolve, reject) =>{
	/*if (auth.basic === undefined) {
		console.log('missing basic auth')
		return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'missing basic auth' }}
	}
	if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {
		console.log('invalid credentials')
    	return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'invalid credentials' }}
	}*/
	Appointment.count(function(err, count) {
  		if (err) reject(err)
  		return resolve(count)
	})
})

exports.clear = () => new Promise((resolve, reject) =>{
	/*if (auth.basic === undefined) {
		console.log('missing basic auth')
		return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'missing basic auth' }}
	}
	if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {
		console.log('invalid credentials')
    	return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'invalid credentials' }}
	}*/
	Appointment.remove(function(err) {
  		if (err) reject(err)
  		resolve('All Appointments Removed')
	})
})

exports.add = (body) => new Promise((resolve, reject) => {
	/*if (auth.basic === undefined) {
		console.log('missing basic auth')
		return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'missing basic auth' }}
	}
	if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {
		console.log('invalid credentials')
    	return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'invalid credentials' }}
	}*/
  	const valid = validateJson(body)
  	if (valid === false) {
    	reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'JSON data missing in request body' }})
  	}
  	const newId = rand(160, 36)
	const newAppointment = new Appointment({
		id: newId,
		name: body.name,
		date: body.date,
		address: body.address,
		towncity: body.towncity,
		postcode: body.postcode
	})
	newAppointment.save(function(err, newAppointment) {
  		if (err) reject(err)
		resolve(newAppointment)
	})
})


exports.getAll = () => new Promise((resolve, reject) =>{
	/*if (auth.basic === undefined) {
		console.log('missing basic auth')
		return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'missing basic auth' }}
	}
	if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {
		console.log('invalid credentials')
    	return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'invalid credentials' }}
	}*/
	Appointment.find(function(err, appointments) {
  		if (err) reject(err)
  		resolve(appointments)
	})
})

exports.remove = (findId) => new Promise((resolve, reject) => {
	/*if (auth.basic === undefined) {
		console.log('missing basic auth')
		return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'missing basic auth' }}
	}
	if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {
		console.log('invalid credentials')
    	return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'invalid credentials' }}
	}*/
	Appointment.findOneAndRemove({id: findId}, function(err, foundApp){
		if (err) reject(err)
		if(!foundApp) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found' }})
		resolve({code: 200, contentType: 'json', response: { status: 'ok', message: 'appointment has been deleted'}})
	})
})

exports.update = (findId, body) => new Promise((resolve, reject) => {
	/*if (auth.basic === undefined) {
		console.log('missing basic auth')
		return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'missing basic auth' }}
	}
	if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {
		console.log('invalid credentials')
    	return {code: 401, contentType: 'application/json', response: { status: 'error', message: 'invalid credentials' }}
	}*/
  	const valid = validateJson(body)
  	if (valid === false) {
    	reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'JSON data missing in request body' }})
  	}
	Appointment.findOneAndUpdate({id: findId}, { $set: {id: findId, name: body.name, date: body.date, address: body.address, towncity: body.towncity, postcode: body.postcode}}, { new: true }, function(err, updatedApp) {
  		if (err) reject(err)
		if(!updatedApp) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found' }})
  		resolve({code: 200, contentType: 'json', response: {status: 'ok', message: `${findId} has been updated`}})
	})
})

exports.getDate = (findDate) => new Promise((resolve, reject) => {
	if(!(findDate instanceof Date)){
		reject({code: 400, contentType: 'json', response: {status: 'ok', message: 'date is the incorrect format'}})
	}
	const appointments = []
	Appointment.find({date: {'$gte': new Date(findDate.getFullYear(), findDate.getMonth(), findDate.getDate(), 0, 0, 0), '$lt': new Date(findDate.getFullYear(), findDate.getMonth(), findDate.getDate(), 23, 59, 59)}}, function(err, foundAppointments){
		if(err) reject(err)
		if(foundAppointments.length == 0) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointments on given date/time' }})
		resolve(foundAppointments)
	})
})

exports.getEvents = (findId) => new Promise((resolve,reject) => {
	Appointment.findOne({id: findId}, function(err, foundApp){
		if (err) reject(err)
		if(!foundApp) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found' }})
		events.getFor(foundApp.towncity, foundApp.date)
		.then(eventList => {
			resolve(eventList)
		})
		.catch(err => {
			reject(err)
		})
	})
})

exports.getDirections = (currentLocation, findId) => new Promise((resolve, reject) => {
	Appointment.findOne({id: findId}, function(err, foundApp){
		if (err) reject(err)
		if(!foundApp) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found' }})
		const destination = `${foundApp.address}, ${foundApp.towncity}, ${foundApp.postcode}`
		directions.route(currentLocation, destination)
		.then(route => {
			resolve(route)
		})
		.catch(err => {
			reject(err)
		})
	})
})
