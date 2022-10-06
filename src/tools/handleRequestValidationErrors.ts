import express from 'express';
import {ValidationError, validationResult} from 'express-validator';
import {APIErrorType} from '../../typings/enums.js';
import APIError from '../classes/APIError.js';


export default function handleRequestValidationErrors(req: express.Request, res: express.Response) {
	// todo: refactor to better handle errors
	const errorFormatter = ({location, msg, param}: ValidationError) => {
		return `invalid ${location} | param <${param}>: ${msg}`;
	};
	const errors = validationResult(req).formatWith(errorFormatter);

	if (!errors.isEmpty()) {
		res.status(400).json(new APIError(400, errors.array(), APIErrorType.InvalidRequest));
		return true;
	}
	return false;
}