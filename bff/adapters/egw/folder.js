// import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import corsMiddleware from '../cors.js';
import { errorEnums } from '../../bff/utils/index.js';
import { lessons_url } from '../_creds.js';
import {picker} from '../../bff/adapters/picker.js';

const getFolder = async (req, res) => {
    const {
        url
    } = req.query
    try {
        // Make the request to the remote resource
        const response = await axios.get(`https://legacy.egwwritings.org/modules/writings/tree/treedata.php?parentnode=${url}`);

        // Send only the response data to the client
        res.status(200).json({
            message: 'estate media',
            data: response.data,
        });

    } catch (err) {
        console.error('Error fetching estate data:', err.message);

        res.status(500).json({
            message: 'Server error: unable to fetch estate data',
            error: err.message,
        });
    }
};

export default async function handler(req, res) {
    const exited = corsMiddleware(req, res);
    if (exited) return;
    const {
        r
    } = req.query
    return getFolder(req, res)

}