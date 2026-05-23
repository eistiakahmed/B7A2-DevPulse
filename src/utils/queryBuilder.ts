export interface BuildUpdateQueryResult {
  query: string;
  values: any[];
}

export const buildUpdateQuery = (
  tableName: string,
  updates: Record<string, any>,
  id: number,
  idColumn: string = 'id',
  returningColumns: string = '*'
): BuildUpdateQueryResult => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 0;

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      paramCount++;
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    return {
      query: `SELECT ${returningColumns} FROM ${tableName} WHERE ${idColumn} = $1`,
      values: [id]
    };
  }

  paramCount++;
  values.push(id);

  const query = `
    UPDATE ${tableName}
    SET ${fields.join(', ')}
    WHERE ${idColumn} = $${paramCount}
    RETURNING ${returningColumns}
  `;

  return { query, values };
};

export const buildWhereClause = (
  conditions: Record<string, any>,
  startParamIndex: number = 1
): { clause: string; values: any[] } => {
  const conditionsArray: string[] = [];
  const values: any[] = [];
  let paramIndex = startParamIndex;

  for (const [key, value] of Object.entries(conditions)) {
    if (value !== undefined && value !== null) {
      conditionsArray.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  const clause = conditionsArray.length > 0 ? conditionsArray.join(' AND ') : '1=1';

  return {
    clause,
    values
  };
};
