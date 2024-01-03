import Express from "express";
import cors from "cors";
import "./DB/mongoose.js";
import * as url from "url";
import path from "path";
import { userRouter } from "./routers/user.router.js";

const app = Express();
const __dirname = url.fileURLToPath(new URL("./", import.meta.url));
const publicPath = path.join(__dirname, "build");
app.use(Express.static("public"));

app.use(Express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use(Express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/Bids", bidRouter);
app.use("/ForgingBids", forgingRouter);
app.use("/Inventory", inventoryRouter);
app.use("/Calc", calcRouter);

app.listen(PORT, () => {
  console.log("connecting to port", PORT);
});
