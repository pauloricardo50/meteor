import { Template } from 'meteor/templating';

import './accountform.html';

Template['override-atForm'].replaces('atForm');
Template['override-atTitle'].replaces('atTitle');
Template['override-atOauth'].replaces('atOauth');
Template['override-atSep'].replaces('atSep');
Template['override-atError'].replaces('atError');
Template['override-atResult'].replaces('atResult');
Template['override-atMessage'].replaces('atMessage');
Template['override-atPwdForm'].replaces('atPwdForm');
Template['override-atTermsLink'].replaces('atTermsLink');
Template['override-atSigninLink'].replaces('atSigninLink');
Template['override-atSignupLink'].replaces('atSignupLink');
Template['override-atResendVerificationEmailLink'].replaces('atResendVerificationEmailLink');
Template['override-atSocial'].replaces('atSocial');
Template['override-atInput'].replaces('atInput');
Template['override-atPwdLink'].replaces('atPwdLink');
Template['overrideatPwdFormBtn'].replaces('atPwdFormBtn');

Template.overrideatPwdFormBtn.events({
    'click .submit': function() {
        console.log("submitted");

        $('#loginModal').delay(1000).fadeOut(450);

        setTimeout(function(){
            $('#loginModal').modal("hide");
        }, 1500);
    }
})
