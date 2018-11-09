// @flow

// Calculates the degressive tax on an amount, based on brackets with varying rates
const degressive = (
  amount: number,
  brackets: Array<{ rate: number, max: number }>,
): number => {
  if (amount <= 0) {
    return 0;
  }

  let tax = 0;

  brackets.every(({ max, rate }, index, allBrackets) => {
    let previousBracket = { rate: 0, max: 0 };
    if (index > 0) {
      previousBracket = allBrackets[index - 1];
    }

    if (max < previousBracket.max) {
      throw new Error(`Tax brackets should come in increasing order, but found ${
        previousBracket.max
      } -> ${max}`);
    }

    tax
      += Math.min(amount - previousBracket.max, max - previousBracket.max) * rate;

    // Stop calculating once you've reached the highest bracket you're in
    return max <= amount;
  });

  return tax;
};

export default degressive;
