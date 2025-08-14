export const storage = {
  getUser: async (emailOrId: string) => ({ id: emailOrId, email: emailOrId }),
};
