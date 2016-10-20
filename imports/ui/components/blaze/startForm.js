import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Chart } from 'chart.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

import maxPropertyValue from '/imports/js/finance-math.js';

import './startForm.html';

const validationDelay = 400;
var propertyValueTimeout;
var ageTimeout;
var salaryTimeout;
var fortuneTimeout;
var bonusTimeout;
var cashTimeout;
var insuranceCashTimeout;
let formFilled = false;

Template.startForm.onCreated(function() {
  this.single = new ReactiveVar(true);
  this.formType = new ReactiveVar();
  this.bonusExists = new ReactiveVar(false);
  this.formErrors = new ReactiveDict();
});

Template.startForm.onRendered(function() {
  Meteor.setTimeout(function() {
    $('#formInfo').animate({
      'fontSize': '17px',
      'padding': '20px',
    }, 'slow', function() {
      $('#theForm').removeClass('hidden');
      Meteor.setTimeout(function() {
        focusToNextInput();
      }, 500);
    });
  }, 1500);
});

Template.startForm.helpers({
  single: function() {
    return Template.instance().single.get();
  },
  new: function() {
    var theType = Template.instance().formType.get();

    if (theType === 'new1' || theType === 'new2') {
      return true;
    }
    return false;
  },
  bonusExists: function() {
    if (Template.instance().bonusExists.get() === 'true') {
      return true;
    } else {
      return false;
    }
  },
  old: function() {
    var theType = Template.instance().formType.get();

    if (theType === 'old1' || theType === 'old2') {
      return true;
    }
    return false;
  },
  new1: function() {
    var theType = Template.instance().formType.get();

    if (theType === 'new1') {
      return true;
    }
    return false;
  },
  new2: function() {
    var theType = Template.instance().formType.get();

    if (theType === 'new2') {
      return true;
    }
    return false;
  },
})

Template.startForm.events({
  'change #form-type': function(event, templateInstance) {
    templateInstance.formType.set($('#form-type').val());
    $('#line-2').removeClass('hidden');
    focusToNextInput();
  },
  'change #borrowerCount': function(event, templateInstance) {
    $('#line-2-part-2').removeClass('hidden');
    focusToNextInput();

    if ($('#borrowerCount').val() === 'twoBorrowers') {
      templateInstance.single.set(false);
      return;
    } else {
      templateInstance.single.set(true);
      $('#age2').val('');
      updateGenderLine();
      return;
    }
  },
  'keyup #age1, change #age1': function(event, templateInstance) {
    var age1 = Number($('#age1').val());

    // Verify if age input has 2 characters -> input is finished
    if (age1.toString().length >= 2) {
      updateGenderLine();
      if (age1 < 18) {
        templateInstance.formErrors.set('age1', 'Il faut être un peu plus agé pour une hypothèque!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      } else if (age1 > 99) {
        templateInstance.formErrors.set('age1', 'Je pense qu\'il serait judicieux de demander à vos petits-enfants de s\'occuper de votre hypothèque!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      }

      // Validated
      Session.set('age', $('#age1').val().replace(/\D/g, ''));
      templateInstance.formErrors.set('age1', '');
      $('#' + event.target.id).parent().removeClass('has-error');
      $('#' + event.target.id).parent().addClass('has-success');
      if (age1 <= 50) {
        // If for single person, handle unhiding next part of form
        if (templateInstance.single.get() === true) {
          if ($('#gender-line').is(':hidden')) {
            $('#line-3').removeClass('hidden');
          }
        }
      }
      focusToNextInput();
    } else {
      return;
    }
  },
  'keyup #age2, change #age2': function(event, templateInstance) {
    var age2 = Number($('#age2').val());

    if (age2.toString().length >= 2) {
      updateGenderLine();
      if (age2 < 18) {
        templateInstance.formErrors.set('age2', 'Il faut être un peu plus agé pour une hypothèque!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      } else if (age2 > 99) {
        templateInstance.formErrors.set('age1', 'Je pense qu\'il serait judicieux de demander à vos petits-enfants de s\'occuper de votre hypothèque!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      }
      // Validated
      Session.set('age', $('#age1').val().replace(/\D/g, ''));
      templateInstance.formErrors.set('age2', '');
      $('#' + event.target.id).parent().removeClass('has-error');
      $('#' + event.target.id).parent().addClass('has-success');
      if (age2 <= 50) {
        // Unhide next part of the form, if gender line is not necessary
        if ($('#gender-line').is(':hidden')) {
          $('#line-3').removeClass('hidden');
        }
      }
      focusToNextInput();
    } else {
      return;
    }
  },
  'change #gender1, change #gender2': function() {
    Session.set('gender1', $('#gender1').val());

    // Verify if gender 2 exists
    if ($('#gender2').length) {
      Session.set('gender2', $('#gender2').val());
    }
    Session.set('gender2', $('#gender2').val());
    $('#line-3').removeClass('hidden');
    focusToNextInput();
  },
  'change #propertyType': function() {
    $('#line-4').removeClass('hidden');
    focusToNextInput();
  },
  'keyup #salary': function(event, templateInstance) {
    let salary = $('#salary').val().replace(/\D/g, '');

    // Validation
    Meteor.clearTimeout(salaryTimeout)
    salaryTimeout = Meteor.setTimeout(function() {
      if (salary === '' || salary == null) {
        return;
      } else if (salary < 0) {
        templateInstance.formErrors.set('salary', 'Hacker Life!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      } else if (salary >= 1000000000) {
        templateInstance.formErrors.set('salary', 'Rentre chez toi Bill Gates!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      }

      // Validated
      if (salary >= 0) {
        templateInstance.formErrors.set('salary', '');
        $('#' + event.target.id).parent().removeClass('has-error');
        $('#' + event.target.id).parent().addClass('has-success');
        $('#line-4-part-2').removeClass('hidden');
        Session.set('salary', $('#salary').val().replace(/\D/g, ''));
      }
    }, validationDelay);
  },
  'change #bonusExists': function(event, templateInstance) {
    templateInstance.bonusExists.set($('#bonusExists').val());

    if ($('#bonusExists').val() === 'false') {
      $('#line-6').removeClass('hidden');
      focusToNextInput();
    }
  },
  'keyup #bonus': function(event, templateInstance) {
    var bonus = $('#bonusExists').val().replace(/\D/g, '');

    // Validation
    Meteor.clearTimeout(bonusTimeout)
    bonusTimeout = Meteor.setTimeout(function() {
      if (bonus === '' || bonus == null) {
        return;
      } else if (bonus < 0) {
        templateInstance.formErrors.set('bonus', 'Hacker Life!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      } else if (bonus >= 1000000000) {
        templateInstance.formErrors.set('bonus', 'Rentre chez toi Warren Buffet!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      }

      // Validated
      if (bonus >= 0) {
        templateInstance.formErrors.set('bonus', '');
        $('#' + event.target.id).parent().removeClass('has-error');
        $('#' + event.target.id).parent().addClass('has-success');
        $('#line-6').removeClass('hidden');
      }
    }, validationDelay);
  },
  'keyup #propertyValue': function(event, templateInstance) {
    let propertyValue = $('#propertyValue').val().replace(/\D/g, '');

    // Validation
    Meteor.clearTimeout(propertyValueTimeout)
    propertyValueTimeout = Meteor.setTimeout(function() {
      if (propertyValue === '' || propertyValue == null) {
        return;
      } else if (propertyValue < 0) {
        templateInstance.formErrors.set('propertyValue', 'Hacker Life!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      } else if (propertyValue >= 1000000000) {
        templateInstance.formErrors.set('propertyValue', 'Rentre chez toi Jeff Bezos!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      }

      // Validated
      if (propertyValue >= 0) {
        templateInstance.formErrors.set('propertyValue', '');
        $('#' + event.target.id).parent().removeClass('has-error');
        $('#' + event.target.id).parent().addClass('has-success');
        $('#line-6-part-2').removeClass('hidden');
      }
    }, validationDelay);
  },
  'keyup #cash': function(event, templateInstance) {
    let cash = $('#cash').val().replace(/\D/g, '');

    // Validation
    Meteor.clearTimeout(cashTimeout)
    cashTimeout = Meteor.setTimeout(function() {
      if (cash === '' || cash == null) {
        return;
      } else if (cash < 0) {
        templateInstance.formErrors.set('cash', 'Hacker Life!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      } else if (cash >= 1000000000) {
        templateInstance.formErrors.set('cash', 'Rentre chez toi Larry Page!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      }

      // Validated
      if (cash >= 0) {
        Session.set('fortune', String(Number($('#cash').val().replace(/\D/g, '')) + Number($('#insuranceCash').val().replace(/\D/g, ''))));
        templateInstance.formErrors.set('cash', '');
        $('#' + event.target.id).parent().removeClass('has-error');
        $('#' + event.target.id).parent().addClass('has-success');
        $('#line-6-part-3').removeClass('hidden');
      }
    }, validationDelay);
  },
  'keyup #insuranceCash': function(event, templateInstance) {
    const insuranceCash = $('#insuranceCash').val().replace(/\D/g, '');

    // Validation, Meteor.setTimeout?
    clearTimeout(insuranceCashTimeout);
    insuranceCashTimeout = setTimeout(function() {
      if (insuranceCash === '' || insuranceCash == null) {
        return;
      } else if (insuranceCash < 0) {
        templateInstance.formErrors.set('insuranceCash', 'Hacker Life!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      } else if (insuranceCash >= 1000000000) {
        templateInstance.formErrors.set('insuranceCash', 'Rentre chez toi Sergey Brin!');
        $('#' + event.target.id).parent().removeClass('has-success');
        $('#' + event.target.id).parent().addClass('has-error');
        return;
      }

      // Validated
      if (insuranceCash >= 0) {
        Session.set('fortune', String(Number($('#cash').val().replace(/\D/g, ''))));
        Session.set('insuranceFortune', String(Number($('#insuranceCash').val().replace(/\D/g, ''))));
        formFilled = true;
        validateForm();
        templateInstance.formErrors.set('insuranceCash', '');
        $('#' + event.target.id).parent().removeClass('has-error');
        $('#' + event.target.id).parent().addClass('has-success');
        $('#result').removeClass('hidden');
        // window.scrollTo(0,document.body.scrollHeight);
      }
    }, validationDelay);
  },

  // Error Handling
  'change .natural-language': function(event, templateInstance) {
    console.log('checking errors');

    // Remove all errors
    $('#error-list').empty();

    var keys = Object.keys(templateInstance.formErrors.keys);
    keys.forEach(function(key) {
      console.log('error: ' + key);
      if (templateInstance.formErrors.get(key) !== '') {
        $('#error-list').append('<li>' + templateInstance.formErrors.get(key) + '</li>');
      }
    });
    if ($('#error-list').is(':empty')) {
      validateForm();
    }

  },

  // Formatting
  'keyup input[type=text], blur input[type=text]': function(event) {
    // skip for arrow keys
    if (event.which >= 37 && event.which <= 40) {
      return;
    }

    // skip for backspace
    if (event.which === 8 || event.which === 46) {
      return;
    }

    // format number
    let thisId = event.target.id;
    let thisValue = event.target.value;

    // Age formatting, simply remove non numbers with an empty char
    if (thisId === 'age1' || thisId === 'age2') {
      $('#' + thisId).val(thisValue.replace(/\D/g, ''));
      return;
    }

    // Remove non numbers and add a ' for every 3 characters
    $('#' + thisId).val(thisValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '\''));
  },

  // Resizing selects
  'change .resizing_select-1': function () {
    // Auto resize dropdown
    $('#width_tmp_option-1').html($('.resizing_select-1 option:selected').text());
    $('.resizing_select-1').width($('#width_tmp_select-1').width() + 15);
  },
  'change .resizing_select-2': function () {
    // Auto resize dropdown
    $('#width_tmp_option-2').html($('.resizing_select-2 option:selected').text());
    $('.resizing_select-2').width($('#width_tmp_select-2').width() + 15);
  },
  'change .resizing_select-3': function () {
    // Auto resize dropdown
    $('#width_tmp_option-3').html($('.resizing_select-3 option:selected').text());
    $('.resizing_select-3').width($('#width_tmp_select-3').width() + 15);
  },
  'change .resizing_select-4': function () {
    // Auto resize dropdown
    $('#width_tmp_option-4').html($('.resizing_select-4 option:selected').text());
    $('.resizing_select-4').width($('#width_tmp_select-4').width() + 15);
  },
  'change .resizing_select-5': function () {
    // Auto resize dropdown
    $('#width_tmp_option-5').html($('.resizing_select-5 option:selected').text());
    $('.resizing_select-5').width($('#width_tmp_select-5').width() + 15);
  },
  'change .resizing_select-6': function () {
    // Auto resize dropdown
    $('#width_tmp_option-6').html($('.resizing_select-6 option:selected').text());
    $('.resizing_select-6').width($('#width_tmp_select-6').width() + 15);
  }
});

function updateGenderLine() {
  if ($('#age1').val() > 50 || $('#age2').val() > 50) {
    $('#gender-line').removeClass('hidden');
  } else {
    $('#gender-line').addClass('hidden');
  }
}

let chartsCreated = false;
let myBarChart;
let myDoughnutChart;

Template.charts.onRendered(function () {
  this.autorun(() => {
    if ((document.getElementById('doughnutCanvas') != null) && (document.getElementById('barCanvas') != null)) {

      Session.get('salary')

      const data = {
        labels: [
          'Intérêts', 'Ammortissement', 'Entretien',
        ],
        datasets: [
          {
            data: [
              50, 66, 33,
            ],
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56',
            ],
            hoverBackgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56',
            ],
          },
        ],
      };

      if (!chartsCreated) {
        const ctx1 = document.getElementById('barCanvas').getContext('2d');
        const ctx2 = document.getElementById('doughnutCanvas').getContext('2d');

        myDoughnutChart = new Chart(ctx2, {
          type: 'doughnut',
          data,
          animation: {
            animateScale: true,
          },
        });

        myBarChart = new Chart(ctx1, {
          type: 'horizontalBar',
          data: {
            labels: [
              'Salaire', 'Fonds Propres', 'Propriété',
            ],
            datasets: [
              {
                label: 'CHF',
                data: [
                  100, 120, 200,
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
              yAxes: [
                {
                  //
                },
              ],
            },
          },
        });
        chartsCreated = true;
        return;
      }

      console.log('reactive!!');
      myBarChart.data.datasets[0].data[0] = Number(Session.get('salary'));
      myBarChart.data.datasets[0].data[1] = Number(Session.get('fortune'));
      myBarChart.data.datasets[0].data[2] = Number(Session.get('propertyValue'));

      myBarChart.update();
      myDoughnutChart.update();
    }
  });
});

function random() {
  return Math.floor((Math.random() * 100) + 1);
}

function focusToNextInput() {
  const inputs = $(':input:visible');

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value === '' || inputs[i].value == null) {
      let thisId = inputs[i].id;
      $('#' + thisId).focus();
      if (window.mobilecheck) {
        document.body.scrollTop = $('#' + thisId).offset() + (window.innerHeight / 3);
      }
      return;
    }
  }
}

window.mobilecheck = function () {
  let check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
      check = true;
  }
  )(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

function validateForm() {
  if (formFilled) {
    // TODO Choose max of age1 and age2, as well as gender1 and gender2
    var maxValue = maxPropertyValue($('#salary').val().replace(/\D/g, ''), $('#cash').val().replace(/\D/g, '') + $('#insuranceCash').val().replace(/\D/g, ''), lpp = 0, $('#age1').val().replace(/\D/g, ''), $('#gender1').val());

    if ($('#propertyValue').length) {
      // If the user has given a property value
      Session.set('propertyValue', $('#propertyValue').val().replace(/\D/g, ''));
    } else {
      // Set calculated value instead
      Session.set('propertyValue', maxValue);
    }

    Session.set('startFormFilled', 'true');
  }
}

// Template.startForm.events({
//     'change .resizing_select-1': function() {
//         // Auto resize dropdown
//         $('#width_tmp_option-1').html($('.resizing_select-1 option:selected').text());
//         $('.resizing_select-1').width($('#width_tmp_select-1').width() + 15);
//     },
//     'change .resizing_select-2': function() {
//         // Auto resize dropdown
//         $('#width_tmp_option-2').html($('.resizing_select-2 option:selected').text());
//         $('.resizing_select-2').width($('#width_tmp_select-2').width() + 15);
//     },
//     'change #property-value-known': function(event) {
//         if (event.target.value === 'true') {
//             $('#propertyValueSpan').removeClass('fadeOut');
//             $('#propertyValueSpan').removeClass('hidden');
//         } else if (event.target.value === 'false') {
//             // If value exists, remove it
//             $('#propertyValueSpan').addClass('fadeOut');
//             $('#propertyValueSpan').addClass('hidden');
//
//             // Go to next part of form
//             $('#line-2').removeClass('hidden');
//         }
//     },
//     'keyup #propertyValue': function(event) {
//         var propertyValue = $('#propertyValue').val().replace(/\D/g, '');
//
//         // skip for arrow keys
//         if (event.which >= 37 && event.which <= 40) return;
//         // skip for backspace
//         if (event.which == 8 || event.which == 46) return;
//
//         // format number
//         $('#propertyValue').val(propertyValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '''));
//
//         // Validation
//         clearTimeout(propertyValueTimeout)
//         propertyValueTimeout = setTimeout(function() {
//
//             if (propertyValue >= 0) {
//                 $('#line-2').removeClass('hidden');
//             }
//         }, validationDelay);
//     },
//     'change #gender': function() {
//         $('#line-2-part-2').removeClass('hidden');
//     },
//     'keyup #age': function() {
//         var age = $('#age').val();
//
//         // Validation
//         clearTimeout(ageTimeout);
//         ageTimeout = setTimeout(function() {
//             if (age >= 18 && age <= 120) {
//                 $('#line-3').removeClass('hidden');
//                 $('.form-errors').empty();
//             } else {
//                 $('.form-errors').empty();
//                 $('.form-errors').append('Age non valide!');
//             }
//         }, validationDelay);
//     },
//     'keyup #salary': function(event) {
//         var salary = $('#salary').val().replace(/\D/g, '');
//
//         // skip for arrow keys
//         if (event.which >= 37 && event.which <= 40) return;
//         // skip for backspace
//         if (event.which == 8 || event.which == 46) return;
//
//         // format number
//         $('#salary').val(salary.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '''));
//
//         // Validation
//         clearTimeout(salaryTimeout);
//         salaryTimeout = setTimeout(function() {
//             if (salary > 1000000000) {
//                 $('.form-errors').empty();
//                 $('.form-errors').append('Rentre chez toi Bill Gates!');
//                 return
//             } else if (salary > 0) {
//                 $('.form-errors').empty();
//                 $('#line-4').removeClass('hidden');
//             }
//         }, validationDelay);
//     },
//     'keyup #fortune': function(event) {
//         var fortune = $('#fortune').val().replace(/\D/g, '');
//
//         // skip for arrow keys
//         if (event.which >= 37 && event.which <= 40) return;
//         // skip for backspace
//         if (event.which == 8 || event.which == 46) return;
//
//         // format number
//         $('#fortune').val(fortune.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '''));
//
//         // Validation
//         clearTimeout(fortuneTimeout);
//         fortuneTimeout = setTimeout(function() {
//             if (fortune > 1000000000) {
//                 $('.form-errors').empty();
//                 $('.form-errors').append('Rentre chez toi Bill Gates!');
//             } else if (fortune >= 0) {
//                 formFilled = true;
//                 validateForm();
//             }
//         }, validationDelay);
//     },
//     'change .natural-language, keyup .natural-language': function() {
//         validateForm();
//     }
// });
//
// function validateForm() {
//     if (formFilled) {
//         var maxValue = maxPropertyValue(
//             $('#salary').val().replace(/\D/g, ''),
//             $('#fortune').val().replace(/\D/g, ''),
//             lpp = 0,
//             $('#age').val().replace(/\D/g, ''),
//             $('#gender').val()
//         );
//
//         propertyValueKnown = $('#property-value-known').val();
//         propertyValue = $('#propertyValue').val().replace(/\D/g, '');
//
//         Session.set('salary', $('#salary').val().replace(/\D/g, ''));
//         Session.set('fortune', $('#fortune').val().replace(/\D/g, ''));
//         Session.set('age', $('#age').val().replace(/\D/g, ''));
//         Session.set('gender', $('#gender').val());
//         Session.set('propertyValue', propertyValue);
//         Session.set('startFormFilled', 'true');
//
//
//         if (propertyValueKnown === 'true') {
//             if (propertyValue <= maxValue && propertyValue > 50000) {
//                 // Property is affordable, go on
//                 $('#line-5').addClass('hidden');
//                 $('#line-6').removeClass('hidden');
//                 $('.formValidButton').removeClass('disabled');
//                 $('#formFinalText').empty();
//                 $('#formFinalText').append('Tout est bon!');
//             } else {
//                 // Property is way too low or too expensive
//                 $('#line-5').addClass('hidden');
//                 $('#line-6').removeClass('hidden');
//                 $('.formValidButton').addClass('disabled');
//                 if (propertyValue <= 50000 || !propertyValue) {
//                     $('#formFinalText').empty();
//                     $('#formFinalText').append('Entrez une valeur de propriété');
//                 } else {
//                     $('#formFinalText').empty();
//                     $('#formFinalText').append('On dirait que cette propriété est au dessus de vos moyens');
//                 }
//             }
//         } else if (propertyValueKnown === 'false') {
//
//             $('#line-6').addClass('hidden');
//             $('#line-5').removeClass('hidden');
//             $('#propertyValueOutput').empty();
//             $('#propertyValueOutput').append('CHF ' + String(maxValue).replace(/\B(?=(\d{3})+(?!\d))/g, '''));
//         }
//     }
// };
