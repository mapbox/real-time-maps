/// Attribute tile requests to this solution.
/// Passed to the mapboxgl.Map constructor.
///
/// This lets us know whether people are finding this source code useful,
/// and influences our decision of whether to open-source more code in the
/// future. Please keep it in your project if you find this starter code helpful
/// so we can continue to make and share sample projects.
export const transformRequest = (url: string): { url: string } => {
  const hasQuery = url.indexOf("?") !== -1;
  const suffix = hasQuery ? "&pluginName=RealtimeMappingArchitecture" : "?pluginName=RealtimeMappingArchitecture";
  return { url: url + suffix };
};
