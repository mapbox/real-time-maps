const express = require("express");
const app = express();
const port = 5000;
const EOM = "\n\n";

// Enable CORS for local development
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET");
    next();
});

// Import mock election data as an observable subject from mock election returns
const { RESET, electionSubject, startAnimation } = require("./mockElectionReturns");

// Keep a record of all election data events so we can send
// new clients the full, latest data when they connect.
let updatedCounties = [];
electionSubject.subscribe(update => {
    if (update === RESET) {
        updatedCounties = [];
    } else {
        updatedCounties = updatedCounties.concat(update);
    }
});

// Create an SSE endpoint where clients can receive election data updates
app.get("/election-stream", function (req, res) {
    // Start an SSE connection
    req.socket.setTimeout(2147483647);
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
    res.write(EOM);

    // Send complete data for election in first message
    res.write(`data: ${encodeURI(JSON.stringify(updatedCounties))}${EOM}`);

    // Subscribe client to incremental updates
    const subscription = electionSubject.subscribe(update => {
        if (update === RESET) {
            res.write(`data: RESET${EOM}`);
        } else if (update.length > 0) {
            res.write(`data: ${encodeURI(JSON.stringify(update))}${EOM}`);
        }
    });
    const referer = req.headers.referer;
    console.log(`Client connected: ${referer}`);

    // When client disconnects, cancel their subscription
    req.on("close", function unsubscribe() {
        subscription.unsubscribe();
        console.log(`Client disconnected: ${referer}`);
    });
});

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port} `));
// Start playing back the election data
startAnimation({ duration: 30000, updateInterval: 1000 });
