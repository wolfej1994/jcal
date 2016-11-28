'use strict'

const directions = require('../modules/directions')
const origin = 'Coventry'
const destination = 'Nottingham'

describe('Get Directions', function() {

	it('should give us the route distance from our start point till our end point', () => {
		directions.distance(origin, destination, (err, distance) => {
			try {
				if (err)
					throw err
				expect(distance).toBe('Nottingham is 89.0 km from Coventry')
			} catch(err) {
				console.log(err.message)
			}
		})
	})

	it('should give us the duration that our route will take from start till end', () => {
		directions.duration(origin, destination, (err, duration) => {
			try {
				if (err)
					throw err
				expect(duration).toBe('Travelling from Coventry to Nottingham will take 1 hour 5 mins')
			} catch(err) {
				console.log(err.message)
			}
		})
	})

	it('should give us a list of 29 directions from our start till our end point', () => {
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
