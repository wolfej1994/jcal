'use strict'

const calendar = require('../calendar')

describe('Calendar Appointments', function() {

	beforeEach(() => {
		calendar.add('Easter Sunday', new Date(2017, 4, 16, 12, 0, 0), 'Coventry University, Priory Street', 'Coventry', 'CV1 5FB')
		calendar.add('Bonfire Night', new Date(2017, 11, 5, 18, 0, 0), 'Main Street, Hunningham', 'Leamington Spa', 'CV33 9DY')
		calendar.add('Christmas Day', new Date(2017, 12, 25, 11, 0, 0), 'West Thorpe, Willoughby', 'Loughborough', 'LE12 6TD')
	})

	afterEach(() => {
		calendar.clear()
	})

	it('should add a new caledar appointment', () => {
		calendar.add('New Years Day', new Date(2017, 1, 1, 0, 0, 0), 'Far Gosford Street', 'Coventry', 'CV1 5DZ')
		expect(calendar.count()).toBe(4)
	})

	it('should remove a calendar appointment', () => {
		calendar.remove(new Date(2017, 11, 5, 18, 0, 0))
		const appointments = calendar.getAll()
		expect(appointments[1].name).toBe('Christmas Day')
	})

	it('should update a calendar appointment', () => {
		const bonfireNight = new Date(2017, 11, 5, 18, 0, 0)
		calendar.update(bonfireNight, 'Bonfire Night', bonfireNight, 'The Ricoh Arena', 'Coventry', 'CV6 6GE')
		const appointment = calendar.get(bonfireNight)
		expect(appointment.name).toBe('Bonfire Night')
		expect(appointment.address).toBe('The Ricoh Arena')
		expect(appointment.townCity).toBe('Coventry')
		expect(appointment.postcode).toBe('CV6 6GE')
	})

	it('should return an array for all appointments on the given date', () => {
		const bonfireNight = new Date(2017, 11, 5, 18, 0, 0)
		const appointment = calendar.get(bonfireNight)
		expect(appointment.name).toBe('Bonfire Night')
		expect(appointment.address).toBe('Main Street, Hunningham')
		expect(appointment.townCity).toBe('Leamington Spa')
		expect(appointment.postcode).toBe('CV33 9DY')
	})

	it('should throw an error if there are no appointments on the given date', () => {
		const myBirthday = new Date(2016, 12, 9, 0, 0)
		const appointment = calendar.get(myBirthday)
		expect(appointment).toThrowError('no appointments on given date/time')

	})

})
