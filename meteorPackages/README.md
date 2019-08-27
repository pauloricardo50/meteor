# Shared Meteor packages

The packages in this folder are shared between all microservices.

To install one:

1. Clone a meteor package here
2. Run a meteor app with the `METEOR_PACKAGE_DIRS` environment variable set
   1. Give it this value: `METEOR_PACKAGE_DIRS=\"packages:../../meteorPackages\"`, that way it will look for local meteor packages in both the `./packages` folder and in `../../meteorPackages`
