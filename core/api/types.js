// @flow
export * from './properties/queries/types';
export * from './loans/queries/types';
export * from './loans/types';

export type ExtractReturn = <R>((*) => R) => R;
