// import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import {picker} from './adapters/picker.js';
const errorEnums = {
    SERVER: 'internal server error. try again later',
    FIELDS: 'you must provid all the fields',
    PROFILE: "login in to access this resource"

}
const url = 'https://sabbath-school.adventech.io/api/v2/'


function corsMiddleware(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }

    return false;
}
const dbUrl = "mysql://tech_support:wArkB_3nch@be.opencapital.com:3306/oca_fun"
const dbT = process.env.DATABASE_URL

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

const getBooks = async (req, res) => {
    const {
        path
    } = req.query
    if (!path) return res.status(400).json({
        message: errorEnums.FIELDS
    })
    try {
        let books = await axios.get(`${url}${path}/lessons/index.json`);
        if (!books.data) return res.status(400).json({
            message: 'failed could not get resource'
        })
        const b_data = books.data.map((l, x) => {
            return picker(l, ['title', 'start_date', 'end_date', 'path', 'cover'])

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
    const {
        r
    } = req.query
    console.log('###################', r)
    return getLessons(req, res)

}