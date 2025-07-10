// import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import corsMiddleware from '../cors.js';
import { errorEnums } from '../../bff/utils/index.js';
import { picker } from '../../bff/adapters/picker.js';
import { lessons_url } from '../_creds.js';

const url = lessons_url

const getRead = async (req, res) => {
    const {
        path
    } = req.query
    if (!path) return res.status(400).json({
        message: errorEnums.FIELDS
    })
    try {
        let books = await axios.get(`${url}${path}/read/index.json`);
        if (!books.data) return res.status(400).json({
            message: 'failed could not get resource'
        })
        const b_data = picker(books.data, ['id', 'content', 'path'])
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
    return getRead(req, res)
}