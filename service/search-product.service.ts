import { Injectable } from '@nestjs/common';
import { Neo4jConfigService } from 'config/neo4j.config';

@Injectable()
export class SearchProductService {
  constructor(private readonly neo4jConfigService: Neo4jConfigService) {}

  private async runQuery(query: string, params: Record<string, any>) {
    const session = this.neo4jConfigService.getDriver().session();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  async searchProduct(name: string) {
    // Do a full-text search for a product by name
    // Requires a FULLTEXT index on the each product node's name property
    
    const query = `
      CALL db.index.fulltext.queryNodes('searchProductName', $name)
      YIELD node, score
      RETURN node, score
      LIMIT 100;
    `;

    return this.runQuery(query, { name });
  }
}