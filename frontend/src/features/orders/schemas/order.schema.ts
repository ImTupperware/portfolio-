import { z } from "zod";

export const OrderStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "cancelled",
]);

export const OrderSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  customer_name: z.string(),
  customer_email: z.string().email(),
  status: OrderStatusSchema,
  total_amount: z.number(),
  currency: z.string().default("USD"),
  items_count: z.number().int(),
  payment_method: z.string(),
  created_at: z.string().nullable().optional(),
});

export const PaginatedOrdersResponseSchema = z.object({
  data: z.array(OrderSchema),
  links: z.object({
    first: z.string().nullable().optional(),
    last: z.string().nullable().optional(),
    prev: z.string().nullable().optional(),
    next: z.string().nullable().optional(),
  }),
  meta: z.object({
    current_page: z.number(),
    from: z.number().nullable().optional(),
    last_page: z.number(),
    per_page: z.number(),
    to: z.number().nullable().optional(),
    total: z.number(),
  }),
});

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type PaginatedOrdersResponse = z.infer<typeof PaginatedOrdersResponseSchema>;

export interface OrderFilterParams {
  q?: string;
  status?: string;
  page?: number;
  perPage?: number;
}
