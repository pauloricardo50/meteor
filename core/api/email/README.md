# Emails	

## To add a new email using an existing template:	

1. Edit `emailConstants.js` to add a new EMAIL_IDS	
2. Edit `emailConfigs.js` to add a new email, here's where you override the template's variables with your own content	
   - `createOverrides` receives whatever params you decide to give this email	
3. Add necessary translations required by the template in fr.json	
   1. `emails.MY_NEW_EMAIL_ID.TITLE` for example	
4. Send the email using one of 2 email methods `sendEmail` and `sendEmailToAddress` from `methods.js`. simply pass all the params you need in `createOverrides` to this method	

## To add a new email with a new template:	

1. Open mailchimp	
1. Create a new template in mailchimp	
1. Push the template to mandrill using the dropdown menu in their UI	
1. Open mandrill	
1. Give the new template an id to be used later	
1. Edit `emailConstants.js` to add a new EMAIL_TEMPLATES	
1. Proceed as in the first part of this readme