import { IssueModel } from '../models/IssueModel';
import { Validator } from '../utils/validators';
import { Issue, IssueCreateInput, IssueUpdateInput, IssueQueryParams } from '../types';

export class IssueService {
  static async getIssueWithReporter(id: number) {
    return await IssueModel.findWithReporter(id);
  }

  static async getAllIssuesWithReporters(params: IssueQueryParams = {}) {
    return await IssueModel.findAllWithReporters(params);
  }

  static async updateIssue(id: number, updates: IssueUpdateInput): Promise<Issue | null> {
    const issue = await IssueModel.findById(id);

    if (!issue) {
      throw new Error('Issue not found');
    }

    return await IssueModel.update(id, updates);
  }

  static canUserModifyIssue(userId: number, userRole: string, issue: Issue): boolean {
    if (userRole === 'maintainer') {
      return true;
    }

    if (issue.reporter_id === userId && issue.status === 'open') {
      return true;
    }

    return false;
  }

  static validateIssueInput(input: IssueCreateInput | IssueUpdateInput): {
    valid: boolean;
    errors: string[];
  } {
    const validator = new Validator();

    if ('title' in input && input.title !== undefined) {
      validator
        .required(input.title, 'Title')
        .maxLength(input.title, 'Title', 150);
    }

    if ('description' in input && input.description !== undefined) {
      validator
        .required(input.description, 'Description')
        .minLength(input.description, 'Description', 20);
    }

    if ('type' in input && input.type !== undefined) {
      validator.enum(input.type, ['bug', 'feature_request'], 'Type');
    }

    if ('status' in input && input.status !== undefined) {
      validator.enum(input.status, ['open', 'in_progress', 'resolved'], 'Status');
    }

    return validator.getResult();
  }
}
