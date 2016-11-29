// export function maxPropertyValue(salary = 0, fortune = 0, insuranceFortune = 0, age = 18, gender = 'f') {
//   let maxBorrow = 0.8; // Emprunter maximum 80% de la valeur de la propriété
//   const interest = 0.05; // Interet théorique sur l'emprunt
//   let amortization = 0.0125; // Amortissement annuel de l'emprunt si le client a moins de 50 ans
//   const maintenance = 0.01; // Entretien de la propriété: 1% de la valeur totale de la propriété
//   const notaryFee = 0.05; // Frais de notaire: 5%
//
//
//   // Get retirement age
//   const retirement = (gender === 'f' ? 64 : 65);
//
//
//   const limitingValues = [];
//
//   if (age >= 51 && age < retirement) {
//     amortization = 0.15 / (retirement - age);
//   } else if (age >= retirement) {
//     maxBorrow = 0.65;
//   }
//
//   const salaryLimitedValue = (salary / 3) / ((maxBorrow * (interest + amortization)) + maintenance);
//   limitingValues.push(salaryLimitedValue);
//
//   // TODO: Quel est le ratio requis si l'emprunt est de moins de 80% ?
//   if (insuranceFortune === 0) {
//     // Si pas de LPP, le cash doit valoir 25% de la propriété
//     const cashLimitedValue1 = fortune / (1 - (maxBorrow + notaryFee));
//     limitingValues.push(cashLimitedValue1);
//   } else if (insuranceFortune > 0) {
//     // Si il existe une LPP, le cash doit etre au minimum 15% de la propriété, lpp 10%
//     const cashLimitedValue2 = fortune / (1 - 0.15);
//     limitingValues.push(cashLimitedValue2);
//     if (insuranceFortune < cashLimitedValue2 * 0.1) {
//       // Si la LPP n'est pas suffisante, la propriété est limitée par la LPP
//       const lppLimitedValue = insuranceFortune / (1 - 0.10);
//       limitingValues.push(lppLimitedValue);
//     }
//   }
//
//   // Return the smallest value of the 5
//   const maxValue = Math.min(...limitingValues);
//
//   // Round value down to nearest 1000
//   return Math.floor(maxValue / 1000) * 1000;
// }


// Returns the minimum amount of combined fortune you have to provide to buy a certain property
export function minimumFortuneRequired(age1, age2, gender1, gender2, type, revenue, propertyValue) {
  // Determine retirement age depending on the gender of the borrowers
  const retirement1 = (gender1 === 'f' ? 64 : 65);
  let retirement2 = null;
  if (gender2) {
    retirement2 = (gender2 === 'f' ? 64 : 65);
  }

  // Substract age to determine remaining time to retirement for both borrowers
  const toRetirement1 = retirement1 - age1;
  let toRetirement2;
  if (retirement2) {
    toRetirement2 = retirement2 - age2;
  }

  // Get the most limiting time to retirement for both borrowers, in years
  let yearsToRetirement;
  if (toRetirement2) {
    yearsToRetirement = Math.min(toRetirement1, toRetirement2);
  } else {
    yearsToRetirement = toRetirement1;
  }

  // A secondary residence can only have a loan up to 70%, primary and investment allow 80%
  let maxLoan = (type === 'secondary' ? 70 : 80);
  // If the person is already over 65, only allow a loan up to 65%
  maxLoan = (yearsToRetirement <= 0 ? 65 : maxLoan);

  // The array which will store all valid loan values from 0% to 80%
  const loanValues = [];

  // Try all values from a 0% to 80% loan, 1 percent at a time
  // TODO: Get a more precise value, and optimize this shit
  let l = 0;
  for (l = 0; l <= maxLoan; l += 1) {
    if (isLoanValid(l / 100, revenue, propertyValue, yearsToRetirement)) {
      loanValues.push((l / 100) * propertyValue);
    }
  }

  // Return the biggest amount you can borrow
  return Math.max(...loanValues);
}


// Given a loan, return a boolean indicating if it is valid or not based on revenue
function isLoanValid(loanPercent, revenue, propertyValue, yearsToRetirement) {
  const maintenance = 0.01; // property maintenance percent: usually 1%
  const interest = 0.05; // Official theoretical interest rate to calculate these things: 5%


  // Stays 0% if the loan is less than 65%
  let yearlyAmortization = 0;
  if (loanPercent > 0.65) {
    // The loan has to be below 65% before 15 years or before retirement, whichever comes first
    const remainingYears = Math.min(yearsToRetirement, 15);
    const amountToAmortize = (0.65 - loanPercent) * propertyValue;

    // Make sure we don't create a black hole, or use negative values by error
    if (remainingYears > 0) {
      // Amortization is the amount to amortize divided by the amount of years before the deadline
      yearlyAmortization = amountToAmortize / remainingYears;
    }
  }

  // The maximum amount someone can borrow given his salary and the house he wants to buy
  // salary / 3 >= yearly expenditures
  // salary / 3 >= maintenanceCosts + interest on loan + amortization of loan
  const maintenanceCosts = maintenance * propertyValue;
  const loan = loanPercent * propertyValue;
  const yearlyCosts = maintenanceCosts + (loan * interest) + yearlyAmortization;

  // Return a boolean indicating whether this amount can be borrowed or not
  return (revenue / 3) >= yearlyCosts;
}


export function toMoney(value) {
  return String(value).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}


export function toNumber(value) {
  return Number(String(value).replace(/\D/g, ''));
}
