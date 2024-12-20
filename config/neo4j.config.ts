import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver } from 'neo4j-driver';

@Injectable()
export class Neo4jConfigService {
  private driver: Driver;

  constructor(private configService: ConfigService) {
    this.driver = neo4j.driver(
      this.configService.get<string>('NEO4J_URI'),
      neo4j.auth.basic(
        this.configService.get<string>('NEO4J_USER'),
        this.configService.get<string>('NEO4J_PASSWORD'),
      ),  
    );
    this.testConnection();
  }

  async testConnection() {
    const session = this.driver.session();
    try {
      const result = await session.run('RETURN 1');
      console.log('Neo4j connected');
    } catch (error) {
      console.error('Error connecting to Neo4j:', error);
    } finally {
      await session.close();
    }
  }

  getSession() {
    return this.driver.session();
  }

  getDriver(): Driver {
    return this.driver;
  }
}
