import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { LoginBodyDTO, RefreshTokenBodyDTO, RegisterBodyDTO } from './auth.dto';
import { TokenService } from 'src/shared/services/token.service';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers';

@Injectable()
export class AuthService {
    constructor(private readonly hashingService: HashingService, private readonly prismaService: PrismaService, private readonly tokenService: TokenService) {}

    async register(body: RegisterBodyDTO) {
        try {
        const hashingPassword = await this.hashingService.hash(body.password)
        const user = await this.prismaService.user.create({
            data: {
                email: body.email,
                password: hashingPassword,
                name: body.name
                }
            })
            return user
        } catch (error) {
            if (isUniqueConstraintPrismaError(error)) {
                throw new ConflictException("Email already exists")
            }
            throw error
        }
    }

    async login(body: LoginBodyDTO) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email
            }
        })
        if (!user) {
            throw new UnauthorizedException('Account is not exist')
        }

        const isPasswordMatch = await this.hashingService.compare(body.password, user.password)

        if (!isPasswordMatch) {
            throw new UnprocessableEntityException([
                {
                    field: 'password',
                    error: 'Password is incorrect'
                }
            ])
        }
        const tokens = await this.generateTokens({userId: user.id})
        return tokens
    }

    async generateTokens(payload: {userId: number}) {
        const [accessToken,refreshToken] = await Promise.all([
            this.tokenService.signAccessToken(payload),
            this.tokenService.signRefreshToken(payload)
        ])
        const decodeRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
        await this.prismaService.refreshToken.create({
            data: {
                token: refreshToken,
                userId: payload.userId,
                expiresAt: new Date(decodeRefreshToken.exp * 1000)
            }
        })
        return {
            accessToken,
            refreshToken
        }
    }

    async refreshToken(refreshToken: string) {
        try {
            const {userId} = await this.tokenService.verifyRefreshToken(refreshToken)
            await this.prismaService.refreshToken.findUniqueOrThrow({
                where: {
                    token: refreshToken
                }
            })
            // xoa refresh-token cu
            await this.prismaService.refreshToken.delete({
                where: {
                    token: refreshToken
                }
            })
            // tao moi access va refresh
            return await this.generateTokens({userId})
        } catch (error) {   
            // Truong hop da refresh token roi, thong bao cho user biet refresh token cuar ho da bi danh cap
            if (isNotFoundPrismaError(error)) {
                throw new UnauthorizedException('Refresh token has been revoked')
            }
            throw new UnauthorizedException('Account is not exist')
        }
    }
}
