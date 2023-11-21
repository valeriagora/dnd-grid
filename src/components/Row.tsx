import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { styled } from "@mui/material";
import React, { useMemo } from "react";
import { ICard, Id, IRow } from "../types";
import Card from "./Card";
import { CSS } from "@dnd-kit/utilities";

const RowContainer = styled("div")(() => ({
  border: "1px solid #444",
  width: "100%",
  minHeight: "200px",
  // display: "flex",
  // gap: 20,
  // alignItems: "center",
  // justifyContent: "space-between",
  borderRadius: 20,
  padding: 20,
  boxSizing: "border-box",
  //
  position: "relative",
}));

interface IRowProps {
  row: IRow;
  cards: ICard[];
  deleteRow: (rowId: Id) => void;
  deleteCard: (cardId: Id) => void;
  addCard: (rowId: Id) => void;
}

function Row({ row, cards, deleteRow, deleteCard, addCard }: IRowProps) {
  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);
  // console.log("row cards", cards);
  const {
    setNodeRef,
    // attributes,
    // listeners,
    // transform,
    // transition,
    // isDragging,
  } = useSortable({
    id: row.id,
    data: {
      type: "Row",
      row,
    },
  });

  return (
    <>
      {/* {row.title} */}
      <RowContainer
        // style={style}
        ref={setNodeRef}
        // {...attributes}
        // {...listeners}
      >
        <button
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
          }}
          onClick={() => addCard(row.id)}
        >
          Add card to row {row.title}
        </button>
        <SortableContext items={cardIds}>
          {cards.map((card) => (
            <Card key={card.id} card={card} deleteCard={deleteCard} />
          ))}
        </SortableContext>
      </RowContainer>
    </>
  );
}

export default Row;
