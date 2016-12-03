'use strict'
/*istanbul ignore next*/
/* global expect */

const calendar = require('../calendar')

describe('Calendar Appointments', function() {

	beforeEach(() => {
		calendar.add({name: 'Easter Sunday', date: new Date(2017, 3, 16, 12, 0, 0), address: 'Coventry University, Priory Street', towncity: 'Coventry', postcode: 'CV1 5FB'})
		calendar.add({name: 'Bonfire Night', date: new Date(2017, 10, 5, 18, 0, 0), address: 'Main Street, Hunningham', towncity: 'Leamington Spa', postcode: 'CV33 9DY'})
		calendar.add({name: 'Christmas Day', date: new Date(2016, 11, 25, 11, 0, 0), address: 'West Thorpe, Willoughby', towncity: 'Loughborough', postcode: 'LE12 6TD'})
	})

	afterEach(() => {
		calendar.clear()
	})

	it('should add a new caledar appointment', () => {
		calendar.add({name: 'New Years Day', date: new Date(2017, 0, 1, 0, 0, 0), address: 'Far Gosford Street', towncity: 'Coventry', postcode: 'CV1 5DZ'})
		expect(calendar.count()).toBe(4)
		expect(calendar.getAll()[3].name).toBe('New Years Day')
	})

	it('should remove a calendar appointment', () => {
		const allAppointments = calendar.getAll()
		const removeAppointment = calendar.remove(allAppointments[1].id)
		expect(removeAppointment.response.message).toBe('List has been deleted')
		expect(calendar.getAll()[1].name).toBe('Christmas Day')
	})

	it('should throw an error due to appointment not being found', () => {
		const allAppointments = calendar.getAll()
		const removeAppointment = calendar.remove('ExampleID')
		expect(removeAppointment.code).toBe(204)
		expect(removeAppointment.response.message).toBe('no appointment found')
	})

	it('should update a calendar appointment', () => {
		const allAppointments = calendar.getAll()
		calendar.update(allAppointments[1].id, {name: 'Bonfire Night', date: new Date(2017, 10, 5, 18, 0, 0), address: 'The Ricoh Arena', towncity: 'Coventry', postcode: 'CV6 6GE'})
		expect(calendar.getAll()[1].name).toBe('Bonfire Night')
		expect(calendar.getAll()[1].address).toBe('The Ricoh Arena')
		expect(calendar.getAll()[1].towncity).toBe('Coventry')
		expect(calendar.getAll()[1].postcode).toBe('CV6 6GE')
	})

	it('should return an array for all appointments on the given date', () => {
		calendar.add({name: 'Another Bonfire Night', date: new Date(2017, 10, 5, 19, 0, 0), address: 'Main Street, Hunningham', towncity: 'Leamington Spa', postcode: 'CV33 9DY'})
		const bonfireNight = new Date(2017, 10, 5, 18, 0, 0)
		const appointment = calendar.getDate(bonfireNight)
		expect(appointment.length).toBe(2)
		expect(appointment[0].name).toBe('Bonfire Night')
		expect(appointment[1].name).toBe('Another Bonfire Night')
	})

	it('should throw an error if there are no appointments on the given date', () => {
		const myBirthday = new Date(2016, 12, 9, 0, 0)
		const appointment = calendar.getDate(myBirthday)
		expect(appointment.code).toBe(204)
		expect(appointment.response.message).toBe('no appointments on given date/time')
	})

	it('should give us events happening on the appointment date/location', function(done) {
		calendar.add({name: 'New Appointment', date: new Date(2016, 11, 10, 0, 0, 0), address: 'Far Gosford Street', towncity: 'Coventry', postcode: 'CV1 5DZ'})
		const newAppointment = calendar.getDate(new Date(2016,11,10,0,0,0))
		calendar.getEvents(newAppointment[0].id, function(err, data) {
			expect(err).toBe(null)
			expect(data[0].name).toBe('The Snowman and The Nutcracker - with live orchestra')
			done()
		})
	})

	it('should give us directions to the appointment location', function(done) {
		const bonfireNight = calendar.getAll()[1]
		const testLocation = '58 Far Gosford Street, Coventry, CV1 5DZ'
		calendar.getDirections(testLocation, bonfireNight.id , function(err, data){
			expect(err).toBe(null)
			expect(data.length).toBe(15)
			done()
		})
	})

	it('should throw error due to invalid name', function(done) {
		const appointment = calendar.add({name: 42, date: new Date(2017, 0, 1, 0, 0, 0), address: 'Far Gosford Street', towncity: 'Coventry', postcode: 'CV1 5DZ'})
		expect(appointment.code).toBe(400)
		expect(appointment.response.message).toBe('JSON data missing in request body')
		done()
	})

	it('should throw error due to invalid date', function(done) {
		const appointment = calendar.add({name: 'New Years Day', date: 'not a date', address: 'Far Gosford Street', towncity: 'Coventry', postcode: 'CV1 5DZ'})
		expect(appointment.code).toBe(400)
		expect(appointment.response.message).toBe('JSON data missing in request body')
		done()
	})

	it('should throw error due to invalid address', function(done) {
		const appointment = calendar.add({name: 'New Years Day', date: new Date(2017, 0, 1, 0, 0, 0), address: 42, towncity: 'Coventry', postcode: 'CV1 5DZ'})
		expect(appointment.code).toBe(400)
		expect(appointment.response.message).toBe('JSON data missing in request body')
		done()
	})

	it('should throw error due to invalid towncity', function(done) {
		const appointment = calendar.add({name: 'New Years Day', date: new Date(2017, 0, 1, 0, 0, 0), address: 'Far Gosford Street', towncity: 42, postcode: 'CV1 5DZ'})
		expect(appointment.code).toBe(400)
		expect(appointment.response.message).toBe('JSON data missing in request body')
		done()
	})

	it('should throw error due to invalid postcode', function(done) {
		const appointment = calendar.add({name: 'New Years Day', date: new Date(2017, 0, 1, 0, 0, 0), address: 'Far Gosford Street', towncity: 'Coventry', postcode: 42})
		expect(appointment.code).toBe(400)
		expect(appointment.response.message).toBe('JSON data missing in request body')
		done()
	})

	it('should throw error due to invalid date', function(done) {
		const appointment = calendar.getDate('today')
		expect(appointment.code).toBe(400)
		expect(appointment.response.message).toBe('date is the incorrect format')
		done()
	})

	it('should throw error due to data missing in request body', function(done) {
		const allAppointments = calendar.getAll()
		const appointment = calendar.update(allAppointments[1].id, {name: 42, date: new Date(2017, 10, 5, 18, 0, 0), address: 'The Ricoh Arena', towncity: 'Coventry', postcode: 'CV6 6GE'})
		expect(appointment.code).toBe(400)
		expect(appointment.response.message).toBe('JSON data missing in request body')
		done()

	})

})
