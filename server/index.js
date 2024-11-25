import express from"express";
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

  app.post("/admin/login", async(req, res) => {
    try {
      const {email,password} = req.body;
      const adminResult = await pool.query(
        "SELECT * FROM admin WHERE email = $1 and password = $2",
        [email,password]
      );
      if (adminResult.rows.length === 0) {
        return res.status(401).json({
          message: "Incorrect email or password",
          success: false,
        });
      }
  
      const admin = adminResult.rows[0];
      console.log(admin);
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
 app.post("/employee/insert", async(req,res) => {
  try {
    const {
      employee_name,
      contact,
      salary,
      hire_date,
      job_title,
      admin_id,
    } = req.body;
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
 })
//delete employees/${deleteEmployeeId}

app.delete("/employee/:deleteEmployeeId", async(req,res) => {
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
 })

//update employee/${updateEmployeeId}

app.put("/employee/:updateEmployeeId", async(req,res) => {
  try {
    const upId = req.params.updateEmployeeId;
    const {
      employee_name,
      contact,
      salary,
      hire_date,
      job_title,
      admin_id,
    } = req.body;
    const newEmployee = await pool.query(
      `UPDATE EMPLOYEE SET employee_name = $1, contact= $2, salary = $3, hire_date = $4, job_title = $5, admin_id = $6 where employee_id = $7`,
      [employee_name, contact, salary, hire_date, job_title, admin_id, upId]
    );
    return res.status(201).json(newEmployee.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
 })

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

//view one
