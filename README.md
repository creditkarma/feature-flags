# Feature Flags

A dynamic feature flags library for Node.js. This library gives you fine-grained control over rolling out and testing new features.

This implementation is largely based on [Feature Toggles](https://twitter.github.io/finagle/guide/Configuration.html#feature-toggles) in [Twitter's Finagle framework](https://github.com/twitter/finagle).

## Install

This feature flags library has a peer dependency on `@creditkarma/dynamic-config`.

```sh
$ npm install --save @creditkarma/dynamic-config
$ npm install --save @creditkarma/feature-flags
```

## Usage

### Dynamic Config

[DynamicConfig](https://github.com/creditkarma/dynamic-config) is a pluggable config library for Node.js that allows for runtime changes to config values.

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
