export type CartItemDTO = {
  id: number;
  color: string;
  size: string;
  quantity: number;

  price: number;
  name?: string;
  cover_image?: string;
  color_name?: string;
  brand?: string;
};

export type CartDTO = {
  items: CartItemDTO[];
  total_quantity: number;
  total_price: number;
};

export type LocalCartItem = {
  productId: number;
  size: string;
  qty: number;
  price: number;

  name: string;
  image: string;
  colorName: string;
};

export type AddPayload = {
  productId: number;
  size: string;
  qty: number;
  name: string;
  image: string;
  colorName?: string;
  price: number;
};
