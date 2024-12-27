import express from "express";
import cors from "cors";
import bookRoutes from "./routes/books";
import customerRoutes from "./routes/customers";
import orderRoutes from "./routes/orders";
import cartRoutes from "./routes/carts";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
