import { Mongo } from 'meteor/mongo';

import UploadClient from '@uploadcare/upload-client'

const client = new UploadClient({ publicKey: '7284c98dd9b56f6e7489' })
     

export const CardSets = new Mongo.Collection('cardSets');
export const AudioCollections = new Mongo.Collection('audioCollections');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('cardSets', function tasksPublication() {
      return CardSets.find();

    });


  }

  Meteor.methods({
    'cardSets.insertCard'(id, card){
      CardSets.upsert({ _id: id }, {
        $push: { cards: card },
      });

      

    }

  });
 