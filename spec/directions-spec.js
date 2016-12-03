'use strict'
/*istanbul ignore next*/
/* global expect */

const directions = require('../modules/directions')
const origin = 'Coventry'
const destination = 'Nottingham'

describe('Get Directions', function() {

	it('should give us the route distance from our start point till our end point', function(done) {
		directions.distance(origin, destination, function(err, data){
			expect(err).toBe(null)
			expect(data).toBe(88967)
			done()
		})
	})

	it('should give us the duration that our route will take from start till end', function(done) {
		directions.duration(origin, destination, function(err, data){
			expect(err).toBe(null)
			expect(data).toBe(3913)
			done()
		})
	})

	it('should give us a list of 29 directions from our start till our end point', function(done) {
		directions.route(origin, destination, function(err, data){
			expect(err).toBe(null)
			expect(data.length).toBe(31)
			done()
		})
	})

})
