'use strict'

const events = require('../modules/events')

describe('Get Events', function() {

	it('should give us an array of event objects for nearby events on given date', function(done) {
		events.getFor('Coventry', new Date(2016, 11, 10, 0, 0), function(data) {
			expect(data[0].name).toBe('The Snowman and The Nutcracker - with live orchestra')
			expect(data[1].name).toBe('ACE - it! from Coventry University')
			expect(data[2].name).toBe('BMF Session - War Memorial Park, Coventry')
			expect(data[3].name).toBe('Kids Run Free - Longford Park')
			done()
		})
	})

	it('should return an empty array of events', function(done) {
		events.getFor('Coventry', new Date(2040, 1, 1, 0, 0), function(data) {
			expect(data.length).toBe(0)
			done()
		})
	})
})
