
'use strict';

var _ = require('lodash');

import { getIdTo, getValue } from '../utils/utils';

export function patchsOut(fields, local, remote): any {
    return patchFields(fields, local, remote, { from: 'local', to: 'remote' });
}

export function patchsIn(fields, remote, local): any {
    let params = { from: 'remote', to: 'local' };
    return {
        id: getIdTo(fields, local, params),
        action: 'patch',
        patches: patchFields(fields, remote, local, params)
    }
}

export function patchFields(fields, curr, last, params) {
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
            let patchPath = '/' + path.replace('.', '/');
            if (hasPreviousValue) {
                return { op: 'replace', path: patchPath, value, isPush: _isPush };
            } else {
                return { op: 'add', path: patchPath, value, isPush: _isPush };
            }
        }
    })
    .filter(patch => !!patch);
}
