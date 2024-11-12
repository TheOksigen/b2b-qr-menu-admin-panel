import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const restaurantRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      if (!user.orgId || !user.orgPermissions) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have an organization",
        });
      }

      if (!user.orgPermissions.includes("org:restaurant:manage")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have permission to update a restaurant",
        });
      }

      return ctx.db.restaurant.create({
        data: {
          ...input,
          organizationId: user.orgId,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id, ...data } = input;

      if (!user.orgId || !user.orgPermissions) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have an organization",
        });
      }

      if (!user.orgPermissions.includes("org:restaurant:manage")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have permission to update a restaurant",
        });
      }

      return ctx.db.restaurant.update({
        where: { id, organizationId: user.orgId },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      if (!user.orgId || !user.orgPermissions) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have an organization",
        });
      }

      if (!user.orgPermissions.includes("org:restaurant:manage")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have permission to update a restaurant",
        });
      }

      return ctx.db.restaurant.delete({
        where: { id, organizationId: user.orgId },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    if (!user.orgId || !user.orgPermissions) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User does not have an organization",
      });
    }

    if (!user.orgPermissions.includes("org:restaurant:read")) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User does not have permission to read restaurants",
      });
    }

    return ctx.db.restaurant.findMany({
      where: { organizationId: user.orgId },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      if (!user.orgId || !user.orgPermissions) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have an organization",
        });
      }

      if (!user.orgPermissions.includes("org:restaurant:read")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not have permission to read a restaurant",
        });
      }

      const restaurant = await ctx.db.restaurant.findUnique({
        where: { id, organizationId: user.orgId },
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
