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
	this.audioAnswerRecorder = new ReactiveVar();
	this.audioQuestionSource = new ReactiveVar();
	this.audioAnswerSource = new ReactiveVar();
	this.audioQuestionStatus = new ReactiveVar(false);
	this.audioAnswerStatus = new ReactiveVar(false);
	this.keyEstablished = new ReactiveVar(false);
	this.answerEstablished = new ReactiveVar(false);
	this.audioQuestionFormat = new ReactiveVar();
	this.audioAnswerFormat = new ReactiveVar();	
	this.randomKeyId = new ReactiveVar();
	this.randomAnswerId = new ReactiveVar();	
	this.tempCard = new ReactiveVar();
	this.index = new ReactiveVar(0);
	this.editQuestionAudioSource = new ReactiveVar();
	this.editAnswerAudioSource = new ReactiveVar();
	

});

var editQuestionAudioArray = [];
var editAnswerAudioArray = []; 

function audioQuestionChecker() {
	var findCollection = CardSets.findOne({_id: Session.get('currentEditId')})
	var audioQuestion = findCollection.keyFormat;
	Template.instance().audioQuestionFormat.set(audioQuestion);
	return audioQuestion;

}

function audioAnswerChecker() {
	
	var findCollection = CardSets.findOne({_id: Session.get('currentEditId')});
	var audioAnswer = findCollection.answerFormat;	
	Template.instance().audioAnswerFormat.set(audioAnswer);	
	return audioAnswer;

}

let setCreated;
let tempId;

Template.body.helpers({
	cardSets() {
		//create tempId variable or filter by user
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
	audioAnswerRecorder() {
		var audioRecorder = Template.instance().audioAnswerRecorder.get();
		return audioRecorder;
	},
	audioChunks() {
		var audioChunks = Template.instance().audioChunks.get();
		return audioChunks;
	},
	audioQuestionSource() {
		var audioQuestionSource = Template.instance().audioQuestionSource.get();
		return audioQuestionSource;
	},
	audioAnswerSource() {
		var audioAnswerSource = Template.instance().audioAnswerSource.get();
		return audioAnswerSource;
	},
	editQuestionAudioSource() {
		return Session.get('editQuestionAudioSource');
	},
	editAnswerAudioSource(){
		return Session.get('editAnswerAudioSource');
	},
	audioQuestionStatus(){
		//access keyFormat use edit cardset as guide
		return Template.instance().audioQuestionStatus.get();
	},
	audioAnswerStatus(){

		//access AnswerFormat use edit cardset as guide
		return Template.instance().audioAnswerStatus.get();
	},
	audioQuestionFormat() {

		var findCollection = CardSets.findOne({_id: Session.get('currentEditId')})
		var audioQuestion = findCollection.keyFormat;
		Template.instance().audioQuestionFormat.set(audioQuestion);
		return Template.instance().audioQuestionFormat.get();
	},
	audioAnswerFormat() {		
		
		var findCollection = CardSets.findOne({_id: Session.get('currentEditId')});
		var audioAnswer = findCollection.answerFormat;		
		Template.instance().audioAnswerFormat.set(audioAnswer);
		return Template.instance().audioAnswerFormat.get();

	},
	keyEstablished() {
		return Template.instance().keyEstablished.get();
	  },
	  answerEstablished() {
		return Template.instance().answerEstablished.get();
	  },
	randomKeyId() {
		return Template.instance().randomKeyId.get();
	  },
	randomAnswerId() {
		return Template.instance().randomAnswerId.get();
	  },
	  tempCard() {
		return Template.instance().tempCard.get();
	  },
	  
	  
	 




});

Template.registerHelper('incremented', function (index) {
    index++;
	return index
});

Template.body.events({
	'submit .new-card-set'(event, template) {
		template.setCreated.get();

		template.setCreated.set(!this.setCreated);
		event.preventDefault();


		const target = event.target;
		const name = target.name.value;
		const description = target.description.value;
		const keyFormat = target.keyFormat.value;
		const answerFormat = target.answerFormat.value;
		template.audioQuestionStatus.set(keyFormat);
		console.log('keyFormat:' + keyFormat)
		template.audioAnswerStatus.set(answerFormat);
	

		var keyFormatFlag = $('[name="keyFormat"]').is(':checked');
		if ( !keyFormatFlag  ) {
			alert("Please choose a question format");
            return false;
        }

		var answerFormatFlag = $('[name="answerFormat"]').is(':checked');
		if ( !answerFormatFlag) {
			alert("Please choose an answer format.");
            return false;
        }
		var searchable;
		var searchableCheck = document.getElementById('searchable');
		if (searchableCheck.checked){
			searchable = true;
			
		} else {
			searchable = false;

		}
		if (answerFormatFlag && keyFormatFlag) {
		CardSets.insert({
			name: name,
			description: description,
			createdAt: new Date(),
			createdBy: Meteor.userId(),
			username: Meteor.user().username,
			searchable: searchable,
			keyFormat: JSON.parse(keyFormat),
			answerFormat: JSON.parse(answerFormat)
		

		});
	
		var findCollection = CardSets.find().fetch();
		var cardSetsLength = findCollection.length - 1;
		var myId = findCollection[cardSetsLength]._id;
		template.tempCardSetId.set(myId);

		tempId = template.tempCardSetId.get();


		target.name.value = '';
		target.description.value = '';
	}
	else {
		alert ("Please complete the form")
	}
	},
	'click .add-card-button'(event, template) {
		var card = {}
		Session.set('keyEstablished', false);
		 var audioQuestionStatus = JSON.parse(template.audioQuestionStatus.get());
		Session.set('answerEstablished', false);
		var audioAnswerStatus = JSON.parse(template.audioAnswerStatus.get());
		console.log('audioQuestionStatus:' + audioQuestionStatus)
		console.log('audioAnswerStatus:' + audioAnswerStatus)
		if (audioQuestionStatus) {
			console.log('if question status in true loop');
			var keyAudio = template.audioQuestionSource.get();

			client.uploadFile(keyAudio).then((file) => {
				Session.set("tempKeyUuId", file.uuid);
				console.log(Session.get("tempKeyUuId"));
				tempKeyUuId = Session.get("tempKeyUuId");
				var randomId = template.randomKeyId.get();
				trueKey = "https://ucarecdn.com/" + tempKeyUuId + "/" + randomId;
				console.log(trueKey);
				card.key = trueKey;
				card.audioKeyBoolean = true;
				template.tempCard.set(card);
				Session.set('keyEstablished', true);
				console.log('keyEstablished in async function' + Session.get( 'keyEstablished'))
				
			});
		} else {
			console.log('if question status in false loop');
			card.key = document.getElementById("key").value;
			card.audioKeyBoolean = false;
			Session.set('keyEstablished', true);
		}
		console.log('audioAnswerstatus: ' + audioAnswerStatus);
		if (audioAnswerStatus) {
			var tempAnswerUuId;
			var answerAudio = template.audioAnswerSource.get();
			console.log('answer audio :' + answerAudio);
			client.uploadFile(answerAudio).then((file) => {
				Session.set("tempAnswerUuId", file.uuid);
				console.log(Session.get("tempAnswerUuId"));
				tempAnswerUuId = Session.get("tempAnswerUuId");
				var randomId = template.randomAnswerId.get();
				trueAnswer = "https://ucarecdn.com/" + tempAnswerUuId + "/" + randomId;
				card.answer = trueAnswer;
				card.audioAnswerBoolean = true;
				template.tempCard.set(card);
				Session.set('answerEstablished', true);
				console.log('answerEstablished in async function' + Session.get( 'answerEstablished'))
				
			});
		} else {
			card.answer = document.getElementById("answer").value;
			card.audioAnswerBoolean = false;
			Session.set('answerEstablished', true);
		}

		
				
		var keyInitiziationInterval = setInterval(initializationCheck, 300);
		function initializationCheck() {
			var keyInitialized = Session.get('keyEstablished');
			var answerInitialized = Session.get('answerEstablished');
			console.log('init check')
			var cardString = JSON.stringify(card);
			console.log (cardString);
			console.log('keyEstablished outside async function' + keyInitialized+ Session.get( 'keyEstablished'))
			console.log('answerEstablished outside async function' + answerInitialized + Session.get( 'answerEstablished'))
		if(keyInitialized && answerInitialized){
			clearInterval(keyInitiziationInterval);
		
		console.log ('key Initialized:' + keyInitialized);
		console.log ('answer Initialized:' + answerInitialized);
		console.log ('inside if statement' + cardString);
		CardSets.upsert({ _id: tempId }, {
			$push: { cards: card},
		
		
	});
}
		}

		


if (audioQuestionStatus) {
	var questionRecordedAudio = document.getElementById('questionRecordedAudio');
	questionRecord.style.background ="lightgrey";
	questionRecordedAudio.controls = false;
	questionRecordedAudio.src = '';

} else {
	document.getElementById("key").value = '';
}

if (audioAnswerStatus) {
		var answerRecordedAudio = document.getElementById('answerRecordedAudio');
		answerRecord.style.background ="lightgrey";
		answerRecordedAudio.controls = false;
		answerRecordedAudio.src = '';
} else {
		
				document.getElementById("answer").value = '';
}

	},
	'click .add-edit-card-button'(event, template){
		var card = {}
		Session.set('keyEstablished', false);
		Session.set('answerEstablished', false);
		console.log(Session.get('currentEditId'));
		aFormat = audioAnswerChecker();
		qFormat = audioQuestionChecker();
		if (qFormat) {
			var keyAudio = template.audioQuestionSource.get();
			client.uploadFile(keyAudio).then((file) => {
				Session.set("tempKeyUuId", file.uuid);
				tempKeyUuId = Session.get("tempKeyUuId");
				var randomId = template.randomKeyId.get();
				trueKey = "https://ucarecdn.com/" + tempKeyUuId + "/" + randomId;
				card.key = trueKey;
				card.audioKeyBoolean = true;
				template.tempCard.set(card);
				Session.set('keyEstablished', true);
			});
		} else {
			card.key = document.getElementById("key").value;
			card.audioKeyBoolean = false;
			Session.set('keyEstablished', true);
		}
		
		if (aFormat) {
			var answerAudio = template.audioAnswerSource.get();
			client.uploadFile(answerAudio).then((file) => {
				Session.set("tempAnswerUuId", file.uuid);
				tempAnswerUuId = Session.get("tempAnswerUuId");
				var randomId = template.randomAnswerId.get();
				trueAnswer = "https://ucarecdn.com/" + tempAnswerUuId + "/" + randomId;
				card.answer = trueAnswer;
				card.audioAnswerBoolean = true;
				template.tempCard.set(card);
				Session.set('answerEstablished', true);
				
			});
		} else {
			// trueAnswer = answer; 
			card.answer = document.getElementById("answer").value;
			card.audioAnswerBoolean = false;
			Session.set('answerEstablished', true);
		}

		
				
		var keyInitiziationInterval = setInterval(initializationCheck, 300);
		function initializationCheck() {
			var keyInitialized = Session.get('keyEstablished');
			var answerInitialized = Session.get('keyEstablished');
		console.log('key Initialized: ' + keyInitialized)	
		console.log('answer Initialized: ' + answerInitialized)			
		if(keyInitialized && answerInitialized){
			clearInterval(keyInitiziationInterval);
		
console.log(card);
	var tempId = Session.get('currentEditId')
	CardSets.upsert({ _id: tempId }, {
		$push: { cards: card},
	});
	
}
		}

		if (template.audioQuestionStatus.get()){
			template.audioKeyBoolean.set('false');
			Session.set('answerAudioBoolean', false);
			template.audioAnswerBoolean.set('false');
			Session.set('answerAudioBoolean', false);
		document.getElementById("key").value = '';
		document.getElementById("answer").value = '';
	}
	

	},
	'click #questionRecord'(event, template) {
		let recorder;
		var recordingSession = template.recordingSession.get();
		var questionRecord = document.getElementById('questionRecord');


	template.recordingSession.set(!recordingSession)
	if (recordingSession) {
		console.log(recordingSession);
		var audioRecorder = template.audioRecorder.get();
		console.log("we do not have a recording session!");
		audioRecorder.stop();
		console.log(audioRecorder.state);
		
		  questionRecord.style.background ="red";
	} else {
		console.log(recordingSession);
		console.log("there is recording being done!");
		questionRecord.style.background ="green";
		navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(function(stream) {
            recorder = new MediaRecorder(stream);
            //add blob
			
			recorder.ondataavailable = function(e) {
				let audioChunks =[];
				audioChunks.push(e.data);
				let blob = new Blob(audioChunks,{type:'audio/mpeg'})
                var url = URL.createObjectURL(blob);

				let randomFileName = Date.now();
				template.randomKeyId.set(randomFileName);
				blob.lastModified = randomFileName;
				blob.name = randomFileName;
				template.randomKeyId.set(randomFileName);
				
				var questionRecordedAudio = document.getElementById('questionRecordedAudio');
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


	'click #answerRecord'(event, template) {
		let recorder;
		var recordingSession = template.recordingSession.get();
		var answerRecord = document.getElementById('answerRecord');

	template.recordingSession.set(!recordingSession)
	if (recordingSession) {
		var audioRecorder = template.audioAnswerRecorder.get();
		audioRecorder.stop();
		
		  answerRecord.style.background ="red";
	} else {
		answerRecord.style.background ="green";
		navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(function(stream) {
            recorder = new MediaRecorder(stream);
            //add blob
			
			recorder.ondataavailable = function(e) {
				let audioChunks =[];
				audioChunks.push(e.data);
				let blob = new Blob(audioChunks,{type:'audio/mpeg'})
                var url = URL.createObjectURL(blob);

				var randomFileName = Date.now();
				template.randomAnswerId.set(randomFileName);
				blob.lastModified = randomFileName;
				blob.name = randomFileName;
				template.randomAnswerId.set(randomFileName);
				
				var answerRecordedAudio = document.getElementById('answerRecordedAudio');
                answerRecordedAudio.controls = true;
                answerRecordedAudio.src = url;
				template.audioAnswerSource.set(blob);
				console.log('URL:' + url);
				console.log('blob:' + blob);
            };
			template.audioAnswerRecorder.set(recorder);
            recorder.start();
          console.log(recorder.state);
        });
    
	}

	

	},
	'click #editQuestionRecord'(event, template) {
		const target = event.target;		
		const buttonName = target.name;
		const suffix = parseInt(buttonName.substr(9), 10);
		let recorder;
		var recordingSession = template.recordingSession.get();
		var questionRecordGroup = document.getElementsByName(buttonName);
		var questionRecord = questionRecordGroup[0];


	template.recordingSession.set(!recordingSession)
	if (recordingSession) {
		var audioRecorder = template.audioRecorder.get();
		audioRecorder.stop();
		
		  questionRecord.style.background ="red";
	} else {
		questionRecord.style.background ="green";
		navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(function(stream) {
            recorder = new MediaRecorder(stream);
            //add blob
			
			recorder.ondataavailable = function(e) {
				let audioChunks =[];
				audioChunks.push(e.data);
				let blob = new Blob(audioChunks,{type:'audio/mpeg'})
                var url = URL.createObjectURL(blob);

				let randomFileName = Date.now();
				template.randomKeyId.set(randomFileName);
				blob.lastModified = randomFileName;
				blob.name = randomFileName;
				blob.index = suffix;
				console.log('blob index' + blob.index);
				template.randomKeyId.set(randomFileName);
				
				var questionRecordedAudio = document.getElementById("updateQuestionRecordedAudio" + suffix);
				questionRecordedAudio.controls = true;
                questionRecordedAudio.src = url;
				template.audioQuestionSource.set(blob);
				for (i=0; i < editQuestionAudioArray.length; i++) {
					if (editQuestionAudioArray[i].index === suffix) {
						editQuestionAudioArray.splice(i, 1);
					}
				}
				editQuestionAudioArray.push(blob);
				console.log('editQuestionAudioArray')
				console.log(editQuestionAudioArray)
            };
			template.audioRecorder.set(recorder);
            recorder.start();
          console.log(recorder.state);
        });
    
	}

},


	'click #editAnswerRecord'(event, template) {
		const target = event.target;
		const buttonName = target.name;
		const suffix = parseInt(buttonName.substr(12), 10);
		let recorder;
		var recordingSession = template.recordingSession.get();
		var answerRecordGroup = document.getElementsByName(buttonName);
		var answerRecord = answerRecordGroup[0];

	template.recordingSession.set(!recordingSession)
	if (recordingSession) {
		var audioRecorder = template.audioAnswerRecorder.get();
		audioRecorder.stop();
		
		  answerRecord.style.background ="red";
	} else {
		answerRecord.style.background ="green";
		navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(function(stream) {
            recorder = new MediaRecorder(stream);
            //add blob
			
			recorder.ondataavailable = function(e) {
				let audioChunks =[];
				audioChunks.push(e.data);
				let blob = new Blob(audioChunks,{type:'audio/mpeg'})
                var url = URL.createObjectURL(blob);

				var randomFileName = Date.now();
				template.randomAnswerId.set(randomFileName);
				blob.lastModified = randomFileName;
				blob.name = randomFileName;
				blob.index = suffix;
			
				var answerRecordedAudio = document.getElementById('updateAnswerRecordedAudio' + suffix);
                answerRecordedAudio.controls = true;
                answerRecordedAudio.src = url;
				template.audioAnswerSource.set(blob);
				for (i=0; i < editAnswerAudioArray.length; i++) {
					if (editAnswerAudioArray[i].index === suffix) {
						editAnswerAudioArray.splice(i, 1);
					}
				}
				editAnswerAudioArray.push(blob);
				console.log('editAnswerArray :');
				console.log( editAnswerAudioArray)
            };
			template.audioAnswerRecorder.set(recorder);
            recorder.start();
          console.log(recorder.state);
        });
    
	}

	

	},


	'click .finish-button'(event, template) {

		template.setCreated.set(!setCreated);
		tempId = '';

	},
	'click .finish-edit-button'(event, template){
		const target = event.target;
		Session.set('keyEstablished', false);
	   Session.set('answerEstablished', false);
	   var trueKey, trueAnswer;
	   		  var updateCards = [];
		  var card = {};
				  
		const name = document.getElementById("name").value;

		const description = document.getElementById("description").value;
		 qFormat = audioQuestionChecker();
		aFormat = audioAnswerChecker();
  
		var updateKey = document.querySelectorAll("input[name='updateKey']");
		var updateAnswer = document.querySelectorAll("input[name='updateAnswer']");
		var updateAudioKey = document.querySelectorAll("audio[name='updateAudioKey']");
		var updateAudioAnswer = document.querySelectorAll("audio[name='updateAudioAnswer']");
		console.log('updateAudioKey' + updateAudioKey);
  
console.log('qformat' + qFormat);
for (i = 0; i < editQuestionAudioArray.length; i++){
	var keyAudio = editQuestionAudioArray[i];
	console.log('editarrayelement' + JSON.stringify(editQuestionAudioArray[i].index));
	console.log('keyAudio' + keyAudio);
	client.uploadFile(keyAudio).then((file) => {
		Session.set("tempKeyUuId", file.uuid);
		console.log(Session.get("tempKeyUuId"));
		tempKeyUuId = Session.get("tempKeyUuId");
		var randomId = template.randomKeyId.get();
		trueKey = "https://ucarecdn.com/" + tempKeyUuId + "/" + randomId;
		template.tempCard.set(card);
		Session.set('keyEstablished', true);
		console.log('editQuestionAudioArray' + JSON.stringify(keyAudio));
		var tempIndex = JSON.stringify(keyAudio.index)
		console.log('tempIndex: ' + tempIndex);

		/*here is the problem. need to  set src for audio elements
		also on finished non edited elements should remain the same*/
		var questionAudioSource = document.getElementById('updateQuestionRecordedAudio' + tempIndex);
		console.log(questionAudioSource);
		questionAudioSource.src = trueKey;
		
			});
	}
	  if (qFormat){
		  for (i=0; i < updateAudioKey.length; i++){
			card.key = updateAudioKey[i].currentSrc;
			card.audioKeyBoolean = true;  
			updateCards.push(card);
			console.log(card);
			console.log(updateCards);
		  }
	  
	  
	  }
 
	  if (aFormat){
}
			



	
	//   var editId = Session.get('currentEditId');
	// 	  CardSets.upsert ( {_id: editId}, {
	// 		$set: { name: name,
	// 			 description: description,
	// 		  cards: updateCards},
				  
	// 	  });		
	
	// Session.set('editMode', false);
	  },


});

