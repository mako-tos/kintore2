import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrainingMenu } from "@/types/training-menu";

interface Props {
  menu: TrainingMenu;
  onStatusChange: (id: string, status: number) => void;
}

export const TrainingMenuItem: React.FC<Props> = ({ menu, onStatusChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: "8px",
    padding: "12px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    touchAction: "none", // Recommended for dnd-kit
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span
          style={{ cursor: "grab", fontSize: "20px", userSelect: "none" }}
          {...listeners}
        >
          ☰
        </span>
        <span>{menu.name}</span>
      </div>
      <div>
        <button
          className={`pure-button ${
            menu.status === 0 ? "button-success" : "button-warning"
          }`}
          style={{
            backgroundColor: menu.status === 0 ? "#28a745" : "#dc3545",
            color: "white",
            fontSize: "0.8em",
          }}
          onClick={() => {
            onStatusChange(menu.id, menu.status === 0 ? 1 : 0);
          }}
        >
          {menu.status === 0 ? "有効" : "無効"}
        </button>
      </div>
    </div>
  );
};
