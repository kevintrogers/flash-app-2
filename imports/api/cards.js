import { Mongo } from 'meteor/mongo';


 
export const CardSets = new Mongo.Collection('cardSets');
export const Cards = new Mongo.Collection('cards');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('cardSets', function tasksPublication() {
      return CardSets.find();

    });
	    Meteor.publish('cards', function tasksPublication() {
      return Cards.find();

    });

  }
 