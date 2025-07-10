// import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import {picker} from '../../utils/picker.js';
import corsMiddleware from '../../../api/cors.js';
import { errorEnums } from '../../utils/index.js';
import { lessons_url } from '../../../api/_creds.js';

const url = lessons_url
const getDays = async (req, res) => {
    const {
        path
    } = req.query
    if (!path) return res.status(400).json({
        message: errorEnums.FIELDS
    })
    try {
        let books = await axios.get(`${url}${path}/days/index.json`);
        if (!books.data) return res.status(400).json({
            message: 'failed could not get resource'
        })
        const b_data = books.data.map((l, x) => {
            return picker(l, ['title', 'date', 'path'])

        })
        res.status(200).json({
            message: 'lessons media',
            data: b_data,
        });
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
    return getDays(req, res)
}