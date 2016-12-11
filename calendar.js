'use strict'

/**
 * calendar module.
 * @module calendar
 */

const directions = require('./modules/directions')
const events = require('./modules/events')
const mongo = require('./modules/data')
const auth = require('./modules/auth')


/**
 * @function createAppointment
 * @description Creates a new appointment and stores it in the databse.
 * @param {object} request - The data passed to the function that is used to define an appointment.
 * @return {object} - Response data detailing whether the addition was successful or not.
 */
exports.createAppointment = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => {
		console.log('creating appointment...')
		return mongo.addAppointment(request.body, request.authorization.basic.username)
	})
	.then(result => {
		resolve(result)
	})
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * 
 */
exports.clearAllAppointments = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => {
		console.log('deleting all appointments...')
		return mongo.appointmentsClear(request.authorization.basic.username)
	})
	.then(result => {
		resolve(result)
	})
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * 
 */
exports.getAllAppointments = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => {
		console.log('getting all appointments...')
		return mongo.getAllAppointments(request.authorization.basic.username)
	})
	.then(result => {
		resolve(result)
	})
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * 
 */
exports.getAppointment = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => {
		console.log('getting appointment...')
		return mongo.getAppointmentById(request.body.id, request.authorization.basic.username)
	})
	.then(result => {
		resolve(result)
	})
	.catch(err => {
		console.log(err)
		reject(err)
	})
})


/**
 * 
 */
exports.getAppointmentByDate = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => {
		console.log('getting appointments...')
		return mongo.getAppointmentsByDate(request.body.date, request.authorization.basic.username)
	})
	.then(result => {
		resolve(result)
	})
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * 
 */
exports.updateAppointment = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => {
		console.log('updating appointment...')
		return mongo.updateAppointment(request.body.id, request.body, request.authorization.basic.username)
	})
	.then(result => {
		resolve(result)
	})
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * 
 */
exports.deleteAppointment = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => {
		console.log('deleting appointment...')
		return mongo.removeAppointment(request.body.id, request.authorization.basic.username)
	})
	.then(result => {
		resolve(result)
	})
	.catch(err => {
		console.log(err)
		reject(err)
	})
})


/**
 * @function getEvents
 * @description Gets a collection of event objects based on information stored in appointment.
 * @param {string} findId - The ID used to identify appointments in the collection.
 * @returns {Array<object>} - Event objects found on given date in given town.
 */
exports.getEvents = (request) => new Promise((resolve,reject) => {
	validateAuth(request)
	.then(() => {
		console.log('getting all events')
		return mongo.getAppointmentById(request.body.id, request.authorization.basic.username)
	})
	.then(appointment => {
		console.log(appointment.towncity + appointment.date)
		return events.getFor(appointment.towncity, appointment.date)
	})
	.then(eventList => {
		resolve(eventList)
	})
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * @function getDirections
 * @description Gets an array of direction objects from given location to appointment location.
 * @param {object} currentLocation - Information containing the origin position for directions.
 * @param {string} findId - The ID used to identify appointments in the collection.
 * @returns {Array<object>} - Directions from current location to appointment.
 */
exports.getDirections = (request) => new Promise((resolve, reject) => {
	mongo.getAppointmentById(request.body.id, request.authorization.basic.username)
	.then(appointment => {
		const destination = `${appointment.address}, ${appointment.towncity}, ${appointment.postcode}`
		return directions.route(request.body.currentLocation, destination)
	})
	.then(route => {
		resolve(route)
	})
	.catch(err => {
		reject(err)
	})
})

/**
 * @function getDistance
 * @description Gets the distance of hourney from given location to appointment location.
 * @param {object} currentLocation - Information containing the origin position for distance.
 * @param {string} findId - The ID used to identify appointments in the collection.
 * @returns {number} - Distance from current location to appointment.
 */
exports.getDistance = (request) => new Promise((resolve, reject) => {
	mongo.getAppointmentById(request.body.id, request.authorization.basic.username)
	.then(appointment => {
		const destination = `${appointment.address}, ${appointment.towncity}, ${appointment.postcode}`
		return directions.distance(request.body.currentLocation, destination)
	})
	.then(distance => {
		resolve(distance)
	})
	.catch(err => {
		reject(err)
	})
})

/**
 * @function getDuration
 * @description Gets the duration of journey from given location to appointment location.
 * @param {object} currentLocation - Information containing the origin position for distance.
 * @param {string} findId - The ID used to identify appointments in the collection.
 * @returns {number} - Duration of journey from current location to appointment.
 */
exports.getDuration = (request) => new Promise((resolve, reject) => {
	mongo.getAppointmentById(request.body.id, request.authorization.basic.username)
	.then(appointment => {
		const destination = `${appointment.address}, ${appointment.towncity}, ${appointment.postcode}`
		return directions.duration(request.body.currentLocation, destination)
	})
	.then(duration => {
		resolve(duration)
	})
	.catch(err => {
		reject(err)
	})
})

// ------------------ UTILITY FUNCTIONS ------------------

/**
 * 
 */
const validateAuth = (request) => new Promise((resolve, reject) => {
	auth.getHeaderCreds(request)
	.then(credentials => {
		this.username = credentials.username
		return auth.hashPass(credentials)
	})
	.then(credentials => {
		this.password = credentials.password
		return mongo.getUserInfo(credentials)
	})
	.then(account => {
		const hash = account[0].password
		return auth.checkPassword(hash, this.password)
	})
	.then(validated => {
		console.log('validated'+validated)
		resolve(validated)
	})
	.catch(err =>{
		console.log(err)
		reject(err)
	})
})
