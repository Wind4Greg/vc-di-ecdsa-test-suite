# [ECDSA](https://www.w3.org/TR/vc-di-ecdsa/) Cryptosuite test suite

## Table of Contents

- [ECDSA Cryptosuite test suite](#ecdsa-cryptosuite-test-suite)
  - [Table of Contents](#table-of-contents)
  - [Fork Background](#fork-background)
    - [Gotcha: Context Injection](#gotcha-context-injection)
  - [Background](#background)
  - [Install](#install)
  - [Usage](#usage)
  - [Implementation](#implementation)
    - [Docker Integration (TODO)](#docker-integration-todo)
  - [Contribute](#contribute)
  - [License](#license)

## Fork Background

This fork of the ECDSA Cryptosuite test suite shows how I modified things to use the test suite for local implementation testing. For example the `.localImplementationsConfig.cjs` is included along with changes to the test files to only run local tests.

I'm currently working on ECDSA-SD tests and I only want to run a single batch of tests at a time. To do that I run `mocha` with a particular test file. For example for ECDSA-SD creation tests I use the command:

`npx mocha tests/40-sd-create.js`

or for the ECDSA-SD verification tests I use the command:

`npx mocha tests/50-sd-verify.js`

Note that I don't use the  `npm test` script (see `package.json`) as it runs all the tests, including, interoperability tests and it also prepares a full interoperability report which is not my goal in testing locally.

The `.localImplementationsConfig.cjs` is where you configure your server that is under test. This is a regular JavaScript file so I defined an extra variable `let localServerPrefix = "http://127.0.0.2:5555";` to make it easy to change the *endpoints* of my very simple test server.

The rest of this README.md is from the original as of the time of last fork update.

```json
{
    "name": "Grotto Networking",
    "implementation": "Grotto Test",
    "issuers": [{
      "id": "",
      "endpoint": "https://ecdsa-sd.grotto-networking.com/credentials/issue",
      "tags": ["ecdsa-sd-2023"],
      "supportedEcdsaKeyTypes": ["P-256"]
    }],
    "verifiers": [{
      "id": "",
      "endpoint": "https://ecdsa-sd.grotto-networking.com/credentials/verify",
      "tags": ["ecdsa-sd-2023"],
      "supportedEcdsaKeyTypes": ["P-256"]
    }]
  }
  ```

### Gotcha: Context Injection

I created the test vectors for many of the VC data integrity documents. When I did so I used the nice new data model context, i.e., "https://www.w3.org/ns/credentials/v2". This includes all the needed VC data integrity context stuff.

However, the tests use the older data model context, i.e., "https://www.w3.org/2018/credentials/v1", hence you need to do what is called "context injection" as explained here:
[VC Data Integrity: Context Injection](https://w3c.github.io/vc-data-integrity/#context-injection), before processing the credential. This basically involves adding "https://w3id.org/security/data-integrity/v2" to the unsigned credentials context array.


## Background

Provides interoperability tests for verifiable credential processors
(issuers and verifiers) that support [ECDSA](https://www.w3.org/TR/vc-di-ecdsa/)
[Data Integrity](https://www.w3.org/TR/vc-data-integrity/) cryptosuites.

## Install

```js
npm i
```

## Usage

To generate test data used in the test suite, testers are required to specify
the issuer name using the environment variable `ISSUER_NAME`.

In addition, the environment variable `HOLDER_NAME` may be used to specify
the VC holder name for generating disclosed test credentials for ECDSA-SD tests.
If `$HOLDER_NAME` is not specified, `Digital Bazaar` will be used.

```
ISSUER_NAME="IssuerName" HOLDER_NAME="HolderName" npm test
```

## Implementation

You will need an issuer and verifier that are compatible with [VC API](https://w3c-ccg.github.io/vc-api/)
and are capable of handling issuance and verification of Verifiable Credentials
with `DataIntegrityProof` proof type using the `ecdsa-rdfc-2019`,
`ecdsa-jcs-2019`, or `ecdsa-sd-2023` cryptosuites.

To add your implementation to this test suite, you will need to add 2 endpoints
to your implementation manifest.
- A credential issuer endpoint (`/credentials/issue`) in the `issuers` property.
- A credential verifier endpoint (`/credentials/verify`) in the `verifiers`
property.

All endpoints will require a cryptosuite tag of `ecdsa-rdfc-2019`,
`ecdsa-jcs-2019`, and/or `ecdsa-sd-2023`. Alongside this cryptosuite tag, you
must also specify the `supportedEcdsaKeyTypes` property, parallel to `tags`
listing the ECDSA key types issuable or verifiable by your implementation.
Currently, the test suite supports `P-256` and `P-384` ECDSA key types.

NOTE: The tests for `ecdsa-jcs-2019` are TBA.

A simplified manifest would look like this:

```js
{
  "name": "My Company",
  "implementation": "My implementation",
  "issuers": [{
    "id": "",
    "endpoint": "https://mycompany.example/credentials/issue",
    "method": "POST",
    "supportedEcdsaKeyTypes": ["P-256", "P-384"]
    "tags": ["ecdsa-rdfc-2019"]
  }, {
    "id": "",
    "endpoint": "https://mycompany.example/credentials/issue",
    "method": "POST",
    "supportedEcdsaKeyTypes": ["P-256"]
    "tags": ["ecdsa-jcs-2019"]
  }, {
    "id": "",
    "endpoint": "https://mycompany.example/credentials/issue",
    "method": "POST",
    "supportedEcdsaKeyTypes": ["P-256"]
    "tags": ["ecdsa-sd-2023"]
  }],
  "verifiers": [{
    "id": "",
    "endpoint": "https://mycompany.example/credentials/verify",
    "method": "POST",
    "supportedEcdsaKeyTypes": ["P-256", "P-384"]
    "tags": [
      "ecdsa-rdfc-2019", "ecdsa-jcs-2019", "ecdsa-sd-2023"
    ]
  }]
}
```

The example above represents an unauthenticated endpoint. You may add ZCAP or
OAuth2 authentication to your endpoints. You can find an example in the
[vc-test-suite-implementations README](https://github.com/w3c/vc-test-suite-implementations#adding-a-new-implementation).

To run the tests, some implementations may require client secrets that can be
passed as environment variables to the test script. To see which implementations
require client secrets, please check the implementation manifest within the
[vc-test-suite-implementations](https://github.com/w3c/vc-test-suite-implementations/tree/main/implementations) library.

### Docker Integration (TODO)

We are presently working on implementing a new feature that will enable the
use of Docker images instead of live endpoints. The Docker image that
you provide will be started when the test suite is run. The image is expected
to expose the API provided above, which will be used in the same way that
live HTTP endpoints are used above.

## Contribute

See [the CONTRIBUTING.md file](CONTRIBUTING.md).

Pull Requests are welcome!

## License

See [the LICENSE.md file](LICENSE.md)
