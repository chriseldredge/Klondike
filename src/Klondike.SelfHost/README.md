# Klondike.SelfHost

This app allows Klondike to run without IIS from the command line or as a service.

## Settings

Settings are configured in [Settings.config](../Klondike.WebHost/Settings.config) and can be overridden on the command line.

In addition to the options found in Settings.config, the following additional options are supported:

Switch                                | Default    | Description
------------------------------------- | ---------- | -----------
port                                  | 8080       | When no url(s) are specified, listens on all interface on this tcp port.
url                                   |            | URL to listen on, e.g. `http://example.com/` (may be repeated for multiple bindings).
virtualPathRoot                       | /          | Virtual path root to prefix all routes with.
serverFactory                         | Nowin      | Selects OWIN server factory (may also use Microsoft.Owin.Host.HttpListener on Windows).
enableAnonymousAuthentication         | true       | When using Microsoft.Owin.Host.HttpListener, enables / disables Anonymous authentication.
enableIntegratedWindowsAuthentication | false      | When using Microsoft.Owin.Host.HttpListener, enables / disables Windows authentication.
baseDirectory                         | (computed) | The directory where Klondike.SelfHost.exe resides, or the parent of `bin` when in a bin folder.
interactive                           | (computed) | When set to true, don't run as a service, block on Console.ReadLine. When unspecified, uses `Environment.UserInteractive`.

## Running as a Service

You can install Klondike as a Windows Service so it runs in the background and starts when Windows starts:

```
C:\Windows\system32\sc.exe create Klondike \
    start= auto
    binpath= "c:\path\to\klondike\bin\Klondike.SelfHost.exe --args --go --here"
```

You can also run the service using `mono-service` on Unix hosts:

```
mono /Library/Frameworks/Mono.framework/Versions/3.8.0/lib/mono/4.5/mono-service.exe Klondike.SelfHost.exe
```
