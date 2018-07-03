'use strict';

var log4js = require('log4js')
//import config from '../config/environment';


const logLevel = process.env.logLevel || 'info';
console.log('Initing logger with level: ' + logLevel);

export function getLogger(key) {
	var logger = log4js.getLogger(key);
	logger.setLevel(logLevel);
	return logger;
}
