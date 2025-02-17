import { z } from "zod";

// Validation schema
export const personalInfoSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    dateOfBirth: z.string(),
    phoneNumber: z.string().min(10, "Invalid phone number"),
  });


export const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one symbol"
      ),
  });
  

  export const signinSchema = z.object({
    email: z.string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password is too long"),
  });