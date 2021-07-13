import { Template } from 'meteor/templating';

import './editCardSet.html';
import { CardSets } from '../api/cards.js';
import { Cards } from '../api/cards.js';

Meteor.subscribe('cardSets');
Meteor.subscribe('cards');

let updateId;
Template.editCardSet.onCreated(function() {
	this.updateSetId = new ReactiveVar(this._id);
	

});


Template.editCardSet.helpers({

	currentSetName() {
		var findCollection = CardSets.find({_id: Session.get('currentEditId')});
		var setName = findCollection.name;
		return setName;
	},
	currentCreatedCards() {	 
		
		return CardSets.findOne({_id: Session.get('currentEditId')});
		
	},
	editModeValue() {
	var parentView = Blaze.currentView.parentView.parentView;
    var parentInstance = parentView.templateInstance();
    return parentInstance.editMode.get();
		
	}
	
});

Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});

Template.editCardSet.events ({
	'click .add-edit-card-button'(event, template){
	 const target = event.target;
	
      const key = document.getElementById("key").value;

	  const answer = document.getElementById("answer").value;


		
		let card = { 'key': key,
					'answer': answer,
					'removeFromSet': false,
					'setId': this._id
				   };
	
		CardSets.update( {_id: this._id}, {
      	$push: { cards: card},
    	});
			
	  document.getElementById("key").value = '';
	  document.getElementById("answer").value = '';
		
	},
	'click .finish-edit-button'(event, template){
	  const target = event.target;
				
	  const name = document.getElementById("name").value;
	
      const description = document.getElementById("description").value;

	  const key = document.getElementById("key").value;
		
	  const answer = document.getElementById("answer").value;
		
	  var updateKey = document.querySelectorAll("input[name='updateKey']");
	  var updateAnswer = document.querySelectorAll("input[name='updateAnswer']");

		
		let updateCards = [];
	
for (i = 0; i < updateKey.length; i++) {
    updateCards.push( {
		'key': updateKey[i].value,
		'answer': updateAnswer[i].value
	
	
	})
}
		console.log(updateCards);
		
		CardSets.update ( {_id:this._id}, {
      	$set: { name: name,
			   description: description,
			cards: updateCards},
				
    	});		
	var parentView = Blaze.currentView.parentView.parentView;
    var parentInstance = parentView.templateInstance();
    return parentInstance.editMode.set(false);
		
	},
	'click #delete-card-button'(event, template){
		event.preventDefault();
		
		const target = event.target;
			
		const cardToDelete = target.value;
	
		var tempId = Session.get('currentEditId')
		
		
		CardSets.update( {_id: tempId}, {
      	$pull: { cards: { 'key': cardToDelete} }				
    	});	
		Session.set('currentEditId', '');
	}
})