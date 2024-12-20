import { Injectable } from '@nestjs/common';
import { Neo4jConfigService } from 'config/neo4j.config';

@Injectable()
export class FavoriteListService {
  constructor(private readonly neo4jConfigService: Neo4jConfigService) {}

  private async runQuery(query: string, params: Record<string, any>) {
    const session = this.neo4jConfigService.getDriver().session();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  async getFavoriteList(userId: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const query = `
      MATCH (u:User)-[:FAVORITE]->(p)
      WHERE u.id = $userId
      RETURN p SKIP toInteger($offset) LIMIT toInteger($limit)
    `;
    const result = await this.runQuery(query, { userId, offset, limit });

    return {
      results: result.records.map((record) => {
        const node = record.get('p');
        return {
          id: node.properties.id,
          name: node.properties.name,
          price: node.properties.price || null,
          imageUrl: node.properties.imageUrl || null,
        };
      }),
      totalPages: Math.ceil(result.records.length / limit), // Adjust based on actual count
    };
  }

  async addToFavoriteList(userId: string, productId: string) {
    if (!userId || !productId) {
      throw new Error('User ID and Product ID are required');
    }

    const query = `
      MATCH (u:User {id: $userId}), (p {id: $productId})
      MERGE (u)-[:FAVORITE]->(p)
      RETURN p;
    `;

    const result = await this.runQuery(query, { userId, productId });

    return {
      results: result.records.map((record) => {
        const node = record.get('p');
        return {
          id: node.properties.id,
          name: node.properties.name,
          price: node.properties.price || null,
          imageUrl: node.properties.imageUrl || null,
        };
      }),
    };
  }

  async removeFromFavoriteList(userId: string, productId: string) {
    if (!userId || !productId) {
      throw new Error('User ID and Product ID are required');
    }

    const query = `
      MATCH (u:User {id: $userId})-[r:FAVORITE]->(p {id: $productId})
      DELETE r
      RETURN p;
    `;

    const result = await this.runQuery(query, { userId, productId });

    return {
      results: result.records.map((record) => {
        const node = record.get('p');
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
