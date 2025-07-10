import {getLessons} from "../../bff/adapters/quarterlies/index.js";
import corsMiddleware from "../../bff/middlewares/cors.js";

export default async function handler(req, res) {
    const exited = corsMiddleware(req, res);
    if (exited) return;
    const {
        r
    } = req.query
    return getLessons(req, res)

}