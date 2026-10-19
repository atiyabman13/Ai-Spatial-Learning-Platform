const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(
    __dirname,
    "../../ai-spatial-medical-platform-firebase-adminsdk-fbsvc-7a7e0b88a2.json"
));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

module.exports = admin;