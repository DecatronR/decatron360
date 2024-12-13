import axios from "axios";

export const fetchSinglePost = async (postId, accessToken) => {
  const url = `https://graph.facebook.com/v16.0/${postId}`;
  const fields = "message,created_time,attachments";

  try {
    const response = await axios.get(url, {
      params: {
        fields,
        access_token: accessToken,
      },
    });

    const postDetails = response.data;
    console.log("Post details:", postDetails);
    return postDetails;
  } catch (error) {
    console.error("Error fetching post details:", error.message);
    throw error;
  }
};
