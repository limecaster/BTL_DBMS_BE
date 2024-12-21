import { Injectable } from '@nestjs/common';
import { Neo4jConfigService } from 'config/neo4j.config';

@Injectable()
export class RecommendService {
  constructor(private readonly neo4jConfigService: Neo4jConfigService) {}

  private async runQuery(query: string, params: Record<string, any>) {
    const session = this.neo4jConfigService.getDriver().session();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  async recommendProducts(productId: string) {
    const query = `
      MATCH (p1)-[:COMPATIBLE_WITH]-(p2)
      WHERE p1.id = $productId
      AND p1.manufacturer IS NOT NULL AND p2.manufacturer IS NOT NULL
      WITH p1, p2
      ORDER BY (p1.manufacturer = p2.manufacturer) DESC
      RETURN p2 LIMIT 10
    `;
    const result = await this.runQuery(query, { productId });

    return {
      results: result.records.map((record) => {
        const node = record.get('p2');
        return {
          id: node.properties.id,
          name: node.properties.name,
          price: node.properties.price || null,
          imageUrl: node.properties.imageUrl || null,
        };
      }),
    };
  }
}
