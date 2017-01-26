import { Slingshot } from 'meteor/edgee:slingshot';

Slingshot.fileRestrictions('myFileUploads', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'application/pdf'],
  maxSize: 100 * 1024 * 1024, // 100 MB (use null for unlimited).
});
