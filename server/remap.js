function remap(ia, ib, iv, oa, ob) {
    const t = (iv - ia) / (ib - ia);
    return mix(oa, ob, t);
}

function mix(a, b, t) {
    return a + (b - a) * t;
}

module.exports = {
    remap,
    mix
}
