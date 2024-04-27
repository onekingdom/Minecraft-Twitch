import express, { type NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import appwriteRoutes from "./routes/appwrite";

const app = express();
const port = process.env.WEBSERVER_PORT || 8000;

app.use(express.raw({ type: "*/*" }));
// Middlewareæ

app.use(cors());
app.use(helmet());



app.get("/", (req, res) => {
  return res.redirect("https://onekingdom.net");
});




app.use("/appwrite/", appwriteRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
