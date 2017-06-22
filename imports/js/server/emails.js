import { Accounts } from 'meteor/accounts-base';

// https://themeteorchef.com/tutorials/sign-up-with-email-verification
Accounts.emailTemplates.siteName = 'e-Potek';
Accounts.emailTemplates.from = 'e-Potek <info@e-potek.ch>';

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return '[e-Potek] Vérifiez votre e-mail';
  },
  text(user, url) {
    const emailAddress = user.emails[0].address;
    const urlWithoutHash = url.replace('#/', '');
    const supportEmail = 'info@e-potek.ch';
    const emailBody = `Pour vérifier votre adresse e-mail (${emailAddress}), visitez le lien suivant:\n\n${urlWithoutHash}\n\n Si vous n'avez pas demandé cette vérification, vous pouvez ignorer cet e-mail. Par contre, si vous pensez qu'il y a quelque chose d'anormal, n'hésitez pas à nous écrire: ${supportEmail}.`;

    return emailBody;
  },
};

Accounts.emailTemplates.resetPassword = {
  subject() {
    return '[e-Potek] Mot de passe réinitialisé';
  },
  text(user, url) {
    const emailAddress = user.emails[0].address;
    const urlWithoutHash = url.replace('#/', '');
    const supportEmail = 'info@e-potek.ch';
    const emailBody = `Pour choisir un nouveau mot de passe, visitez le lien suivant:\n\n${urlWithoutHash}\n\n Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail. Par contre, si vous pensez qu'il y a quelque chose d'anormal, n'hésitez pas à nous écrire: ${supportEmail}.`;

    return emailBody;
  },
};
