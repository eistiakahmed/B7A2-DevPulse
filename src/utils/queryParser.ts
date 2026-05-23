import { IssueQueryParams } from '../types';

export const parseIssueQueryParams = (query: any): IssueQueryParams => {
  const params: IssueQueryParams = {};

  if (query.sort && ['newest', 'oldest'].includes(query.sort)) {
    params.sort = query.sort as 'newest' | 'oldest';
  }

  if (query.type && ['bug', 'feature_request'].includes(query.type)) {
    params.type = query.type as 'bug' | 'feature_request';
  }

  if (query.status && ['open', 'in_progress', 'resolved'].includes(query.status)) {
    params.status = query.status as 'open' | 'in_progress' | 'resolved';
  }

  return params;
};
