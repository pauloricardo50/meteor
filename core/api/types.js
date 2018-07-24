// @flow
export * from './loans/queries/types';
export * from './loans/types';

export type ExtractReturn = <R>((*) => R) => R;
