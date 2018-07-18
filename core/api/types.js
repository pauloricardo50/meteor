// @flow
export * from './loans/queries/types';
export * from './loans/types';

export type ExtractReturn = <R>((*) => R) => R;

// export type ExtractReturn<F> = _ExtractReturn<*, F>;
