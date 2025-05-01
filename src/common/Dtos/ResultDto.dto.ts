export class ResultDto<T = null> {
  data?: T | null; // `T` can be nullable, and data itself can be `undefined` or `null`
  isSuccess: boolean;
  message?: string;

  constructor(isSuccess: boolean, data?: T | null, message?: string) {
    this.isSuccess = isSuccess;
    this.data = data ?? null; // Ensures data is null if it's undefined
    this.message = message;
  }
}
