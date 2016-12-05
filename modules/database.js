'use strict'
const mongoose = require('mongoose')

// import the mongoose package
const details = {
	user: 'apiUser',
	pass: 'secret1'
}
mongoose.connect(`mongodb://${details.user}:${details.pass}@ds119508.mlab.com:19508/calendar`)

const appointmentSchema = mongoose.Schema({
	id: String,
	name: String,
	date: Date,
	address: String,
	towncity: String,
	postcode: String
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment

