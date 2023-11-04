import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
};

export type GQLBook = {
  __typename?: 'Book';
  author: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type GQLQuery = {
  __typename?: 'Query';
  books: Array<GQLBook>;
  teams: Array<Maybe<GQLTeam>>;
  users: Array<GQLUser>;
};

export type GQLTeam = {
  __typename?: 'Team';
  createdAt: Scalars['DateTime']['output'];
  firstLoggedInAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  mailAddress: Scalars['String']['output'];
  name: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLUser = {
  __typename?: 'User';
  age: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GQLResolversTypes = {
  Book: ResolverTypeWrapper<GQLBook>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Team: ResolverTypeWrapper<GQLTeam>;
  User: ResolverTypeWrapper<GQLUser>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GQLResolversParentTypes = {
  Book: GQLBook;
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Query: {};
  String: Scalars['String']['output'];
  Team: GQLTeam;
  User: GQLUser;
};

export type GQLBookResolvers<
  ContextType = any,
  ParentType extends
    GQLResolversParentTypes['Book'] = GQLResolversParentTypes['Book'],
> = {
  author?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GQLDateTimeScalarConfig
  extends GraphQLScalarTypeConfig<GQLResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GQLQueryResolvers<
  ContextType = any,
  ParentType extends
    GQLResolversParentTypes['Query'] = GQLResolversParentTypes['Query'],
> = {
  books?: Resolver<Array<GQLResolversTypes['Book']>, ParentType, ContextType>;
  teams?: Resolver<
    Array<Maybe<GQLResolversTypes['Team']>>,
    ParentType,
    ContextType
  >;
  users?: Resolver<Array<GQLResolversTypes['User']>, ParentType, ContextType>;
};

export type GQLTeamResolvers<
  ContextType = any,
  ParentType extends
    GQLResolversParentTypes['Team'] = GQLResolversParentTypes['Team'],
> = {
  createdAt?: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  firstLoggedInAt?: Resolver<
    Maybe<GQLResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  mailAddress?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  postalCode?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<GQLResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLUserResolvers<
  ContextType = any,
  ParentType extends
    GQLResolversParentTypes['User'] = GQLResolversParentTypes['User'],
> = {
  age?: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<GQLResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQLResolvers<ContextType = any> = {
  Book?: GQLBookResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Query?: GQLQueryResolvers<ContextType>;
  Team?: GQLTeamResolvers<ContextType>;
  User?: GQLUserResolvers<ContextType>;
};
