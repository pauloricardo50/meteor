import { Slingshot } from 'meteor/edgee:slingshot';

export const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];
export const maxSize = 50 * 1024 * 1024; // 50 MB (use null for unlimited).

Slingshot.fileRestrictions('myFileUploads', { allowedFileTypes, maxSize });
