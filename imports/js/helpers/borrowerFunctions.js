export const getFortune = (borrowers = []) => {
  const array = [];

  borrowers.forEach(b => {
    array.push(b.bankFortune);
  });
  return array.reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
};

export const getInsuranceFortune = (borrowers = []) => {
  const array = [];

  borrowers.forEach(b => {
    array.push(b.insuranceSecondPillar);
    array.push(b.insuranceThirdPillar);
  });
  return array.reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
};
