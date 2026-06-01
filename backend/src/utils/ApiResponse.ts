
export const ApiResponse = (statusCode: number, data: {} | string | [], message: string = "successfully done") => {
  return {
    statusCode,
    data,
    message,
    success: statusCode < 400
  }
}
