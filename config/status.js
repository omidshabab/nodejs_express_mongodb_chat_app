const HTTP_STATUS = {
  CONTINUE: "CONTINUE", // 100
  OK: "OK", // 200
  CREATED: "CREATED", // 201
  ACCEPTED: "ACCEPTED", // 202
  NO_CONTENT: "NO_CONTENT", // 204
  RESET_CONTENT: "RESET_CONTENT", // 205
  BAD_REQUEST: "BAD_REQUEST", // 400
  UNAUTHORIZED: "UNAUTHORIZED", // 401
  FORBIDDEN: "FORBIDDEN", // 403
  NOT_FOUND: "NOT_FOUND", // 404
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED", // 405
  CONFLICT: "CONFLICT", // 409
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR", // 500
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED", // 501
  BAD_GATEWAY: "BAD_GATEWAY", // 502
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE", // 503
  GATEWAY_TIMEOUT: "GATEWAY_TIMEOUT", // 504
};

module.exports = HTTP_STATUS;
