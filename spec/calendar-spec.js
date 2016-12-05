'use strict'
/*istanbul ignore next*/
/* global expect */

const calendar = require('../calendar')


describe('Calendar Appointments', function() {

	beforeEach(function(done) {
		let addAppointment = {name: 'Easter Sunday', date: new Date(2017, 3, 16, 12, 0, 0), address: 'Coventry University, Priory Street', towncity: 'Coventry', postcode: 'CV1 5FB'}
		calendar.add(addAppointment)
		.then(appointment => {
			expect(appointment.name).toBe('Easter Sunday')
			done()
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		 })

		addAppointment = {name: 'Bonfire Night', date: new Date(2017, 10, 5, 18, 0, 0), address: 'The Red Lion Hunningham, Main Street, Hunningham', towncity: 'Leamington Spa', postcode: 'CV33 9DY'}
		calendar.add(addAppointment)
		.then(appointment => {
			expect(appointment.name).toBe('Bonfire Night')
			done()
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		 })

		addAppointment = {name: 'Christmas Day', date: new Date(2016, 11, 25, 11, 0, 0), address: 'West Thorpe, Willoughby', towncity: 'Loughborough', postcode: 'LE12 6TD'}
		calendar.add(addAppointment)
		.then(appointment => {
			expect(appointment.name).toBe('Christmas Day')
			done()
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		 })
	})

	afterEach(function(done) {
		calendar.clear()
		.then(response => {
			expect(response).toBe('All Appointments Removed')
			done()
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		})
	})

	it('should add a new calendar appointment', function(done) {
		const addAppointment = {name: 'New Years Day',
			date: new Date(2017, 0, 1, 0, 0, 0),
			address: 'Far Gosford Street',
			towncity: 'Coventry',
			postcode: 'CV1 5DZ'}
		calendar.add(addAppointment)
		.then(appointment => {
			expect(appointment.name).toBe('New Years Day')
			done()
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		})
	})

	it('should return all appointments', function(done){
		calendar.getAll()
		.then(appointments => {
			expect(appointments.length).toBe(3)
			done()
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		})
	})

	it('should remove a calendar appointment', function(done){
		calendar.getAll()
		.then(appointments => {
			calendar.remove(appointments[0].id)
			.then(response => {
				expect(response.code).toBe(200)
				expect(response.response.message).toBe('appointment has been deleted')
				done()
			})
			.catch(err => {
				expect(true).toBe(false)
				console.log(err)
				done()
			})
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		})
	})

	it('should throw an error due to appointment not being found', function(done){
		calendar.getAll()
		.then(appointments => {
			calendar.remove('not an id')
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
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		})
	})

	it('should update a calendar appointment', function(done){
		const updateAppointment = {name: 'Bonfire Night',
			date: new Date(2017, 10, 5, 18, 0, 0),
			address: 'The Ricoh Arena',
			towncity: 'Coventry',
			postcode: 'CV6 6GE'}
		calendar.getAll()
		.then(appointments => {
			calendar.update(appointments[0].id, updateAppointment)
			.then(response => {
				expect(response.code).toBe(200)
				expect(response.response.message).toBe(`${appointments[0].id} has been updated`)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(204)
				expect(err.response.message).toBe('no appointment found')
				done()
			})
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		})
	})

	it('should return an array for all appointments on the given date', function(done) {
		const newAppointment = {name: 'Another Bonfire Night', date: new Date(2017, 10, 5, 19, 0, 0), address: 'Main Street, Hunningham', towncity: 'Leamington Spa', postcode: 'CV33 9DY'}
		calendar.add(newAppointment)
		.then(response => {
			calendar.getDate(newAppointment.date)
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
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
		})
	})

	it('should throw an error if there are no appointments on the given date', function(done){
		const myBirthday = new Date(2016, 12, 9, 0, 0)
		calendar.getDate(myBirthday)
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

	it('should give us events happening on the appointment date/location', function(done) {
		const newAppointment = {name: 'New Appointment', date: new Date(2016, 11, 10, 0, 0, 0), address: 'Far Gosford Street', towncity: 'Coventry', postcode: 'CV1 5DZ'}
		calendar.add(newAppointment)
		.then(appointment => {
			calendar.getEvents(appointment.id)
			.then(events => {
				expect(events[0].name).toBe('The Snowman and The Nutcracker - with live orchestra')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).tobe(false)
				done()
			})
		})
		.catch(err => {
			console.log(err)
			expect(true).tobe(false)
		})
	})

	it('should give us directions to the appointment location', function(done) {
		calendar.getDate(new Date(2017, 10, 5, 0 ,0 ,0))
		.then(appointments => {
			const testLocation = '58 Far Gosford Street, Coventry, CV1 5DZ'
			calendar.getDirections(testLocation, appointments[0].id)
			.then(directions => {
				const finalIndex = directions.length-1
				expect(directions.length).toBe(15)
				expect(directions[0].start_location.lat).toBe(52.4078548)
				expect(directions[0].start_location.lng).toBe(-1.4951875)
				expect(directions[finalIndex].end_location.lat).toBe(52.3131411)
				expect(directions[finalIndex].end_location.lng).toBe(-1.4517591)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		})
	})

	it('should throw error due to invalid name', function(done) {
		const newAppointment = {name: 42, date: new Date(2017, 0, 1, 0, 0, 0), address: 'Far Gosford Street', towncity: 'Coventry', postcode: 'CV1 5DZ'}
		calendar.add(newAppointment)
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

	it('should throw error due to invalid date', function(done) {
		const newAppointment = {name: 'New Years Day', date: 'not a date', address: 'Far Gosford Street', towncity: 'Coventry', postcode: 'CV1 5DZ'}
		calendar.add(newAppointment)
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

	it('should throw error due to invalid address', function(done) {
		const newAppointment = {name: 'New Years Day', date: new Date(2017, 0, 1, 0, 0, 0), address: 42, towncity: 'Coventry', postcode: 'CV1 5DZ'}
		calendar.add(newAppointment)
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

	it('should throw error due to invalid towncity', function(done) {
		const newAppointment = {name: 'New Years Day', date: new Date(2017, 0, 1, 0, 0, 0), address: 'Far Gosford Street', towncity: 42, postcode: 'CV1 5DZ'}
		calendar.add(newAppointment)
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

	it('should throw error due to invalid postcode', function(done) {
		const newAppointment = {name: 'New Years Day', date: new Date(2017, 0, 1, 0, 0, 0), address: 'Far Gosford Street', towncity: 'Coventry', postcode: 42}
		calendar.add(newAppointment)
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

	it('should throw error due to invalid date', function(done) {
		const appointment = calendar.getDate('today')
		calendar.getDate(appointment)
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

	it('should throw error due to data missing in request body', function(done) {
		calendar.getAll()
		.then(appointments => {
			const updateAppointment = calendar.update(appointments[1].id, {name: 42, date: new Date(2017, 10, 5, 18, 0, 0), address: 'The Ricoh Arena', towncity: 'Coventry', postcode: 'CV6 6GE'})
			calendar.update(appointments[1].id, {name: 42, date: new Date(2017, 10, 5, 18, 0, 0), address: 'The Ricoh Arena', towncity: 'Coventry', postcode: 'CV6 6GE'})
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
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		})
	})
})
