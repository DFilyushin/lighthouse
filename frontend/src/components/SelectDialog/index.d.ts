import * as React from 'react';
import { DialogProps } from '@material-ui/core/Dialog';
import { ButtonProps } from '@material-ui/core/Button';

export interface SelectDialogOptions {
  title?: string;
  description?: string;
  confirmationText?: string;
  cancellationText?: string;
  dataItems: any[],
  initKey: number,
  valueName: string;
  dialogProps?: DialogProps;
  confirmationButtonProps?: ButtonProps;
  cancellationButtonProps?: ButtonProps;
}

export interface SelectDialogProviderProps {
  defaultOptions?: SelectDialogOptions;
}

export const SelectDialogProvider: React.ComponentType<SelectDialogProviderProps>;

export const useDialog: () => (options?: SelectDialogOptions) => Promise<void>;
