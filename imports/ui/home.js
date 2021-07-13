import './home.html';
import { CardSets } from '../api/cards.js'; 

Template.home.helpers({
	cardSetsLength() {
        return CardSets.find().count();
      }
});