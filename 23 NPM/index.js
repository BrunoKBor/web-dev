// var generateName = require('sillyname');

import generateName from "sillyname";
var sillyName = generateName();

console.log(`My silly name is ${sillyName}.`);

import superheroes from 'superheroes';

// Generate a random superhero name
const superheroName = superheroes.random();

console.log(`My  superhero name is ${superheroName}.`);