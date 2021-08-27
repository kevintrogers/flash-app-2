import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { CardSets } from '../api/cards.js'; 

import './cardSet.js';
import './messages.js';
import './addCardForm.js';
import './footer.js';
import './home.js';
import './body.html';
import './study.js';
import './loading/loading.js'
import './help.js'

    Meteor.subscribe('cardSets');


    Template.body.onCreated = function() {
		
		  console.log('Template onLoad');
   
	navigator.mediaDevices.getUserMedia({audio:true})
	.then(stream => {handlerFunction(stream)})


		  function handlerFunction(stream) {
		  rec = new MediaRecorder(stream);
		  rec.ondataavailable = e => {
			audioChunks.push(e.data);
			if (rec.state == "inactive"){
			  let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
			  recordedAudio.src = URL.createObjectURL(blob);
			  recordedAudio.controls=true;
			  recordedAudio.autoplay=true;
			  sendData(blob)
			}
		  }
		}
			  function sendData(data) {}
	}


				 
	


document.addEventListener("DOMContentLoaded", function(){
	$('.loader-wrapper').fadeOut('fast');

});



Template.body.onCreated(function() {
	this.setCreated = new ReactiveVar(false);
	this.tempCardSetId = new ReactiveVar(0);
	
	this.audioStream = new ReactiveVar();
	this.audioRecorder = new ReactiveVar();

	// this.recordingState = new ReactiveVar(false);
	

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
	audioRecorder(){
		var audioRecorder = Template.instance().audioRecorder.get();
		return audioRecorder;
	},
	audioStream(){
		var audioStream = Template.instance().audioStream.get();
		return audioStream;
	}
	

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
					// 'setId': tempId
				   };
		
		
		CardSets.upsert( {_id: tempId}, {
      	$push: { cards: card},
    	});
	  document.getElementById("key").value = '';
	  document.getElementById("answer").value = '';
		
	},
	'click #questionRecord'(event, template){

		template.audioStream.set( navigator.mediaDevices.getUserMedia({audio:true})
		.then(stream => {handlerFunction(stream)}));

		function handlerFunction(stream) {
            template = new MediaRecorder(stream);
            rec.ondataavailable = e => {
              audioChunks.push(e.data);
              if (rec.state == "inactive"){
                let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
                questionRecordedAudio.src = URL.createObjectURL(blob);
                questionRecordedAudio.controls=true;
                questionRecordedAudio.autoplay=true;
                sendData(blob)
              }
            }
          }
                function sendData(data) {}
		
		audioChunks = [];
          rec.start();
		var questionStopRecord = document.getElementById("questionStopRecord");
		var questionRecord = document.getElementById("questionRecord");
		
		questionRecord.style.background = "none";
		questionStopRecord.style.background = "red";
		// FINISH INTEGRATING CODEPEN EXAMPLE INTO APP, make recording stop and 
		//controls display

		// const audioChunks = [];
		// mediaRecorder.start();

		// mediaRecorder.addEventListener("dataavailable", event => {
		//   audioChunks.push(event.data);
		// })
	

	},
	'click #questionStopRecord'(event, template){

		questionRecord.style.background = "green";
		questionStopRecord.style.background = "none";

		rec.stop();
	},
	'click #answerRecord'(){

	},
	'click #answerStopRecord'(){
		
		
	},
	'click .finish-button'(event, template){
		
		template.setCreated.set(!setCreated);
		tempId = '';		
		
	},

	
  });

