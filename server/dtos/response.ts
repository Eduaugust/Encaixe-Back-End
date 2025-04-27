export class ResponseDTO {
  type: string;
  status: number;
  message: string;
  data: any | null;

  constructor(type: string, status: number, message: string, data: any = null) {
    this.type = type;
    this.status = status;
    this.message = message;
    this.data = data;
  }
}