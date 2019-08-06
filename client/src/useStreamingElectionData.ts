import { useEffect, useState } from "react";
import { ReplaySubject } from "rxjs";

export interface ElectionUpdate {
  geoid: string;
  population: number;
  votes_total: number;
}

export type ResetCommand = "RESET";
export const RESET: ResetCommand = "RESET";
export type ElectionMessage = ElectionUpdate[] | ResetCommand;
export type ElectionSubject = ReplaySubject<ElectionMessage>;

/**
 * Create an observable stream of election data for use in React components.
 * The returned subject can be shared across many components, but this function
 * should only be called once (in the top-level component).
 */
export function useStreamingElectionData(url: string): ElectionSubject {
  // remember earlier updates to avoid race condition with map initialization
  const [subject] = useState(new ReplaySubject<ElectionMessage>(5));

  useEffect(
    function subscribeToElectionData() {
      const source = new EventSource(url);
      source.addEventListener("message", function(message) {
        const data = decodeURI(message.data);
        if (data === RESET) {
          subject.next(RESET);
        } else {
          const update = JSON.parse(data) as ElectionUpdate[];
          subject.next(update);
        }
      });

      return () => {
        console.log("closing event source");
        source.close();
      };
    },
    [subject, url]
  );

  return subject;
}
