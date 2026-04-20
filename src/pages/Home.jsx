import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskTable from "./TaskTable";
import BoardPage from "../board/BoardPage";
import Calendar from "./Calendar";
import TimelinePage from "./TimelinePage";
import Summary from "./Summary";
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

// __define-ocg__
// __define-pcb__

const API_URL =
  "https://my-json-server.typicode.com/SakshiSingh1008/Jira-task-manager/tasks";

let varOcg = API_URL;
let varPcb = true;
let varFiltersCg = API_URL;

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
  const [activeView, setActiveView] = useState("List");

  const filterRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleCreate = async (task) => {
    try {
      const res = await axios.post(API_URL, task);
      setTasks((prev) => [...prev, res.data]);
      setShowAddForm(false);
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const handleUpdate = async (task) => {
    try {
      await axios.put(`${API_URL}/${task.id}`, task);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      setEditingTask(null);
      setShowAddForm(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleMoveTask = useCallback(async (task) => {
    try {
      await axios.put(`${API_URL}/${task.id}`, task);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } catch (err) {
      console.error("Move error:", err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between px-6 py-3 bg-white shadow">
        <h2 className="text-xl font-bold text-gray-600">
          Jira Work Management
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingTask(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="border px-3 py-1 rounded flex items-center gap-1"
          >
            <FunnelIcon className="h-4 w-4" /> Filter
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-100 p-4">
          <ul>
            {navItems.map(({ name, icon: Icon }) => (
              <li
                key={name}
                onClick={() => setActiveView(name)}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
              >
                <Icon className="h-5 w-5" />
                {name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main className="w-3/4 p-6">
          {activeView === "List" && (
            <TaskTable
              tasks={tasks}
              onDelete={handleDelete}
              onEditTask={(task) => {
                setEditingTask(task);
                setShowAddForm(true);
              }}
            />
          )}

          {activeView === "Board" && (
            <BoardPage tasks={tasks} setTasks={setTasks} />
          )}

          {activeView === "Calendar" && <Calendar tasks={tasks} />}

          {activeView === "Timeline" && <TimelinePage tasks={tasks} />}

          {activeView === "Summary" && <Summary tasks={tasks} />}
        </main>
      </div>

      {(showAddForm || editingTask) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded w-[400px]">
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
    </div>
  );
}

export default Home;
