import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string };
    }
  }
}

// Export the custom Request type
export interface CustomRequest extends Request {
  user?: JwtPayload & { id: string };
}
