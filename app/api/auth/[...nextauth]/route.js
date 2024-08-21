import authOptions from '@/utils/authOptions';
import NextAuth from 'next-auth';

console.log("found auth option in route.js: ", await authOptions);
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Add debugging logs
// handler.get = async (req, res) => {
//   console.log('Handling GET request');
//   try {
//     await handler(req, res);
//   } catch (error) {
//     console.error('Error handling GET request:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// handler.post = async (req, res) => {
//   console.log('Handling POST request');
//   try {
//     await handler(req, res);
//   } catch (error) {
//     console.error('Error handling POST request:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
