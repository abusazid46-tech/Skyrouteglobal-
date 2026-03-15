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
  // Set CORS headers
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

  // Public GET endpoint - no auth required
  if (req.method === 'GET') {
    try {
      const data = readData();
      const { type, id } = req.query;

      if (type && id) {
        // Return specific package
        const packages = data.packages[type] || [];
        const pkg = packages.find(p => p.id === id);
        if (pkg) {
          res.status(200).json(pkg);
        } else {
          res.status(404).json({ error: 'Package not found' });
        }
      } else if (type) {
        // Return all packages of a type
        res.status(200).json(data.packages[type] || []);
      } else {
        // Return all packages
        res.status(200).json(data.packages);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to read data' });
    }
    return;
  }

  // Protected endpoints - require authentication
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

    // POST - Add new package
    if (req.method === 'POST') {
      const { type, pkg } = req.body;
      
      if (!type || !pkg) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      if (!data.packages[type]) {
        data.packages[type] = [];
      }

      // Generate unique ID
      pkg.id = `${type}-${Date.now()}`;
      data.packages[type].push(pkg);
      writeData(data);

      res.status(201).json({ success: true, pkg });
    }

    // PUT - Update package
    else if (req.method === 'PUT') {
      const { type, id, pkg } = req.body;

      if (!type || !id || !pkg) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const index = data.packages[type]?.findIndex(p => p.id === id);
      if (index === -1 || index === undefined) {
        res.status(404).json({ error: 'Package not found' });
        return;
      }

      pkg.id = id; // Preserve the ID
      data.packages[type][index] = pkg;
      writeData(data);

      res.status(200).json({ success: true, pkg });
    }

    // DELETE - Remove package
    else if (req.method === 'DELETE') {
      const { type, id } = req.query;

      if (!type || !id) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const initialLength = data.packages[type]?.length;
      data.packages[type] = data.packages[type]?.filter(p => p.id !== id) || [];

      if (data.packages[type].length === initialLength) {
        res.status(404).json({ error: 'Package not found' });
        return;
      }

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
