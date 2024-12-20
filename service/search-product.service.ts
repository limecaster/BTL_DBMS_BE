import { Injectable } from '@nestjs/common';
import { Neo4jConfigService } from 'config/neo4j.config';
import { off } from 'process';

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

  async searchProduct(name: string, page: number = 1, limit: number = 10) {
    if (!name) {
      throw new Error('Name is required');
    }

    // Ensure page and limit are integers
    const pageNum = Math.max(1, Math.floor(page)); // Ensure page is at least 1
    const limitNum = Math.max(1, Math.floor(limit)); // Ensure limit is at least 1

    const offset = (pageNum - 1) * limitNum;

    const query = `
        CALL db.index.fulltext.queryNodes('searchProductName', $name)
        YIELD node, score
        RETURN node, score
        SKIP toInteger($offset)
        LIMIT toInteger($limit);
    `;

    const result = await this.runQuery(query, {
      name,
      offset,
      limit: limitNum,
    });
    
    const countTotalRecords = `
      CALL db.index.fulltext.queryNodes('searchProductName', $name)
      YIELD node
      RETURN count(node) as totalRecords;
    `;

    const countResult = await this.runQuery(countTotalRecords, { name });
    const countTotalRecordsResult = countResult.records[0].get('totalRecords').toNumber();

    return {
      results: result.records.map((record) => {
        const node = record.get('node');
        return {
          id: node.properties.id,
          name: node.properties.name,
          price: node.properties.price || null,
          imageUrl: node.properties.imageUrl || null,
          score: record.get('score'),
        };
      }),
      currentPage: pageNum,
      totalPages: Math.ceil(countTotalRecordsResult / limitNum)
    };
  }
}
