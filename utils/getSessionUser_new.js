import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export const getSessionUser = async () => {
  try {
    // Fetch the session from NextAuth
    const session = await getServerSession(authOptions);

    // Check if the session exists and contains user data
    if (!session || !session.user) {
      console.warn('No session or user found.');
      return null;
    }

    // Return the user information
    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
      userId: session.user.id,
    };
  } catch (error) {
    // Log detailed error for debugging
    console.error('Error fetching session user:', error);
    return null;
  }
};
