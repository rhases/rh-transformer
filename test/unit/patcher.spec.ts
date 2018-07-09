'use strict';

import { patchsIn } from '../../src/rh-transformer'
import model from './pipedrive-transformer-model';

var should = require('chai').should();
var _ = require('lodash');

import { expect } from 'chai';
import '../setup';

describe('Transformer:', function() {

	var localDeal = {
		"_id": "571bc31d121a6e03007632b4",
		"email": 'pedrinho@gmail.com', // email
		"name": 'Pedrinho Silva',
		"title": 'Pedrinho | mei | brasilia - df, 2 vidas',
		"state": 'df',
		"city": 'brasilia',
		"pipedrive": {
			"org_id": 3
		}
	}

	var localDeal2 = {
		"_id": "571bc31d121a6e03007632b5",
		"email": 'mariazinha@gmail.com', // email
		"name": 'Maria Silva Souza',
		"title": 'Maria Silva | mei | brasilia - df, 2 vidas',
		"pipedrive":{ "id": 1}
	}

	var pdDeal = {
		id:1,
		title:"Maria Silva",
		value: 500
	};

	it('should create patches for an in update', function () {
		var operation = patchsIn(model.Deals.fields, pdDeal, localDeal2);
		operation.patches.length.should.be.equals(2);

		operation.id.should.be.equals('571bc31d121a6e03007632b5');
		operation.action.should.be.equals('patch');
		operation.patches[0].op.should.be.equals('replace');
		operation.patches[0].path.should.be.equals('/title');
		operation.patches[0].value.should.be.equals(pdDeal.title);
	});
});
