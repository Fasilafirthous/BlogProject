
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    // const loggerService = new MyLogger();
    // loggerService.debug(
    //   `user is **************: ${JSON.stringify(ctx.getContext().req.user)}`,
    //   CurrentUser.name,
    // );
    console.log(ctx.getContext().req.user,"user")
    return ctx.getContext().req.user;
  },
);

export const CurrentUserID = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context);
    console.log("20",ctx.getContext().req.user)
    return ctx.getContext().req.user.id;
  },
);
