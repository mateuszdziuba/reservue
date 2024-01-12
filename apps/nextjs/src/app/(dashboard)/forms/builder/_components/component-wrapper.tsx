import type { UniqueIdentifier } from "@dnd-kit/core";
import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Trash } from "lucide-react";

import { Button } from "~/components/ui/button";

export function FormWrapper({
  id,
  name,
  onDeleteClick,
  children,
}: {
  id: UniqueIdentifier;
  name: string;
  onDeleteClick: () => void;
  children: ReactNode;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md border bg-white p-4"
    >
      <div className="flex w-full justify-between">
        <p>{name}</p>
        <div className="flex gap-2">
          <Button size="icon" variant="secondary">
            <Copy />
          </Button>
          <Button size="icon" onClick={onDeleteClick}>
            <Trash />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            {...attributes}
            {...listeners}
            className="text-secondary-foreground/50  h-auto cursor-grab p-1"
          >
            <GripVertical />
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
