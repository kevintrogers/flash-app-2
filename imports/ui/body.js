import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { CardSets } from '../api/cards.js'; 
import { Cards } from '../api/cards.js';

import './cardSet.js';
import './messages.js';
import './addCardForm.js';
import './footer.js';
import './home.js';
import './body.html';
import './study.js';
import './loading/loading.js'
import './help.js';

    Meteor.subscribe('cardSets');
	Meteor.subscribe('cards');
  

document.addEventListener("DOMContentLoaded", function(){
	$('.loader-wrapper').fadeOut('fast');

});



Template.body.onCreated(function() {
	this.setCreated = new ReactiveVar(false);
	this.tempCardSetId = new ReactiveVar(0);
	

});


let setCreated;
let tempId;

Template.body.helpers({
	cardSets() {
        return CardSets.find({}, { sort: { createdAt: -1 } });
      },
	setCreated(){
		setCreated = Template.instance().setCreated.get();
		return setCreated;
	},

});

Template.body.events({
    'submit .new-card-set'(event, template) {
	  template.setCreated.get();
		
	  template.setCreated.set(!this.setCreated);
      event.preventDefault();
  		
   
      const target = event.target;
      const name = target.name.value;
	  const description = target.description.value;
	 	
      CardSets.insert({
        name: name,
		description: description,
        createdAt: new Date(), 
		createdBy: Meteor.userId(),
        username: Meteor.user().username,
		searchable: 'false'
      });
		var findCollection = CardSets.find().fetch();
		var cardSetsLength = findCollection.length-1;
		var myId = findCollection[cardSetsLength]._id;
		template.tempCardSetId.set(myId);

		tempId = template.tempCardSetId.get();


      target.name.value = '';
	  target.description.value = '';
    },
	'click .add-card-button'(event, template){
		

	 const target = event.target;
	
      const key = document.getElementById("key").value;

	  const answer = document.getElementById("answer").value;



		let card = { 'key': key,
					'answer': answer,
					'keepInSet': true,
					'setId': tempId
				   };
		Cards.insert({
			 card
			
		})
		
		CardSets.upsert( {_id: tempId}, {
      	$push: { cards: card},
    	});
	  document.getElementById("key").value = '';
	  document.getElementById("answer").value = '';
		
	},
	'click .finish-button'(event, template){
		
		template.setCreated.set(!setCreated);
		tempId = '';		
		
	},

	
  });

