import "dotenv/config";
import express from "express";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import { GetSelectedMessage } from "./utils/utils.js";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
const ai = new GoogleGenAI({});

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async function (req, res) {
    const { application_id, type, data, channel, token } = req.body;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

      // "translate" command
      if (name === "trans`late") {
        // deferred response
        res.send({ type: 5 });

        const message = await GetSelectedMessage(
          channel.id,
          data.target_id,
          process.env.DISCORD_TOKEN,
        );
        console.log("message", message.content);

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `translate the following message to chinese: ${message.content}`,
        });
        console.log("response", response.text);

        // send response
        return axios.post(
          `https://discord.com/api/v10/webhooks/${application_id}/${token}`,
          {
            content: response.text,
          },
        );
      }

      console.error(`unknown command: ${name}`);
      return res.status(400).json({ error: "unknown command" });
    }

    console.error("unknown interaction type", type);
    return res.status(400).json({ error: "unknown interaction type" });
  },
);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
