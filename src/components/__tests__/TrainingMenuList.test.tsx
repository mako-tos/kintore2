import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TrainingMenuList } from "../TrainingMenuList";
import { TrainingMenu } from "@/types/training-menu";

// Mock dnd-kit
jest.mock("@dnd-kit/sortable", () => ({
  ...jest.requireActual("@dnd-kit/sortable"),
  useSortable: ({ id }: { id: string }) => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

const mockMenus: TrainingMenu[] = [
  {
    id: "1",
    name: "Menu 1",
    status: 0,
    sort_order: 0,
    user_id: "u1",
    created_at: "2023-01-01",
  },
  {
    id: "2",
    name: "Menu 2",
    status: 1,
    sort_order: 1,
    user_id: "u1",
    created_at: "2023-01-02",
  },
];

describe("TrainingMenuList", () => {
  it("renders menus", () => {
    render(
      <TrainingMenuList
        menus={mockMenus}
        onReorder={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

    expect(screen.getByText("Menu 1")).toBeInTheDocument();
    expect(screen.getByText("Menu 2")).toBeInTheDocument();
    expect(screen.getByText("有効")).toBeInTheDocument();
    expect(screen.getByText("無効")).toBeInTheDocument();
  });

  it("calls onStatusChange when status button is clicked", async () => {
    const user = userEvent.setup();
    const handleStatusChange = jest.fn();
    render(
      <TrainingMenuList
        menus={mockMenus}
        onReorder={jest.fn()}
        onStatusChange={handleStatusChange}
      />
    );

    await user.click(screen.getByText("有効"));
    expect(handleStatusChange).toHaveBeenCalledWith("1", 1);

    await user.click(screen.getByText("無効"));
    expect(handleStatusChange).toHaveBeenCalledWith("2", 0);
  });
});
