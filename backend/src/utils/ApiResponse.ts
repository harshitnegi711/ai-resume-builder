
export const ApiResponse = (statusCode: number, data: {} | string | [] | undefined, message: string = "successfully done") => {
  return {
    statusCode,
    data,
    message,
    success: statusCode < 400
  }
}
