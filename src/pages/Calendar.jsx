import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  addDays,
  isSameDay,
} from "date-fns";
import TaskForm from "./TaskForm";

function Calendar() {
  const API_URL =
    "https://my-json-server.typicode.com/SakshiSingh1008/Jira-task-manager/tasks";

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.toLowerCase());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleUpdate = async (updatedTask) => {
    try {
      await axios.put(`${API_URL}/${updatedTask.id}`, updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
      setEditingTask(null);
      setShowEditForm(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setEditingTask(null);
      setShowEditForm(false);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);

    const days = [];
    let day = monthStart;
    let taskNumber = 1;

    while (day <= monthEnd) {
      const filteredTasks = tasks.filter((task) => {
        const isStart = isSameDay(new Date(task.startDate), day);
        const isEnd = isSameDay(new Date(task.dueDate), day);
        const searchableText =
          (task.summary ?? "") +
          (task.description ?? "") +
          (task.assignee?.name ?? "") +
          (task.priority ?? "") +
          (task.status ?? "");

        return (
          (isStart || isEnd) &&
          searchableText.toLowerCase().includes(debouncedSearchTerm)
        );
      });

      days.push(
        <div
          key={day}
          className="border border-gray-300 p-2 h-32 overflow-auto flex flex-col bg-white"
        >
          <div className="text-xs font-bold text-gray-700 mb-1">
            {format(day, "d")}
          </div>

          {filteredTasks.length === 0 ? (
            <p className="text-xs text-gray-400">No tasks</p>
          ) : (
            filteredTasks.map((task, index) => {
              const isStart = isSameDay(new Date(task.startDate), day);
              return (
                <div
                  key={`${task.id}-${index}`}
                  className={`text-xs p-1 rounded mb-1 cursor-pointer ${
                    isStart
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  onClick={() => {
                    setEditingTask(task);
                    setShowEditForm(true);
                  }}
                >
                  #{taskNumber++} {isStart ? "Start" : "End"}: {task.summary}
                </div>
              );
            })
          )}
        </div>,
      );

      day = addDays(day, 1);
    }

    const rows = [];
    for (let i = 0; i < days.length; i += 5) {
      rows.push(
        <div className="grid grid-cols-5 gap-0" key={i}>
          {days.slice(i, i + 5)}
        </div>,
      );
    }

    return <div className="space-y-0">{rows}</div>;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 border rounded-md px-3 py-1 bg-white">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks"
            className="outline-none text-sm w-40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center text-sm text-gray-700">
            <FunnelIcon className="h-5 w-5 mr-1" />
            Filter
          </button>
          <button
            className="px-3 py-1 bg-gray-200 text-sm rounded"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </button>
          <div className="flex items-center space-x-1">
            <ChevronLeftIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            />
            <span className="text-sm font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <ChevronRightIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
          <div className="text-center font-bold text-sm" key={day}>
            {day}
          </div>
        ))}
      </div>

      {renderCells()}

      {(showEditForm || editingTask) && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-xl border w-[40%] h-[80%] overflow-y-auto">
          <div className="p-6">
            <TaskForm
              task={editingTask}
              mode="edit"
              onSave={handleUpdate}
              onDelete={handleDelete}
              onCancel={() => {
                setShowEditForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
