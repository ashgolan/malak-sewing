import Express from "express";
import cors from "cors";
import "./DB/mongoose.js";
import { inventoryRouter } from "./routers/inventory.router.js";
import * as url from "url";
import path from "path";
import { providerRouter } from "./routers/provider.router.js";
import { saleRouter } from "./routers/sale.router.js";
import { userRouter } from "./routers/user.router.js";
import { contactRouter } from "./routers/contact.router.js";
import { sleevesBidRouter } from "./routers/sleevesBid.router.js";
import { expenseRouter } from "./routers/expense.router.js";
import { workersExpensesRouter } from "./routers/workersExpenses.router.js";
import { bidRouter } from "./routers/bid.router.js";
import { eventsRouter } from "./routers/events.router.js";
import { saleToCompanyRouter } from "./routers/saleToCompany.router.js";
import { companyRouter } from "./routers/company.router.js";
import { InstitutionRouter } from "./routers/institutionTax.router.js";
import { taxValuesRouter } from "./routers/taxValues.router.js";

const app = Express();
const __dirname = url.fileURLToPath(new URL("./", import.meta.url));
const publicPath = path.join(__dirname, "build");
app.use(Express.static("public"));

app.use(Express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use(Express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/inventories", inventoryRouter);
app.use("/providers", providerRouter);
app.use("/bids", bidRouter);
app.use("/sales", saleRouter);
app.use("/salesToCompanies", saleToCompanyRouter);
app.use("/contacts", contactRouter);
app.use("/sleevesBids", sleevesBidRouter);
app.use("/expenses", expenseRouter);
app.use("/workersExpenses", workersExpensesRouter);
app.use("/events", eventsRouter);
app.use("/companies", companyRouter);
app.use("/institutionTax", InstitutionRouter);
app.use("/taxValues", taxValuesRouter);
app.listen(PORT, () => {
  console.log("connecting to port", PORT);
});
