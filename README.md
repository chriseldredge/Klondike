## Klondike

Ember front-end that builds on NuGet.Lucene for private package hosting.

## Binaries

Available from the Releases tab on github.

## Building Locally

This repository consists of two components:

1. Emberjs front-end built and packaged by Grunt
1. c# project built by MSBuild

### Front End

Prerequisites: nodejs, ruby. `node`, `npm` and `gem` should be on your PATH.

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

_Note_: `grunt build` will call msbuild if available to build the .NET components. Use
`grunt build --force` to ignore the warning.

### .NET Back End

The c# project requires Windows, Visual Studio 2013 and the Microsoft.NET Framework 4.5.1 SDK.

Make sure you use the MSBuild.exe included in Visual Studio 2013:

    C:\Program Files (x86)\MSBuild\12.0\Bin\MSBuild.exe

This puts the .NET assets into `./dist`.

Before opening the solution in Visual Studio, make sure to restore packages. This can be
done on the command line by doing

    msbuild IntegratedBuild.proj /t:RestoreSolutionPackages

This will also be done by using the default Build target.

## Front End development without .NET

You can develop the front end without needing to build or host the .net code.

Edit [app/js/config.js](app/js/config.js) to point to an external Klondike API endpoint,
then run

    grunt serve --force

The force flag is necessary to ignore the warning about MSBuild not being available.

## Previewing debug/release builds

IIS Express can be used to preview the contents of `./dist` including .NET back end:

    grunt serve:dist:iisexpress

You can also preview the debug version of the site by running

    grunt serve::iisexpress

## Integration Tests

Integration Tests use either curl or the nuget command line client and are invoked from MSBuild targets
in [integration-tests/test.proj](integration-tests/test.proj).

To enable running integration tests, run msbuild from the top level directory (so it builds IntegratedBuild.proj):

    msbuild /p:TestsEnabled=true

To execute tests without building first:

    msbuild /t:IntegrationTest /p:TestsEnabled=true

To execute a specific test case:

    msbuild /t:IntegrationTest /p:TestsEnabled=true /p:TestCase=Test_PutPackage

To run the tests against a different endpoint and avoid starting and stopping IIS Express, use the `HttpUrl` property:

    msbuild /t:IntegrationTest /p:HttpUrl=http://localhost:40221/
