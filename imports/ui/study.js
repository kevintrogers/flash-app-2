import "./study.html";
import "./timer.js";

import { CardSets } from "../api/cards.js";

let setChosen, tempCardStackId;
let emptyCardStackCheck = false;
let counter = 0;
let cardsViewed = 0;
let cardsMastered = 0;

Template.study.onCreated(function () {
  this.setChosen = new ReactiveVar(false);
  this.cardStackId = new ReactiveVar();
  this.cardStackLength = new ReactiveVar();
  this.currentCardKey = new ReactiveVar();
  this.currentCardAnswer = new ReactiveVar();
  this.currentKeyBoolean = new ReactiveVar();
  this.audioKeyBoolean = new ReactiveVar();
  this.audioAnswerBoolean = new ReactiveVar();
  this.currentCard = new ReactiveVar();
  this.htmlCounter = new ReactiveVar(0);
  this.cardsViewed = new ReactiveVar(0);
  this.cardsMastered = new ReactiveVar(0);
  this.cardStackItems = new ReactiveVar();
  this.percentage = new ReactiveVar(0);
  this.emptyCardStack = new ReactiveVar();
  this.frontSide = new ReactiveVar(true);
  Meteor.subscribe("cardSets");
  Meteor.subscribe("cardStackItems");
});

// Template.currentCardItem.onCreated(function () {

// });

function cardStackLength() {
  var count = 0;
  var theItems = CardSets.findOne({ _id: tempCardStackId });
  for (i = 0; i < theItems.cards.length; i++) {
    if (theItems.cards[i].keepInSet == true) {
      count++;
    }
  }
  return count;
}

function cardStack() {
  var cardStack = CardSets.findOne({ _id: tempCardStackId });
  Template.instance().emptyCardStack.get();
  return cardStack;
}

function counterDown() {
  var cardStackItem = cardStack();
  var length = fullCardStackLength();
  console.log(counter);
  if (counter > 0) {
    counter--;
  } else {
    counter = length - 1;
  }

  if (cardStackItem.cards[counter].keepInSet == false) {
    counterDown();
  }
}

function counterUp() {
  var cardStackItem = cardStack();
  var length = fullCardStackLength();
  console.log(counter);

  if (counter < length - 1) {
    counter++;
  } else {
    counter = 0;
  }

  if (emptyCardStackCheck) {
    counterUp();
  }
}

function fullCardStackLength() {
  fullCardStackItems = CardSets.findOne({ _id: tempCardStackId });
  var l = fullCardStackItems.cards.length;
  return l;
}



Template.study.helpers({
  cardSets() {
    return CardSets.find({}, { sort: { createdAt: -1 } });
  },

  cardStackId() {
    return Template.instance().cardStackId.get();
  },

  setChosen() {
    setChosen = Template.instance().setChosen.get();
    return setChosen;
  },
  activeStackLength() {
    return cardStackLength();
  },

  previousCard() {
    return CardSets.findOne({ _id: tempCardStackId });
  },
  nextCard() {
    return CardSets.findOne({ _id: tempCardStackId });
  },

  currentKeyBoolean() {
    var i = Template.instance().htmlCounter.get();
    var cardStackItem = cardStack();
    Template.instance().currentKeyBoolean.set(
      cardStackItem.cards[i].audioKeyBoolean
    );
    currentKeyBoolean = Template.instance().currentCard.get();
    return currentKeyBoolean;
  },

  audioKeyBoolean() {
    var i = Template.instance().htmlCounter.get();
    var cardStackItem = cardStack();
    Template.instance().audioKeyBoolean.set(
      cardStackItem.cards[i].audioKeyBoolean
    );
    audioKeyBoolean = Template.instance().audioKeyBoolean.get();
    return audioKeyBoolean;
  },
  audioAnswerBoolean() {
    var i = Template.instance().htmlCounter.get();
    var cardStackItem = cardStack();
    Template.instance().audioAnswerBoolean.set(
      cardStackItem.cards[i].audioAnswerBoolean
    );
    audioKAnswerBoolean = Template.instance().currentCardKey.get();
    return audioAnswerBoolean;
  },
  currentCard() {
    var i = Template.instance().htmlCounter.get();
    var cardStackItem = cardStack();
    Template.instance().currentCard.set(cardStackItem.cards[i]);
    currentCard = Template.instance().currentCard.get();
    return currentCard;
  },
  htmlCounter() {
    htmlCounter = Template.instance().htmlCounter.get();
    return htmlCounter;
  },
  cardsViewed() {
    cardsViewed = Template.instance().cardsViewed.get();
    return cardsViewed;
  },
  cardsMastered() {
    cardsMastered = Template.instance().cardsMastered.get();
    return cardsMastered;
  },
  percentage() {
    var cardsMastered = Template.instance().cardsMastered.get();
    var cardsViewed = Template.instance().cardsViewed.get();
    var percentage = (cardsMastered / cardsViewed) * 100;
    return percentage + "%";
  },
  cardStackItems() {
    cardStackItems = CardSets.findOne({ _id: tempCardStackId });
    return cardStackItems;
  },
  frontSide() {
    frontSide = Template.instance().frontSide.get();
    return frontSide;
  },
  emptyCardStack() {
    if (cardStackLength() > 0) {
      Template.instance().emptyCardStack.set(false);
    } else {
      Template.instance().emptyCardStack.set(true);
    }
    return Template.instance().emptyCardStack.get();
  },
});

// Template.currentCardItem.helpers({

// })

Template.study.events({
  "click #studyButton"(event, template) {
    template.setChosen.get();
    template.setChosen.set(!this.setChosen);
    tempCardStackId = this._id;
    template.cardStackId.set(this._id);
    template.cardStackId.get();
    tempCardStackId = template.cardStackId.get();

    event.preventDefault();
  },
  "click #counterDownButton"(event, template) {
    counterDown();
    template.htmlCounter.set(counter);
    cardsViewed++;
    template.cardsViewed.set(cardsViewed);
    console.log('after counter down: ' + counter);
  },
  "click #counterUpButton"(event, template) {
    counterUp();
    template.htmlCounter.set(counter);
    cardsViewed++;
    template.cardsViewed.set(cardsViewed);
    console.log('emptyCardStackCheck :' + template.emptyCardStack.get());
    console.log('after counter up: ' + counter);
  },
  "click .removeBox"(event, template) {
    var indexString = "cards." + parseInt(counter) + ".keepInSet";
    const target = event.target;

    const checkboxes = document.querySelectorAll("input[type='checkbox']");

    const flashCard = document.getElementById("flashCard");
    console.log('before' + counter);

    CardSets.update(
      { _id: tempCardStackId },
      { $set: { [indexString]: false } }
    );
    emptyCardStackCheck = template.emptyCardStack.get();
    
    counterUp();
    cardsViewed++;
    template.cardsViewed.set(cardsViewed);
    cardsMastered++;
    template.cardsMastered.set(cardsMastered);
    console.log('after ' + counter);
    template.htmlCounter.set(counter);
    template.currentCard.get();
  },

  "click #resetStudyButton"(event, template) {
    console.log(cardStackLength());
    var l = fullCardStackLength();
    for (i = 0; i < l; i++) {
      CardSets.update(
        { _id: tempCardStackId },
        { $set: { ["cards." + i + ".keepInSet"]: true } }
      );
    }
    counter = 0;
    template.htmlCounter.set(counter);
  },

  "click #flipButton"(event, template) {
    template.frontSide.set(!template.frontSide.get());
    console.log(template.frontSide.get());
    event.preventDefault();
  },
  "click #sendReportButton"(event, template) {
  
  },
});

