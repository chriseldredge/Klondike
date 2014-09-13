# Klondike.SelfHost

This app allows Klondike to run without IIS from the command line.

## Settings

Settings are configured in Settings.config and can be overridden on the command line.

In addition to the options found in Settings.config, the following additional options are supported:

Switch          | Default
----------------|--------
port            | 8080
baseDirectory   | The directory where Klondike.SelfHost.exe resides, or the parent of `bin` when in a bin folder
