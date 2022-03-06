import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './addCardForm.html';
import { CardSets } from '../api/cards.js';
Meteor.subscribe('cardSets');

Template.addCardForm.onCreated(function() {
	this.counter = new ReactiveVar(1);
	this.audioQuestion = new ReactiveVar();
	this.audioAnswer = new ReactiveVar();

	  
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
	audioQuestion() {
		var findCollection = CardSets.find().fetch();
		var cardSetsLength = findCollection.length-1;
		var audioQuestion = findCollection[cardSetsLength].keyFormat;
		return audioQuestion;
	},
	audioAnswer() {		
		var findCollection = CardSets.find().fetch();
		var cardSetsLength = findCollection.length-1;
		var audioAnswer = findCollection[cardSetsLength].answerFormat;
		return audioAnswer;
	 }

	
	
});


Template.addCardForm.events({
	'click .questionToggleSwitch' (event, template){
   var questionToggleButton = document.getElementById("questionToggleButton");

   		questionToggleButton.classList.toggle('questionSecondaryTogglePosition');
		template.audioQuestion.set(!template.audioQuestion.get());
 
		
	},
	'click .answerToggleSwitch' (event, template){

		
		var answerToggleButton = document.getElementById("answerToggleButton");
  
		answerToggleButton.classList.toggle('answerSecondaryTogglePosition');
	
 
		
	},

	
});
Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});



