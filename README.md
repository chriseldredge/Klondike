## Klondike

Ember front-end that builds on NuGet.Lucene for private package hosting.

## Binaries

Available from the Releases tab on github.

Alternatively, you can clone the [Klondike-Release](https://github.com/themotleyfool/Klondike-Release)
git repo to make upgrading easier.

## What is Klondike

Klondike is an asp.net web application you deploy to your own web server or to the cloud
that works as a private NuGet package feed for storing private packages your organization
creates. Klondike can also automatically restore packages sourced from 3rd party feeds,
such as the nuget.org public feed, to keep your build server humming even when nuget.org
is unavailable.

Klondike performs dramatically better than the standard NuGet.Server provider and adds lots
of extra features you can't get anywhere else. Klondikes use of Lucene.Net means that the
install footprint is light. Simply grab the binaries, stand up an IIS site and you're done.
Much easier than deploying your own NuGet Gallery.

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

When using the latter target, live reloading will take place whenever you rebuild the
c# project, e.g. from Visual Studio, or whenever you modify a js or scss file.

## Integration Tests

Integration Tests use either curl or the nuget command line client and are invoked from MSBuild targets
in [integration-tests/test.proj](integration-tests/test.proj).

To enable running integration tests, run msbuild from the top level directory (so it builds IntegratedBuild.proj):

    msbuild

To execute tests without building first:

    msbuild /t:IntegrationTest

To execute a specific test case:

    msbuild /t:IntegrationTest /p:TestsEnabled=true /p:TestCase=Test_PutPackage

To run the tests against a different endpoint and avoid starting and stopping IIS Express, use the `HttpUrl` property:

    msbuild /t:IntegrationTest /p:HttpUrl=http://localhost:40221/

## Building without Integration Tests

If you simply want to build (and perhaps stage) the c# project without running tests, set `TestsEnabled=false`:

    msbuild /p:TestsEnabled=False

or

    msbuild /t:Stage /p:DistDir=dist /p:TestsEnabled=False /p:Configuration=Release

This is basically the same as what `grunt exec` will do.
