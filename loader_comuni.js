'use strict';

var jsonfile = require('jsonfile');
var util = require('util');

var path = require('path');

var file = __dirname + '/data/comuni_italiani.json';

var level = require('level');

var db = level(path.join(__dirname, '/db'));

jsonfile.readFile(file, function(err, obj) {
  // console.dir(obj)
  let wc = 1;
  var batch = db.batch();
  
  console.time('100-elements');

  for (let value of obj){
  	// console.dir(value);
  	
  	if(value.model === 'comuni_italiani.regione'){
		
		let key = 'regioni:' + value.fields.name;
		let valueR = value.pk;
		
		console.log('reg: %s -> %s', key, valueR);
		
		batch.put(key, valueR);

		let keyInv = 'inv:regioni:' + value.pk;
		let valueInv = value.fields.name;
		
		console.log('reg inv: %s -> %s', keyInv, valueInv);

		batch.put(keyInv, valueInv);
		
		/*
			let regione = new model.Regione({ pk: value.pk, name: value.fields.name });
			regione.save(function (err, regione) {
			  if (err) return console.error(regione);
			});
		*/
  		
  	} else if (value.model === 'comuni_italiani.provincia') {
		
		let key = 'province:' + value.fields.name;
		let valueP = value.pk;

		batch.put(key, valueP);
		
		let keyInv = 'inv:province:' + value.pk;
		let name = value.fields.name;
		let code =  value.fields.codice_targa;
		let regione_id =  value.fields.regione;
		
		let obj = {
			name: name,
			code: code,
			regione_id: regione_id
		};
		
		console.log('prov: %s -> %s', keyInv, JSON.stringify(obj));
		
		batch.put(keyInv,  JSON.stringify(obj));

		/*
  		let provincia = new model.Provincia({ pk: value.pk, name: value.fields.name, 
  			code: value.fields.codice_targa, regione_id: value.fields.regione });
  		
  		provincia.save(function (err, provincia) {
		  if (err) return console.error(provincia);
		});
		*/
  		
  	} else if (value.model === 'comuni_italiani.comune') {
		
		let key = 'comuni:' + value.fields.name;
		let valueC = value.pk;
		
		console.log('comuni: %s -> %s', key, valueC);
		
		batch.put(key, valueC);

		let keyInv = 'inv:comuni:' + value.pk;
		let name = value.fields.name;
		let provincia_id = value.fields.provincia;
		let altitudine = value.fields.altitudine;
		let superficie = value.fields.superficie;
		let popolazione = value.fields.popolazione;
		
		let obj = {
			name: name,
			provincia_id: provincia_id,
			altitudine: altitudine,
			superficie: superficie,
			popolazione: popolazione
		};
		
		console.log('comuni inv: %s -> %s', keyInv, JSON.stringify(obj));
		
		batch.put(keyInv,  JSON.stringify(obj));

		/*
  		let comune = new model.Comune({ pk: value.pk, name: value.fields.name, provincia_id: value.fields.provincia, 
  			altitudine: value.fields.altitudine, superficie: value.fields.superficie, popolazione: value.fields.popolazione });
  		
  		comune.save(function (err, comune) {
		  if (err) return console.error(comune);
		});
		*/
  		
  	}
  }

  console.time('beforeWrite');
  
  batch.write();
  
  console.timeEnd('beforeWrite');
  
  console.timeEnd('100-elements');

})
