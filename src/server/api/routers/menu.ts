// src/server/api/routers/menu.ts
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { menuSchema } from "@/server/schemas";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const menuRouter = createTRPCRouter({
  create: protectedProcedure
    .input(menuSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.menu.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(menuSchema.partial().extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.menu.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.menu.delete({
        where: { id: input.id },
      });
    }),

  getAll: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.menu.findMany({
        where: { restaurantId: input.restaurantId },
        include: {
          items: true,
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const menu = await ctx.db.menu.findUnique({
        where: { id: input.id },
        include: {
          items: {
            include: {
              category: true,
            },
          },
        },
      });
      
      if (!menu) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Menu not found",
        });
      }
      
      return menu;
    }),
});