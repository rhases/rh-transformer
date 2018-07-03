var logger = require('./logger.service').getLogger('data-model-transformer.transformation.util');
var _ = require('lodash');

import dataModelTransformer from './transformer';

export function setLocal(model, deal, control) {
  return function (entity) {
    if (entity) {
      logger.trace(`setting local for ${model.remote}`);
      //save pipedriveId
      logger.trace(entity)
      var toTransport = dataModelTransformer.transportIn(model.fields, entity, deal);

      logger.debug(`toTransportIn: ${JSON.stringify(toTransport)}`)
      if (toTransport.action !== 'noup') {
        _.merge(deal, toTransport.data);
        control.isDirty = true;
        logger.trace(`updated with: ${JSON.stringify(toTransport.data)}`)
      }
    }
    logger.debug('merged:', JSON.stringify(deal));
    return deal;
  };
}

export function setItFromThat(model, entity, control) {
  return function (deal) {
    if (entity) {
      logger.trace(`setting local for ${model.remote}`);
      //save pipedriveId
      logger.trace(entity)
      var toTransport = dataModelTransformer.transportIn(model.fields, entity, deal);

      logger.debug(`toTransportIn: ${JSON.stringify(toTransport)}`)
      if (toTransport.action !== 'noup') {
        _.merge(deal, toTransport.data);
        control.isDirty = true;
        logger.trace(`updated with: ${JSON.stringify(toTransport.data)}`)
      }
    }
    logger.trace('merged', JSON.stringify(deal));
    return deal;
  };
}
