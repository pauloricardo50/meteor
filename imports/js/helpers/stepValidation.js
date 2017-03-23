const validateStep1 = () => false;
const validateStep2 = () => false;
const validateStep3 = () => false;
const validateStep4 = () => false;

const validationArray = [
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
];

const stepValidation = i => {
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
