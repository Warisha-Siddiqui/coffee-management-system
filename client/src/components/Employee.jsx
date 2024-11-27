import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Employee = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [updateEmployeeId, setUpdateEmployeeId] = useState("");
  const [deleteEmployeeId, setDeleteEmployeeId] = useState("");

  const [formData, setFormData] = useState({
    employee_name: "",
    contact: "",
    salary: 0,
    hire_date: "",
    job_title: "",
    admin_id: 0,
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/employees");
        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setEmployees([]);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.employee_name &&
      employee.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle delete employee
  const handleDelete = async () => {
    if (!deleteEmployeeId) {
      alert("Please enter an Employee ID to delete.");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/employee/${deleteEmployeeId}`);
      alert(`Employee with ID ${deleteEmployeeId} deleted successfully.`);
      setEmployees(
        employees.filter(
          (emp) => emp.employee_id !== parseInt(deleteEmployeeId)
        )
      );
      setDeleteEmployeeId("");
    } catch (error) {
      alert("Failed to delete employee. Please check the Employee ID.");
    }
  };

  // Handle create or update employee submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (updateEmployeeId) {
        // Update employee
        await axios.put(
          `http://localhost:5000/employee/${updateEmployeeId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        alert("Employee updated successfully!");
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.employee_id === parseInt(updateEmployeeId)
              ? { ...emp, ...formData }
              : emp
          )
        );
        setUpdateEmployeeId("");
      } else {
        // Create new employee
        const response = await axios.post(
          "http://localhost:5000/employee/insert",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        alert("Employee submitted!");
        setEmployees([...employees, response.data]);
      }
      setShowForm(false);
      setFormData({
        employee_name: "",
        contact: "",
        salary: 0,
        hire_date: "",
        job_title: "",
        admin_id: 0,
      });
    } catch (error) {
      console.error("Error submitting employee data:", error);
    }
  };

  // Populate form with employee data for updating
  const handleUpdateClick = (id) => {
    const employee = employees.find((emp) => emp.employee_id === id);
    if (employee) {
      setFormData(employee);
      setUpdateEmployeeId(id);
      setShowForm(true);
    } else {
      alert("Employee not found!");
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMarkAttendance = () => {
    navigate("/employee/attendance");
  };

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <button
        className="bg-orange-400 py-2 px-4 mb-3 rounded-md text-white hover:bg-orange-500 "
        onClick={handleBack}
      >
        Back
      </button>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-5 font-bold text-orange-700">
          Employee Management
        </h1>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white text-sm px-3 py-2 rounded hover:bg-red-600 transition"
            >
              Delete Employee
            </button>
            <input
              type="text"
              value={deleteEmployeeId}
              onChange={(e) => setDeleteEmployeeId(e.target.value)}
              placeholder="Emp. ID"
              className="p-1 w-20 rounded border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={handleMarkAttendance}
            className="bg-[#5C4033] text-white text-sm px-3 py-2 rounded hover:bg-[#4A3328] transition"
          >
            Mark Attenance
          </button>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setUpdateEmployeeId("");
              setFormData({
                employee_name: "",
                contact: "",
                salary: 0,
                hire_date: "",
                job_title: "",
                admin_id: 0,
              });
            }}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
          >
            {showForm ? "Cancel" : "+ Create Employee"}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold text-orange-700 mb-4">
              {updateEmployeeId ? "Update Employee" : "Add New Employee"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="employee_name"
                  value={formData.employee_name}
                  onChange={handleInputChange}
                  placeholder="Employee Name"
                  className="p-3 rounded border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Contact"
                  className="p-3 rounded border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Salary"
                  className="p-3 rounded border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleInputChange}
                  placeholder="Hire Date"
                  className="p-3 rounded border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  placeholder="Job Title"
                  className="p-3 rounded border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="number"
                  name="admin_id"
                  value={formData.admin_id}
                  onChange={handleInputChange}
                  placeholder="Admin ID"
                  className="p-3 rounded border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white rounded shadow">
            <thead className="bg-orange-300 text-orange-900">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Salary</th>
                <th className="px-4 py-2">Hire Date</th>
                <th className="px-4 py-2">Job Title</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.employee_id}
                    className="text-center even:bg-orange-50"
                  >
                    <td className="border px-4 py-2">{employee.employee_id}</td>
                    <td className="border px-4 py-2">
                      {employee.employee_name}
                    </td>
                    <td className="border px-4 py-2">{employee.contact}</td>
                    <td className="border px-4 py-2">{employee.salary}</td>
                    <td className="border px-4 py-2">
                      {formatDate(employee.hire_date)}
                    </td>
                    <td className="border px-4 py-2">{employee.job_title}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleUpdateClick(employee.employee_id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-orange-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employee;
