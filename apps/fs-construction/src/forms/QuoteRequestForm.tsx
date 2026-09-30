'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createQuoteSchema, ICreateQuoteForm } from '@/schemas/quote.schema';
import { FilestackUploader } from '@/components/features/FilestackUploader';
import { IStoredFile } from '@/interfaces/filestack.interface';
import { useCreateQuote } from '@/hooks/useQuotes';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Send } from 'lucide-react';

interface IQuoteRequestFormProps {
  onSuccess?: () => void;
}

export const QuoteRequestForm: FC<IQuoteRequestFormProps> = ({ onSuccess }) => {
  const { user } = useAuthStore();
  const createQuote = useCreateQuote();
  const [files, setFiles] = useState<IStoredFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ICreateQuoteForm>({
    resolver: zodResolver(createQuoteSchema),
    defaultValues: {
      clientName: user?.name || '',
      clientEmail: user?.email || '',
      companyName: user?.company || '',
      projectName: '',
      projectType: 'commercial',
      squareFootage: 2500,
      location: 'Austin, TX',
      targetBudget: 500000,
      desiredTimeline: '6 Months',
      description: '',
    },
  });

  const handleFileUploaded = (file: IStoredFile) => {
    setFiles((prev) => [...prev, file]);
    setFileError(null);
  };

  const handleFileRemoved = (handle: string) => {
    setFiles((prev) => prev.filter((f) => f.handle !== handle));
  };

  const onSubmit = async (data: ICreateQuoteForm) => {
    if (files.length === 0) {
      setFileError('Please attach at least one AutoCAD DWG, DXF, or PDF blueprint file.');
      return;
    }

    await createQuote.mutateAsync({
      ...data,
      designFiles: files,
    });

    reset();
    setFiles([]);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left text-xs">
      {/* Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="field-label">Client Name *</label>
          <input
            {...register('clientName')}
            className="input"
            placeholder="Jane Doe"
          />
          {errors.clientName && <p className="mt-1 text-[11px] font-semibold text-rose-600">{errors.clientName.message}</p>}
        </div>

        <div>
          <label className="field-label">Email Address *</label>
          <input
            {...register('clientEmail')}
            type="email"
            className="input"
            placeholder="jane@company.com"
          />
          {errors.clientEmail && <p className="mt-1 text-[11px] font-semibold text-rose-600">{errors.clientEmail.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="field-label">Company Name</label>
          <input
            {...register('companyName')}
            className="input"
            placeholder="Horizon Developments"
          />
        </div>

        <div>
          <label className="field-label">Project Location *</label>
          <input
            {...register('location')}
            className="input"
            placeholder="Austin, TX"
          />
          {errors.location && <p className="mt-1 text-[11px] font-semibold text-rose-600">{errors.location.message}</p>}
        </div>
      </div>

      {/* Project Scope */}
      <div>
        <label className="field-label">Project Name / Title *</label>
        <input
          {...register('projectName')}
          className="input"
          placeholder="e.g. Skyline Commercial Center Structural Phase 1"
        />
        {errors.projectName && <p className="mt-1 text-[11px] font-semibold text-rose-600">{errors.projectName.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="field-label">Project Type *</label>
          <select
            {...register('projectType')}
            className="input"
          >
            <option value="commercial">Commercial</option>
            <option value="residential">Residential</option>
            <option value="industrial">Industrial</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="renovation">Renovation</option>
          </select>
        </div>

        <div>
          <label className="field-label">Area (Sq Ft) *</label>
          <input
            type="number"
            {...register('squareFootage')}
            className="input"
          />
          {errors.squareFootage && <p className="mt-1 text-[11px] font-semibold text-rose-600">{errors.squareFootage.message}</p>}
        </div>

        <div>
          <label className="field-label">Target Budget ($) *</label>
          <input
            type="number"
            {...register('targetBudget')}
            className="input"
          />
          {errors.targetBudget && <p className="mt-1 text-[11px] font-semibold text-rose-600">{errors.targetBudget.message}</p>}
        </div>
      </div>

      <div>
        <label className="field-label">Desired Completion Timeline *</label>
        <input
          {...register('desiredTimeline')}
          className="input"
          placeholder="e.g. 12 Months"
        />
        {errors.desiredTimeline && <p className="mt-1 text-[11px] font-semibold text-rose-600">{errors.desiredTimeline.message}</p>}
      </div>

      <div>
        <label className="field-label">Project Requirements & Design Notes *</label>
        <textarea
          {...register('description')}
          rows={3}
          className="input"
          placeholder="Specify structural details, soil conditions, HVAC specs, or load requirements..."
        />
        {errors.description && <p className="mt-1 text-[11px] font-semibold text-rose-600">{errors.description.message}</p>}
      </div>

      {/* Filestack CAD File Upload Component */}
      <FilestackUploader
        onFileUploaded={handleFileUploaded}
        onFileRemoved={handleFileRemoved}
        files={files}
      />
      {fileError && <p className="text-[11px] font-bold text-rose-600">{fileError}</p>}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={createQuote.isPending || isSubmitting}
          className="btn-primary w-full py-3"
        >
          {createQuote.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Submit CAD Design for Quote
            </>
          )}
        </button>
      </div>
    </form>
  );
};
