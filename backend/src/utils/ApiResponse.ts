
export const ApiResponse = (statusCode: number, data: any | string | [] | undefined, message: string = "successfully done") => {
  return {
    statusCode,
    data,
    message,
    success: statusCode < 400
  }
}
