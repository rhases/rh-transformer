const ngModuleName = 'rhTransformer';
import { transportOut, transportIn } from '../services/transformer'; 
const angular = require('./angularfix');
const ngModule = angular.module(ngModuleName, [/*require('angular-formly')*/]);

// ngModule.constant(
//     'formlyBootstrapApiCheck',
//     require('api-check')({
//         output: {
//             prefix: 'angular-formly-bootstrap'
//         }
//     })
// );
// ngModule.constant('formlyBootstrapVersion', VERSION);

ngModule.factory('tranformerService', function(){
    return {
        transportOut,
        transportIn
    }
})