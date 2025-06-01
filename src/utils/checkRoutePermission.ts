import { getProtectedPaths } from '@/routes/protectedPaths';

export const checkRoutePermission = (path: string, userData: any): boolean => {
  const { staff, user } = getProtectedPaths();

  if (!userData?.user_data && !userData?.staff_data) {
    return !staff.includes(path) && !user.includes(path);
  }
  if (userData?.staff_data) return !user.includes(path);
  if (userData?.user_data) return !staff.includes(path);
  return false;
};
