const validateStep1 = () => true;
const validateStep2 = () => true;
const validateStep3 = () => true;
const validateStep4 = () => true;


const validationArray = [
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
];


const stepValidation = (i) => {
  let valid = false;
  validationArray.forEach((validate, index) => {
    // While the currentstep is smaller or equal than the validation function, validate.
    if (i <= index) {
      valid = validate();
    }
  });

  if (i >= 4) {
    return true;
  }

  return valid;
};

export default stepValidation;
