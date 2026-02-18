const express = require("express");
const { Pool } = require("pg");
const { loadEnv } = require("./loadEnv");

loadEnv();

const app = express();
const PORT = process.env.PORT || 3001;
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || "localhost",
      port: Number.parseInt(process.env.PGPORT || "5432", 10),
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "",
      database: process.env.PGDATABASE || "permashare",
    };
const pool = new Pool(poolConfig);
const editablePropertyFields = [
  "current_salary_pool",
  "deposit_goal",
  "mortgage_rate",
  "house_value",
];
const editablePropertyFieldSet = new Set(editablePropertyFields);

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/houses/:house_id/listing_price", async (req, res) => {
  const house_id = Number.parseInt(req.params.house_id, 10);

  if (!Number.isInteger(house_id) || house_id <= 0) {
    return res.status(400).json({ error: "house_id must be a positive integer." });
  }

  try {
    const result = await pool.query(
      'SELECT house_id, listing_price FROM "HouseDetails" WHERE house_id = $1',
      [house_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "House not found." });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch listing_price:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/houses/:house_id/listing_price", async (req, res) => {
  const house_id = Number.parseInt(req.params.house_id, 10);
  const { listing_price } = req.body;

  if (!Number.isInteger(house_id) || house_id <= 0) {
    return res.status(400).json({ error: "house_id must be a positive integer." });
  }

  if (typeof listing_price !== "number" || !Number.isFinite(listing_price)) {
    return res.status(400).json({ error: "listing_price must be a valid number." });
  }

  try {
    const result = await pool.query(
      'UPDATE "HouseDetails" SET listing_price = $1 WHERE house_id = $2 RETURNING house_id, listing_price',
      [listing_price, house_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "House not found." });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update listing_price:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/houses/:house_id/property-details", async (req, res) => {
  const house_id = Number.parseInt(req.params.house_id, 10);

  if (!Number.isInteger(house_id) || house_id <= 0) {
    return res.status(400).json({ error: "house_id must be a positive integer." });
  }

  try {
    const result = await pool.query(
      'SELECT house_id, current_salary_pool, deposit_goal, mortgage_rate, house_value FROM "HouseDetails" WHERE house_id = $1',
      [house_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "House not found." });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch property details:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.patch("/api/houses/:house_id/property-details", async (req, res) => {
  const house_id = Number.parseInt(req.params.house_id, 10);

  if (!Number.isInteger(house_id) || house_id <= 0) {
    return res.status(400).json({ error: "house_id must be a positive integer." });
  }

  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Request body must be a JSON object." });
  }

  const updates = Object.entries(req.body).filter(([key]) =>
    editablePropertyFieldSet.has(key)
  );

  if (updates.length === 0) {
    return res.status(400).json({
      error:
        "Provide at least one editable field: current_salary_pool, deposit_goal, mortgage_rate, house_value.",
    });
  }

  for (const [field, value] of updates) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      return res
        .status(400)
        .json({ error: `${field} must be a non-negative number.` });
    }

    if (field === "mortgage_rate" && value > 100) {
      return res
        .status(400)
        .json({ error: "mortgage_rate must be less than or equal to 100." });
    }
  }

  const updateParts = [];
  const queryParams = [];

  updates.forEach(([field, value], index) => {
    updateParts.push(`${field} = $${index + 1}`);
    queryParams.push(value);
  });

  queryParams.push(house_id);
  const houseIdParamIndex = queryParams.length;

  const query = `UPDATE "HouseDetails" SET ${updateParts.join(
    ", "
  )} WHERE house_id = $${houseIdParamIndex} RETURNING house_id, current_salary_pool, deposit_goal, mortgage_rate, house_value`;

  try {
    const result = await pool.query(query, queryParams);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "House not found." });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update property details:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
