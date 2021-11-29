import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './addCardForm.html';
import { CardSets } from '../api/cards.js';
Meteor.subscribe('cardSets');

Template.addCardForm.onCreated(function() {
	this.counter = new ReactiveVar(1);
	this.audioQuestion = new ReactiveVar(false);
	this.audioAnswer = new ReactiveVar(false);

	  
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
			return Template.instance().audioQuestion.get();
	},
	audioAnswer() {		
		
		return Template.instance().audioAnswer.get();
	}

	
	
});
Session.set('audioQuestionStatus' , false);

Template.addCardForm.events({
	'click .questionToggleSwitch' (event, template){
   var questionToggleButton = document.getElementById("questionToggleButton");

   		questionToggleButton.classList.toggle('questionSecondaryTogglePosition');
		template.audioQuestion.set(!template.audioQuestion.get());
		Session.set('audioQuestionStatus', (!Session.get('audioQuestionStatus')));
 
		
	},
	'click .answerToggleSwitch' (event, template){

		
		var answerToggleButton = document.getElementById("answerToggleButton");
  
		answerToggleButton.classList.toggle('answerSecondaryTogglePosition');
		template.audioAnswer.set(!template.audioAnswer.get());
		Session.set('audioAnswerStatus', template.audioAnswer.get());

		
		
 
		
	},
	'click .add-card-button' (event, template) {
		// template.audioQuestion.set(false);
		// template.audioAnswer.set(false);

	}
	
});
Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});


