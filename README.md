# codex-api-server

API Server for Codex

# Getting Started

Clone the repo & install dependencies:

```
https://github.com/Flux159/codex-api-server
npm install
```

Start the server:

```
npm run dev
```

Test using curl:

```
curl -X POST \
    http://localhost:3000/prompt \
    -H 'Content-Type: application/json' \
    -d '{"prompt": "What is the name of this project"}'
```
