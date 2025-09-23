import { StatusCodes } from 'http-status-codes'

export default class ApiResponse<T = any> {
  constructor(
    public statusCode: number,
    public message: string,
    public success: boolean,
    public data: T | null
  ) {}

  /**
   * Response cho request thành công (200 OK)
   */
  static success<T>(data: T, message = 'Operation successful!') {
    return new ApiResponse(StatusCodes.OK, message, true, data)
  }

  /**
   * Response cho tạo mới thành công (201 Created)
   */
  static created<T>(data: T, message = 'Resource created successfully!') {
    return new ApiResponse(StatusCodes.CREATED, message, true, data)
  }
}
