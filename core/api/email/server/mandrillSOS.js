import { Mongo } from 'meteor/mongo';

export const mandrillQueue = new Mongo.Collection('mandrill_queue');
