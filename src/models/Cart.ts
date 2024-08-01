import { CartItem } from "./CartItem";

export type Cart = {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  status: CartStatuses;
  items: CartItem[];
};

export enum CartStatuses {
  OPEN = "OPEN",
  ORDERED = "ORDERED",
}
