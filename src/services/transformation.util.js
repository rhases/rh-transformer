
var _ = require('lodash');

import dataModelTransformer from './transformer';

export function setLocal(model, deal, control) {
  return function (entity) {
    if (entity) {
      //save pipedriveId
      var toTransport = dataModelTransformer.transportIn(model.fields, entity, deal);

      if (toTransport.action !== 'noup') {
        _.merge(deal, toTransport.data);
        control.isDirty = true;
      }
    }
    return deal;
  };
}

export function setItFromThat(model, entity, control) {
  return function (deal) {
    if (entity) {
      var toTransport = dataModelTransformer.transportIn(model.fields, entity, deal);

      if (toTransport.action !== 'noup') {
        _.merge(deal, toTransport.data);
        control.isDirty = true;
      }
    }
    return deal;
  };
}
