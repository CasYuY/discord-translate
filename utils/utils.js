import axios from "axios";

export async function GetSelectedMessage(channelId, messageId, botToken) {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;
  const headers = {
    Authorization: `Bot ${botToken}`,
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (err) {
    console.error(
      "Error fetching single message:",
      err.response?.data || err.message,
    );
    throw err;
  }
}
