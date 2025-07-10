import corsMiddleware from "../../lib/cors.js";
import { Readable } from "stream";
import {
    Client
} from "basic-ftp";

export default async function handler(req, res) {
    const exited = corsMiddleware(req, res);
    if (exited) return;

    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }

    const {
        base64Image,
        filename
    } = req.body;

    if (!base64Image) {
        return res.status(400).json({
            message: "No base64 image provided"
        });
    }

    const client = new Client();
    client.ftp.verbose = true;

    try {
        const buffer = Buffer.from(
            base64Image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );

        await client.access({
            host: "ftp.adventband.org",
            user: "bucket@adventband.org",
            password: "m@jiMot0",
            secure: false
        });

        await client.cd("shop");

        // Upload buffer as file

        const stream = Readable.from(buffer);
        await client.uploadFrom(stream, filename); // ✅ works

        console.log("✅ Upload successful!");
        res.status(200).json({
            message: "Upload successful",
            filename
        });
    } catch (err) {
        console.error("❌ FTP upload failed:", err);
        res.status(500).json({
            message: "Upload failed",
            error: err.message
        });
    } finally {
        client.close();
    }
}