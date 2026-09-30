import { z } from 'zod';

export const projectTypes = ['commercial', 'residential', 'industrial', 'infrastructure', 'renovation'] as const;

export const createQuoteSchema = z.object({
  clientName: z.string().min(2, 'Name must be at least 2 characters'),
  clientEmail: z.string().email('Please enter a valid email address'),
  clientPhone: z.string().optional(),
  companyName: z.string().optional(),
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  projectType: z.enum(projectTypes, {
    required_error: 'Please select a project type',
  }),
  squareFootage: z.coerce.number().min(100, 'Square footage must be at least 100 sq ft'),
  location: z.string().min(2, 'Project location is required'),
  targetBudget: z.coerce.number().min(1000, 'Minimum budget is $1,000'),
  desiredTimeline: z.string().min(2, 'Target timeline is required'),
  description: z.string().min(10, 'Please provide details about the project requirements'),
});

export type ICreateQuoteForm = z.infer<typeof createQuoteSchema>;

export const quoteResponseSchema = z.object({
  estimatedCost: z.coerce.number().min(1000, 'Estimated cost is required'),
  estimatedTimelineWeeks: z.coerce.number().min(1, 'Timeline is required'),
  architectNotes: z.string().min(5, 'Notes are required'),
});

export type IQuoteResponseForm = z.infer<typeof quoteResponseSchema>;
