import { GraphQLList, GraphQLFieldConfig } from 'graphql';

import { models } from 'models';
import { RootValue } from '../../root-value';
import { Context } from '../../context/context';
import { BookType } from './book.type';
import { AbstractQuery, IGraphQLQuery } from '../abstract.query';
import { LimitArgument, OffsetArgument } from '../common/arguments';

import { Logger } from '../../core/logger';
const log = Logger('app:schemas:book:FindAllBooksQuery');


export class FindAllBooksQuery extends AbstractQuery implements GraphQLFieldConfig, IGraphQLQuery {

    public type = new GraphQLList(BookType);
    public allow = ['admin'];
    public args = {
        limit: new LimitArgument(),
        offset: new OffsetArgument()
    };

    public before(context: Context, args: common.PageinationArguments): Promise<common.PageinationArguments> {
        log.debug('hook before args', args);
        LimitArgument.validate(args.limit);
        OffsetArgument.validate(args.limit);
        return Promise.resolve(args);
    }

    public execute(root: RootValue, args: common.PageinationArguments, context: Context): Promise<models.book.Attributes> {
        log.debug('resolve findAllBooks()');
        return context.Repositories.BookRepository.findAllBooks({
            limit: args.limit,
            offset: args.offset
        });
    }

    public after(result: models.book.Attributes, context: Context, args: common.PageinationArguments): Promise<models.book.Attributes> {
        log.debug('hook after args', args);
        return Promise.resolve(result);
    }
}
