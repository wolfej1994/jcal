'use strict'

const directions = require('../modules/directions')
const origin = 'Coventry'
const destination = 'Nottingham'

describe('Get Directions', function() {

	xit('should give us the route distance from our origin to our destination', () => {
		directions.distance(origin, destination, (err, distance) => {
			try {
				if (err)
					throw err
				expect(distance).toBe('89.0 km')
			} catch(err) {
				console.log(err.message)
			}
		})
	})

	xit('should give us the duration that our route will take ', () => {
		directions.duration(origin, destination, (err, duration) => {
			try {
				if (err)
					throw err
				expect(duration).toBe('1 hour 5 mins')
			} catch(err) {
				console.log(err.message)
			}
		})
	})

	xit('should give us directions from the origin to the destination', () => {
		directions.route(origin, destination, (err, route) => {
			try {
				if (err)
					throw err
				expect(route.length).toBe(29)
			} catch(err) {
				console.log(err.message)
			}
		})
	})

})
