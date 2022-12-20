import { ConflictException } from "@nestjs/common";

export class ActiveGameAlreadyExistsError extends ConflictException {}
