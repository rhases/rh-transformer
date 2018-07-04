'use strict';

import {
getValue,
diff,
setAction,
clearNotUpdatableFields,
setNoupIfRequiredFieldNotSet,
setNoupIfEmpty } from '../utils/utils';

var _ = require('lodash');


export function transportOut(fields, local, remote): any {
	return transport(fields, local, remote, {from:'local', to: 'remote'})
}

export function transportIn(fields, remote, local): any {
	return transport(fields, remote, local, {from:'remote', to: 'local'})
}

export function transport(fields, fromData, toData, params): any{
	if(!fromData || !params)
		throw new Error("missing params");
	if(!toData)
		toData = {};

	var toTransport: any = {};
	var newOtherSide = createTranslation(fields, fromData, toData, params)
	var data = diff(newOtherSide, toData); //what have changed
	toTransport.data = data;
	setAction(fields, toTransport, fromData, toData, params); // action:create or action:update, updateId:xx}
	clearNotUpdatableFields(fields, toTransport, params);
	if (params.to === 'remote ') {
		setNoupIfRequiredFieldNotSet(fields, toTransport, params);
	}
	setNoupIfEmpty(toTransport)
	return toTransport;
}

export function createTranslation(fields, curr, last, params){
	return translateFields(fields, curr, last, params)
	.reduce(function(acc, resultField){
		if(resultField && resultField.isPush){
			if(!_.get(acc, resultField.path)){
				_.set(acc, resultField.path, [])
			}
			_.get(acc, resultField.path).push(resultField.value);
		}else if(resultField && resultField.path && resultField.value){
			_.set(acc, resultField.path, resultField.value);
		}
		return acc;
	}, {});
}

export function translateFields(fields, curr, last, params) {
	let { from, to } = params;
	let data: any = {};

	data[params.from] = curr;
	data[params.to] = last;

	data.freshData = curr.updatedAt &&
		last.updatedAt && curr.updatedAt > last.updatedAt ?
		curr : last;

	return fields.map(function (field) {
		let path = field[to];
		let value = getValue(data, field, from);

		let _isPush = field.isPush || false;

		if (value === _.get(last, path)) {
			return; //field should not be updated
		}
		else if (!value || !path) {
			return; //field should not be updated
		}
		else {
			let hasPreviousValue = !!_.get(data[to], path);
			if (hasPreviousValue) {
				return { op: 'replace', path, value, isPush: _isPush };
			} else {
				return { op: 'add', path, value, isPush: _isPush };
			}
		}
	})
	.filter(patch => !!patch);
}
