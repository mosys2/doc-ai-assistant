import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";

@Injectable()
export class MongooseDbConfig implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const host = this.configService.get<string>("Db.host");
    const port = this.configService.get<string>("Db.port");
    const database = this.configService.get<string>("Db.database");
    const username = this.configService.get<string>("Db.username");
    const password = this.configService.get<string>("Db.password");

    let uri = `mongodb://${host}:${port}/${database}`;

    if (username && password) {
      uri = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`;
    }
    console.log(uri)


    return {
      uri,
    };
  }
}


