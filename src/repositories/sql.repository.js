import { Op, QueryTypes } from 'sequelize';
import { sqlServer } from '../db-connect.js';
import CONSTANT from '../config/constants.js';

// Escapes SQL Server LIKE wildcards so user input is matched literally, then wraps it for a "contains" search
const replaceSpecialCharacterInQuery = (value) => {
  const escaped = `${value}`.replace(/[[\]%_]/g, (char) => `[${char}]`);
  return `%${escaped}%`;
};

const setLogProcessFlow = (req, system, code, startTime, eventType, event, model) => {
  console.log('logProcessFlow', {
    system,
    code,
    eventType,
    event,
    model: model?.name,
    elapsedMs: Date.now() - startTime
  });
};

const query = async ({ sql, transaction, replacements = [], req = { logProcessFlow: [] }, event }) => {
  const eventType = 'Q';
  const dateNow = new Date();
  try {
    const options = { replacements, type: QueryTypes.SELECT };
    if (transaction) {
      options.transaction = transaction;
    }

    const sqlResponse = await sqlServer.query(sql, options);

    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 20000, dateNow.getTime(), eventType, event);
    return sqlResponse;
  } catch (e) {
    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 50000, dateNow.getTime(), eventType, event);
    throw e;
  }
};

const findAll = async ({
  criteria = {},
  included,
  model,
  attributes = [],
  options = null,
  groupBy = null,
  transaction,
  req = { logProcessFlow: [] },
  event
}) => {
  let searchOptions = { include: included, where: criteria };
  const eventType = 'FA';
  if (options) {
    const { order, limit, offset, search } = options;
    if (order) {
      searchOptions.order = order;
    }
    if (limit) {
      searchOptions.limit = limit;
    }
    if (offset) {
      searchOptions.offset = offset;
    }
    if (search) {
      let { fields, value } = search;
      value = value ? value.trim() : '';
      const searchList = fields.map((field) => ({
        [field]: {
          [Op.like]: replaceSpecialCharacterInQuery(`${value}`),
        },
      }));
      if (value) {
        searchOptions.where = {
          ...criteria,
          [Op.or]: searchList,
        };
      }
    }
  }
  if (Array.isArray(attributes) && attributes.length) {
    searchOptions.attributes = attributes;
  }
  if (Array.isArray(groupBy) && groupBy.length) {
    searchOptions.group = groupBy;
  }
  if (transaction) {
    searchOptions.transaction = transaction;
  }
  const dateNow = new Date();
  try {
    const sqlResponse = await model.findAll(searchOptions);
    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 20000, dateNow.getTime(), eventType, event, model);
    return sqlResponse;
  } catch (e) {
    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 50000, dateNow.getTime(), eventType, event, model);
    throw e;
  }
};

const create = async ({ data, model, transaction, req = { logProcessFlow: [] }, event }) => {
  const eventType = 'C';
  const dateNow = new Date();
  try {
    const sqlResponse = await model.create(data, { transaction })
      .then((result) => {
        return result.get({ plain: true });
      });

    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 20000, dateNow.getTime(), eventType, event, model);
    return sqlResponse;
  } catch (e) {
    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 50000, dateNow.getTime(), eventType, event, model);
    throw e;
  }
};

const update = async ({ data, criteria, model, transaction, req = { logProcessFlow: [] }, event }) => {
  const eventType = 'U';
  const dateNow = new Date();
  try {
    const sqlResponse = await model.update(data, {
      where: criteria,
      transaction: transaction
    });

    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 20000, dateNow.getTime(), eventType, event, model);
    return sqlResponse;
  } catch (e) {
    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 50000, dateNow.getTime(), eventType, event, model);
    throw e;
  }
};

const findOne = async ({
  criteria,
  transaction,
  included,
  model,
  attributes = [],
  order = [],
  req = { logProcessFlow: [] },
  event
}) => {
  let options = { include: included, where: criteria };
  const eventType = 'FO';
  if (Array.isArray(attributes) && attributes.length) {
    options.attributes = attributes;
  }
  if (Array.isArray(order) && order.length) {
    options.order = order;
  }
  if (transaction) {
    options.transaction = transaction
  }
  const dateNow = new Date();
  try {
    const sqlResponse = await model.findOne(options);
    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 20000, dateNow.getTime(), eventType, event, model);
    return sqlResponse;
  } catch (e) {
    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 50000, dateNow.getTime(), eventType, event, model);
    throw e;
  }
};

const destroy = async ({ criteria, model, transaction, req = { logProcessFlow: [] }, event }) => {
  const eventType = 'D';
  const dateNow = new Date();
  try {
    const sqlResponse = await model.destroy({ where: criteria, transaction });

    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 20000, dateNow.getTime(), eventType, event, model);
    return sqlResponse;
  } catch (e) {
    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 50000, dateNow.getTime(), eventType, event, model);
    throw e;
  }
};

const upsert = async ({ data, criteria, model, include, transaction, req = { logProcessFlow: [] }, event }) => {
  const eventType = 'US';
  const dateNow = new Date();
  try {
    const sqlResponse = await model
      .findOne({ where: criteria, transaction })
      .then(async (obj) => {
        if (obj) {
          // update
          const updateData = await obj.update(data, { transaction });
          return updateData.get({ plain: true });
        } else {
          // insert
          const createData = await model.create(data, { include, transaction });
          return createData.get({ plain: true });
        }
      });
    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 20000, dateNow.getTime(), eventType, event, model);
    return sqlResponse;
  } catch (e) {
    setLogProcessFlow(req, CONSTANT.SYSTEM_NAME.SQL_SERVER, 50000, dateNow.getTime(), eventType, event, model);
    throw e;
  }
};

export { query, findAll, findOne, create, update, destroy, upsert };
