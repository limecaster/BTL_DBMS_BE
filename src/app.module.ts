import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildController } from 'controller/build.controller';
import { ManualBuildService } from 'service/manual-build.service';
import { Neo4jConfigService } from 'config/neo4j.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutoBuildService } from 'service/auto-build.service';
import { SpacyService } from 'service/spacy.service';
import { CheckCompatibilityService } from 'service/check-compatibility.service';
import { SearchController } from 'controller/search.controller';
import { SearchProductService } from 'service/search-product.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, BuildController, SearchController],
  providers: [
    AppService,
    ManualBuildService,
    AutoBuildService,
    CheckCompatibilityService,
    SpacyService,
    Neo4jConfigService,
    ConfigService,
    SearchProductService
  ],
})
export class AppModule { }
