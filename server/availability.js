const OpenSimplexNoise = require("open-simplex-noise").default;
const generator = new OpenSimplexNoise(Date.now());

/// Returns availability for a single location
function availabilityForId(id) {
    const time = Date.now() / (1000 * 10);
    return generator.noise2D(+id, time) * 0.5 + 0.5;
}

/// Returns space availability for many locations
function availabilityForIds(ids) {
    const idsToAvailability = ids.map(id => availabilityForId(id));
    return idsToAvailability;
}

module.exports = {
    availabilityForIds
}