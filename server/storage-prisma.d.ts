export const storage: any = {
  getUser: (emailOrId: string) => ({ id: emailOrId, email: emailOrId }),
};
