import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

interface DecodedToken extends JwtPayload {
  id: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Not authorized, admin access required" });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to verify admin access" });
  }
};

export const writerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user || (user.role !== "writer" && user.role !== "admin")) {
      res
        .status(403)
        .json({ message: "Not authorized, writer access required" });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to verify writer access" });
  }
};

export const viewerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user || (user.role !== "viewer" && user.role !== "admin")) {
      res
        .status(403)
        .json({ message: "Not authorized, viewer access required" });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to verify viewer access" });
  }
};
