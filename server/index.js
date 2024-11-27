import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import pool from "./utils/db.js";
dotenv.config({});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I am backend",
    success: true,
  });
});

app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminResult = await pool.query(
      "SELECT * FROM admin WHERE email = $1 and password = $2",
      [email, password]
    );
    if (adminResult.rows.length === 0) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const admin = adminResult.rows[0];
    return res.json({
      message: `Logged in`,
      success: true,
      admin: {
        admin_id: admin.admin_id,
        fullname: admin.admin_name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});

//create
app.post("/employee/insert", async (req, res) => {
  try {
    const { employee_name, contact, salary, hire_date, job_title, admin_id } =
      req.body;
    const newEmployee = await pool.query(
      `INSERT INTO EMPLOYEE (employee_name, contact, salary, hire_date, job_title, admin_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [employee_name, contact, salary, hire_date, job_title, admin_id]
    );
    return res.status(201).json(newEmployee.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
//delete employees/${deleteEmployeeId}

app.delete("/employee/:deleteEmployeeId", async (req, res) => {
  try {
    const delId = req.params.deleteEmployeeId;
    const newEmployee = await pool.query(
      `DELETE FROM EMPLOYEE WHERE employee_id = $1`,
      [delId]
    );
    return res.status(201).json(newEmployee.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//update employee/${updateEmployeeId}

app.put("/employee/:updateEmployeeId", async (req, res) => {
  try {
    const upId = req.params.updateEmployeeId;
    const { employee_name, contact, salary, hire_date, job_title, admin_id } =
      req.body;
    const newEmployee = await pool.query(
      `UPDATE EMPLOYEE SET employee_name = $1, contact= $2, salary = $3, hire_date = $4, job_title = $5, admin_id = $6 where employee_id = $7`,
      [employee_name, contact, salary, hire_date, job_title, admin_id, upId]
    );
    return res.status(201).json(newEmployee.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//view all
app.get("/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM EMPLOYEE");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// insert attendance
app.post("/employees/attendance", async (req, res) => {
  const { employee_id, date, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO attendance (employee_id, date, status) VALUES ($1, $2, $3) RETURNING *",
      [employee_id, date, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get attendance history
app.get("/employees/attendance", async (req, res) => {
  const { start_date, end_date } = req.query;
  try {
    const result = await pool.query(
      `SELECT a.id, a.employee_id, e.employee_name, a.date, a.status
       FROM attendance a
       JOIN employee e ON a.employee_id = e.employee_id
       WHERE a.date BETWEEN $1 AND $2
       ORDER BY a.date DESC, e.employee_name ASC`,
      [start_date, end_date]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching attendance history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/product", async (req, res) => {
  try {
    const { p_name, price, category, stock_quantity } = req.body;

    await pool.query("BEGIN");

    const newProduct = await pool.query(
      "INSERT INTO PRODUCT (p_name, price, category) VALUES ($1, $2, $3) RETURNING *",
      [p_name, price, category]
    );

    const p_id = newProduct.rows[0].p_id;

    const newInventory = await pool.query(
      "INSERT INTO INVENTORY (stock_quantity, last_restocked, product_id) VALUES ($1, CURRENT_DATE, $2) RETURNING *",
      [stock_quantity, p_id]
    );

    await pool.query("COMMIT");

    res.json({
      product: newProduct.rows[0],
      inventory: newInventory.rows[0],
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const allProducts = await pool.query(
      `SELECT 
         p.p_id, 
         p.p_name, 
         p.price, 
         p.category, 
         i.stock_quantity, 
         i.last_restocked 
       FROM PRODUCT p
       JOIN INVENTORY i ON p.p_id = i.product_id`
    );
    res.json(allProducts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get a product
app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query(
      `SELECT 
         p.p_id, 
         p.p_name, 
         p.price, 
         p.category, 
         i.stock_quantity, 
         i.last_restocked 
       FROM PRODUCT p
       JOIN INVENTORY i ON p.p_id = i.product_id
       WHERE p.p_id = $1`,
      [id]
    );
    res.json(product.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a product
app.put("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { p_name, price, category, stock_quantity } = req.body;

    await pool.query("BEGIN");

    const updateProduct = await pool.query(
      "UPDATE PRODUCT SET p_name = $1, price = $2, category = $3 WHERE p_id = $4 RETURNING *",
      [p_name, price, category, id]
    );

    const updateInventory = await pool.query(
      "UPDATE INVENTORY SET stock_quantity = $1, last_restocked = CURRENT_DATE WHERE product_id = $2 RETURNING *",
      [stock_quantity, id]
    );

    await pool.query("COMMIT");

    res.json({
      product: updateProduct.rows[0],
      inventory: updateInventory.rows[0],
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a product
app.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM PRODUCT WHERE p_id = $1", [id]);
    res.json("Product was deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/customer", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO CUSTOMER (c_name, email) 
       VALUES ($1, $2) 
       ON CONFLICT (email) DO UPDATE 
       SET c_name = EXCLUDED.c_name 
       RETURNING *`,
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating/updating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get customer details
app.get("/customer/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM CUSTOMER WHERE customer_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//insert orders
app.post("/orders", async (req, res) => {
  const {
    status,
    payment_method,
    order_details,
    customer_id,
    use_loyalty_points,
    discount,
  } = req.body;

  try {
    await pool.query("BEGIN");

    const orderResult = await pool.query(
      `
      INSERT INTO ORDERS (status, payment_method)
      VALUES ($1, $2)
      RETURNING *
      `,
      [status, payment_method]
    );

    const order = orderResult.rows[0];
    let total_bill = 0;

    for (let detail of order_details) {
      await pool.query(
        `
        INSERT INTO ORDER_DETAILS (quantity, price, order_id, p_id)
        VALUES ($1, $2, $3, $4)
        `,
        [detail.quantity, detail.price, order.order_id, detail.product_id]
      );

      total_bill += detail.quantity * detail.price;

      const inventoryUpdateResult = await pool.query(
        `
        UPDATE INVENTORY
        SET stock_quantity = stock_quantity - $1
        WHERE product_id = $2 AND stock_quantity >= $1
        RETURNING stock_quantity
        `,
        [detail.quantity, detail.product_id]
      );

      if (inventoryUpdateResult.rowCount === 0) {
        throw new Error(
          `Insufficient stock for product ID: ${detail.product_id}`
        );
      }
    }

    // Apply discount
    total_bill -= discount;

    await pool.query(
      `
      INSERT INTO BILLING (total_bill, discount, order_id)
      VALUES ($1, $2, $3)
      `,
      [total_bill, discount, order.order_id]
    );

    // Update customer loyalty points
    if (use_loyalty_points) {
      await pool.query(
        `
        UPDATE CUSTOMER
        SET loyalty_points = 0
        WHERE customer_id = $1
        `,
        [customer_id]
      );
    }

    // Add new loyalty points
    await pool.query(
      `
      UPDATE CUSTOMER
      SET loyalty_points = loyalty_points + $1
      WHERE customer_id = $2
      `,
      [Math.round(total_bill), customer_id]
    );

    await pool.query("COMMIT");

    res.status(201).json({ order, total_bill });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error processing order:", err.message);
    res.status(400).json({ message: err.message });

    if (err.message.includes("Insufficient stock")) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, b.total_bill
      FROM ORDERS o
      JOIN BILLING b ON o.order_id = b.order_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single order
app.get("/order/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const orderResult = await pool.query(
      `
      SELECT 
        o.*, 
        b.total_bill, b.discount
      FROM ORDERS o
      JOIN BILLING b ON o.order_id = b.order_id
      WHERE o.order_id = $1
    `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.rows[0];

    const detailsResult = await pool.query(
      `
      SELECT 
        od.*, 
        p.p_name, 
        i.stock_quantity
      FROM ORDER_DETAILS od
      JOIN PRODUCT p ON od.p_id = p.p_id
      LEFT JOIN INVENTORY i ON p.p_id = i.product_id
      WHERE od.order_id = $1
    `,
      [id]
    );

    order.details = detailsResult.rows;

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// order gets completed and it'll trigger the trigger
app.put("/order/:id/complete", async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const orderCheck = await client.query(
        `
        SELECT * FROM ORDERS WHERE order_id = $1 AND status = 'P'
      `,
        [id]
      );

      if (orderCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({ message: "Order not found or is already completed" });
      }

      await client.query(
        `
        UPDATE ORDERS
        SET status = 'C'
        WHERE order_id = $1
      `,
        [id]
      );

      await client.query("COMMIT");

      res.json({ message: `Order ID ${id} marked as completed and deleted` });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//delete order (completed)
app.delete("/order/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const orderCheck = await pool.query(
      `
      SELECT * FROM ORDERS WHERE order_id = $1 AND status = 'P'
    `,
      [id]
    );

    if (orderCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Order not found or is already completed" });
    }

    await pool.query(
      `
      DELETE FROM ORDER_DETAILS WHERE order_id = $1
    `,
      [id]
    );

    await pool.query(
      `
      DELETE FROM BILLING WHERE order_id = $1
    `,
      [id]
    );

    await pool.query(
      `
      DELETE FROM ORDERS WHERE order_id = $1
    `,
      [id]
    );

    res.json({ message: `Order ID ${id} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
