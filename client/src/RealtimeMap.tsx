import React, { useEffect, useRef, useState, Fragment } from "react";
import ReactDOM from "react-dom";
import center from "@turf/center";
import mapboxgl from "mapbox-gl";
import { useMapbox } from "use-mapbox";
import { Subscription, Observable } from "rxjs";
import "mapbox-gl/dist/mapbox-gl.css";
import "./RealtimeMap.css";
import { transformRequest } from "./transformRequest";
import { ElectionUpdate, ResetCommand, RESET, ElectionSubject } from "./useStreamingElectionData";

interface Props {
  accessToken: string;
  styleUrl: string;
  electionData: ElectionSubject;
}

/**
 * React component rendering a real-time election map.
 * Subscribes to SSE messages streaming from server.
 * Displays a mapbox map with layer styles driven by real-time data.
 */
export function RealtimeMap({ accessToken, styleUrl, electionData }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);

  const map = useMapbox(mapContainer, accessToken, {
    transformRequest: transformRequest,
    style: styleUrl,
    center: [-96.5, 39.8],
    zoom: 3.8
  });

  const displayLayerID = "county-shape"; // the display layer we dynamically style
  const sourceLayerID = "county"; // the source used by the display layer
  useElectionDataToStyleLayer(map, electionData, displayLayerID, sourceLayerID);
  useClickEffect(map, displayLayerID);

  return <div className="mapbox-map" ref={mapContainer} />;
}

/**
 * Set map's style to vary based on feature-state and subscribe
 * to election data messages to change the feature-state
 */
function useElectionDataToStyleLayer(
  map: mapboxgl.Map | undefined,
  electionData: Observable<ElectionUpdate[] | ResetCommand>,
  displayLayerID: string,
  sourceLayerID: string
) {
  // Configure map style once to change when feature-state changes
  useEffect(
    function setStyleExpressions() {
      if (!map) {
        return;
      }
      map.once("style.load", () => {
        // Set paint properties of real-time data layer to vary
        // based on the state of each feature we retrieve from our live data
        map.setPaintProperty(displayLayerID, "fill-color", [
          "case",
          ["!=", ["feature-state", "voteProportion"], null],
          // if we have turnout information for a feature, use it to interpolate a color
          [
            "interpolate",
            ["exponential", 2],
            // use the value of the `voteProportion` feature-state as an input
            ["feature-state", "voteProportion"],
            // color low turnout purple
            0.3,
            "rgba(127, 0, 200, 0.6)",
            // color high turnout bright green
            0.7,
            "rgba(0, 255, 80, 0.9)"
          ],
          // if there is no turnout information, use gray
          "rgba(127, 127, 127, 0.5)"
        ]);
      });
    },
    [map, displayLayerID]
  );
  // Subscribe to changes in election data and update feature-state as changes arrive
  useEffect(
    function updateFeatureStateWithElectionData() {
      if (!map) {
        return;
      }
      let subscription: Subscription;
      map.once("style.load", () => {
        subscription = electionData.subscribe(update => {
          if (update === RESET) {
            map.removeFeatureState({ source: "composite", sourceLayer: sourceLayerID });
          } else {
            update.forEach(county => {
              const voteProportion = county.votes_total / county.population;
              if (county.geoid === "NA") {
                return;
              }
              // Assign the `voteProportion` feature-state to the source feature
              // whose ID matches the county's geoid
              map.setFeatureState(
                { source: "composite", sourceLayer: sourceLayerID, id: +county.geoid },
                { voteProportion, population: county.population, votesTotal: county.votes_total }
              );
            });
          }
        });
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    },
    [map, electionData, sourceLayerID]
  );
}

/**
 * Show more information about counties when they are selected.
 */
function useClickEffect(onMap: mapboxgl.Map | undefined, displayLayerID: string) {
  const [popup] = useState(() => new mapboxgl.Popup({ closeButton: true, closeOnClick: false }));
  useEffect(
    function show() {
      if (!onMap) {
        return;
      }
      const map = onMap;
      function showPopup(event: any) {
        const feature = event.features && event.features[0];
        if (!feature) {
          return;
        }
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        const { coordinates } = center(feature).geometry;
        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const name = feature.properties.name;
        const { population, votesTotal, voteProportion } = feature.state;

        // Populate the popup and set its coordinates
        // based on the feature found.
        const element = document.createElement("div");
        ReactDOM.render(
          <Fragment>
            <h1>{name} County</h1>
            <dl>
              <dt>Population</dt>
              <dd>{(population && population.toLocaleString()) || "unreported"}</dd>
              <dt>Votes cast</dt>
              <dd>{(votesTotal && votesTotal.toLocaleString()) || "unreported"}</dd>
              <dt>Participation rate</dt>
              <dd>{(voteProportion && (voteProportion * 100).toFixed(2) + "%") || "unreported"}</dd>
            </dl>
          </Fragment>,
          element
        );
        popup
          .setLngLat(coordinates)
          .setHTML(element.outerHTML)
          .addTo(map);
      }

      function hidePopup() {
        map.getCanvas().style.cursor = "";
        popup.remove();
      }
      map.on("click", displayLayerID, showPopup);

      return () => {
        map.off("click", displayLayerID, showPopup);
        hidePopup();
      };
    },
    [onMap, popup, displayLayerID]
  );
}
