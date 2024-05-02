import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  const { code } = req.query;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oauth/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code })
  });

  if (!response.ok) {
    res.redirect('/signin');
  } else {
    res.redirect('/');
  }
};

export default handler;