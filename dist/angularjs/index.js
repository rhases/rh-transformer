"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ngModuleName = 'rhTransformer';
var transformer_1 = require("../services/transformer");
var angular = require('./angularfix');
var ngModule = angular.module(ngModuleName, [ /*require('angular-formly')*/]);
// ngModule.constant(
//     'formlyBootstrapApiCheck',
//     require('api-check')({
//         output: {
//             prefix: 'angular-formly-bootstrap'
//         }
//     })
// );
// ngModule.constant('formlyBootstrapVersion', VERSION);
ngModule.factory('tranformerService', function () {
    return {
        transportOut: transformer_1.transportOut,
        transportIn: transformer_1.transportIn
    };
});
