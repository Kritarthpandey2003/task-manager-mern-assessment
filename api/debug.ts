import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        message: 'Debug endpoint works via TS in Root!',
        time: new Date().toISOString(),
        query: req.query,
        cookies: req.cookies,
    });
}
