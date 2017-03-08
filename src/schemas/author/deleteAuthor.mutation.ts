import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql';

import { Context } from '../../context/context';
import { AuthorType } from './author.type';
import { AbstractMutation, IGraphQLMutation } from '../abstract.mutation';

import { Logger } from '../../core/logger';
const log = Logger('app:schemas:author:DeleteAuthorMutation');


export interface IDeleteAuthorMutationArguments {
    id: number;
}

export class DeleteAuthorMutation extends AbstractMutation implements GraphQLFieldConfig, IGraphQLMutation {

    public type = AuthorType;

    public allow = ['admin'];

    public args = {
        id: { type: new GraphQLNonNull(GraphQLID) }
    };

    public execute(root, args: IDeleteAuthorMutationArguments, context: Context) {
        log.debug('resolve deleteAuthor(%s)', args.id);
        return context.Repositories.AuthorRepository.deleteAuthor(args.id);
    }
}
