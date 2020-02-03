import React, { useState, useEffect } from "react";
import { RealtimeMap } from "./RealtimeMap";
import "./App.css";
import { useStreamingElectionData, RESET, ElectionSubject } from "./useStreamingElectionData";

/**
 * Parent component containing a real-time election map.
 * Subscribes to an observable data stream and shares that
 * stream with the map to enable real-time visualization.
 */
function App() {
  // Connect to local server's election stream for real-time data
  const electionData = useStreamingElectionData("//localhost:5000/election-stream");
  const { countiesReporting, votesCast } = useAggregateStatistics(electionData);
  return (
    <div className="column">
      <RealtimeMap
        accessToken={process.env.REACT_APP_MAPBOX_TOKEN || ""}
        styleUrl="mapbox://styles/mbxsolutions/ck4ye87f3nlti1co2al1wpsnz"
        electionData={electionData}
      />
      <div className="row">
        <div className="column margin-1 width-50">
          <h1>Real-time election map simulation</h1>
          <h2>Counties reporting: {countiesReporting.toLocaleString()}</h2>
          <h2>Votes counted: {votesCast.toLocaleString()}</h2>
          <p>
            This application shows voter turnout rates across the contiguous United States during the 2016 general
            election. The map is updated as voting data is sent from the server. For this demo, the server simulates
            polls closing at different times across the country.
          </p>
        </div>
        <div className="column margin-1 width-50">
          <p>
            Read more about real-time mapping and the architecture of this application on the{" "}
            <a href="https://www.mapbox.com/solutions/real-time-maps">real-time mapping solutions page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

/**
 * Returns aggregate statistics from incoming election results.
 */
function useAggregateStatistics(electionData: ElectionSubject) {
  const [countiesReporting, setCountiesReporting] = useState(0);
  const [votesCast, setVotesCast] = useState(0);
  useEffect(
    function countResponses() {
      const subscription = electionData.subscribe(update => {
        if (update === RESET) {
          setCountiesReporting(0);
          setVotesCast(0);
        } else {
          // accumulate number of counties reporting
          setCountiesReporting(count => count + update.length);
          // accumulate total votes cast
          const newVotesRecorded = update.reduce((prev, current) => {
            return prev + current.votes_total;
          }, 0);
          setVotesCast(count => count + newVotesRecorded);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    },
    [electionData]
  );
  return { countiesReporting, votesCast };
}
