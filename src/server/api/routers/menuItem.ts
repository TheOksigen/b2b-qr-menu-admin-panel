// src/server/api/routers/menuItem.ts
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { menuItemSchema } from "@/server/schemas";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const menuItemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(menuItemSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.menuItem.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(menuItemSchema.partial().extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.menuItem.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.menuItem.delete({
        where: { id: input.id },
      });
    }),

  getAll: publicProcedure
    .input(z.object({ menuId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.menuItem.findMany({
        where: { menuId: input.menuId },
        include: {
          category: true,
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const menuItem = await ctx.db.menuItem.findUnique({
        where: { id: input.id },
        include: {
          category: true,
        },
      });
      
      if (!menuItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Menu item not found",
        });
      }
      
      return menuItem;
    }),
});