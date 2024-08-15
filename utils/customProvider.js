import axios from 'axios';

const CustomProvider = {
  id: 'custom',
  name: 'Custom API',
  type: 'oauth',
  version: '2.0',
  // Your authorization, token, and user info endpoints
  authorization: {
    url: 'http://localhost:8080/auth/login',
    params: {
      scope: 'openid profile email',
      // Include any other necessary params for your API
    },
  },
  // Provide your token endpoint
  token: {
    url: 'http://localhost:8080/auth/login', // Modify if different
    params: {
      grant_type: 'authorization_code',
    },
  },
  // Define how to extract the user profile
  userinfo: {
    url: 'http://localhost:8080/users/editUsers',
  },
  profile(profile) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.image,
    };
  },
};
export default CustomProvider;
