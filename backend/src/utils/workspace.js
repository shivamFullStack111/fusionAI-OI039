export const getWorkspaceUserId = (user) =>
  user?.role === "member" && user?.parentUserId ? user.parentUserId : user?._id;

export const isMember = (user) => user?.role === "member";

export const denyMemberAction = (req, res, action) => {
  if (!isMember(req.user)) return false;

  res.status(403).send({
    success: false,
    message: `Only admin users can ${action}.`,
  });

  return true;
};
