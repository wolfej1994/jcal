'use strict'

/**
 * auth module.
 * @module auth
 */

const bcrypt = require('bcrypt')

/**
 * 
 */
exports.getHeaderCreds = (request) => new Promise((resolve, reject) => {
	if(request.authorization === undefined || request.authorization.basic === undefined) {
		reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'authorization header missing'}})
	}
	const auth = request.authorization.basic
	if(auth.username === undefined || auth.password === undefined) {
		reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'missing username/password'}})
	}
	resolve({username: auth.username, password: auth.password})
})

/**
 * 
 */
exports.hashPass = (credentials) => new Promise((resolve, reject) => {
    const salt = bcrypt.genSaltSync(10)
    credentials.password = bcrypt.hashSync(credentials.password, salt)
    resolve(credentials)
})

/**
 * 
 */
exports.checkPassword = (provided, hash) => new Promise((resolve, reject) => {
  if(!bcrypt.compareSync(provided, hash)) reject(false)
  resolve(true)
})