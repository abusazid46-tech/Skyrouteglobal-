import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const dataPath = path.join(process.cwd(), 'data', 'config.json');

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function readData() {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Public GET endpoint
  if (req.method === 'GET') {
    try {
      const data = readData();
      const { section } = req.query;

      if (section) {
        res.status(200).json(data[section] || {});
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to read data' });
    }
    return;
  }

  // Protected endpoints
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  try {
    const data = readData();

    if (req.method === 'POST' || req.method === 'PUT') {
      const { section, content } = req.body;

      if (!section || !content) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      data[section] = content;
      writeData(data);

      res.status(200).json({ success: true });
    }

    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
