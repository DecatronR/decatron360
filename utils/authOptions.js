import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Send credentials to your backend for authentication
          const response = await axios.post('http://localhost:8080/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.status === 200) {
            // If authentication is successful, return user details
            console.log("response data", response.data);
            const user = response.data;

            // Optionally save user to database if needed
            // await User.create({ email: user.email, ... });

            return user; // Return user object if authentication is successful
          }

          return null; // Return null if authentication fails
        } catch (error) {
          console.error('Error during authorization:', error);
          return null; // Return null if there's an error
        }
      },
    }),
  ],
  callbacks: {
    // Modify the session object
    async session({ session, token }) {
      // Optionally enrich the session with additional data
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.image;
      return session;
    },
    // Token callback to include additional user information
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin', // Customize the sign-in page if you have one
  },
};

export default NextAuth(authOptions);
