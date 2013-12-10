## Klondike

Ember front-end that builds on NuGet.Lucene for private package hosting.

## Building Locally

This repository consists of two components:

1. Emberjs front-end built and packaged by Grunt
1. c# project built by MSBuild

### Front End

Prerequisites: nodejs, ruby

Install compass if you haven't already:

    gem install compass

Install grunt and bower if you haven't already:

    npm install -g grunt-cli bower

Install dependencies:

    npm install
    bower install

Finally, build:

    grunt build

This puts the built app into `./dist`.

_Note_: `grunt build` will clean the dist directory, so you will need to run MSBuild again
if you are testing the .NET back end locally.

### .NET Back End

The c# project requires Windows, Visual Studio 2013 and the Microsoft.NET Framework 4.5.1 SDK.

Make sure you use the MSBuild.exe included in Visual Studio 2013:

    C:\Program Files (x86)\MSBuild\12.0\Bin\MSBuild.exe

This puts the .NET assets into `./dist`.

## Front End development without .NET

You can develop the front end without needing to build or host the .net code.

Edit [app/js/config.js](app/js/config.js) to point to an external Klondike API endpoint,
then run

    grunt serve

## Integration Tests

Integration Tests use either curl or the nuget command line client and are invoked from MSBuild targets
in [integration-tests/test.proj](integration-tests/test.proj).

To enable running integration tests, run msbuild from the top level directory (so it builds IntegratedBuild.proj):

    msbuild /p:TestsEnabled=true

To execute tests without building first:

    msbuild /t:IntegrationTest /p:TestsEnabled=true

To execute a specific test case:

    msbuild /t:IntegrationTest /p:TestsEnabled=true /p:TestCase=TestPutPackageWithFullPath

