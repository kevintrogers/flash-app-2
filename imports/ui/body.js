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
		var parentView = Blaze.currentView.parentView;
		var parentInstance = parentView.templateInstance();
		var status = parentInstance.audioQuestion.get();
		Template.instance().audioQuestionStatus.set(status);
		var audioQuestionStatus = Template.instance().audioQuestionStatus.get();
		return audioQuestionStatus;

	},
	audioAnswerStatus(){
		var parentView = Blaze.currentView.parentView;
		var parentInstance = parentView.templateInstance();
		var status = parentInstance.audioAnswer.get();
		Template.instance().audioAnswerStatus.set(status);
		var audioAnswerStatus = Template.instance().audioAnswerStatus.get();
		return audioAnswerStatus;
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
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
		var cardSetsLength = findCollection.length - 1;
		var myId = findCollection[cardSetsLength]._id;
		template.tempCardSetId.set(myId);

		tempId = template.tempCardSetId.get();


		target.name.value = '';
		target.description.value = '';
	},
	'click .add-card-button'(event, template) {

		const target = event.target;
		
		
		// const answer = document.getElementById("answer").value;
		// const answerAudio = document.getElementById("answerRecordedAudio").value;
		var trueKey, trueAnswer, audioKey, audioAnswer;
		var audioQuestionStatus = Session.get('audioQuestionStatus');
		
		if (audioQuestionStatus) {
			const keyAudio = template.audioQuestionSource.get();
			trueKey = keyAudio;
			audioKey = true;
		} else {
			console.log(audioQuestionStatus);
			const key = document.getElementById("key").value;
			trueKey = key;
			audioKey = false;

			
		}

		if (template.audioAnswerStatus.get()) {
			const answerAudio = document.getElementById("answerRecordedAudio").src;
			var ffmpeg = require('ffmpeg');

			try {
				var process = new ffmpeg(answerAudio);
				process.then(function(audio) {
					audio.fnExtractSoundToMP3(trueAnswer, function(error, file){
						if (!error)
							console.log('Audio file:' + file);
						});
					}, function (err) {
						console.log('error' + err);
					});
				}
				catch(e) {
					console.log(e.code);
					console.log(e.msg);
				}
			
		
			

			
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
				let blob = new Blob(audioChunks,{type:'audio/mpeg-3'})
                var url = URL.createObjectURL(blob);
                questionRecordedAudio.controls = true;
                questionRecordedAudio.src = url;
				template.audioQuestionSource.set(url);
				console.log(url);
				console.log(blob);
            };
			template.audioRecorder.set(recorder);
            recorder.start();
          console.log(recorder.state);
        });
    
	}
	// const upload = AudioClips.insert({
    //     file: e.currentTarget.files[0],
    //     chunkSize: 'dynamic'
    //   }, false);

    //   upload.on('start', function () {
    //     template.currentUpload.set(this);
    //   });

    //   upload.on('end', function (error, fileObj) {
    //     if (error) {
    //       alert(`Error during upload: ${error}`);
    //     } else {
    //       alert(`File "${fileObj.name}" successfully uploaded`);
    //     }
    //     template.currentUpload.set(false);
    //   });

    //   upload.start();
},


	'click #answerRecord'() {

	},

	'click .finish-button'(event, template) {

		template.setCreated.set(!setCreated);
		tempId = '';

	},


});

  //meteor method function handler use reactive method or other method

