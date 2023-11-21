export type Id = string | number;

export interface IRow {
  id: Id;
  title: string;
}
export enum CardSize {
  sm = "sm",
  md = "md",
  lg = "lg",
}
export interface ICard {
  id: Id;
  rowId: Id;
  content: string;
  size: CardSize;
}
