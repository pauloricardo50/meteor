// flow-typed signature: 1b594c86bfd1c6cf7d559f3baa5ac540
// flow-typed version: c6154227d1/object-hash_v1.x.x/flow_>=v0.25.x <=v0.103.x

/**
 * Flow libdef for 'object-hash'
 * See https://www.npmjs.com/package/object-hash
 * by Vincent Driessen, 2018-12-21
 */

declare module "object-hash" {
  declare type Options = {|
    algorithm?: "sha1" | "sha256" | "md5" | "passthrough",
    excludeValues?: boolean,
    encoding?: "buffer" | "hex" | "binary" | "base64",
    ignoreUnknown?: boolean,
    unorderedArrays?: boolean,
    unorderedSets?: boolean,
    unorderedObjects?: boolean,
    excludeKeys?: string => boolean
  |};

  declare export default (
    value: { +[string]: mixed } | Array<mixed>,
    options?: Options
  ) => string;
}
