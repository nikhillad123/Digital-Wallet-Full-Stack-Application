const requiredEnvVars = [
    "MONGO_URI",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "EMAIL_USER",
    "EMAIL_PASS"
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(
            `Missing required environment variable: ${envVar}`
        );
    }
}

module.exports = process.env;