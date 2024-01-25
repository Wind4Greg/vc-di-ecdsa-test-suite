# Notes on additional testing for ECDSA-SD

Unlike `ecdsa-rdfc-2019` and `ecdsa-jcs-2019`, `ecdsa-sd-2023` has three (or four) rather than two fundamental functions to be tested. These are roughly

* **Add Base**: inputs: unsigned document, mandatory pointers. returns a signed base document. Can use the [VC-API: issue credential](https://w3c-ccg.github.io/vc-api/#issue-credential) API but need to supplement the `options` object to support `mandatoryPointers` or have it as a separate item.
* **Verify Base**: *technically not required in the specification, but needed to know if someones base proof meets the spec*. inputs:s signed base document. In my ECDSA-SD library I provide a high level function for this. Could use the [VC-API: verify credential](https://w3c-ccg.github.io/vc-api/#verify-credential) API to check this.
* **Derive Proof**: inputs: signed base document, selective pointers; Returns signed derived document. Can use the [VC-API derive credential](https://w3c-ccg.github.io/vc-api/#derive-credential) API, however the `frame` field is out of date and should be replace by a `selectivePointers` field of type array.
* **Verify Derived**: input: signed derived document, Returns true or false; Should use the [VC-API: verify credential](https://w3c-ccg.github.io/vc-api/#verify-credential) API to check this.

## Proof Value Checking

For both base proof and derived proof the encoding is *base64url-no-pad-encoding* and **not** *base-58-btc* and starts with a `u` and **not** a 'z'. In addition the decoded proofs should start with the following bytes:

* **base proof** header bytes 0xd9, 0x5d, and 0x00
* **disclosure proof** header bytes 0xd9, 0x5d, and 0x01

