// Issue Entity Types
export interface Issue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export type IssueType = 'bug' | 'feature_request';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';

// Issue Input Types
export interface IssueCreateInput {
  title: string;
  description: string;
  type: IssueType;
}

export interface IssueUpdateInput {
  title?: string;
  description?: string;
  type?: IssueType;
  status?: IssueStatus;
}

// Issue Response Types
export interface IssueWithReporter extends Issue {
  reporter: {
    id: number;
    name: string;
    role: 'contributor' | 'maintainer';
  };
}

// Issue Query Types
export interface IssueQueryParams {
  sort?: 'newest' | 'oldest';
  type?: IssueType;
  status?: IssueStatus;
}
