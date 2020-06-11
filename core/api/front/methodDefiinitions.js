import { Method } from '../methods/methods';

export const frontTagLoan = new Method({
  name: 'frontTagLoan',
  params: { loanId: String, conversationId: String },
});

export const frontUntagLoan = new Method({
  name: 'frontUntagLoan',
  params: { loanId: String, conversationId: String },
});

export const frontGetTag = new Method({
  name: 'frontGetTag',
  params: { tagId: String },
});
