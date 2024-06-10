export const isAxiosError = (error: any) => Boolean(error?.response?.data?.message);

export const messageErrorAxios = (error: any): string => error?.response?.data?.message;

export const getMessageErrorAxios = (error: any) => {
  let message: string = error?.message;

  if (isAxiosError(error)) {
    message = messageErrorAxios(error);
  }

  return message;
};
