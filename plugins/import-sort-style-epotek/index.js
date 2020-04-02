function isMeteor(imported) {
  return imported.moduleName === 'meteor/meteor';
}

function isMeteorPackage(imported) {
  return imported.moduleName.startsWith('meteor');
}

function isCoreModule(imported) {
  return imported.moduleName.startsWith('core');
}

function isReact(imported) {
  return imported.moduleName === 'react';
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

    // Meteor itself
    { match: isMeteor },

    // Meteor packages
    {
      match: isMeteorPackage,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // Put react first on top
    {
      match: isReact,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },

    // import … from "foo";
    {
      match: and(or(isNodeModule, isAbsoluteModule), not(isCoreModule)),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // Core packages
    {
      match: isCoreModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
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
