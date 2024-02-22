// .localImplementationsConfig.cjs defining local implementations
let localServerPrefix = "https:ecdsa-sd.grotto-networking.com"; // Set this to your servers address
module.exports = [{
    "name": "Grotto Networking",
    "implementation": "Grotto Test",
    "issuers": [{
      "id": "urn:uuid:my:implementation:issuer:id",
      "endpoint": localServerPrefix + "/credentials/issue",
      "tags": ["ecdsa-sd-2023"],
      "supportedEcdsaKeyTypes": ["P-256"]
    }],
    "verifiers": [{
      "id": "urn:uuid:my:implementation:verifier:id",
      "endpoint": localServerPrefix + "/credentials/verify",
      "tags": ["ecdsa-sd-2023"],
      "supportedEcdsaKeyTypes": ["P-256"]
    }]
  }];