export function withAuth(handler) {
    return async (req, res) => {
      const token = req.headers.authorization || '';
  
      if (!token || token !== 'Bearer your-secret-token') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      return handler(req, res);
    };
  }
  