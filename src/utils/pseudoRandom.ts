// ==========================================================================
// QUEEN JIYU'S UNIVERSE - DETERMINISTIC PRNG
// Pure, idempotent pseudo-random generation to comply with React 19 compiler
// ==========================================================================

export function createPseudoRandom(initialSeed = 1337) {
    let s = initialSeed;
    return function next(): number {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

