import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';

@Controller('/posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    // @UseGuards(AccessTokenGuard)
    // @UseGuards(APIKeyGuard)
    @Auth([AuthType.Bearer, AuthType.APIKey], {condition: ConditionGuard.And})
    // @UseGuards(AuthenticationGuard)
    @Get()
    getPosts() {
        return this.postsService.getPosts()
    }
    @Post()
    createPost(@Body() body: any) {
        return this.postsService.createPost(body)
    }
    @Get(':id')
    getPost(@Param('id') id: string) {
        return this.postsService.getPost(id)
    }
    @Put(':id')
    updatePost(@Param('id') id: string, @Body() body: any) {
        return this.postsService.updatePost(id, body)
    }
    @Delete(':id')
    deletePost(@Param('id') id: string) {
        return this.postsService.deletePost(id)
    }
}
