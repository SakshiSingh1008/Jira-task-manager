import React from "react";
import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({ id, title, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="rounded-lg p-3 shadow-sm flex flex-col bg-gray-100 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-gray-700">{title}</h3>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};

export default DroppableColumn;
