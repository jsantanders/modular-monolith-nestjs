import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./infra/database/repositories";
import { UserController } from "./infra/http/user";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserController],
})
export class UserModule {}
