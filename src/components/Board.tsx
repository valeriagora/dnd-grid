import React, { useMemo, useState } from "react";
import { styled } from "@mui/material";
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Id, IRow, ICard, CardSize } from "../types";
import Row from "./Row";
import { createPortal } from "react-dom";
import Card from "./Card";

const RowsContainer = styled("div")({
  margin: "auto",
  padding: 20,
  width: 1000,
  boxSizing: "border-box",
  border: "1px solid #333",
  borderRadius: 16,
});

function generateId() {
  return Math.floor(Math.random() * 1001);
}

const swapArrayElements = function (
  arr: any[],
  indexA: number,
  indexB: number
) {
  const temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
  return arr;
};
function Board() {
  const [rows, setRows] = useState<IRow[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const rowIds = useMemo(() => rows.map((r) => r.id), [rows]);

  const [activeCard, setActiveCard] = useState<ICard | null>(null);

  const addRow = () => {
    const newColumn = {
      id: rows.length ? (rows[rows.length - 1].id as number) + 1 : 1,
      title: `Row ${rows.length + 1}`,
    };
    setRows([...rows, newColumn]);
  };
  const deleteRow = (id: Id) => {
    const filteredCols = rows.filter((c) => c.id !== id);
    setRows(filteredCols);
  };

  const addCard = (rowId: Id) => {
    const newCard: ICard = {
      id: generateId(),
      rowId,
      content: `Card ${cards.length + 1}`,
      size: CardSize.sm,
    };
    setCards([...cards, newCard]);
  };
  const deleteCard = (cardId: Id) => {
    const newCards = cards.filter((card) => card.id !== cardId);
    setCards(newCards);
  };

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Card") {
      setActiveCard(e.active.data.current?.card);
      return;
    }
  };

  console.log("cards", cards);
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Card";
    const isOverATask = over.data.current?.type === "Card";
    // console.log(" active", active);
    // console.log(" over", over);

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      console.log("DROPPING TASK OVER TASK");

      setCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        const overIndex = cards.findIndex((t) => t.id === overId);
        const activeCard = cards.find((c) => c.id === activeId)!;
        const overCard = cards.find((c) => c.id === overId)!;
        if (cards[activeIndex].rowId !== cards[overIndex].rowId) {
          console.log("rows are different", activeIndex, overIndex);
          const temp = cards[activeIndex].rowId;
          cards[activeIndex].rowId = cards[overIndex].rowId;
          cards[overIndex].rowId = temp;
          const res = swapArrayElements([...cards], activeIndex, overIndex).map(
            (c) => {
              if (c.id === activeId) {
                return {
                  ...c,
                  rowId: activeCard.rowId,
                };
              }
              if (c.id === overId) {
                return {
                  ...c,
                  rowId: overCard.rowId,
                };
              }
              return c;
            }
          );
          return res;
          // return arrayMove(cards, activeIndex, overIndex);
        }
        // console.log("else");
        return arrayMove(cards, activeIndex, overIndex);
      });
    }

    const isOverARow = over.data.current?.type === "Row";

    // dropping a Task over a row
    if (isActiveATask && isOverARow) {
      // console.log("if 2");
      setCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        // const overIndex = cards.findIndex((t) => t.id === overId);
        const activeCard = cards.find((c) => c.id === activeId)!;
        const overCard = cards.find((c) => c.id === overId)!;

        cards[activeIndex].rowId = overId;
        console.log("DROPPING TASK OVER ROW", activeCard, overCard);
        const arr = [...cards];

        const cardToAdd = cards.find((c) => c.id === activeId)!;
        const filtered = arr.filter((c) => c.id !== active.id);

        return [...filtered, cardToAdd];
      });
    }
  };
  return (
    <>
      <button onClick={() => addRow()}>Add row</button>
      <RowsContainer>
        <DndContext
          // collisionDetection={closestCorners}
          onDragStart={onDragStart}
          // onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={rowIds}>
            {rows.map((row) => (
              <Row
                deleteRow={deleteRow}
                addCard={addCard}
                deleteCard={deleteCard}
                row={row}
                cards={cards.filter((c) => c.rowId === row.id)}
                key={row.id}
              />
            ))}
          </SortableContext>
          {/*  */}
          {createPortal(
            <DragOverlay>
              {activeCard && <Card card={activeCard} deleteCard={deleteCard} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </RowsContainer>
    </>
  );
}

export default Board;
