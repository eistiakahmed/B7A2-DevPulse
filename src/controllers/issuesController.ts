import { Response } from 'express';
import { IssueModel } from '../models/IssueModel';
import { IssueService } from '../services/issueService';
import { successResponse } from '../utils/response';
import { parseIssueQueryParams } from '../utils/queryParser';
import { serverErrorResponse, notFoundResponse, accessDeniedResponse, validationFailedResponse } from '../utils/errorResponses';
import { HttpStatus, RequestWithUser } from '../types';

export const createIssue = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { title, description, type } = req.body;
    const reporterId = req.user!.id;

    const validation = IssueService.validateIssueInput({ title, description, type });

    if (!validation.valid) {
      validationFailedResponse(res, validation.errors);
      return;
    }

    const issue = await IssueModel.create({ title, description, type }, reporterId);

    successResponse(res, {
      message: 'Issue created successfully',
      data: issue
    }, HttpStatus.CREATED);
  } catch (error) {
    serverErrorResponse(res, 'Create issue', error as Error);
  }
};

export const getAllIssues = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const queryParams = parseIssueQueryParams(req.query);
    const issues = await IssueService.getAllIssuesWithReporters(queryParams);

    successResponse(res, {
      data: issues
    });
  } catch (error) {
    serverErrorResponse(res, 'Get all issues', error as Error);
  }
};

export const getIssueById = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const issue = await IssueService.getIssueWithReporter(parseInt(id));

    if (!issue) {
      notFoundResponse(res, 'issue', id);
      return;
    }

    successResponse(res, {
      data: issue
    });
  } catch (error) {
    serverErrorResponse(res, 'Get issue by id', error as Error);
  }
};

export const updateIssue = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, type, status } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const issue = await IssueModel.findById(parseInt(id));

    if (!issue) {
      notFoundResponse(res, 'issue', id);
      return;
    }

    const canModify = IssueService.canUserModifyIssue(userId, userRole, issue);

    if (!canModify) {
      accessDeniedResponse(res, 'You can only update your own issues with open status');
      return;
    }

    const validation = IssueService.validateIssueInput({ title, description, type, status });

    if (!validation.valid) {
      validationFailedResponse(res, validation.errors);
      return;
    }

    const updatedIssue = await IssueService.updateIssue(parseInt(id), {
      title,
      description,
      type,
      status
    });

    successResponse(res, {
      message: 'Issue updated successfully',
      data: updatedIssue
    });
  } catch (error) {
    serverErrorResponse(res, 'Update issue', error as Error);
  }
};

export const deleteIssue = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'maintainer') {
      accessDeniedResponse(res, 'Only maintainers can delete issues');
      return;
    }

    const issue = await IssueModel.findById(parseInt(id));

    if (!issue) {
      notFoundResponse(res, 'issue', id);
      return;
    }

    await IssueModel.delete(parseInt(id));

    successResponse(res, {
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    serverErrorResponse(res, 'Delete issue', error as Error);
  }
};
