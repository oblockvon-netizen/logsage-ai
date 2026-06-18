import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "Alex Morgan" })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: "analyst@logsage.ai" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "StrongPassword123!" })
  @IsString()
  @MinLength(8)
  password!: string;
}
