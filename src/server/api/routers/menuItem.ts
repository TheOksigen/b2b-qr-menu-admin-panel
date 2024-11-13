import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const createMenuItemSchema = z.object({
  menuId: z.string().uuid("Invalid menu ID format"),
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be greater than zero"),
  details: z.string().optional(),
  categoryId: z.string().uuid("Invalid category ID format").optional(),
  availableFrom: z.string().optional(),
  availableUntil: z.string().optional(),
  availableMonths: z.array(z.number().int().min(1).max(12)).optional(),
});

const updateMenuItemSchema = createMenuItemSchema.partial().extend({
  id: z.string().uuid("Invalid item ID format"),
});

export const menuItemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createMenuItemSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || !ctx.user.orgPermissions) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Permission denied" });
      }

      try {
        return await ctx.db.menuItem.create({
          data: input,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create menu item",
          cause: error,
        });
      }
    }),

  update: protectedProcedure
    .input(updateMenuItemSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || !ctx.user.orgPermissions) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Permission denied" });
      }

      const { id, ...data } = input;
      try {
        return await ctx.db.menuItem.update({
          where: { id },
          data,
        });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Menu item with ID ${id} not found or update failed`,
          cause: error,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid("Invalid item ID format") }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || !ctx.user.orgPermissions) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Permission denied" });
      }

      try {
        return await ctx.db.menuItem.delete({
          where: { id: input.id },
        });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Menu item with ID ${input.id} not found or delete failed`,
          cause: error,
        });
      }
    }),

  getAll: publicProcedure
    .input(z.object({ menuId: z.string().uuid("Invalid menu ID format") }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.menuItem.findMany({
          where: { menuId: input.menuId },
          include: {
            category: true,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch menu items",
          cause: error,
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid("Invalid item ID format") }))
    .query(async ({ ctx, input }) => {
      try {
        const menuItem = await ctx.db.menuItem.findUnique({
          where: { id: input.id },
          include: {
            category: true,
          },
        });

        if (!menuItem) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Menu item with ID ${input.id} not found`,
          });
        }

        return menuItem;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch menu item",
          cause: error,
        });
      }
    }),
});
