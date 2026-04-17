import React from "react";
import { useDraggable } from "@dnd-kit/core";

const getCardColor = (status) => {
  switch (status) {
    case "To Do":
      return "bg-red-100";
    case "In Progress":
      return "bg-blue-100";
    case "Done":
      return "bg-green-100";
    default:
      return "bg-white";
  }
};

const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useDraggable({
      id: task.id.toString(),
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`${getCardColor(
        task.status
      )} p-4 rounded-md shadow border border-gray-300 cursor-pointer`}
    >
      <div className="text-lg font-semibold text-gray-800 mb-1">
        {task.summary}
      </div>
      <div className="text-sm text-gray-600">Assignee: {task.assignee?.name}</div>
      <div className="text-sm text-gray-600">Due: {task.dueDate}</div>
      <div className="text-sm text-gray-600">Priority: {task.priority}</div>
    </div>
  );
};

export default TaskCard;
