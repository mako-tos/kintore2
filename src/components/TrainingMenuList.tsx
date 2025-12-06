import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TrainingMenu } from "@/types/training-menu";
import { TrainingMenuItem } from "./TrainingMenuItem";

interface Props {
  menus: TrainingMenu[];
  onReorder: (menus: TrainingMenu[]) => void;
  onStatusChange: (id: string, status: number) => void;
}

export const TrainingMenuList: React.FC<Props> = ({
  menus,
  onReorder,
  onStatusChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = menus.findIndex((item) => item.id === active.id);
      const newIndex = menus.findIndex((item) => item.id === over.id);

      const newMenus = arrayMove(menus, oldIndex, newIndex);
      // Update sort_order locally
      const updatedMenus = newMenus.map((menu, index) => ({
        ...menu,
        sort_order: index,
      }));

      onReorder(updatedMenus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={menus.map((m) => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {menus.map((menu) => (
            <TrainingMenuItem
              key={menu.id}
              menu={menu}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
