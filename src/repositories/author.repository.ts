import * as Knex from 'knex';

import { models } from 'models';
import { AUTHOR } from '../common/tables';
import { AuthorModel } from '../models/author.model';
import { AbstractRepository } from './abstract.repository';
import { Utils } from '../common/utils';

import { Logger } from '../core/logger';
const log = Logger('app:repo:AuthorRepository');


export class AuthorRepository extends AbstractRepository<Knex> {

    public async findAllAuthors(options: common.PageinationArguments): Promise<models.author.Attributes[]> {
        log.debug('findAllAuthors called');
        const results = await this.db
            .select()
            .from(AUTHOR)
            .limit(options.limit)
            .offset(options.offset);
        return results.map((result) => new AuthorModel(result).toJson());
    }

    public async findAuthorById(id: number): Promise<models.author.Attributes> {
        log.debug('findAuthorById called with id=', id);
        const results = await this.db.select().from(AUTHOR).where('id', id);
        Utils.assertResults(results, id);
        return (new AuthorModel(Utils.single(results))).toJson();
    }

    public async findAuthorsByIds(ids: number[]): Promise<models.author.Attributes[]> {
        log.debug('findAuthorByIds called with ids=', ids);
        const results = await this.db.select().from(AUTHOR).whereIn('id', ids);
        Utils.assertResults(results, ids);
        return results.map((result) => new AuthorModel(result).toJson());
    }

    public async searchAuthors(text: string): Promise<models.author.Attributes[]> {
        const results = await this.db
            .select()
            .from(AUTHOR)
            .where('last_name', 'like', `%${text}%`)
            .orderBy('updated_at', 'DESC');
        log.debug('searchAuthors found %s results', results.length);
        return results.map((result) => new AuthorModel(result).toJson());
    }

    public async createAuthor(authorModel: AuthorModel): Promise<models.author.Attributes> {
        const ids = await this.db
            .insert(authorModel.toDatabaseObject())
            .into(AUTHOR);
        const id: number = Utils.single<number>(ids);
        return this.findAuthorById(id);
    }

    public async updateAuthor(newAuthorModel: AuthorModel): Promise<models.author.Attributes> {
        const author = await this.findAuthorById(newAuthorModel.Id);
        const authorModel = new AuthorModel();
        authorModel.mapJson(author).merge(newAuthorModel);
        await this.db
            .update(authorModel.toDatabaseObject())
            .into(AUTHOR)
            .where('id', authorModel.Id);
        return this.findAuthorById(authorModel.Id);
    }

    public async deleteAuthor(id: number): Promise<void> {
        await this.db.delete().from(AUTHOR).where('id', id);
        return;
    }

}
