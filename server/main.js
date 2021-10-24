import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

WebApp.connectHandlers.use('/hello', (req, res, next) => {
  res.writeHead(200);
  res.end('Hello world from your server');
});


import '../imports/api/cards.js';


Meteor.startup(() => {


});