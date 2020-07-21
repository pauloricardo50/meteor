export const isIE = () =>
  /* @cc_on!@ */ false || !!global?.document?.documentMode;
