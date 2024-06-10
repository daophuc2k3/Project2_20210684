"use strict";

const _parserWhere = (where = "") => {
  let whereBy = {};

  // VD: Find condition one where = category_id,12232
  where ? (where = where.split(",")) : (where = [where]);

  // VD: Find condition array where = category_id,1234;2345;5670
  if (where[1] && where[1].search(";") !== -1) {
    where[1] = where[1].split(";");
  }

  // Find by name (where[0]) with $in array
  if (where[1] && Array.isArray(where[1])) {
    whereBy[where[0]] = {
      $in: where[1],
    };
  } else {
    where[1] && (whereBy[where[0]] = where[1]); // Find by name with value
  }

  return whereBy;
};

const parserParams = (filters = {}) => {
  // paging
  const page = parseInt(filters.page) || 1,
    limit = parseInt(filters.limit) || 5,
    skip = (page - 1) * limit;

  // filter & sort
  let options = filters?.options ?? {},
    sort = filters.sort || "_id",
    sortBy = {},
    where = filters.where,
    whereBy = _parserWhere(where);

  if (where) {
    options = {
      ...options,
      ...whereBy,
    };
  }

  // ["sort", "desc"] || ["_id"]
  filters.sort ? (sort = filters.sort.split(",")) : (sort = [sort]);

  // {sort: "desc"} || _id: "asc"
  sort[1] ? (sortBy[sort[0]] = sort[1]) : (sortBy[sort[0]] = "asc");

  // Find by keyword and field
  if (filters.search && filters.field) {
    options = {
      ...options,
      [filters.field]: { $regex: filters.search, $options: "i" },
    };
  }

  return {
    options,
    limit,
    skip,
    page,
    sortBy,
  };
};

module.exports = {
  parserParams,
};
