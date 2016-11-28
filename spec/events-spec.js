'use strict'

const events = require('../modules/events')

describe('Get Directions', function() {

	it('should give us an array of event objects for nearby events on given date'), () => {
		events.getFor('Coventry', new Date(2017, 1, 1, 0, 0))
		events.foreach(function(events){
			expect(events.name).not.toBeUndefined()
			expect(events.description).not.toBeUndefined()
			expect(events.date).not.toBeUndefined()
			expect(events.url).not.toBeUndefined()
		})
	}

})
