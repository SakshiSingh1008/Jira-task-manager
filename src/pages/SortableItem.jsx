import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

function SortableItem({ id, children, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'pointer',
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={onClick} // ONLY on the row
    >
      {/* Add a drag handle cell if you want drag-and-drop */}
      <td {...listeners} style={{ cursor: 'grab', justifyContent:'center', display:"flex", fontSize:"15px",marginTop:"12px"}}>⠿</td>
      {children}
    </tr>
  );
}

export default SortableItem;





