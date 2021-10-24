import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import UploadClient from '@uploadcare/upload-client'
const client = new UploadClient({ publicKey: '7284c98dd9b56f6e7489' })

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
Meteor.subscribe('AudioCollections');

document.addEventListener("DOMContentLoaded", function () {
	$('.loader-wrapper').fadeOut('fast');

});



Template.body.onCreated(function () {
	this.setCreated = new ReactiveVar(false);
	this.recordingSession = new ReactiveVar(false);
	this.tempCardSetId = new ReactiveVar(0);
	this.audioChunks = new ReactiveVar();
	this.audioRecorder = new ReactiveVar();
	this.audioQuestionSource = new ReactiveVar();
	this.audioAnswerSource = new ReactiveVar();
	this.audioQuestionStatus = new ReactiveVar(false);
	this.audioAnswerStatus = new ReactiveVar(false);
	this.currentUpload = new ReactiveVar(false);
	this.randomId = new ReactiveVar();

});


let setCreated;
let tempId;

Template.body.helpers({
	cardSets() {
		return CardSets.find({}, { sort: { createdAt: -1 } });
	},
	setCreated() {
		setCreated = Template.instance().setCreated.get();
		return setCreated;
	},
	recordingSession() {
		recordingSession = Template.instance().recordingSession.get();
		return recordingSession;
	},
	audioRecorder() {
		var audioRecorder = Template.instance().audioRecorder.get();
		return audioRecorder;
	},
	audioChunks() {
		var audioChunks = Template.instance().audioChunks.get();
		return audiochunks;
	},
	audioQuestionSource() {
		var audioQuestionSource = Template.instance().audioQuestionSource.get();
		return audioQuestionSource;
	},
	audioAnswerSource() {
		var audioAnswerSource = Template.instance().audioAnswerSource.get();
		return audioAnswerSource;
	},
	audioQuestionStatus(){
		return Session.get('audioQuestionStatus')
	},
	audioAnswerStatus(){
		return Session.get('audioAnswerStatus')
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
	  },
	randomId() {
		return Template.instance().randomId.get();
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
		var cardSetsLength = findCollection.length - 1;
		var myId = findCollection[cardSetsLength]._id;
		template.tempCardSetId.set(myId);

		tempId = template.tempCardSetId.get();


		target.name.value = '';
		target.description.value = '';
	},
	'click .add-card-button'(event, template) {

		const target = event.target;
		var tempUuId;
		
		// const answer = document.getElementById("answer").value;
		// const answerAudio = document.getElementById("answerRecordedAudio").value;
		var trueKey, trueAnswer, audioKey, audioAnswer;
		var audioQuestionStatus = Session.get('audioQuestionStatus');
		
		if (audioQuestionStatus) {
			
			var keyAudio = template.audioQuestionSource.get();
client
.uploadFile(keyAudio)
.then(file => Session.set('tempUuId', file.uuid))


			var tempUuId = Session.get('tempUuId');
			var randomId = template.randomId.get();
			https://ucarecdn.com/291f74d9-5523-4d4c-b68c-713ea67be2b5/1635026522581.mp3
			trueKey = "https://ucarecdn.com/" + tempUuId + '/' + randomId + '.mp3';
			audioKey = true;
			console.log(trueKey);
		} else {
			console.log(audioQuestionStatus);
			const key = document.getElementById("key").value;
			trueKey = key;
			audioKey = false;

			
		}

		if (audioQuestionStatus) {
			const questionAudio = template.audioQuestionSource.get();
			// Meteor.call('audioCollections.insertQuestionAudio', {
			// 	questionAudio: questionAudio
			//   }, (err, res) => {
			// 	if (err) {
			// 	  alert(err);
			// 	} else {
			// 	  // success!
			// 	}
			//   });

			
			
		
			

			
		} else {
			const answer = document.getElementById("answer").value;
			trueAnswer = answer;
		}

		
		let card = {
			'key': trueKey,
			'audioKey': audioKey,
			'answer': trueAnswer,
			'audioAnswer': audioAnswer,
			'keepInSet': true,
			// 'setId': tempId
		};


		CardSets.upsert({ _id: tempId }, {
			$push: { cards: card },
		});
		//key and answer values can't be null IF STATMENTS if(value)?
		if (template.audioQuestionStatus.get()){
		document.getElementById("key").value = '';
		document.getElementById("answer").value = '';
	}

	},
	'click #questionRecord'(event, template) {
		let recorder, gumStream;
		var recordingSession = template.recordingSession.get();



	template.recordingSession.set(!recordingSession)
	if (recordingSession) {
		var audioRecorder = template.audioRecorder.get();
		console.log("we do not have a recording session!");
		audioRecorder.stop();
		console.log(audioRecorder.state);
		
		//   gumStream.getAudioTracks()[0].stop();
		  questionRecord.style.background ="red";
	} else {
		console.log("there is recording being done!");
		questionRecord.style.background ="green";
		navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(function(stream) {
            gumStream = stream;
            recorder = new MediaRecorder(stream);
            //add blob
			
			recorder.ondataavailable = function(e) {
				let audioChunks =[];
				audioChunks.push(e.data);
				let blob = new Blob(audioChunks,{type:'audio/mpeg'})
                var url = URL.createObjectURL(blob);

				var randomFileName = Date.now();
				template.randomId.set(randomFileName);
				blob.lastModified = randomFileName;
				blob.name = randomFileName + '.mp3';
				
				
                questionRecordedAudio.controls = true;
                questionRecordedAudio.src = url;
				template.audioQuestionSource.set(blob);
				console.log('URL:' + url);
				console.log('blob:' + blob);
            };
			template.audioRecorder.set(recorder);
            recorder.start();
          console.log(recorder.state);
        });
    
	}

},


	'click #answerRecord'() {

	},

	'click .finish-button'(event, template) {

		template.setCreated.set(!setCreated);
		tempId = '';

	},


});

  //meteor method function handler use reactive method or other method

