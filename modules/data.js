'use strict'

/**
 * data module.
 * @module data
 */

const schema = require('../schema/schema')
const rand = require('csprng')

/**
 * @function validateApppointment
 * @description Validates appointment objects before usage.
 * @param {data} json - The appointment to be validated.
 * @returns {boolean} - Whether or not json is valid.
 */
function validateAppointment(appointment) {
	if(typeof appointment.name !== 'string') {
		console.log('name not a string')
		return false
	}
	if(typeof appointment.userID !== 'string') {
		console.log('userID is not a string')
		return false
	}
	if(!(appointment.date instanceof Date)) {
		console.log('date is not a date')
		return false
	}
  	if(typeof appointment.address !== 'string') {
      	console.log('address is not a string')
      	return false
  	}
  	if(typeof appointment.towncity !== 'string') {
    	console.log('towncity is not a string')
     	return false
	}
	if(typeof appointment.postcode !== 'string') {
		console.log('postcode is not a string')
		return false
	}
	return true
}

/**
 * 
 */
exports.addUser = (body) => new Promise((resolve, reject) =>{
	if(typeof body.username !== 'string' || typeof body.password !== 'string'){
		reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'username/password are not strings'}})
	}
	const newUser = new schema.User({
		username: body.username,
		password: body.password
	})
	newUser.save(function(err) {
  		if(err) reject(err)
		resolve({code: 201, contentType: 'json', response: { status: 'ok', message: 'created new user'}})
	})
})

/**
 * 
 */
exports.getUserInfo = (details) => new Promise((resolve, reject) =>{
	schema.User.find({username: details.username}, function(err, docs) {
		if(err) reject(err)
		if(docs.length) resolve(docs)
		reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'user does not exist'}})
	})
})

/**
 * @function appointmentsCount
 * @description Returns the number of documents present in the 'appointments' collection.
 * @returns {number} - The number of items in the collection.
 */
exports.appointmentsCount = (username) => new Promise((resolve, reject) =>{
	schema.Appointment.find({userID: username}).count(function(err, length) {
		/* istanbul ignore next */
  		if(err) reject(err)
  		resolve(length)
	})
})

/**
 * @function appointmentsClear
 * @description Deletes all documents in the 'appointments' collection.
 * @returns {string} - Describes whether or not the opperation was successful.
 */
exports.appointmentsClear = (username) => new Promise((resolve, reject) =>{
	schema.Appointment.find({userID: username}).remove(function(err) {
		/* istanbul ignore next */
  		if(err) reject(err)
  		resolve({code: 200, contentType: 'json', response: { status: 'ok', message: 'all appointments removed'}})
	})
})

/**
 * @function add
 * @description Adds a new appointment document to the 'appointments' collection.
 * @param {object} body - All data used to create a new schema and save it to the 'appointmens' collection.
 * @returns {string} - Describes whether or not the opperation was successful.
 */
exports.addAppointment = (body) => new Promise((resolve, reject) => {
  	const valid = validateAppointment(body)
  	if(valid === false) {
    	reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'JSON data missing in request body'}})
  	}
  	const newId = rand(160, 36)
	const newAppointment = new schema.Appointment({
		userID: body.userID,
		id: newId,
		name: body.name,
		date: body.date,
		address: body.address,
		towncity: body.towncity,
		postcode: body.postcode
	})
	newAppointment.save(function(err) {
  		if(err) reject(err)
		resolve({code: 201, contentType: 'json', response: { status: 'ok', message: 'created new appointment'}})
	})
})

/**
 * @function getAllAppointments
 * @description Gets all appointment documents from the 'appointments' collection.
 * @returns {Array.<object>} - All appointment documents found in the collection.
 */
exports.getAllAppointments = (username) => new Promise((resolve, reject) =>{
	schema.Appointment.find({userID: username}, function(err, appointments) {
		/* istanbul ignore next */
  		if(err) reject(err)
  		resolve(appointments)
	})
})

/**
 * @function removeAppointment
 * @description Removes an appointment document from the 'appointments' collection.
 * @param {string} findId - The ID used to identify the appointment that is being removed.
 * @returns {object} - Response containing HTTP status and message.
 */
exports.removeAppointment = (findId, username) => new Promise((resolve, reject) => {
	schema.Appointment.findOneAndRemove({id: findId, userID: username}, function(err, foundApp) {
		/* istanbul ignore next */
		if(err) reject(err)
		if(!foundApp) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found'}})
		resolve({code: 200, contentType: 'json', response: { status: 'ok', message: 'appointment has been deleted'}})
	})
})

/**
 * @function updateAppointment
 * @description Updates an appointment document in the 'appointments' collection.
 * @param {string} findId - The ID used to identify the appointment that is being updated.
 * @param {object} body - All data used to create a new schema and save it to the 'appointmens' collection.
 * @returns {object} - Response containing HTTP status and message.
 */
exports.updateAppointment = (findId, body, username) => new Promise((resolve, reject) => {
  	const valid = validateAppointment(body)
  	if(valid === false) {
    	reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'JSON data missing in request body'}})
  	}
	schema.Appointment.findOneAndUpdate({id: findId, userID: username}, { $set: {userID: username, id: findId, name: body.name, date: body.date, address: body.address, towncity: body.towncity, postcode: body.postcode}}, { new: true }, function(err, updatedApp) {
  		/* istanbul ignore next */
		if(err) reject(err)
		if(!updatedApp) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found'}})
  		resolve({code: 200, contentType: 'json', response: {status: 'ok', message: `${findId} has been updated`}})
	})
})

/**
 * @function getAppointmentByDate
 * @description Gets all appointments on given date.
 * @param {date} findDate - The date used to identify appointments in the collection.
 * @returns {Array<object>} - Appointment objects found on given date.
 */
exports.getAppointmentsByDate = (findDate, username) => new Promise((resolve, reject) => {
	if(!(findDate instanceof Date)) {
		reject({code: 400, contentType: 'json', response: {status: 'ok', message: 'date is the incorrect format'}})
	}
	const appointments = []
	schema.Appointment.find({userID: username, date: {'$gte': new Date(findDate.getFullYear(), findDate.getMonth(), findDate.getDate(), 0, 0, 0), '$lt': new Date(findDate.getFullYear(), findDate.getMonth(), findDate.getDate(), 23, 59, 59)}}, function(err, foundAppointments) {
		/* istanbul ignore next */
		if(err) reject(err)
		if(foundAppointments.length === 0) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointments on given date/time'}})
		resolve(foundAppointments)
	})
})

/**
 * @function getAppointmentById
 * @description Gets all appointments on given date.
 * @param {date} findDate - The date used to identify appointments in the collection.
 * @returns {Array<object>} - Appointment objects found on given date.
 */
exports.getAppointmentById = (findId, username) => new Promise((resolve, reject) => {
	schema.Appointment.findOne({id: findId, userID: username}, function(err, foundApp) {
		/* istanbul ignore next */
		if(err) reject(err)
		if(!foundApp) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found'}})
	    resolve(foundApp)
	})
})
