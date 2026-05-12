const https = require('https');
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;

const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models?key=${key}`,
    method: 'GET'
};

const req = https.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            if (data.models) {
                console.log('--- AVAILABLE MODELS ---');
                data.models.forEach(m => {
                    console.log(` - ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                });
                console.log('--- END MODELS ---');
            } else {
                console.log('No models found in response:', body);
            }
        } catch (e) {
            console.log('Failed to parse response:', body);
        }
    });
});

req.on('error', (e) => { console.error('Error:', e.message); });
req.end();
