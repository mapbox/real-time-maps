const encode = require("hashcode").hashCode();
const OpenSimplexNoise = require("open-simplex-noise").default;
const generator = new OpenSimplexNoise(Date.now());

/// Returns availability for a single location
function precinctStatus(id) {
    const time = Date.now() / (1000 * 10);
    const code = encode.value(id);
    return generator.noise2D(code, time) * 0.5 + 0.5;
}

/// Returns space availability for many locations
function precinctStatuses(ids) {
    return ids.map(id => precinctStatus(id));
}

module.exports = {
    precinctStatuses
}