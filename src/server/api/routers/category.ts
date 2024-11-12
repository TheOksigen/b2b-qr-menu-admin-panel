// src/server/api/routers/category.ts
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { categorySchema } from "@/server/schemas";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(categorySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(categorySchema.partial().extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.category.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.delete({
        where: { id: input.id },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      include: {
        items: true,
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.id },
        include: {
          items: true,
        },
      });
      
      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }
      
      return category;
    }),
});