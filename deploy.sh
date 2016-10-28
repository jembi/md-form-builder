#!/bin/bash

HOME=`pwd`

echo "Publish";

export BOWER_V=`sed -n 's/.*"version":.*\([0-9]\{1,\}\.[0-9]\{1,\}\.[0-9]\{1,\}\).*/\1/p' bower.json`;
export NPM_V=`sed -n 's/.*"version":.*\([0-9]\{1,\}\.[0-9]\{1,\}\.[0-9]\{1,\}\).*/\1/p' package.json`;

echo -n "What version are you publishing? (semver)"
read NEW_PACKAGE_VERSION

if [ -z "$NEW_PACKAGE_VERSION" ]; then
    echo "Please supply a valid version."
    exit 1
fi

echo "$NPM_V > $NEW_PACKAGE_VERSION"

# Set NPM version of the OpenHIM to install
sed -i s/$NPM_V/$NEW_PACKAGE_VERSION/ $HOME/package.json
sed -i s/$NPM_V/$NEW_PACKAGE_VERSION/ $HOME/bower.json

if [[ ${BOWER_V} == ${NPM_V} ]]
  then
    echo "Publishing NPM package ${NPM_V}";
    echo "//registry.npmjs.org/:_password=${NPM_PASSWORD}" > ~/.npmrc
    echo "//registry.npmjs.org/:_authToken=${NPM_AUTH}" >> ~/.npmrc
    echo "//registry.npmjs.org/:username=${NPM_USERNAME}" >> ~/.npmrc
    echo "//registry.npmjs.org/:email=${NPM_EMAIL}" >> ~/.npmrc
    npm publish ./ --loglevel verbose
    echo "Success"
  else
    echo "Version Mismatched"
    exit 1
fi