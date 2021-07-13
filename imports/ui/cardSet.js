   import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import './cardSet.html';
import './editCardSet.js';

import { CardSets } from '../api/cards.js';
Meteor.subscribe('cardSets');

let editMode;


Template.cardSet.onCreated(function() {
	this.editMode = new ReactiveVar(false);

  
});

Template.cardSet.helpers({
	editMode(){
		editMode = Template.instance().editMode.get();
		return editMode;
	},
	
	

});
Template.editCardSet.helpers({
		currentEditId(){
		return Session.get('currentEditId');
	}
})
 
Template.cardSet.events({
  'click .delete'() {
    CardSets.remove(this._id);
  },
  'click .edit'(event, template) {
	  template.editMode.set(true);
	  Session.set('currentEditId', this._id);
	  
  }
});