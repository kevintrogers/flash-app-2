import { Mongo } from 'meteor/mongo';
import { FilesCollection } from 'meteor/ostrio:files';
import { MongoInternals } from 'meteor/mongo';

export const createBucket = bucketName => {
  const options = bucketName ? {bucketName} : (void 0);
  return new MongoInternals.NpmModule.GridFSBucket(MongoInternals.defaultRemoteCollectionDriver().mongo.db, options);
}

const AudioClips = new FilesCollection({
  collectionName: 'AudioClips',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /mp3/i.test(file.extension)) {
      return true;
    }
    return 'Please upload audio, with size equal or less than 10MB';
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.audioclips.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.audioclips.all', function () {
    return AudioClips.find().cursor;
  });
}


 
export const CardSets = new Mongo.Collection('cardSets');
// export const Cards = new Mongo.Collection('cards');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('cardSets', function tasksPublication() {
      return CardSets.find();

    });


  }
 