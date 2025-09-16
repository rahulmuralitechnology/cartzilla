class CustomError extends Error {
    public readonly isOperational: boolean;
    public statusCode: number;
    public status: string;
  
    constructor(message: string, statusCode: number, name: string = "") {
      super(message);
      this.name = name;
      this.statusCode = statusCode || 500;
      this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default CustomError;
  