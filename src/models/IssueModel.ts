import { query } from '../config/database';
import { buildUpdateQuery, buildWhereClause } from '../utils/queryBuilder';
import { Issue, IssueCreateInput, IssueUpdateInput, IssueQueryParams, IssueWithReporter } from '../types';

export class IssueModel {
  static async findById(id: number): Promise<Issue | null> {
    const result = await query('SELECT * FROM issues WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(input: IssueCreateInput, reporterId: number): Promise<Issue> {
    const result = await query(
      'INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [input.title, input.description, input.type, reporterId]
    );
    return result.rows[0];
  }

  static async update(id: number, updates: IssueUpdateInput): Promise<Issue | null> {
    const { query: updateQuery, values } = buildUpdateQuery('issues', updates, id);

    const result = await query(updateQuery, values);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM issues WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async findAll(params: IssueQueryParams = {}): Promise<Issue[]> {
    const { clause, values } = buildWhereClause({
      type: params.type,
      status: params.status
    });

    const orderBy = params.sort === 'oldest' ? 'created_at ASC' : 'created_at DESC';
    const queryText = `SELECT * FROM issues WHERE ${clause} ORDER BY ${orderBy}`;

    const result = await query(queryText, values);
    return result.rows;
  }

  static async findWithReporter(id: number): Promise<IssueWithReporter | null> {
    const issueResult = await query('SELECT * FROM issues WHERE id = $1', [id]);

    if (issueResult.rows.length === 0) {
      return null;
    }

    const issue = issueResult.rows[0];

    const reporterResult = await query(
      'SELECT id, name, role FROM users WHERE id = $1',
      [issue.reporter_id]
    );

    return {
      ...issue,
      reporter: reporterResult.rows[0] || null
    };
  }

  static async findAllWithReporters(params: IssueQueryParams = {}): Promise<IssueWithReporter[]> {
    const issues = await this.findAll(params);

    const reporterIds = issues.map((issue) => issue.reporter_id);
    const uniqueReporterIds = [...new Set(reporterIds)];

    let reportersMap: { [key: number]: any } = {};

    if (uniqueReporterIds.length > 0) {
      const reportersResult = await query(
        'SELECT id, name, role FROM users WHERE id = ANY($1)',
        [uniqueReporterIds]
      );

      reportersResult.rows.forEach((reporter: any) => {
        reportersMap[reporter.id] = {
          id: reporter.id,
          name: reporter.name,
          role: reporter.role
        };
      });
    }

    return issues.map((issue) => ({
      ...issue,
      reporter: reportersMap[issue.reporter_id] || null
    }));
  }
}
