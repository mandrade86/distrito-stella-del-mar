"use client";

import { useRef, useState, type ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type Props<T> = {
  items: T[];
  getKey: (item: T, index: number) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  itemClassName?: string | ((item: T, index: number) => string);
};

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= list.length ||
    to >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Lista reordenable con HTML5 drag and drop (admin). */
export function SortableList<T>({
  items,
  getKey,
  onReorder,
  renderItem,
  className,
  itemClassName,
}: Props<T>) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => {
        const key = getKey(item, index);
        const extra =
          typeof itemClassName === "function"
            ? itemClassName(item, index)
            : itemClassName;

        return (
          <div
            key={key}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              if (over !== index) setOver(index);
            }}
            onDragLeave={() => {
              if (over === index) setOver(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const from = dragFrom.current;
              setDragging(null);
              setOver(null);
              dragFrom.current = null;
              if (from == null) return;
              onReorder(moveItem(items, from, index));
            }}
            className={cn(
              "flex items-stretch gap-2 border bg-white transition",
              dragging === index && "opacity-50",
              over === index &&
                dragging !== index &&
                "border-ocean ring-1 ring-ocean/40",
              extra ?? "border-navy/10",
            )}
          >
            <div
              draggable
              aria-label="Arrastrar para reordenar"
              title="Arrastrar para reordenar"
              className="flex cursor-grab items-center px-2 text-muted active:cursor-grabbing"
              onDragStart={(e) => {
                dragFrom.current = index;
                setDragging(index);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(index));
              }}
              onDragEnd={() => {
                setDragging(null);
                setOver(null);
                dragFrom.current = null;
              }}
            >
              <GripVertical className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 py-1 pr-2">{renderItem(item, index)}</div>
          </div>
        );
      })}
    </div>
  );
}
