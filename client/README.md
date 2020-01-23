# Voting Precincts

This package contains an example frontend for displaying real-time voting precinct data using React and Mapbox GL JS.

It uses a base style containing geometry and metadata about each precinct. At runtime, it adds a paint property to
the style that is controlled by feature-state and changes the appearance of the precincts. On an interval, it requests
real-time data about each visible feature from the mock API and changes the feature-state based on the response.

![diagram]()

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).