import { IsEmail, IsString, Length } from 'class-validator';

export class LocalRegisterCommand {
  @IsEmail()
  @Length(6, 64)
  public readonly username: string = '';

  @IsString()
  @Length(1, 32)
  public readonly displayName: string = '';

  @IsString()
  @Length(8, 32)
  public readonly password: string = '';
}
