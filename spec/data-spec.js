'use strict'

const calendar = require('../modules/data')
const username = 'testUser'


describe('Pesistant Data Model', function() {

	beforeEach(function(done) {
		let addAppointment = {
			userID: username,
			name: 'Easter Sunday',
			date: new Date(2017, 3, 16, 12, 0, 0),
			address: 'Coventry University, Priory Street',
			towncity: 'Coventry',
			postcode: 'CV1 5FB'
		}
		calendar.addAppointment(addAppointment)
		.then(appointment => {
			expect(appointment.code).toBe(201)
			expect(appointment.response.message).toBe('created new appointment')
		})
		addAppointment = {
			userID: username,
			name: 'Bonfire Night',
			date: new Date(2017, 10, 5, 18, 0, 0),
			address: 'The Red Lion Hunningham, Main Street, Hunningham',
			towncity: 'Leamington Spa',
			postcode: 'CV33 9DY'
		}
		calendar.addAppointment(addAppointment)
		.then(appointment => {
			expect(appointment.code).toBe(201)
			expect(appointment.response.message).toBe('created new appointment')
		})
		addAppointment = {
			userID: username,
			name: 'Christmas Day',
			date: new Date(2016, 11, 25, 11, 0, 0),
			address: 'West Thorpe, Willoughby',
			towncity: 'Loughborough',
			postcode: 'LE12 6TD'
		}
		calendar.addAppointment(addAppointment)
		.then(appointment => {
			expect(appointment.code).toBe(201)
			expect(appointment.response.message).toBe('created new appointment')
			done()
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		 })
	})

	afterEach(function(done) {
		calendar.appointmentsClear(username)
		.then(response => {
			expect(response.code).toBe(200)
			expect(response.response.message).toBe('all appointments removed')
			done()
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		})
	})

	describe('Calendar Add Appointment Function', function() {

		it('should add a new calendar appointment', function(done) {
			const addAppointment = {
				userID: username,
				name: 'New Years Day',
				date: new Date(2017, 0, 1, 0, 0, 0),
				address: 'Far Gosford Street',
				towncity: 'Coventry',
				postcode: 'CV1 5DZ'
			}
			calendar.addAppointment(addAppointment)
			.then(appointment => {
				expect(appointment.code).toBe(201)
				expect(appointment.response.message).toBe('created new appointment')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
		 	})
		})

		it('should throw error due to invalid name when adding appointment', function(done) {
			const newAppointment = {
				userID: username,
				name: 42,
				date: new Date(2017, 0, 1, 0, 0, 0),
				address: 'Far Gosford Street',
				towncity: 'Coventry',
				postcode: 'CV1 5DZ'
			}
			calendar.addAppointment(newAppointment)
			.then(appointment => {
				console.log(appointment)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(400)
				expect(err.response.message).toBe('JSON data missing in request body')
				done()
			})
		})

		it('should throw error due to invalid date when adding appointment', function(done) {
			const newAppointment = {
				userID: username,
				name: 'New Years Day',
				date: 'not a date',
				address: 'Far Gosford Street',
				towncity: 'Coventry',
				postcode: 'CV1 5DZ'
			}
			calendar.addAppointment(newAppointment)
			.then(appointment => {
				console.log(appointment)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(400)
				expect(err.response.message).toBe('JSON data missing in request body')
				done()
			})
		})

		it('should throw error due to invalid address when adding appointments', function(done) {
			const newAppointment = {
				userID: username,
				name: 'New Years Day',
				date: new Date(2017, 0, 1, 0, 0, 0),
				address: 42,
				towncity: 'Coventry',
				postcode: 'CV1 5DZ'
			}
			calendar.addAppointment(newAppointment)
			.then(appointment => {
				console.log(appointment)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(400)
				expect(err.response.message).toBe('JSON data missing in request body')
				done()
			})
		})

		it('should throw error due to invalid towncity when adding appointment', function(done) {
			const newAppointment = {
				userID: username,
				name: 'New Years Day',
				date: new Date(2017, 0, 1, 0, 0, 0),
				address: 'Far Gosford Street',
				towncity: 42,
				postcode: 'CV1 5DZ'
			}
			calendar.addAppointment(newAppointment)
			.then(appointment => {
				console.log(appointment)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(400)
				expect(err.response.message).toBe('JSON data missing in request body')
				done()
			})
		})

		it('should throw error due to invalid postcode when adding appointment', function(done) {
			const newAppointment = {
				userID: username,
				name: 'New Years Day',
				date: new Date(2017, 0, 1, 0, 0, 0),
				address: 'Far Gosford Street',
				towncity: 'Coventry',
				postcode: 42
			}
			calendar.addAppointment(newAppointment)
			.then(appointment => {
				console.log(appointment)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(400)
				expect(err.response.message).toBe('JSON data missing in request body')
				done()
			})
		})

	})

	describe('Calendar Get Appointment by Date Function', function() {

		it('should return an array for all appointments on the given date', function(done) {
			const newAppointment = {
				userID: username,
				name: 'Another Bonfire Night',
				date: new Date(2017, 10, 5, 19, 0, 0),
				address: 'Main Street, Hunningham',
				towncity: 'Leamington Spa',
				postcode: 'CV33 9DY'
			}
			calendar.addAppointment(newAppointment)
			.then(response => {
				expect(response.code).toBe(201)
				expect(response.response.message).toBe('created new appointment')
				return calendar.getAppointmentsByDate(newAppointment.date, username)
			})
			.then(appointments => {
				expect(appointments.length).toBe(2)
				expect(appointments[0].name).toBe('Bonfire Night')
				expect(appointments[1].name).toBe('Another Bonfire Night')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw an error if there are no appointments on the given date', function(done) {
			const myBirthday = new Date(2016, 12, 9, 0, 0)
			calendar.getAppointmentsByDate(myBirthday, username)
			.then(appointments => {
				console.log(appointments)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(204)
				expect(err.response.message).toBe('no appointments on given date/time')
				done()
			})
		})

		it('should throw error trying to get item on date due to invalid date', function(done) {
			calendar.getAppointmentsByDate('today', username)
			.then(appointment => {
				console.log(appointment)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(400)
				expect(err.response.message).toBe('date is the incorrect format')
				done()
			})
		})

	})

	describe('Calendar Remove Appointment Function', function() {

		it('should remove a calendar appointment', function(done) {
			calendar.getAllAppointments(username)
			.then(appointments => {
				expect(appointments.length).toBe(3)
				return calendar.removeAppointment(appointments[0].id, username)
			})
			.then(response => {
				expect(response.code).toBe(200)
				expect(response.response.message).toBe('appointment has been deleted')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw an error due to appointment not being found', function(done) {
			calendar.getAllAppointments(username)
			.then(appointments => {
				expect(appointments.length).toBe(3)
				return calendar.removeAppointment('not an id', username)
			})
			.then(response => {
				console.log(response)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(204)
				expect(err.response.message).toBe('no appointment found')
				done()
			})
		})

	})

	describe('Calendar Update Appointment Function', function() {

		it('should update a calendar appointment', function(done) {
			const updateAppointment = {
				userID: username,
				name: 'Bonfire Night',
				date: new Date(2017, 10, 5, 18, 0, 0),
				address: 'The Ricoh Arena',
				towncity: 'Coventry',
				postcode: 'CV6 6GE'
			}
			let allAppointments
			calendar.getAllAppointments(username)
			.then(appointments => {
				allAppointments = appointments
				expect(appointments.length).toBe(3)
				return calendar.updateAppointment(appointments[0].id, updateAppointment, username)
			})
			.then(response => {
				expect(response.code).toBe(200)
				expect(response.response.message).toBe(`${allAppointments[0].id} has been updated`)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(204)
				expect(err.response.message).toBe('no appointment found')
				done()
			})
		})

		it('should throw error trying to update due to data missing in request body', function(done) {
			calendar.getAllAppointments(username)
			.then(appointments => {
				const updateAppointment = {
					userID: username,
					name: 42,
					date: new Date(2017, 10, 5, 18, 0, 0),
					address: 'The Ricoh Arena',
					towncity: 'Coventry',
					postcode: 'CV6 6GE'
				}
				return calendar.updateAppointment(appointments[1].id, updateAppointment, username)
			})
			.then(appointment => {
				console.log(appointment)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(400)
				expect(err.response.message).toBe('JSON data missing in request body')
				done()
			})
		})

		it('should throw error due to not finding document to update', function(done) {
			const updateAppointment = {
				userID: username,
				name: 'New Appointment',
				date: new Date(2017, 10, 5, 18, 0, 0),
				address: 'The Ricoh Arena',
				towncity: 'Coventry',
				postcode: 'CV6 6GE'
			}
			calendar.updateAppointment('NotAValidID', updateAppointment, username)
			.then(appointment => {
				console.log(appointment)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(204)
				expect(err.response.message).toBe('no appointment found')
				done()
			})
		})

	})

	describe('Get all appointments / Get Appointment Count Functions', function() {

		it('should return all appointments', function(done) {
			let count
			calendar.appointmentsCount(username)
			.then(number => {
				count = number
				return calendar.getAllAppointments(username)
			})
			.then(appointments => {
				expect(appointments.length).toBe(count)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

	})

})
