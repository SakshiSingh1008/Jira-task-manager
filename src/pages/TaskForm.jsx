// src/components/TaskForm.jsx
import React, { useEffect, useState } from "react";

// __define-ocg__
// __define-pcb__

let varOcg = "task-form";
let varPcb = true;
let varFiltersCg = {};

const TaskForm = ({
  task = null,
  mode = "add",
  onSave,
  onDelete,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    key: "",
    summary: "",
    status: "To Do",
    assignee: "",
    startDate: "",
    dueDate: "",
    priority: "Medium",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        key: task.key || "",
        summary: task.summary || "",
        status: task.status || "To Do",
        assignee: task.assignee?.name || "",
        startDate: task.startDate || "",
        dueDate: task.dueDate || "",
        priority: task.priority || "Medium",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedTask = {
      id: task?.id || Date.now(), // 🔥 important fix for new tasks
      key: formData.key,
      summary: formData.summary,
      status: formData.status,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      priority: formData.priority,
      assignee: {
        name: formData.assignee,
        avatar: `https://i.pravatar.cc/150?u=${formData.assignee}`,
      },
    };

    onSave(updatedTask);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        {mode === "edit" ? "Edit Task" : "Add New Task"}
      </h2>

      <input
        name="key"
        value={formData.key}
        onChange={handleChange}
        placeholder="Task Key"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="summary"
        value={formData.summary}
        onChange={handleChange}
        placeholder="Summary"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>

      <input
        name="assignee"
        value={formData.assignee}
        onChange={handleChange}
        placeholder="Assignee"
        className="w-full border px-3 py-2 rounded"
      />

      <div>
        <label className="text-sm font-medium">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm font-medium">End Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {mode === "edit" ? "Update" : "Add Task"}
          </button>
        </div>

        {mode === "edit" && (
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
