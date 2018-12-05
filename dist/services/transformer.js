'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils/utils");
var _ = require('lodash');
function transportOut(fields, local, remote) {
    return transport(fields, local, remote, { from: 'local', to: 'remote' });
}
exports.transportOut = transportOut;
function transportIn(fields, remote, local) {
    return transport(fields, remote, local, { from: 'remote', to: 'local' });
}
exports.transportIn = transportIn;
function transport(fields, fromData, toData, params) {
    if (!fromData || !params)
        throw new Error("missing params");
    if (!toData)
        toData = {};
    var toTransport = {};
    var newOtherSide = createTranslation(fields, fromData, toData, params);
    var data = utils_1.diff(newOtherSide, toData); //what have changed
    toTransport.data = data;
    utils_1.setAction(fields, toTransport, fromData, toData, params); // action:create or action:update, updateId:xx}
    utils_1.clearNotUpdatableFields(fields, toTransport, params);
    if (params.to === 'remote ') {
        utils_1.setNoupIfRequiredFieldNotSet(fields, toTransport, params);
    }
    utils_1.setNoupIfEmpty(toTransport);
    return toTransport;
}
exports.transport = transport;
function createTranslation(fields, curr, last, params) {
    return translateFields(fields, curr, last, params)
        .reduce(function (acc, resultField) {
        if (resultField && resultField.isPush) {
            if (!_.get(acc, resultField.path)) {
                _.set(acc, resultField.path, []);
            }
            _.get(acc, resultField.path).push(resultField.value);
        }
        else if (resultField && resultField.path && resultField.value) {
            _.set(acc, resultField.path, resultField.value);
        }
        return acc;
    }, {});
}
exports.createTranslation = createTranslation;
function translateFields(fields, curr, last, params) {
    var from = params.from, to = params.to;
    var data = {};
    data[params.from] = curr;
    data[params.to] = last;
    data.freshData = curr.updatedAt &&
        last.updatedAt && curr.updatedAt > last.updatedAt ?
        curr : last;
    return fields.map(function (field) {
        var path = field[to];
        var value = utils_1.getValue(data, field, from);
        var _isPush = field.isPush || false;
        if (value === _.get(last, path)) {
            return; //field should not be updated
        }
        else if (!value || !path) {
            return; //field should not be updated
        }
        else {
            var hasPreviousValue = !!_.get(data[to], path);
            if (hasPreviousValue) {
                return { op: 'replace', path: path, value: value, isPush: _isPush };
            }
            else {
                return { op: 'add', path: path, value: value, isPush: _isPush };
            }
        }
    })
        .filter(function (patch) { return !!patch; });
}
exports.translateFields = translateFields;
