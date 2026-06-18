import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class UuidParamPipe implements PipeTransform<string, string> {
  transform(value: string) {
    if (!uuidRegex.test(value)) {
      throw new BadRequestException("Invalid UUID parameter.");
    }

    return value;
  }
}
