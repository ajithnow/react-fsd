import type { UserStatus, UserType } from '../constants/users.constants';
import { PaginationInfo, SortConfig, FilterValues } from '@/shared/components';
import { z } from 'zod';
import { UserFormSchema } from '../schema';
import { useUserTableLogic } from '../managers';

type UserSchema = ReturnType<typeof UserFormSchema>['userSchema'];

// Base User model for the user management module
export interface AdminUser {
  UserId: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Role: 'POWER_ADMIN' | 'SUPER_ADMIN' | 'NORMAL_USER';
  Status: boolean;
}

// Extend AdminUser to satisfy DataTable constraints
export type UserRecord = AdminUser & Record<string, unknown>;

export interface UserFormProps {
  user?: AdminUser;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
  translate: (key: string) => string;
}

// Form data types
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: AdminUser['Role'];
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  userId: string;
  status?: boolean; // Optional for toggling status
}

export type UsersManagerState = ReturnType<typeof useUserTableLogic>;

// User list response
export interface UsersListResponse {
  message: string;
  data: {
    count: number;
    users: AdminUser[];
  };
}

// User filters
export interface UserFilters {
  search?: string;
  type?: UserType;
  status?: UserStatus;
  department?: string;
  page?: number;
  limit?: number;
}

export interface UserDataTableProps {
  users: AdminUser[];
  loading?: boolean;
  pagination: PaginationInfo;
  currentFilters: FilterValues;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: SortConfig | null) => void;
  onFilterChange: (filters: FilterValues) => void;
  onView?: (user: AdminUser) => void;
  onEdit?: (user: AdminUser) => void;
  onDelete?: (user: AdminUser) => void;
  onResetPassword?: (user: AdminUser) => void;
  onSuspend?: (user: AdminUser) => void;
  className?: string;
  onClickUser?: (user:AdminUser) => void;
}



export type FormData = z.infer<UserSchema>;


// Shared action types for user dialogs
export type UserActionType = 'delete' | 'suspend' | 'reset';

// Props for the shared UserActionDialog component
export interface UserActionDialogProps {
  type: UserActionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
  onConfirm: () => Promise<void> | void;
}
