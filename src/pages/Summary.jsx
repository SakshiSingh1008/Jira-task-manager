// src/components/Summary.jsx
import React from "react";
import {
  ClipboardIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  "To Do": "#9CA3AF", // gray
  "In Progress": "#FACC15", // yellow
  "Done": "#4ADE80", // green
};

const Summary = ({ tasks = [] }) => {
  const createdCount = tasks.length;
  const assignedCount = tasks.filter((task) => task.assignee).length;

  const toDoCount = tasks.filter((t) => t.status === "To Do").length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;
  const doneCount = tasks.filter((t) => t.status === "Done").length;

  // Bar chart data based on priority and status
  const barData = ["High", "Medium", "Low"].map((priority) => {
    const getCount = (status) =>
      tasks.filter((t) => t.priority === priority && t.status === status).length;

    return {
      priority,
      "To Do": getCount("To Do"),
      "In Progress": getCount("In Progress"),
      "Done": getCount("Done"),
    };
  });

  const pieData = [
    { name: "To Do", value: toDoCount },
    { name: "In Progress", value: inProgressCount },
    { name: "Done", value: doneCount },
  ];

  return (
    <div className="p-6">
      {/* Overview */}
      <h2 className="text-2xl font-bold mb-6 text-black">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {/* Created Tasks */}
        <div className="flex items-center bg-white border border-gray-200 shadow-md rounded-xl p-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <ClipboardIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-black text-sm">Tasks Created</p>
            <h3 className="text-xl font-bold text-blue-700">{createdCount}</h3>
          </div>
        </div>

        {/* Assigned Tasks */}
        <div className="flex items-center bg-white border border-gray-200 shadow-md rounded-xl p-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <UserGroupIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-black text-sm">Tasks Assigned</p>
            <h3 className="text-xl font-bold text-indigo-700">{assignedCount}</h3>
          </div>
        </div>
      </div>

      {/* Workload Section */}
      <h2 className="text-2xl font-bold mb-6 text-black">Workload</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* To Do */}
        <div className="flex items-center bg-white border border-gray-200 shadow-md rounded-xl p-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <ClipboardIcon className="h-6 w-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-black text-sm">To Do</p>
            <h3 className="text-xl font-bold text-gray-800">{toDoCount}</h3>
          </div>
        </div>

        {/* In Progress */}
        <div className="flex items-center bg-white border border-gray-200 shadow-md rounded-xl p-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-black text-sm">In Progress</p>
            <h3 className="text-xl font-bold text-yellow-700">{inProgressCount}</h3>
          </div>
        </div>

        {/* Done */}
        <div className="flex items-center bg-white border border-gray-200 shadow-md rounded-xl p-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-black text-sm">Done</p>
            <h3 className="text-xl font-bold text-green-700">{doneCount}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl border shadow-md h-[400px]">
          <h3 className="text-lg font-semibold text-black mb-4">Task Distribution by Priority</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData}>
              <XAxis dataKey="priority" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="To Do" stackId="a" fill={STATUS_COLORS["To Do"]} barSize={40} />
              <Bar dataKey="In Progress" stackId="a" fill={STATUS_COLORS["In Progress"]} barSize={40} />
              <Bar dataKey="Done" stackId="a" fill={STATUS_COLORS["Done"]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
       <div className="bg-white p-4 rounded-xl border shadow-md h-[400px]">
  {/* Heading at the top */}
  <h3 className="text-lg font-semibold text-black mb-4">Workload Status</h3>

  {/* Pie chart and legend side by side */}
  <div className="flex items-center h-full">
    <ResponsiveContainer width="50%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={105}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
        >
          {pieData.map((entry) => (
            <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    {/* Legend on the right */}
    <div className="ml-6 space-y-3">
      {pieData.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[entry.name] }}
          />
          <span className="text-black font-medium">{entry.name} - {entry.value}</span>
        </div>
      ))}
    </div>
  </div>
</div>
</div>
    </div>
  );
};

export default Summary;






