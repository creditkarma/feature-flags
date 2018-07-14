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
    "toggles": [
        {
            "id": "com.example.service.UseNewBackend",
            "description": "Use new backend code",
            "fraction": 0.1,
        }
    ]
}
```

### Dynamic Config

[DynamicConfig](https://github.com/creditkarma/dynamic-config) is a pluggable config library for Node.js that allows for runtime changes to config values. This is the basis for our feature flags support. It certainly isn't required that you use Dyanmic Config for all of your application config, but that would be recommended.



### Flag Schema

```json
{
    "\$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "toggles": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    },
                    "fraction": {
                        "type": "number",
                        "minimum": 0.0,
                        "maximum": 1.0,
                        "exclusiveMinimum": false,
                        "exclusiveMaxmimum": false
                    },
                    "comment": { "type": "string" }
                },
                "required": [ "id", "fraction" ]
            }
        }
    },
    "required": [ "toggles" ]
}
```
