import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const createMenuSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  restaurantId: z.string().uuid("Invalid restaurant ID format"),
  items: z.array(
    z.object({
      name: z.string().min(1, "Item name is required"),
      price: z.number().positive("Price must be greater than zero"),
      details: z.string().optional(),
      categoryId: z.string().uuid("Invalid category ID format").optional(),
      availableFrom: z.string().optional(),
      availableUntil: z.string().optional(),
      availableMonths: z.array(z.number().int().min(1).max(12)).optional(),
    })
  ).nonempty("At least one item is required"),
});

/*
const updateMenuSchema = z.object({
  id: z.string().uuid("Invalid menu ID format"),
  title: z.string().optional(),
  description: z.string().optional(),
  restaurantId: z.string().uuid("Invalid restaurant ID format").optional(),
  items: z.array(
    z.object({
      id: z.string().uuid("Invalid item ID format").optional(),
      name: z.string().optional(),
      price: z.number().positive().optional(),
      details: z.string().optional(),
      categoryId: z.string().uuid("Invalid category ID format").optional(),
      availableFrom: z.string().optional(),
      availableUntil: z.string().optional(),
      availableMonths: z.array(z.number().int().min(1).max(12)).optional(),
    })
  ).optional(),
});
*/

export const menuRouter = createTRPCRouter({
  getMenu: publicProcedure
    .input(z.object({ id: z.string().uuid("Invalid menu ID format") }))
    .query(async ({ ctx, input }) => {
      return ctx.db.menu.findUnique({
        where: { id: input.id },
        include: { items: true },
      });
    }),
  createMenu: protectedProcedure
    .input(createMenuSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || !ctx.user.orgPermissions) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Permission denied" });
      }
      return ctx.db.menu.create({
        data: {
          title: input.title,
          description: input.description,
          restaurantId: input.restaurantId,
          items: {
            create: input.items
          }
        },
      });
    }),

  addMenuItem: protectedProcedure
    .input(z.object({ name: z.string().min(1, "Item name is required"), menuId: z.string().uuid("Invalid menu ID format"), price: z.number().positive("Price must be greater than zero") }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || !ctx.user.orgPermissions) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Permission denied" });
      }

      return ctx.db.menuItem.create({
        data: { name: input.name, menuId: input.menuId, price: input.price },
      });
    }),

  removeMenuItem: protectedProcedure
    .input(z.object({ id: z.string().uuid("Invalid item ID format") }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || !ctx.user.orgPermissions) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Permission denied" });
      }

      return ctx.db.menuItem.delete({
        where: { id: input.id },
      });
    }),
});

