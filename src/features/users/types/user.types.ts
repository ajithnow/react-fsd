import type { UserStatus, UserType } from '../constants/users.constants';
import type { PaginationInfo, SortConfig, FilterValues } from '@/shared/components';
import type { z } from 'zod';
import type { UserFormSchema } from '../schema';

type UserSchema = ReturnType<typeof UserFormSchema>['userSchema'];

export type AdminUser = {
  UserId: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Role: 'admin' | 'editor' | 'viewer';
  Status: boolean;
};

export type UserRecord = AdminUser & Record<string, unknown>;

export type UserFormProps = {
  user?: AdminUser;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
  translate: (key: string) => string;
};

export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  role: AdminUser['Role'];
};

export type UpdateUserRequest = Partial<CreateUserRequest> & {
  userId: string;
  status?: boolean;
};

export type UsersListResponse = {
  message: string;
  data: {
    count: number;
    users: AdminUser[];
  };
};

export type UserFilters = {
  search?: string;
  type?: UserType;
  status?: UserStatus;
  department?: string;
  page?: number;
  limit?: number;
};

export type UserDataTableProps = {
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
  onClickUser?: (user: AdminUser) => void;
};

export type FormData = z.infer<UserSchema>;

export type UserActionType = 'delete' | 'suspend' | 'reset';

export type UserActionDialogProps = {
  type: UserActionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
  onConfirm: () => Promise<void> | void;
};
