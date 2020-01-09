import { Mongo } from 'meteor/mongo';

export const mandrillQueue = new Mongo.Collection('mandrill_queue_01-2020');
