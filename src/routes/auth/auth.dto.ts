import { Exclude, Type } from "class-transformer"
import { IsString, Length } from "class-validator"
import { Match } from "src/shared/decorators/custom-validator.decorator"
import { SuccessResDTO } from "src/shared/shared.dto"

export class LoginBodyDTO {
    @IsString()
    email: string
    @IsString()
    @Length(6, 20, {message: 'Password must be between 6 and 20 characters'})
    password: string
}

export class LoginResDTO {
  accessToken: string
  refreshToken: string

  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial);
  }
}

export class RegisterBodyDTO extends LoginBodyDTO {
    @IsString()
    name: string
    @IsString()
    @Match('password', {message: 'Confirm password must be same as password'})
    confirmPassword: string
}

class RegisterData {
    id: number
    email: string
    name: string
    @Exclude() password: string
    createdAt: Date
    updatedAt: Date

    constructor(partial: Partial<RegisterData>) {
    Object.assign(this, partial);
  }
}


export class RegisterResDTO extends SuccessResDTO{
    @Type(() => RegisterData)
    declare data: RegisterData

    constructor(partial: Partial<RegisterResDTO>) {
    super(partial)
    Object.assign(this, partial);
  }
}

export class RefreshTokenBodyDTO {
    @IsString()
    refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO{

}
