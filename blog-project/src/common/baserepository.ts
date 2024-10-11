/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';

export interface ConditionsObj {
  where?: any;
  relations?: [string];
  take?: number;
  skip?: number;
  order?: any;
}

export class BaseRepository<T> extends Repository<T> {
  public getRelations(conditionsObj, relations: any) {
    if (relations && relations.length !== 0) {
      conditionsObj.relations = relations;
    }
    return conditionsObj;
  }

  public getFindAllCond(
    conditions?: any,
    relations?: any,
    orderBy?: any,
    page?: number | null,
    perPage?: number,
  ) {
    let conditionsObj: ConditionsObj = {};
    conditionsObj = this.getConditions(conditionsObj, conditions);
    conditionsObj = this.getRelations(conditionsObj, relations);
    conditionsObj = this.getPaginationCond(conditionsObj, page, perPage);
    conditionsObj = this.getOrderCond(conditionsObj, orderBy);
    return conditionsObj;
  }

  public async findAll(
    conditions?: any,
    relations?: any,
    orderBy?: any,
    page?: number,
    perPage?: number,
  ): Promise<T[]> {
    return this.find(
      this.getFindAllCond(conditions, relations, orderBy, page, perPage),
    );
  }

  public async findByCond(conditions: any) {
    return this.findAll(conditions);
  }

  public async findById(id, relations?: any) {
    return this.findOne({
      where: {
        id,
        ...this.getRelations({}, relations),
      },
    });
  }

  public async findOneRecord(
    conditions?: any,
    relations?: any,
    orderBy?: any,
    page?: number,
    perPage?: number,
  ): Promise<T> {
    return this.findOne(
      this.getFindAllCond(conditions, relations, orderBy, page, perPage),
    );
  }

  public async findOneByCond(conditions: any) {
    return this.findOneRecord(conditions);
  }

  public async findOneByCondRel(conditions: any, relations: any) {
    return this.findOneRecord(conditions, relations);
  }

  public getPaginationCond(
    conditionObj: ConditionsObj,
    page = 0,
    perPage = 25,
  ) {
    if (page) {
      conditionObj.skip = (page - 1) * perPage;
      conditionObj.take = perPage;
    }
    return conditionObj;
  }

  public getOrderCond(conditionObj: ConditionsObj, orderBy: any) {
    if (orderBy) {
      conditionObj.order = orderBy;
    } else {
      conditionObj.order = {
        createdAt: 'DESC',
      };
    }
    return conditionObj;
  }

  public async saveRecord(attributes: any) {
    return await this.save(attributes);
  }

  public async createRecord(createInput: any) {
    return this.saveRecord(createInput);
  }

  public async updateRecord(updateInput: any) {
    return this.saveRecord(updateInput);
  }

  public async findByIdWithRel(id, relations: any) {
    return this.findById(id, relations);
  }

  public getConditions(conditionObj: ConditionsObj, conditions: any) {
    if (conditions && conditions != '') {
      conditionObj.where = conditions;
    }
    return conditionObj;
  }

  public async findByCondRel(conditions: any, relations: any) {
    return this.findAll(conditions, relations);
  }

  public async updateByObj(object, updateAttributes: any) {
    return this.saveRecord({ ...object, ...updateAttributes });
  }

  public async updateByCond(condition, updateAttributes: any) {
    return this.update(condition, updateAttributes);
  }

  public async findByPagination(
    conditions: any,
    page: number,
    perPage: number,
  ) {
    return this.findAll(conditions, [], {}, page, perPage);
  }

  public async findByCondOrder(
    conditions: any,
    orderByField: string,
    orderByType: 'ASC' | 'DESC',
  ) {
    const orderBy: any = {};
    orderBy[orderByField] = orderByType;
    return this.findAll(conditions, [], orderBy);
  }

  public async deleteRec(record, deletedById) {
    this.updateByObj(record, {
      deletedById,
      deletedAt: new Date(),
    });
    return 'Sucessfully Deleted';
  }
}
