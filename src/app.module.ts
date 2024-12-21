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
import { UserService } from 'service/user.service';
import { UserController } from 'controller/user.controller';
import { FavoriteListService } from 'service/favorite-list.service';
import { FavoriteListController } from 'controller/favorite-list.controller';
import { ManageCartController } from 'controller/manage-cart.controller';
import { ViewDetailController } from 'controller/view-detail.controller';
import { DetailProductService } from 'service/detail-product.service';
import { ManageCartService } from 'service/manage-cart.service';
import { RecommendController } from 'controller/recommend.controller';
import { RecommendService } from 'service/recommend.service';
import { ProductController } from 'controller/list-products.controller';
import { ProductService } from 'service/list-products.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    BuildController,
    SearchController,
    FavoriteListController,
    ManageCartController,
    ViewDetailController,
    UserController,
    RecommendController,
    ProductController,
  ],
  providers: [
    AppService,
    ManualBuildService,
    AutoBuildService,
    CheckCompatibilityService,
    SpacyService,
    Neo4jConfigService,
    ConfigService,
    SearchProductService,
    FavoriteListService,
    ManageCartService,
    DetailProductService,
    UserService,
    RecommendService,
    ProductService,
  ],
})
export class AppModule {}
