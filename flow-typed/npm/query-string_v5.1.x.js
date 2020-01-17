// flow-typed signature: e47cb153af76d1f951b51fe1598d31d3
// flow-typed version: c6154227d1/query-string_v5.1.x/flow_>=v0.104.x

declare module 'query-string' {
  declare type ArrayFormat = 'none' | 'bracket' | 'index'
  declare type ParserOptions = {|
    arrayFormat?: ArrayFormat,
  |}

  declare type StringifyOptions = {|
    arrayFormat?: ArrayFormat,
    encode?: boolean,
    strict?: boolean,
    sort?: false | <A, B>(A, B) => number,
  |}

  declare module.exports: {
    extract(input: string): string,
    parse(input: string, options?: ParserOptions): { [name: string]: string | Array<string>, ... },
    parseUrl(input: string, options?: ParserOptions): {
      url: string,
      query: { [name: string]: string | Array<string>, ... },
      ...
    },
    stringify(obj: { [name: string]: mixed, ... }, options?: StringifyOptions): string,
    ...
  }
}
