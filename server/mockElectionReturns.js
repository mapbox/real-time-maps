const { Subject } = require("rxjs");
const { remap } = require("./remap");
/**
 * Message sent when animation is starting from beginning
 */
const RESET = "RESET";

const ANIMATION_DEFAULTS = {
    duration: 10000,
    updateInterval: 200,
    endHold: 1500
};

/**
 * Observable election information.
 * Emits county election data as an array of objects [{geoid, votes_total, population}]
 * Also emits RESET when election animation is restarting
 */
const electionSubject = new Subject();

// Load the historic voting data and sort it for animating sequentially
const voteSequence = require("../data/votes_animation_sequence.json")
    .sort((a, b) => a.seq < b.seq ? -1 : 1)
    .map(value => { return { ...value, hasUpdated: false } });

/**
 * Start the election update animation
 * @param {{duration: number, updateInterval: number, endHold: number}} options - animation timings
 */
function startAnimation(options = {}) {
    const { duration, updateInterval, endHold } = { ...ANIMATION_DEFAULTS, ...options };
    let startTime = Date.now();
    let endTime = startTime + duration;
    let resetTime = endTime + endHold;
    const interval = setInterval(updateElectionStatus, updateInterval);

    // Send a change in the election status to all listeners
    function updateElectionStatus() {
        const now = Date.now();
        const currentTime = remap(startTime, endTime, now, 5.0, 10.0);
        const data = newlyUpdatedCounties(currentTime);
        electionSubject.next(data);
        if (now >= resetTime) {
            reset();
        }
    }

    // Send reset to all listeners and play over from beginning
    function reset() {
        startTime = Date.now();
        endTime = startTime + duration;
        resetTime = endTime + endHold;
        updatedCounties = [];
        for (let i = 0; i < voteSequence.length; i += 1) {
            voteSequence[i].hasUpdated = false;
        }
        electionSubject.next(RESET);
    }

    return () => {
        clearInterval(interval);
    }
}

/**
 * Returns an array of information about counties that have
 * updated within the last animation time interval.
 * Marks updated counties so they are not re-sent in future calls.
 * @param {Number} now - the current sequence time
 */
function newlyUpdatedCounties(now) {
    const updates = [];
    for (let i = 0; i < voteSequence.length; i += 1) {
        const county = voteSequence[i];
        if (county.seq > now) {
            break;
        }
        if (!county.hasUpdated) {
            county.hasUpdated = true;
            updates.push({
                geoid: county.geoid,
                votes_total: +county.votes_total,
                population: +county.pop2016
            });
        }
    }
    return updates;
}

module.exports = {
    electionSubject,
    RESET,
    startAnimation
};
