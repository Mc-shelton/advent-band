// import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { errorEnums } from '../../lib/utils.js';
import { picker } from '../../lib/picker.js';
import { lessons_url } from '../../lib/_creds.js';

const url = lessons_url
const getLessons = async (req, res) => {
    try {

        let books = await axios.get(`${url}en/quarterlies/index.json`);
        if (!books.data) return res.status(400).json({
            message: 'failed could not get resource'
        })
        const b_data = books.data.filter((l) => {
            if (!l.quarterly_group) return false
            return l['quarterly_group']['name'] == 'Standard Adult'
        }).map((l, x) => {
            return picker(l, ['path', 'title', 'cover', 'splash'])

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


export default getLessons