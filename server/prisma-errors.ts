const DATABASE_UNAVAILABLE_MESSAGE =
  "Reservation service is temporarily unavailable. Please make sure the database is running and try again.";

export const isDatabaseUnavailableError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    code?: string;
    message?: string;
    name?: string;
  };

  return (
    candidate.name === "PrismaClientInitializationError" ||
    candidate.code === "P1001" ||
    candidate.message?.includes("Can't reach database server") === true
  );
};

export const getDatabaseUnavailableMessage = () => DATABASE_UNAVAILABLE_MESSAGE;
