function isMeteorPackage(imported) {
  return imported.moduleName.startsWith('meteor');
}

function isCoreModule(imported) {
  return imported.moduleName.startsWith('core');
}

function format(styleApi) {
  const {
    alias,
    and,
    dotSegmentCount,
    hasDefaultMember,
    hasNamedMembers,
    hasNamespaceMember,
    hasNoMember,
    hasOnlyDefaultMember,
    hasOnlyNamedMembers,
    hasOnlyNamespaceMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    member,
    moduleName,
    name,
    naturally,
    not,
    or,
    startsWithAlphanumeric,
    startsWithLowerCase,
    startsWithUpperCase,
    unicode,
  } = styleApi;

  return [
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule) },
    { separator: true },

    // Meteor packages
    { match: isMeteorPackage },
    { separator: true },

    // import … from "fs";
    {
      match: and(isNodeModule, not(isCoreModule)),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "foo";
    {
      match: and(isAbsoluteModule, not(isCoreModule)),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // Core packages
    { match: isCoreModule },
    { separator: true },

    // import … from "../foo";
    // import … from "./foo";
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
  ];
}

module.exports = format;
