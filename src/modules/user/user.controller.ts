import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
