'use strict';

import { transportOut, transportIn } from '../../src/rh-transformer'
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

  it('should return a pipedrive Deals from Local Deal', function() {
  	var transport = transportOut(model.Deals.fields, localDeal, {});
		transport.data.title.should.be.equals(localDeal.title);
		transport.data.org_id.should.be.equals(localDeal.pipedrive.org_id);
  });

	it('should set existing remote field into local according to policy', function() {
  	var transport = transportIn(model.Deals.fields, pdDeal, {});
		transport.data.pipedrive.id.should.be.equals(pdDeal.id);
  });

	it('should not set existing remote field into local according to policy', function() {
  	var transport = transportIn(model.Deals.fields,{}, pdDeal);
		should.not.exist(transport.title);
  });

	it('should transform origin into a update if has ID', function() {
		var transport = transportOut(model.Deals.fields, localDeal2, pdDeal);
		transport.action.should.be.equals('update');
		transport.updateId.should.be.equals(1);
		transport.data.title.should.be.equals(localDeal2.title);
	});

	it('should transform origin remote into a local update if has ID ', function () {
		var transport = transportIn(model.Deals.fields, pdDeal, localDeal2);
		transport.action.should.be.equals('update');
		transport.updateId.should.be.equals('571bc31d121a6e03007632b5');
		transport.data.potentialValue.should.be.equals(pdDeal.value);
	});
});
