import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './addCardForm.html';
import { CardSets } from '../api/cards.js';
Meteor.subscribe('cardSets');
Meteor.subscribe('cards');

Template.addCardForm.onCreated(function() {
	this.counter = new ReactiveVar(1);
	console.log(this.counter);
	
   
  
});

Template.addCardForm.helpers({

	currentSetName() {
		var findCollection = CardSets.find().fetch();
		var cardSetsLength = findCollection.length-1;
		var setName = findCollection[cardSetsLength].name;
		return setName;
	},
	currentCreatedCards() {
		var findCollection = CardSets.find().fetch();
		var cardSetsLength = findCollection.length-1;
		var currentCards = findCollection[cardSetsLength].cards;
		return currentCards;
		
	},

	
	
});
Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});


