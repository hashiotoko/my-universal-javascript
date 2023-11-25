import { GraphQLError } from 'graphql';
import { ApolloServerOptions } from '@apollo/server';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { Context } from '../resolvers/context';
import { errorLogger } from './logger';

export const MyjsErrorCode = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  NOT_FOUND: 'NOT_FOUND',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;
export type MyjsErrorCode = (typeof MyjsErrorCode)[keyof typeof MyjsErrorCode];

export class UnauthenticatedError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: MyjsErrorCode.UNAUTHENTICATED } });
  }
}

export class BadRequestError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: ApolloServerErrorCode.BAD_REQUEST } });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: MyjsErrorCode.NOT_FOUND } });
  }
}

export class InternalServerError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }
}

export class ServiceUnavailableError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: MyjsErrorCode.SERVICE_UNAVAILABLE } });
  }
}

export const formatError: ApolloServerOptions<Context>['formatError'] = (
  formattedError,
  _error,
) => {
  if (process.env.NODE_ENV !== 'production') errorLogger(formattedError);

  switch (formattedError.extensions?.code) {
    case MyjsErrorCode.UNAUTHENTICATED:
    case MyjsErrorCode.NOT_FOUND:
    case ApolloServerErrorCode.BAD_REQUEST:
    case ApolloServerErrorCode.BAD_USER_INPUT:
    case ApolloServerErrorCode.GRAPHQL_PARSE_FAILED:
    case ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED:
      return formattedError;
    case ApolloServerErrorCode.INTERNAL_SERVER_ERROR:
      return new InternalServerError(
        'An unexpected error has occurred. We apologize for the inconvenience, but please contact us.',
      );
    default:
      return new ServiceUnavailableError(
        'The service is temporarily unavailable. Please wait a moment and try your request again. If you still cannot use the service, please contact us.',
      );
  }
};
