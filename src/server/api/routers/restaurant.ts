import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { restaurantSchema } from "@/server/schemas";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const restaurantRouter = createTRPCRouter({
  create: protectedProcedure
    .input(restaurantSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.restaurant.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(restaurantSchema.partial().extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.restaurant.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.restaurant.delete({
        where: { id: input.id },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.restaurant.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findUnique({
        where: { id: input.id },
        include: {
          users: true,
          menus: true,
        },
      });
      
      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }
      
      return restaurant;
    }),
});