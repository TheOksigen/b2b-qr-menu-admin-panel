import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";
import { cachedAuth } from "@/server/auth";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const user = await cachedAuth();

  return {
    user,
    db,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: {
        ...ctx.user,
        userId: ctx.user.userId,
      },
    },
  });
});

export const organizationProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.user.orgId || !ctx.user.orgPermissions || !ctx.user.orgRole) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User is not associated with an organization",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: {
          ...ctx.user,
          orgId: ctx.user.orgId,
          orgPermissions: ctx.user.orgPermissions,
          orgRole: ctx.user.orgRole,
        },
      },
    });
  },
);
