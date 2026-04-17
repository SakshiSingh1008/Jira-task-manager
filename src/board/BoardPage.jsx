import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaFilter } from "react-icons/fa";

const columns = ["To Do", "In Progress", "Done"];

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

const BoardPage = ({ tasks, onMoveTask,onDeleteTask, onEditTask  }) => {
  const [editingTask, setEditingTask] = useState(null);

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  const handleDragEnd = (result) => {
    if (
      !result.destination ||
      result.source.droppableId === result.destination.droppableId
    )
      return;

    const { draggableId, destination } = result;
    const task = tasks.find((t) => t.id.toString() === draggableId);
    if (!task) return;

    const updatedTask = { ...task, status: destination.droppableId };
    onMoveTask(updatedTask);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTask((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-full w-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Board View</h2>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((id) => (
            <img
              key={id}
              src={`https://i.pravatar.cc/150?img=${id + 10}`}
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-white -ml-2"
            />
          ))}
          <div className="flex items-center gap-1 text-gray-600 cursor-pointer ml-4">
            <FaFilter className="text-gray-600" />
            <span className="text-sm font-medium">Filter</span>
          </div>
        </div>
      </div>

      {/* Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6 h-[75vh]">
          {columns.map((col) => {
            const colTasks = getTasksByStatus(col);
            return (
              <Droppable droppableId={col} key={col}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="rounded-lg p-3 shadow-sm flex flex-col bg-gray-100"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold text-gray-700">
                        {col} ({colTasks.length})
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto">
                      {colTasks.map((task, index) => (
                        <Draggable
                          key={task.id.toString()}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${getCardColor(
                                task.status
                              )} p-4 rounded-md shadow border border-gray-300 cursor-pointer`}
                              onClick={() => onEditTask(task)}
                            >
                              <div className="text-lg font-semibold text-gray-800 mb-1">
                                {task.summary}
                              </div>
                              <div className="text-sm text-gray-600">
                                Assignee: {task.assignee?.name}
                              </div>
                              <div className="text-sm text-gray-500">
  Start: {task.startDate || "N/A"}
</div>

                              <div className="text-sm text-gray-600">
                                Due: {task.dueDate}
                              </div>
                              <div className="text-sm text-gray-600">
                                Priority: {task.priority}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {editingTask && (
  <div className="fixed top-16 right-8 z-50">
    <TaskForm
      task={editingTask}
      onSave={(updated) => {
        onMoveTask(updated);
        setEditingTask(null);
      }}
      onDelete={(id) => {
        onDeleteTask(id);
        setEditingTask(null);
      }}
      onCancel={() => setEditingTask(null)}
      mode="edit"
    />
  </div>
)}

   
    </div>
  );
};

export default BoardPage;

