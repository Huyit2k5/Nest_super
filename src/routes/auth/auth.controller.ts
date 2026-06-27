import { Body, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO, LoginResDTO, RefreshTokenBodyDTO, RefreshTokenResDTO, RegisterBodyDTO, RegisterResDTO } from './auth.dto';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @SerializeOptions({ type: RegisterResDTO })
    @Post('register')
    async register(@Body() body: RegisterBodyDTO) {
        // return new RegisterResDTO(await this.authService.register(body));
        return await this.authService.register(body)
    }

    @Post('login')
    async login(@Body() body: LoginBodyDTO) {
        return new LoginResDTO(await this.authService.login(body))
    }

    @UseGuards(AccessTokenGuard)
    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() body: RefreshTokenBodyDTO) {
        return new RefreshTokenResDTO(await this.authService.refreshToken(body.refreshToken))
    }
}
