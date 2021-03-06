'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var morgan = require('morgan');
var bodyParser = require('body-parser');

app.disable('x-powered-by');
app.use(morgan('short'));
app.use(bodyParser.json());

function promisifyRead(file, encoding){
  return new Promise(function(resolve, reject){
    fs.readFile(file, encoding, function(err, data) {
      if (err) {
        return reject(err);
      }
      else {
        var pets = JSON.parse(data);
        return resolve(pets);
      }
    });
  })
}

app.get('/pets', function(req, res) {
  promisifyRead(petsPath, 'utf8')
    .then(function(data){
      res.json(data);
    })
    .catch(function(err){
      console.error(err.stack);
      return res.sendStatus(500);
    })
});

// app.get('/pets', function(req, res) {
//   fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
//     if (err) {
//       console.error(err.stack);
//       return res.sendStatus(500);
//     }
//
//     var pets = JSON.parse(petsJSON);
//
//     res.send(pets);
//   });
// });

app.get('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON){
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    var id = Number.parseInt(req.params.id);
    var pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    res.send(pets[id]);
  });
});

app.post('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(readErr, petsJSON) {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    var pets = JSON.parse(petsJSON);
    var age = Number.parseInt(req.body.age);
    var kind = req.body.kind;
    var name = req.body.name;

    if (Number.isNaN(age) || !kind || !name) {
      return res.sendStatus(400);
    }

    var pet = {"age":age,"kind":kind,"name":name};

    pets.push(pet);

    var newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, function(writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.send(pet);
    });
  });
});

app.patch('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', (readErr, petsJSON)=>{
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    var id = Number.parseInt(req.params.id);
    var pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    var age = Number.parseInt(req.body.age);
    var kind = req.body.kind;
    var name = req.body.name;

    if (!Number.isNaN(age)){
      pets[id].age = age;
    }

    if (kind) {
      pets[id].kind = kind;
    }

    if (name) {
      pets[id].name = name;
    }

    var newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, function(writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.send(pets[id]);
    });
  });
});

app.delete('/pets/:id', (req, res)=>{
  fs. readFile(petsPath, 'utf8', (readErr, petsJSON)=>{
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    var id = Number.parseInt(req.params.id);
    var pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    var pet = pets.splice(id, 1)[0];
    var newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, function(writeErr) {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.send(pet);
    });
  });
});

app.listen(port, function(){
  console.log('Listening on port', port);
});

module.exports = app;
