import { Injectable } from '@nestjs/common';
import { Neo4jConfigService } from 'config/neo4j.config';

@Injectable()
export class DetailProductService {
  constructor(private readonly neo4jConfigService: Neo4jConfigService) {}

  private async runQuery(query: string, params: Record<string, any>) {
    const session = this.neo4jConfigService.getDriver().session();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  async detailProduct(id: string) {

    const query = `
       CALL db.index.fulltext.queryNodes("searchProductId", $id)
        YIELD node
        RETURN node
    `;
    if (!id) {
      throw new Error('Index is required');
    }
    return this.runQuery(query, { id });
  }
}