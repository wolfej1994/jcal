'use strict'
/*istanbul ignore next*/
/* global expect */

const events = require('../modules/events')

describe('Get Events', function() {

	it('should give us an array of event objects for nearby events on given date', function(done) {
			events.getFor('Coventry', new Date(2016, 11, 10, 0, 0), function(err, data){
			expect(err).toBe(null)
			expect(data[0].name).toBe('The Snowman and The Nutcracker - with live orchestra')
			done()
		})
	})

	it('should return an empty array of events', function(done) {
			events.getFor('Coventry', new Date(2040, 1, 1, 0, 0), function(err, data){
			expect(err).toBe(null)
			expect(data.length).toBe(0)
			done()
		})
	})
})
