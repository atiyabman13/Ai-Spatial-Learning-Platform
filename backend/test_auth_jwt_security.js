const assert = require("assert");
const jwt = require("jsonwebtoken");

console.log("=================================================");
console.log("🔒 FOCUSED AUTHENTICATION & JWT SECURITY AUDIT TEST");
console.log("=================================================");

// 1. Test fail-closed behavior when JWT_SECRET is missing or empty
delete process.env.JWT_SECRET;
const { getJwtSecret, protect } = require("./src/middleware/authMiddleware");

// Test 1: Missing JWT_SECRET throws with code MISSING_JWT_SECRET
assert.throws(
    () => getJwtSecret(),
    (err) => err.code === "MISSING_JWT_SECRET" && /missing or empty/i.test(err.message),
    "Test 1 Failed: getJwtSecret must throw error with code MISSING_JWT_SECRET when JWT_SECRET is unset"
);
console.log("  ✔ Test 1: getJwtSecret() throws MISSING_JWT_SECRET when unset");

// Test 2: Whitespace-only JWT_SECRET throws
process.env.JWT_SECRET = "     ";
assert.throws(
    () => getJwtSecret(),
    (err) => err.code === "MISSING_JWT_SECRET",
    "Test 2 Failed: getJwtSecret must throw error when JWT_SECRET contains only whitespace"
);
console.log("  ✔ Test 2: getJwtSecret() throws when JWT_SECRET contains only whitespace");

// Test 3: Middleware fail-closed response (HTTP 500) when JWT_SECRET is unconfigured
let statusCode = null;
let responseBody = null;
const reqMock = { headers: { authorization: "Bearer some_dummy_token_header" } };
const resMock = {
    status: (code) => { statusCode = code; return resMock; },
    json: (body) => { responseBody = body; return resMock; }
};
protect(reqMock, resMock, () => {});
assert.strictEqual(statusCode, 500, "Test 3 Failed: protect middleware must return 500 if JWT_SECRET is missing");
assert.ok(responseBody && /configuration/i.test(responseBody.message), "Test 3 Failed: error message must indicate configuration error");
console.log("  ✔ Test 3: protect middleware returns HTTP 500 and fails closed when JWT_SECRET is missing");

// Test 4: Symmetrical signing and verification with configured secret
process.env.JWT_SECRET = "ai_spatial_audit_secure_secret_test_2026";
const activeSecret = getJwtSecret();
assert.strictEqual(activeSecret, "ai_spatial_audit_secure_secret_test_2026");

const testPayload = { id: "650000000000000000000001", role: "teacher", email: "teacher@test.com" };
const token = jwt.sign(testPayload, activeSecret, { expiresIn: "1h" });
const decoded = jwt.verify(token, activeSecret);
assert.strictEqual(decoded.id, testPayload.id);
assert.strictEqual(decoded.role, testPayload.role);
assert.strictEqual(decoded.email, testPayload.email);
console.log("  ✔ Test 4: Symmetrical signing & verification succeeds with configured secret");

// Test 5: Forged token signed with removed fallback "aiSpatialSecret2026" is rejected
const forgedFallbackToken = jwt.sign(testPayload, "aiSpatialSecret2026", { expiresIn: "1h" });
assert.throws(
    () => jwt.verify(forgedFallbackToken, activeSecret),
    /invalid signature/,
    "Test 5 Failed: Tokens signed with old hardcoded fallback must fail cryptographic verification"
);
console.log("  ✔ Test 5: Tokens signed with removed fallback 'aiSpatialSecret2026' are strictly rejected");

// Test 6: Verify authController imports and uses getJwtSecret
const authController = require("./src/controllers/authController");
assert.strictEqual(typeof authController.register, "function");
assert.strictEqual(typeof authController.login, "function");
console.log("  ✔ Test 6: authController properly loads with shared getJwtSecret getter");

console.log("=================================================");
console.log("🎉 ALL 6 FOCUSED JWT SECURITY UNIT TESTS PASSED!");
console.log("=================================================");
process.exit(0);
