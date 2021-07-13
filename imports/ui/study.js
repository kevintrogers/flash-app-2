import './study.html';

import { CardSets } from '../api/cards.js'; 

Template.study.onCreated(function() {
	this.setChosen = new ReactiveVar(false);
	this.cardStackId = new ReactiveVar(null);
	 
	Meteor.subscribe('cardSets');
	Meteor.subscribe('cardStackItems');
});

Template.cardItem.onCreated(function() {
	this.frontSide = new ReactiveVar(true);
	
})

let setChosen, tempCardStackId;
let counter = 0;

Template.study.helpers({
	cardSets() {
        return CardSets.find({}, { sort: { createdAt: -1 } });
      },	

	cardStackId(){
		return Template.instance().cardStackId.get();
	
	},
	setChosen(){
		setChosen = Template.instance().setChosen.get();
		return setChosen;
	},
	cardStackItems() { 	
		return CardSets.findOne({_id: tempCardStackId});
		
	}
		});

Template.cardItem.helpers({
		frontSide(){
		frontSide = Template.instance().frontSide.get();
		return frontSide;
	},

	
})


Template.study.events({
    'click #studyButton'(event, template) {
		
	  template.setChosen.get();
	  template.setChosen.set(!this.setChosen);
		tempCardStackId = this._id;
	template.cardStackId.set(this._id);
		template.cardStackId.get();
		tempCardStackId = template.cardStackId.get();
		
      event.preventDefault();

	},
		'click .removeBox'(event, template) {
		const target = event.target;
		
		const checkboxes = document.querySelectorAll("input[type='checkbox']");
		
		const flashCard = document.getElementById("flashCard");
		
// 		checkboxes.forEach((box) => {
// 			var id = template.cardStackId.get();
//        if (box.checked === true){
// 		   CardSets.update( {_id: id}, {
// 				$set: { cards: { 'keepInSet': false} }				
// 				});}
// });
	}
	
		
	});

Template.cardItem.events({
	'click #flipButton'(event, template) {
		template.frontSide.get();
		template.frontSide.set(!frontSide);
		template.frontSide.get();
		event.preventDefault();		
	},


	
})



