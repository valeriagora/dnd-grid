import React from "react";
import { Id, ICard, CardSize } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { styled } from "@mui/material";

interface Props {
  card: ICard;
  deleteCard: (cardId: Id) => void;
}
const cardSizes = {
  sm: {
    width: 300,
    border: "cornflowerblue",
  },
  md: { width: 150, border: "slateblue" },
  lg: { width: 200, border: "teal" },
};
const StyledCard = styled("div", {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: CardSize }>(({ size }) => ({
  cursor: "grab",
  width: cardSizes[size].width,
  height: 200,
  display: "inline-block",
  border: `2px solid ${cardSizes[size].border}`,
  borderRadius: 20,
  padding: 20,
  boxSizing: "border-box",
}));
function Card({ card, deleteCard }: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <StyledCard
        ref={setNodeRef}
        style={{ ...style, opacity: 0.4, border: "2px solid lightyellow" }}
        size={card.size}
      >
        dragging
      </StyledCard>
    );
  }
  return (
    <StyledCard ref={setNodeRef} style={style} size={card.size}>
      <button {...attributes} {...listeners}>
        ...
      </button>
      {card.content}
    </StyledCard>
  );
}

export default Card;
