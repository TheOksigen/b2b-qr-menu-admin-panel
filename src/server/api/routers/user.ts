// src/server/api/routers/user.ts
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { userSchema } from "@/server/schemas";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(userSchema.partial().extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.user.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({
        where: { id: input.id },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        include: {
          restaurant: true,
        },
      });
      
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      
      return user;
    }),
});