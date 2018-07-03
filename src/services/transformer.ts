'use strict';

var logger = require('../utils/logger.service').getLogger('transformer');
var _ = require('lodash');

export function transportOut(fields, currentLocal, originalRemote): any {
	return transport(fields, currentLocal, originalRemote, {from:'local', to: 'remote'})
}

export function transportIn(fields, currentRemote, originalLocal): any {
	return transport(fields, currentRemote, originalLocal, {from:'remote', to: 'local'})
}

export function transport(fields, current, originalFromOtherSide, params): any{
	if(!current || !params)
		throw new Error("missing params");
	if(!originalFromOtherSide)
		originalFromOtherSide = {};

	var toTransport: any = {};
	//logger.trace('current:' + JSON.stringify(current))
	//logger.trace('originalFromOtherSide:' + JSON.stringify(originalFromOtherSide))
	var newOtherSide = translateFields(fields, current, originalFromOtherSide, params)
	logger.trace(`newOtherSide: ${JSON.stringify(newOtherSide)}`);
	var data = diff(newOtherSide, originalFromOtherSide); //what have changed
	logger.trace(`data: ${JSON.stringify(data)}`);
	toTransport.data = data;
	setAction(fields, toTransport, current, params); // action:create or action:update, updateId:xx}
	clearNotUpdatableFields(fields, toTransport, params);
	if (params.to === 'remote ') {
		setNoupIfRequiredFieldNotSet(fields, toTransport, params);
	}
	setNoupIfEmpty(toTransport)
	return toTransport;
}

export function translateFields(fields, curr, last, params){
	var from = params.from;
	var to = params.to;
	var data:any = {};
	data[params.from] = curr;
	data[params.to] = last;
	data.freshData = curr.updatedAt &&
		last.updatedAt && curr.updatedAt > last.updatedAt ?
		curr : last;

	return fields.map(function(field){
		var _path = field[to];
		var _value = getValue(data, field, from);

		var _isPush = field.isPush || false;

		logger.trace(`field: ${JSON.stringify(field)}`);
		logger.trace(`last: ${_.get(last, _path)}, from: ${from}, path: ${JSON.stringify(_path)}, value: ${JSON.stringify(_value)}`);

		if(_value === _.get(last, _path))
			return; //field should not be updated
		else if(!_value || !_path)
			return; //field should not be updated
		else
			return {path: field[to], value: _value, isPush:_isPush};
	})
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

function getValue(data, field, from){
	var value;
	if (!field.dictionary){
		value = _.get(data[field.policy], field[from]);
	}else{
		/* uses a field dictionary
		 to translate between local and remote values */
		var dic = field.dictionary;
		if(from === 'remote') //reverse de dictionary
			dic = _.invert(dic);

		var key = _.get(data[field.policy], field[from]);
		value = dic[key];
	}
	if(_.isFunction(value)){
		logger.trace('---- value ----');
		logger.trace(data);
		return value(data);
	}
	
	if(field.mapFnc && value){
		try {
			value = field.map(value)
		}catch(err){
			logger.error(err);
		}
	}

	return value;
}

function setAction(fields, toTransport, current, params){
	var _idValue = getId(fields, current, params);
	if(!_idValue){
		toTransport.action = 'create'
	}
	else{
		toTransport.action = 'update';
		toTransport.updateId = _idValue;
	}
}

function getId(fields, current, params){
	return fields.filter(function(field){ //id of the target
		return (field.isId && params.to === field.policy)
	})
	.reduce(function(acc, idField){
		var value = _.get(current, idField[params.from]);
		logger.trace('get id: '+ JSON.stringify(idField) +'|' + params.from +'|' +idField[params.from]+'|' + value)
		logger.trace('------------- current')
		logger.trace(current);
		logger.trace('------------- current')
		return value;
	}, undefined);

}
//updated fields
function diff(curr, last){
	var _diff =  _.omitBy(curr, function(v, k) {
		logger.trace('last '+k+ ' '+ JSON.stringify(last[k]))
		return (last[k] === v);
	});
	return _diff;
}

function clearNotUpdatableFields(fields, toTransport, params){
	if(toTransport.action === 'update'){
		fields.forEach(function(field){
			if(field.createOnly){
				_.unset(toTransport.data, field[params.to]);
			}
		})
	}
}
function setNoupIfRequiredFieldNotSet(fields, toTransport, params){
	var allRequiredIsSet = fields.filter(function(field){
		return field.required;
	}).reduce(function(isOk, field){
		return isOk && _.get(toTransport.data, field[params.to]) !== undefined;
	}, true)
	if(!allRequiredIsSet){
		logger.debug(`setting noop. Not all required fields are set.${JSON.stringify(toTransport)} `);
		toTransport.action = 'noop'; //nothing to change
		toTransport.data = undefined;
		return toTransport;
	}

}

function setNoupIfEmpty(toTransport){
	if(!toTransport.data || _.isEmpty(toTransport.data)){
		toTransport.action = 'noop'; //nothing to change
		return toTransport;
	}
}
