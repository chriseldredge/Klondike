# Klondike.SelfHost

This app allows Klondike to run without IIS from the command line or as a service.

## Settings

Settings are configured in Settings.config and can be overridden on the command line.

In addition to the options found in Settings.config, the following additional options are supported:

Switch                                | Default    | Description
--------------------------------------|-------------------------
port                                  | 8080       | When no url(s) are specified, listens on all interface on this tcp port.
url                                   |            | URL to listen on, e.g. `http://example.com/` (may be repeated for multiple bindings).
serverFactory                         | Nowin      | Selects OWIN server factory (may also use Microsoft.Owin.Host.HttpListener on Windows).
enableIntegratedWindowsAuthentication | false      | When using Microsoft.Owin.Host.HttpListener, enables Windows authentication
baseDirectory                         | (computed) | The directory where Klondike.SelfHost.exe resides, or the parent of `bin` when in a bin folder

## Running as a Service

You can install Klondike as a Windows Service so it runs in the background and starts when Windows starts:

```
C:\Windows\system32\sc.exe create Klondike \
    start= auto
    binpath= "c:\path\to\klondike\bin\Klondike.SelfHost.exe --args --go --here"
```

You can also run the service using `mono-service2` on Unix hosts.
