import { UserCredential } from "firebase/auth";
import React, { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export interface ComponentProps {
  id: string;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export interface NotificationState {
  items: any[];
}

export interface ReportModelProps extends ModalProps {
  id: any;
}

export interface CreateVerificationModalProps extends ModalProps {
  email: string;
  phoneNumber: string;
  id: string;
}

export interface VeridyModalProps extends ModalProps {
  verificationData: any;
  id: string;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
}

export interface UniversalModalProps {
  open: boolean;
  onClose: () => void;
  handleYes: () => void;
  title: string;
}
export interface LoggedUserState {
  items: {
    email: string;
    id: string;
    image: string;
  };
}

export interface TokenResponse {
  firstName?: string;
  lastName?: string;
}

export interface CustomUserCredential extends UserCredential {
  _tokenResponse?: TokenResponse;
}

export interface CustomBoxProps {
  children: ReactNode;
}

export interface CustomButtonProps extends CustomBoxProps {
  variant: "contained" | "outlined" | "text";
  component?: any;
  endIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
