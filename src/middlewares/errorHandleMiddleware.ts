import express from "express";

export const errorHandleMiddleware = () => {
  const log = {
    warn: console.warn,
    info: console.log,
    error: console.error,
  };

  return (err: any, req: express.Request, res: express.Response, next: any) => {
    const { body, query, params } = req;
    if (err?.statusCode && err?.type) {
      log.warn({ err, body, query, params }, "Route handler had error");
      // Gracefully handle a shared error type
      const data = Array.isArray(err.data)
        ? err.data.map((row: any) => (row.message ? row.message : row))
        : err.data;

      return res
        .status(err.statusCode)
        .json({
          message: err.message,
          code: err.statusCode,
          type: err.type,
          data,
        });
    } else {
      log.error(
        { err, body, query, params },
        "Route handler with unhandled exception"
      );
      return res.status(500).json({
        message: "Internal server error",
        type: "ServerInternalError",
        detail: err?.message,
      });
    }
  };
};
