# Security Policy

## Architectural Security Guarantees

XENOPHORA is engineered as a strictly self-contained client-side WebGL2 + Web Audio application:
- **Zero third-party runtime dependencies or CDN scripts**
- **Zero telemetry, analytics, cookies, or outbound network requests**
- **Local static dev server (`server.mjs`)** binds to `127.0.0.1` only and enforces canonical path-prefix containment (`fullPath.startsWith(__dirname)`) against directory-traversal attacks (verified in `tests/server.test.mjs`).

## Supported Versions

| Version | Supported |
| :--- | :---: |
| `1.0.x` | Yes |

## Reporting a Vulnerability

If you discover a security issue (such as a static-server path handling flaw, unsafe DOM sink, or GPU shader crash vector), please report it responsibly by emailing **0_0@0thernes.art** or opening a private GitHub Security Advisory on `0thernes/xenophora`. Please avoid posting active exploit details in public issues until a fix is released.
