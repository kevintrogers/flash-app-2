import { Template } from 'meteor/templating';

import UploadClient from '@uploadcare/upload-client'
const client = new UploadClient({ publicKey: '7284c98dd9b56f6e7489' })

import './editCardSet.html';
import './cardSet.js';
import { CardSets } from '../api/cards.js';

Session.set('audioQuestionStatus', false);
Session.set('audioAnswerStatus', false);

Meteor.subscribe('cardSets');
Meteor.subscribe('cards');

var qFormat, aFormat, editId;
Template.editCardSet.onCreated(function() {
	this.updateSetId = new ReactiveVar(this._id);
	this.editQuestionAudioSource = new ReactiveVar();
	this.editAnswerAudioSource = new ReactiveVar();
	this.editRandomQuestionId = new ReactiveVar();
	this.editRandomAnswerId = new ReactiveVar();


});

var editQuestionArray =[];
var editAnswerArray = [];

Template.editCardSet.helpers({

	currentSetName() {
		var findCollection = CardSets.findOne({_id: Session.get('currentEditId')});
		var setName = findCollection.name;
		return setName;
	},
	currentCreatedCards() {	 
		var id = Session.get('currentEditId')
		editId = id;
		return CardSets.findOne({_id: id});		
		
	},
	editModeValue() {
	var parentView = Blaze.currentView.parentView.parentView;
    var parentInstance = parentView.templateInstance();
    return parentInstance.editMode.get();
		
	},

	editQuestionAudioSource() {
		return Session.get('editQuestionAudioSource');
	},
	editAnswerAudioSource(){
		return Session.get('editAnswerAudioSource');
	},
	editRandomQuestionId(){
		return Template.instance().editRandomQuestionId.get();
	},
	editRandomAnswerId(){
		return Template.instance().editRandomAnswerId.get();
	},


	
});



Template.editCardSet.events ({
			
	
	
	'click #editQuestionRecord'(event, template){
		const target = event.target;
		var questionIndex = target.name.substr(9);
		editQuestionArray.push(questionIndex);
		Session.set('editQuestionFieldArray', editQuestionArray);
	},
	'click #editAnswerRecord'(event, template){
		const target = event.target;
		var answerIndex = target.name.substr(9);
		editAnswerArray.push(answerIndex);
		Session.set('editAnswerFieldArray', editAnswerArray);
	},
	
	'click #delete-card-button'(event, template){
		event.preventDefault();
		
		const target = event.target;
			
		const cardToDelete = target.value;
		console.log(cardToDelete);
	
		var tempId = Session.get('currentEditId')
		console.log('editId :' + tempId);
		
		
		CardSets.update( {_id: tempId}, {
      	$pull: { cards: { 'key': cardToDelete} }				
    	});	
	}
})