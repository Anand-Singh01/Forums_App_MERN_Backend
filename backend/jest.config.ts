export default {
    bail: true,
    moduleFileExtensions: ["ts", "js", "json", "node"],
    roots: ["src"], 
    testMatch: ["**/__tests__/**/*.+(ts|tsx|js)"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    verbose: true,
};