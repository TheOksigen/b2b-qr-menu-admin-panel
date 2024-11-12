import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      if (!user.orgId || !user.orgPermissions) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have an organization",
        });
      }

      if (!user.orgPermissions.includes("org:category:manage")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have permission to create a category",
        });
      }

      return ctx.db.category.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
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

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const cursor = input.cursor;

      const items = await ctx.db.category.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          items: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
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
