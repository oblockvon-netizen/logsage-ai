import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "Alex Morgan" })
  @IsString({ message: "Full name must be text." })
  @IsNotEmpty({ message: "Full name is required." })
  @MinLength(2, { message: "Full name must be at least 2 characters." })
  @MaxLength(80, { message: "Full name must be 80 characters or less." })
  fullName!: string;

  @ApiProperty({ example: "analyst@logsage.ai" })
  @IsEmail({}, { message: "Enter a valid email address." })
  email!: string;

  @ApiProperty({ example: "StrongPassword123!" })
  @IsString({ message: "Password must be text." })
  @MinLength(8, { message: "Password must be at least 8 characters." })
  @MaxLength(128, { message: "Password must be 128 characters or less." })
  password!: string;
}
