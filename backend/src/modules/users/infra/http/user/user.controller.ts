import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiConsumes, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateUserDto } from "./create-user.dto";
import { CreateUserCommand } from "modules/users/application/user/create-user/create-user.command";

@Controller("users")
@ApiTags("users")
export class UserController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post("register")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: "Successfully Registered" })
  @ApiConsumes("application/json")
  async userRegister(@Body() request: CreateUserDto) {
    const { email, password, firstName, lastName } = request;
    return this.commandBus.execute(new CreateUserCommand(email, firstName, lastName, password));
  }
}
