import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

function TaskTable({ tasks = [], setTasks, onEditTask }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((task) => task.id === active.id);
    const newIndex = tasks.findIndex((task) => task.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(newTasks);
  };

  const renderStatus = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-semibold";
    switch (status) {
      case 'To Do':
        return <span className={`${base} bg-gray-200 text-gray-800`}>To Do</span>;
      case 'In Progress':
        return <span className={`${base} bg-blue-100 text-blue-700`}>In Progress</span>;
      case 'Done':
        return <span className={`${base} bg-green-100 text-green-800`}>Done</span>;
      default:
        return <span className={base}>{status}</span>;
    }
  };

  const renderPriority = (priority) => {
    const base = "font-semibold text-sm";
    switch (priority) {
      case 'High':
        return <span className={`${base} text-red-500`}>High</span>;
      case 'Medium':
        return <span className={`${base} text-yellow-500`}>Medium</span>;
      case 'Low':
        return <span className={`${base} text-green-500`}>Low</span>;
      default:
        return <span className={base}>{priority}</span>;
    }
  };

  const renderAssignee = (user) => {
    return (
      <div className="flex items-center gap-2">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
          </div>
        )}
        <span className="text-gray-800 font-medium text-sm">{user?.name}</span>
      </div>
    );
  };


  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <table className="w-full border table-auto text-sm">
         <thead className="bg-gray-100 text-gray-800 font-semibold">
  <tr>
    <th className="p-2">Drag & Drop</th>
    <th className="p-2 text-left">✔</th>
    <th className="p-2 text-left">Key</th>
    <th className="p-2 text-left">Summary</th>
    <th className="p-2 text-left">Status</th>
    <th className="p-2 text-left">Assignee</th>
    <th className="p-2 text-left">Start</th>
    <th className="p-2 text-left">Due</th>
    <th className="p-2 text-left">Priority</th>
  </tr>
</thead>
          <tbody>
            {tasks.map((task) => (
              <SortableItem
                key={task.id}
                id={task.id}
                onClick={() =>{
                  console.log("Row clicked", task);
                  onEditTask(task)}
                } 
              >
                <>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={task.status === 'Done'}
                      readOnly
                      onClick={e => e.stopPropagation()}
                    />
                  </td>
                  <td className="p-2 font-semibold">{task.key}</td>
                  <td className="p-2">{task.summary}</td>
                  <td className="p-2">{renderStatus(task.status)}</td>
                  <td className="p-2">{renderAssignee(task.assignee)}</td>
                  <td className="p-2">{task.startDate}</td>
                  <td className="p-2">{task.dueDate}</td>
                  <td className="p-2">{renderPriority(task.priority)}</td>
                </>
              </SortableItem>
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}

export default TaskTable;