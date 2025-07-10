// import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import corsMiddleware from '../../../api/cors.js';
import { errorEnums } from '../../utils/index.js';
import { lessons_url } from '../../../api/_creds.js';
import {picker} from '../../utils/picker.js';

const getContent = async (req, res) => {
    const {
        id_pub,
        maxpuborder
    } = req.query
    try {
        // Make the request to the remote resource
        const response = await axios.get(`https://legacy.egwwritings.org/modules/writings/textview/getid_elementauto.php?id_pub=${id_pub}`);
        if (!response.data) return res.status(400).json({
            message: 'failed could not get resource'
        })
        console.log("#######", response.data.id_elementauto)
        console.log("#######", response.data.maxpuborder)
        let retContent = []
        let counter = 0
        let id_el = response.data.id_elementauto
        while(counter < response.data.maxpuborder){
        const content = await axios.get(`https://legacy.egwwritings.org/modules/writings/writingsview/showrecords.php?startID=${id_el}&amount=${response.data.maxpuborder.toString()}&initload=true&mobile=0`);
        let mid = content.data.elements.middle;

        let lastMid = mid[mid.length - 1].id_elementauto
        let lastOrd= mid[mid.length - 1].order
        id_el = lastMid + 1
        counter = lastOrd
        console.log(lastMid, id_el)
        console.log(counter, lastOrd)
        retContent = [...retContent, ...content.data.elements.middle]

        }

        // Send only the response data to the client
        res.status(200).json({
            message: 'estate media',
            data: {
                elements:{
                    middle:retContent
                }
            },
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
    return getContent(req, res)

}