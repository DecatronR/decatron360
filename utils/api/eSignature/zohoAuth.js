import axios from "axios";

const CLIENT_ID = process.env.ZOHO_SIGN_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_SIGN_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.ZOHO_SIGN_REFRESH_TOKEN;
const TOKEN_URL = process.env.ZOHO_SIGN_TOKEN_URL;

// Store the access token in memory (You can store in Redis, DB, etc.)
let accessToken = null;

/**
 *  Function to Get a New Access Token
 */
const getAccessToken = async () => {
  try {
    const response = await axios.post(
      `${TOKEN_URL}?refresh_token=${REFRESH_TOKEN}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=https%3A%2F%2Fsign.zoho.com&grant_type=refresh_token`
    );

    accessToken = response.data.access_token;
    console.log("🔄 Access Token Refreshed:", accessToken);
    return accessToken;
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response?.data || error
    );
    throw error;
  }
};
