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
    'audioCollections.insertQuestionAudio'(questionAudio){

      // var randomFileName = Date.now();
			// var keyAudio = questionAudio;
			// var audioFile = new File([keyAudio], randomFileName + '.mp3', { type: 'audio/mpeg' })
			// console.log(audioFile)
try{
    client
      .uploadFile(audioFile)
      .then(file => console.log(file.uuid))

console.log(keyAudio)
} 
catch (e){
  console.log(e);
}
      

    }

  });
 