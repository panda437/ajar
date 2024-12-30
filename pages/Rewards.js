export default function handler(req, res) {
    if (req.method === 'POST') {
      const { name, reward } = req.body;
      // Save the reward logic
      res.status(200).json({ message: `${name} rewarded with ${reward}` });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }