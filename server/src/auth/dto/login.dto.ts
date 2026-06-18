import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "analyst@logsage.ai" })
  @IsEmail({}, { message: "Enter a valid email address." })
  email!: string;

  @ApiProperty({ example: "StrongPassword123!" })
  @IsString({ message: "Password must be text." })
  @MinLength(8, { message: "Password must be at least 8 characters." })
  @MaxLength(128, { message: "Password must be 128 characters or less." })
  password!: string;
}
