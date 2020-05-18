# Feature Flags

A dynamic feature flags library for Node.js. This library gives you fine-grained control over rolling out and testing new features.

This implementation is largely based on [Feature Toggles](https://twitter.github.io/finagle/guide/Configuration.html#feature-toggles) in [Twitter's Finagle framework](https://github.com/twitter/finagle).

For a detail looks at feature flags check out this article [Feature Toggles](https://martinfowler.com/articles/feature-toggles.html).

The idea behind feature flags is that they give you a way for testing new code and ramping that code over time. In your configuration you would provide a description of what percentage of requests should use a particular code path and the library will somewhat randomly return a boolean for each toggle representing if it should be used on a particular request or not. Once a code path is ramped to 100% it is expected the feature flag for that code would be removed.

## Install

This feature flags library has a peer dependency on `@creditkarma/dynamic-config`.

```sh
$ npm install --save @creditkarma/dynamic-config
$ npm install --save @creditkarma/feature-flags
```

## Usage

Using feature flags is very easy. They are really just a boolean indicating which code path you should use.

```typescript
import { toggleMap, Toggle } from '@creditkarma/feature-flags'

async function startApp(app) {
    const toggle: Toggle = await toggleMap('com.example.service.UseNewBackend')

    app.get('/test', (req, res) => {
        if (toggle()) {
            // Use new code path
        } else {
            // Use old code path
        }
    })
}
```

In application code there are only two things you need to use. The `toggleMap` function and the `Toggle` type.

### `toggleMap`

The `toggleMap` is a function that returns a Promise of a toggle for a given key. Your application can have many toggles. Each of these toggles has a unique string identifier that you specify. You provide this id to the `toggleMap` function and it gives you back a `Promise<Toggle>`. A `Toggle` is a function that just returns a `boolean`. It will return, randomly, `true` based on the configured percentage.

## Configuration

The real work of the feature flag is actually the configuration. In your application config you would have a key call `toggles`. This key is expected to be at the root level of your config `JSON`:

```json
{
    "toggles": {
        "com.example.service.UseNewBackend" : {
            "description": "Use new backend code",
            "fraction": 0.1,
            "type": "RAMP",
        }
    }
}
```

Each `Toggle` must have an `id` and a `fraction`, the number indicating how often to return `true`. The `fraction` is a number from `0.0` to `1.0`. So in the example the value `0.1` indicates that this `Toggle` will be `true` 10% of the time it is called.

### Dynamic Config

[DynamicConfig](https://github.com/creditkarma/dynamic-config) is a pluggable config library for Node.js that allows for runtime changes to config values. This is the basis for our feature flags support. It certainly isn't required that you use Dyanmic Config for all of your application config, but that would be recommended.

You should check out the docs for DynamicConifg if you are going to use this library. The gist is this. DynamicConfig has plugable support for remote data stores for configuration values. These external data stores can have their values updated without having to restart the application. The feature flags library will be updated if the remote values change and the ramp of your toggles will be updated in real time.

The only time there is a performance penalty for loading the external config is during the creation of a `Toggle`. After this initial penalty updated values are loaded in the background.

### Flag Schema

The schema for the `toggles` config:

```json
{
    "\$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "toggles": {
            "type": "object",
            "patternProperties": {
                "^[A-Za-z0-9 -_.]": {
                    "type": "object",
                    "properties": {
                        "fraction": {
                            "type": "number",
                            "minimum": 0.0,
                            "maximum": 1.0,
                        },
                        "type": {
                            "type": "string",
                        },
                        "description": {
                            "type": "string",
                        },
                    },
                    "required": [ "type", "fraction" ],
                },
            }
        }
    },
    "required": [ "toggles" ]
}
```

## Contributing

For more information about contributing new features and bug fixes, see our [Contribution Guidelines](https://github.com/creditkarma/CONTRIBUTING.md).
External contributors must sign Contributor License Agreement (CLA)

## License

This project is licensed under [Apache License Version 2.0](./LICENSE)
