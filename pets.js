'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data){
    if (err) {
      throw err;
    }

    var pets = JSON.parse(data);
    var index = Number.parseInt(process.argv[3]);

    if (Number.isNaN(index)) {
      console.log(pets);
      process.exit();
    }

    if (index<0 || index > pets.length-1) {
      console.error (`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    console.log(pets[index]);

  });

}

else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', function(readErr,data) {
    if (readErr) {
      throw readErr;
    }

    var pets = JSON.parse(data);
    var age = Number.parseInt(process.argv[3]);
    var kind = process.argv[4];
    var name = process.argv[5];

    if (Number.isNaN(age) || !kind || !name) {
      console.error (`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    var pet = { 'age':age,'kind':kind,'name':name };

    pets.push(pet);

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }

      console.log(pet);
    });
  });
}

else if (cmd === 'update'){
  fs.readFile(petsPath, 'utf8', function(readErr, data){
    if (readErr) {
      throw readErr;
    }

    var pets = JSON.parse(data);
    var index = Number.parseInt(process.argv[3]);
    var age = Number.parseInt(process.argv[4]);
    var kind = process.argv[5];
    var name = process.argv[6];

    if (Number.isNaN(index) || index<0 || index > pets.length-1) {
      console.error (`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    if (Number.isNaN(age) || !kind || !name) {
      console.error (`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    var pet = { 'age':age,'kind':kind,'name':name };

    pets[index] = pet;

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }

    console.log(pet);

    });
  });
}

else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`)
  process.exit(1);
}
