
const asyncHandler = require('../middleware/async');

exports.APIAuth = asyncHandler(asyncHandler(async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const signature = req.headers['signature'];
    const timestamp = req.headers['timestamp'];

    // Check if any of the required headers is missing
    if (!apiKey || !signature || !timestamp) {
        return res.status(401).json({ message: 'Missing required headers' });
    }

    // Calculate the current timestamp
    const currentTime = Date.now();
    
    // Define a tolerance window for timestamp verification (in milliseconds)
    const tolerance = 30000; // 30 seconds

    // Verify the timestamp within the tolerance window
    if (Math.abs(currentTime - timestamp) > tolerance) {
        return res.status(401).json({ message: 'Invalid timestamp' });
    }

    // Calculate the expected signature based on the request data and secret key
    const expectedSignature = crypto
        .createHmac('sha256', process.env.SECRET_KEY)
        .update(`${apiKey}${timestamp}`)
        .digest('hex');

    // Compare the expected signature with the received signature
    const buffSignature = Buffer.from(signature, "latin1");
    const buffExpSignature = Buffer.from(expectedSignature, "latin1");
    if (!crypto.timingSafeEqual(buffSignature,buffExpSignature)) {
        return res.status(401).json({ message: 'Invalid signature' });
    }

    // If all checks pass, continue to the next middleware or route handler
    next();
}));