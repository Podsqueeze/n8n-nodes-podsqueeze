# n8n-nodes-podsqueeze

n8n node to integrate with the Podsqueeze API to process podcast episodes and retrieve generated assets.

## Features
- Start a processing job for an episode and wait until assets are ready
- Polls job status automatically until completion (with configurable interval and timeout)

## Prerequisites
- A Podsqueeze account
- Podsqueeze API token (found in your Podsqueeze dashboard under API Access)

## Install

### Install via Community Nodes (after publishing to npm)
Once this package is published to npm, you can install it via n8n’s Community Nodes UI by searching for `n8n-nodes-podsqueeze`.

### Local development / custom install
If you want to try the node locally without publishing:

1) Build the package
```bash
npm install
npm run build
```

2) Point n8n to load custom extensions from this folder. For example:
- If running n8n locally:
  ```bash
  export N8N_CUSTOM_EXTENSIONS="$(pwd)"
  n8n
  ```
- If running via Docker, mount this directory and set the env var:
  ```bash
  docker run -it \
    -p 5678:5678 \
    -v $(pwd):/custom \
    -e N8N_CUSTOM_EXTENSIONS="/custom" \
    n8nio/n8n
  ```

n8n will load the compiled files from `dist/`.

## Usage
1) In n8n, create new credentials of type "Podsqueeze API" and paste your API token.
2) Add the "Podsqueeze" node to a workflow.
3) Configure:
   - Podcast ID (required)
   - Language (default `en`)
   - Episode URL (public URL) or File (base64)
   - Optional: Episode Title, Polling Interval (s), Timeout (s)
4) Execute the node. On success, the node returns the episode assets JSON.

## Node details
- Credentials: `podsqueezeApi` (API token stored in n8n credentials, not in the workflow)
- API endpoint used: `https://europe-central2-wannabe-entrepreneur.cloudfunctions.net/podsqueeze-api`
- Authorization: `Bearer <token>` header

## Development
- Source (TypeScript): `nodes/Podsqueeze/Podsqueeze.node.ts` and `credentials/PodsqueezeApi.credentials.ts`
- Build: `npm run build` (emits to `dist/`)

## License
MIT © Tiago Ferreira
