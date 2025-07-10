// import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import corsMiddleware from '../cors.js';
import { errorEnums } from '../../bff/utils/index.js';
import { picker } from '../../bff/adapters/picker.js';
import { lessons_url } from '../_creds.js';

const url = lessons_url

const getPdf = async (req, res) => {
    const {
        pdfUrl
    } = req.query
    if (!pdfUrl) return res.status(400).json({
        message: errorEnums.FIELDS
    })

    try {
        const response = await axios.get(pdfUrl, {
            responseType: 'arraybuffer'
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.send(response.data);

    } catch (err) {
        if (err) return res.status(400).json({
            message: err.message
        });
        res.status(500).json({
            message: errorEnums["SERVER"]
        });
        console.log(err.message);
    }
};

export default async function handler(req, res) {
    const exited = corsMiddleware(req, res);
    if (exited) return;
    return getPdf(req, res)
}