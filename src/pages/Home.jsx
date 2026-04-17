import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import TaskForm from "./TaskForm";
import TaskTable from "./TaskTable";
import BoardPage from "../board/BoardPage";
import Calendar from "./Calendar";
import TimelinePage from "./TimelinePage";
import Summary from "./Summary";
import { useNavigate } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  ListBulletIcon,
  Squares2X2Icon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const STATUS_OPTIONS = ["To Do", "In Progress", "Done"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

const navItems = [
  { name: "Summary", icon: ClipboardDocumentListIcon },
  { name: "List", icon: ListBulletIcon },
  { name: "Board", icon: Squares2X2Icon },
  { name: "Calendar", icon: CalendarIcon },
  { name: "Timeline", icon: ClockIcon },
  { name: "Form", icon: DocumentTextIcon },
  { name: "Reports", icon: ChartBarIcon },
  { name: "Add Item", icon: PlusCircleIcon },
  { name: "Project Settings", icon: Cog6ToothIcon },
  { name: "Give Feedback", icon: ChatBubbleLeftRightIcon },
];

function Home() {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem("activeView") || "List";
  });

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");

  // Ref for filter dropdown to detect outside click
  const filterRef = useRef(null);

  // For dynamic assignee options
  const assigneeOptions = Array.from(
    new Set(tasks.map((t) => t.assignee?.name).filter(Boolean))
  );

  useEffect(() => {
    localStorage.setItem("activeView", activeView);
  }, [activeView]);

  // Handle click outside filter dropdown to close it
  useEffect(() => {
    if (!filterOpen) return;
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3001/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const handleCreate = async (newTask) => {
    try {
      const taskWithId = { ...newTask, id: uuidv4() };
      const res = await axios.post("http://localhost:3001/tasks", taskWithId);
      setTasks((prev) => [...prev, res.data]);
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleUpdate = async (updatedTask) => {
    try {
      await axios.put(
        `http://localhost:3001/tasks/${updatedTask.id}`,
        updatedTask
      );
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEditingTask(null);
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleMoveTask = useCallback(async (updatedTask) => {
    try {
      await axios.put(
        `http://localhost:3001/tasks/${updatedTask.id}`,
        updatedTask
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to move/update task:", err);
    }
  }, []);

  const navigate = useNavigate();

  const handleNavClick = useCallback(
    (name) => {
      if (name === "Board") setActiveView("Board");
      else if (name === "List") setActiveView("List");
      else if (name === "Add Item") {
        setShowAddForm(true);
        setEditingTask(null);
      } else if (name === "Calendar") {
        setActiveView("Calendar");
      } else if (name === "Timeline") {
        setActiveView("Timeline");
      }
      else if (name === "Summary") {
        setActiveView("Summary");
      }
    },
    [navigate]
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  const filteredTasks = tasks.filter((task) => {
    const term = debouncedSearchTerm.toLowerCase();
    let matches =
      String(task.title ?? "").toLowerCase().includes(term) ||
      String(task.description ?? "").toLowerCase().includes(term) ||
      String(task.assignee?.name ?? "").toLowerCase().includes(term) ||
      String(task.status ?? "").toLowerCase().includes(term) ||
      String(task.priority ?? "").toLowerCase().includes(term) ||
      String(task.summary ?? "").toLowerCase().includes(term) ||
      String(task.startDate ?? "").toLowerCase().includes(term);

    if (filterStatus && task.status !== filterStatus) matches = false;
    if (filterAssignee && task.assignee?.name !== filterAssignee) matches = false;
    if (filterPriority && task.priority !== filterPriority) matches = false;
    if (filterStartDate && task.startDate < filterStartDate) matches = false;
    if (filterDueDate && task.dueDate > filterDueDate) matches = false;

    return matches;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md w-full">
        <div className="flex items-center space-x-6 gap-6">
          <h2 className="text-2xl font-bold text-gray-500">
            Jira Work Management
          </h2>
          <ul className="hidden md:flex space-x-4 text-lg text-gray-700 font-medium gap-4">
            <li className="cursor-pointer hover:text-blue-600">Your Work</li>
            <li className="cursor-pointer hover:text-gray-700 text-blue-700">
              Projects
            </li>
            <li className="cursor-pointer hover:text-blue-600">Filters</li>
            <li className="cursor-pointer hover:text-blue-600">Dashboards</li>
            <li className="cursor-pointer hover:text-blue-600">People</li>
            <li className="cursor-pointer hover:text-blue-600">Apps</li>
          </ul>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingTask(null);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            Create
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1 border rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filter Button */}
          <div className="relative">
            <button
              className="flex items-center px-2 py-1 rounded text-gray-700 hover:bg-gray-200 border border-gray-300"
              onClick={() => setFilterOpen((open) => !open)}
            >
              <FunnelIcon className="h-5 w-5 mr-1" />
              Filter
            </button>
            {filterOpen && (
              <div
                className="absolute z-20 right-0 mt-2 w-72 bg-white rounded-xl border border-gray-300 shadow-lg p-4 space-y-3"
                ref={filterRef}
              >
                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Assignee Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={filterAssignee}
                    onChange={(e) => setFilterAssignee(e.target.value)}
                  >
                    <option value="">All</option>
                    {assigneeOptions.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Priority Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="">All</option>
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Start Date Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Start Date (From)
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded px-2 py-1"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                  />
                </div>
                {/* Due Date Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Due Date (Before)
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded px-2 py-1"
                    value={filterDueDate}
                    onChange={(e) => setFilterDueDate(e.target.value)}
                  />
                </div>
                <div className="flex justify-between gap-2 mt-2">
                  <button
                    className="px-3 py-1 bg-gray-100 rounded text-xs text-gray-700 border"
                    onClick={() => {
                      setFilterStatus("");
                      setFilterAssignee("");
                      setFilterPriority("");
                      setFilterStartDate("");
                      setFilterDueDate("");
                    }}
                  >
                    Clear
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded"
                    onClick={() => setFilterOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <span title="Notifications" className="text-xl cursor-pointer">
            🔔
          </span>
          <span title="Settings" className="text-xl cursor-pointer">
            ⚙️
          </span>
          <span title="Profile" className="text-xl cursor-pointer">
            👤
          </span>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-100 p-4 shadow-inner">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Task Tracking
          </h2>
          <ul className="space-y-1">
            {navItems.map(({ name, icon: Icon }) => (
              <li
                key={name}
                onClick={() => handleNavClick(name)}
                className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition ${
                  activeView === name
                    ? "bg-white font-semibold shadow-sm"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                <Icon className="h-5 w-5 mr-3 text-gray-600" />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-6 relative">
          {activeView === "List" && (
            <>
              <h1 className="text-2xl font-bold mb-4">List View</h1>
              <TaskTable
                tasks={filteredTasks}
                onDelete={handleDelete}
                setTasks={setTasks}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setShowAddForm(true);
                }}
              />
            </>
          )}
           {activeView === "Summary" && (
  <Summary tasks={filteredTasks} />
)}

          {activeView === "Board" && (
            <BoardPage
              tasks={filteredTasks}
              onMoveTask={handleMoveTask}
              onDeleteTask={handleDelete}
              onEditTask={(task) => {
                setEditingTask(task);
                setShowAddForm(true);
              }}
            />
          )}

          {activeView === "Calendar" && (
            <Calendar tasks={filteredTasks} />
          )}
          {activeView === "Timeline" && <TimelinePage tasks={filteredTasks} />}

          {(showAddForm || editingTask) && (
            <div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                bg-white shadow-2xl rounded-xl border border-gray-300 z-50 w-[40%] h-[80%] 
                transition-all duration-500 ease-in-out overflow-y-auto"
            >
              <div className="p-6">
                <TaskForm
                  task={editingTask}
                  mode={editingTask ? "edit" : "add"}
                  onSave={editingTask ? handleUpdate : handleCreate}
                  onDelete={handleDelete}
                  onCancel={() => {
                    setShowAddForm(false);
                    setEditingTask(null);
                  }}
                />
              </div>
            </div>
          )}

          {activeView === "List" && (
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingTask(null);
              }}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              + Add Item
            </button>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;

