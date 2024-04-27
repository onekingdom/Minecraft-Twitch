import express from "express";
import crypto from "crypto";
import appwriteSessions from "../controller/appwrite/sessions";
import type { Request, Response } from "express";

const router = express.Router();
const app = express();

// Middleware to verify webhook signature
router.use((req: Request, res: Response, next) => {
  const signature = req.headers["x-appwrite-webhook-signature"];
  if (!signature) {
    console.log("No signature provided");

    return res.status(401).send("Unauthorized - No signature provided");
  }
  const payloadstring = req.body.toString();
  const url = req.protocol + "://" + req.get("host") + req.originalUrl;
  const checkSignaturestring: string = url + payloadstring;

  let token = crypto
    .createHmac("sha1", process.env.APPWRITE_WEBHOOK_SIGNATURE)
    .update(checkSignaturestring) // Make sure there isn't a space between the URL and body.
    .digest("base64");

  if (token !== signature) {
    return res.status(401).send("Unauthorized - Invalid signature");
  }

  if (req.is("*/json")) {
    try {
      // Parse raw data into JSON
      req.body = JSON.parse(req.body.toString());
    } catch (error) {
      return res.status(400).send("Bad Request - Invalid JSON data provided");
    }
  }
  next();
});



router.use("/session", appwriteSessions);








export default router;
