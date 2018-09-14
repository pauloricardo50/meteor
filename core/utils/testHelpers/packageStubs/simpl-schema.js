// This mock is necessary because simple schema is extended by small meteor
// packages that wallaby does not know about, like aldeed:schema-index and aldeed: schema - deny
class SimpleSchema {
  static RegEx = { Email: undefined };

  omit = () => {};
}

export default SimpleSchema;
