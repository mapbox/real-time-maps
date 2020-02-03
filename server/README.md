# Mock Election Returns API

This server provides an SSE endpoint for real-time mock election returns.

You can view the data events in your command prompt with curl:  
`curl -N localhost:5000/election-stream`

## Quick Start

The server is run by the root package's `npm run start` script, which also starts the client application.
