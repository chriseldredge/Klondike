## Klondike

Ember front-end that builds on NuGet.Lucene for private [NuGet](https://www.nuget.org/) package hosting.

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

## How to Deploy Klondike

1. Grab a binary zip from the Releases tab or clone
[Klondike-Release](https://github.com/themotleyfool/Klondike-Release)
1. Customize [Settings.config](src/Klondike.WebHost/Settings.config)
1. Create a site in IIS using a .NET v4.0 Integrated Pipeline application pool

## App Pool Advanced Configuration

Klondike is designed to run as a single process to avoid conflicting writes on
the Lucene index files. Adjust your application pool accordingly:

* Make sure `Maximum Worker Processes` is set to `1`
* Make sure `Disable Overlapped Recycle` is set to `true`

## Self-Hosted Klondike

The binary release also includes Klondike.SelfHost.exe in the bin directory.
It can be run from the console using mono or the .net framework:

    Klondike.SelfHost.exe --port=8080

Or

    mono ./Klondike.SelfHost.exe --port=8080

If no port is specified, 8080 is used as a default. See the [Klondike.SelfHost README](src/Klondike.SelfHost/README.md)
for more information.

## Building Locally

This repository consists of two components:

1. Ember front-end built and packaged by [ember-cli](http://www.ember-cli.com/)
1. c# project built by MSBuild or xbuild

### Front End

Prerequisites: node (`node` and `npm` should be on your PATH).

Install ember-cli and bower if you haven't already:

    npm install -g ember-cli bower

Install dependencies:

    npm install
    bower install

Finally, build:

    ember build

This puts the built app into `./dist`.

_Note_: if you do not have the .NET 4.5 SDK or Mono 3.6 MDK installed you can
skip building the .net assets by using the `ember-only` environment:

    ember build --environment=ember-only

### .NET Back End

The c# projects can be build on Windows or OS X / Linux. On Windows,
install Visual Studio 2013 and the Microsoft.NET Framework 4.5 SDK.
On OS X / Linux, install the [Mono MDK](http://www.mono-project.com/download/)

Mono can also be installed by homebrew on OS X.

## Front End development without .NET

You can develop the front end without needing to build or host the .net code.

Edit [app/config.js](app/config.js) to point to an external Klondike API endpoint,
then run

    ember serve --environment=ember-only

## Previewing debug/release builds

You can serve production builds with:

    ember serve --environment=production

## Integration Tests

Coming Real Soon Now.
