// @flow

const INFINITY = 100000000000000;

type degressiveArgs = {
  amount: number,
  brackets: Array<{ rate: number, max: number }>,
  maxTax?: number,
  minTax?: number,
};

// Calculates the degressive tax on an amount, based on brackets with varying rates
const degressive = ({
  amount,
  brackets = [],
  maxTax,
  minTax,
}: degressiveArgs): number => {
  if (amount <= 0) {
    return 0;
  }

  let tax = 0;

  brackets.every(({ max = INFINITY, rate }, index, allBrackets) => {
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

  if (maxTax) {
    return Math.min(tax, maxTax);
  }

  if (minTax) {
    return Math.max(tax, minTax);
  }

  return tax;
};

export default degressive;
