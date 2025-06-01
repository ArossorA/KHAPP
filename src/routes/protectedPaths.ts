export const pathProtectedAdmin = [ "/admin/log", "/admin/report"];
export const pathProtectedUser = ["/user", "/user/user_management"];

export const getProtectedPaths = () => ({
    staff: pathProtectedAdmin,
    user: pathProtectedUser,
});