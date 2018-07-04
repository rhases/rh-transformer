
'use strict';

var _ = require('lodash');

export function getValue(data, field, from) {
    var value;
    if (!field.dictionary) {
        value = _.get(data[field.policy], field[from]);
    } else {
		/* uses a field dictionary
		 to translate between local and remote values */
        var dic = field.dictionary;
        if (from === 'remote') //reverse de dictionary
            dic = _.invert(dic);

        var key = _.get(data[field.policy], field[from]);
        value = dic[key];
    }
    if (_.isFunction(value)) {
        return value(data);
    }

    if (field.mapFnc && value) {
        try {
            value = field.map(value)
        } catch (err) {
            console.error(err);
        }
    }

    return value;
}

export  function setAction(fields, toTransport, fromData, toData, params) {
    var _idValue = getIdFrom(fields, fromData, params)
        || getIdTo(fields, toData, params);

    if (!_idValue) {
        toTransport.action = 'create'
    }
    else {
        toTransport.action = 'update';
        toTransport.updateId = _idValue;
    }
}

/**
 *  Get id from the origin (update with remote reference)
 */
export  function getIdFrom(fields, fromData, params) {
    return fields.filter(function (field) { //id of the target
        return (field.isId && params.to === field.policy)
    })
        .reduce(function (acc, idField) {
            var value = _.get(fromData, idField[params.from]);
            return value;
        }, undefined);

}
/**
 *  Get id from the destination (case of a update with local reference)
 */
export function getIdTo(fields, toData, params) {
    return fields.filter(function (field) { //id of the target
        return (field.isId)
    })
        .reduce(function (acc, idField) {
            var value = _.get(toData, idField[params.to]);
            return value;
        }, undefined);

}

//updated fields
export function diff(curr, last) {
    var _diff = _.omitBy(curr, function (v, k) {
        return (last[k] === v);
    });
    return _diff;
}

export function clearNotUpdatableFields(fields, toTransport, params) {
    if (toTransport.action === 'update') {
        fields.forEach(function (field) {
            if (field.createOnly) {
                _.unset(toTransport.data, field[params.to]);
            }
        })
    }
}
export function setNoupIfRequiredFieldNotSet(fields, toTransport, params) {
    var allRequiredIsSet = fields.filter(function (field) {
        return field.required;
    }).reduce(function (isOk, field) {
        return isOk && _.get(toTransport.data, field[params.to]) !== undefined;
    }, true)
    if (!allRequiredIsSet) {
        toTransport.action = 'noop'; //nothing to change
        toTransport.data = undefined;
        return toTransport;
    }

}

export function setNoupIfEmpty(toTransport) {
    if (!toTransport.data || _.isEmpty(toTransport.data)) {
        toTransport.action = 'noop'; //nothing to change
        return toTransport;
    }
}
