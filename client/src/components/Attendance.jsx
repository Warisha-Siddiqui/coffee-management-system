import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, addDays, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function AttendanceSystem() {
  const [employees, setEmployees] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [startDate, setStartDate] = useState(subDays(new Date(), 3));
  const [endDate, setEndDate] = useState(addDays(new Date(), 3));
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchAttendanceHistory();
  }, [startDate, endDate]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/employees/attendance?start_date=${format(
          startDate,
          "yyyy-MM-dd"
        )}&end_date=${format(endDate, "yyyy-MM-dd")}`
      );
      setAttendanceHistory(response.data);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.employee_name.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const dateRange = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const getAttendanceForDate = (employeeId, date) => {
    return attendanceHistory.find(
      (a) =>
        a.employee_id === employeeId &&
        format(a.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const handleMarkAttendance = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/employees/attendance",
        {
          employee_id: selectedEmployee.employee_id,
          date: format(currentDate, "yyyy-MM-dd"),
          status: attendanceStatus,
        }
      );
      if (response.status === 200) {
        alert("Attendance marked successfully");
        fetchAttendanceHistory();
      } else {
        alert("Error marking attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Error marking attendance");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] p-8">
      <button
        className="bg-[#5C4033] text-white py-2 px-4 rounded-md hover:bg-[#4A3328] mb-3 "
        onClick={handleBack}
      >
        Back
      </button>
      <h1 className="text-4xl font-bold text-[#5C4033] mb-8">
        Employee Attendance System
      </h1>
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#5C4033] mb-4">
            Mark Attendance
          </h2>
          <p className="text-gray-600 mb-4">
            Select an employee and mark their attendance
          </p>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="employee-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Employee
              </label>
              <input
                type="text"
                id="employee-search"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Type employee name..."
              />
            </div>
            {employeeSearch && (
              <ul className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-auto">
                {filteredEmployees.map((employee) => (
                  <li
                    key={employee.employee_id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setEmployeeSearch("");
                    }}
                  >
                    {employee.employee_name}
                  </li>
                ))}
              </ul>
            )}
            {selectedEmployee && (
              <div className="text-sm text-gray-600">
                Selected:{" "}
                <span className="font-semibold">
                  {selectedEmployee.employee_name}
                </span>
              </div>
            )}
            <div>
              <label
                htmlFor="attendance-date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="attendance-date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
                value={format(currentDate, "yyyy-MM-dd")}
                onChange={(e) => setCurrentDate(new Date(e.target.value))}
              />
            </div>
            <div>
              <label
                htmlFor="attendance-status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="attendance-status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <button
              onClick={handleMarkAttendance}
              className="w-full bg-[#5C4033] text-white py-2 px-4 rounded-md hover:bg-[#4A3328] transition duration-200"
            >
              Mark Attendance
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#5C4033] mb-4">
            Attendance History
          </h2>
          <p className="text-gray-600 mb-4">
            View and filter attendance records
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#F3E5D3]">
                  <th className="px-4 py-2 text-left text-xs font-medium text-[#5C4033] uppercase tracking-wider">
                    Employee
                  </th>
                  {dateRange.map((date) => (
                    <th
                      key={date.toISOString()}
                      className="px-4 py-2 text-center text-xs font-medium text-[#5C4033] uppercase tracking-wider"
                    >
                      {format(date, "MMM dd")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee.employee_id}
                    className="border-b border-[#F3E5D3]"
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-[#5C4033]">
                      {employee.employee_name}
                    </td>
                    {dateRange.map((date) => {
                      const attendance = getAttendanceForDate(
                        employee.employee_id,
                        date
                      );
                      return (
                        <td
                          key={date.toISOString()}
                          className="px-4 py-2 whitespace-nowrap text-lg text-center"
                        >
                          {attendance ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                attendance.status === "present"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {attendance.status == "present" ? "P" : "A"}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => {
                setStartDate(subDays(startDate, 7));
                setEndDate(subDays(endDate, 7));
              }}
              className="bg-[#F3E5D3] text-[#5C4033] py-2 px-4 rounded-md hover:bg-[#E6D0B5] transition duration-200"
            >
              Previous Week
            </button>
            <button
              onClick={() => {
                setStartDate(addDays(startDate, 7));
                setEndDate(addDays(endDate, 7));
              }}
              className="bg-[#F3E5D3] text-[#5C4033] py-2 px-4 rounded-md hover:bg-[#E6D0B5] transition duration-200"
            >
              Next Week
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
