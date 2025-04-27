// import type { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import {
  v4
} from 'uuid'
import 'dotenv/config';

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

export default async function handler(req, res) {
  const exited = corsMiddleware(req, res);
  if (exited) return;
  const {
    r
  } = req.query
  console.log('###################',r)
  res.status(200).json({
    message: "Hello from the API",
    data: r
  });


}