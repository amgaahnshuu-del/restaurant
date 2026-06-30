import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export const ok = <T>(data: T, message?: string, status = 200) =>
  NextResponse.json<ApiResponse<T>>({ success: true, message, data }, { status });

export const created = <T>(data: T, message?: string) =>
  NextResponse.json<ApiResponse<T>>({ success: true, message, data }, { status: 201 });

export const badRequest = (message: string, error?: string) =>
  NextResponse.json<ApiResponse>({ success: false, message, error }, { status: 400 });

export const unauthorized = (message = "Unauthorized") =>
  NextResponse.json<ApiResponse>({ success: false, message }, { status: 401 });

export const forbidden = (message = "Forbidden") =>
  NextResponse.json<ApiResponse>({ success: false, message }, { status: 403 });

export const notFound = (message = "Not found") =>
  NextResponse.json<ApiResponse>({ success: false, message }, { status: 404 });

export const conflict = (message: string) =>
  NextResponse.json<ApiResponse>({ success: false, message }, { status: 409 });

export const serverError = (message = "Internal server error") =>
  NextResponse.json<ApiResponse>({ success: false, message }, { status: 500 });

export const handleError = (err: unknown): NextResponse => {
  if (err instanceof ZodError) {
    const message = err.errors[0]?.message ?? "Validation failed";
    return badRequest("Validation failed", message);
  }
  if (err instanceof AppError) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: err.message },
      { status: err.status },
    );
  }
  console.error("[Unhandled Error]", err);
  return serverError();
};
