function createSeededRandomGenerator(seed) {
    let state = seed;
    const m = 2**32;
    return function() {
        console.log("State:", state, m);
        // Xorshift algorithm
        state = (1664525 * state + 1013904223) % m;

        // Normalize to a floating-point number in the interval [0, 1)
        return state / m;
    };
}