export class ClientErrpr extends Error {
  statusCode: number;

  constructor (message: string) {
    super(message);
    this.name = "ClientError";
    this.statusCode = 400;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor (message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor (message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}
