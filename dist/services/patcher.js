'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
var utils_1 = require("../utils/utils");
function patchsOut(fields, local, remote) {
    return patchFields(fields, local, remote, { from: 'local', to: 'remote' });
}
exports.patchsOut = patchsOut;
function patchsIn(fields, remote, local) {
    var params = { from: 'remote', to: 'local' };
    return {
        id: utils_1.getIdTo(fields, local, params),
        action: 'patch',
        patches: patchFields(fields, remote, local, params)
    };
}
exports.patchsIn = patchsIn;
function patchFields(fields, curr, last, params) {
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
            var patchPath = '/' + path.replace('.', '/');
            if (hasPreviousValue) {
                return { op: 'replace', path: patchPath, value: value, isPush: _isPush };
            }
            else {
                return { op: 'add', path: patchPath, value: value, isPush: _isPush };
            }
        }
    })
        .filter(function (patch) { return !!patch; });
}
exports.patchFields = patchFields;
