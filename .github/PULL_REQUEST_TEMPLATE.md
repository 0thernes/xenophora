## Summary
Describe the changes introduced in this pull request.

## Category
- [ ] New 4D specimen / SDF mathematics
- [ ] PDE / Artificial Life dynamics
- [ ] Physical optics / post-processing
- [ ] Web Audio synthesis
- [ ] Documentation / Tests / CI
- [ ] Bug fix / WebGL2 driver compatibility

## Engineering Checklist
- [ ] Zero external runtime dependencies preserved
- [ ] `npm test` passes cleanly
- [ ] No ESSL struct ternaries (`?:` on `struct`)
- [ ] Heavy loops guarded with `ZERO` anti-unroll barriers & bounding envelopes
- [ ] Verified in live WebGL2 browser with 0 console errors
