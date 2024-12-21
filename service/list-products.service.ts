import { Injectable } from '@nestjs/common';
import { Neo4jConfigService } from 'config/neo4j.config';

@Injectable()
export class ProductService {
  constructor(private readonly neo4jConfigService: Neo4jConfigService) {}

  private async runQuery(query: string, params: Record<string, any>) {
    const session = this.neo4jConfigService.getDriver().session();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  // Get a list of products by label with pagination
  async getProductsByLabel(
    label: string,
    limit: number = 10,
    skip: number = 0,
  ) {
    const query = `
      MATCH (p:${label})
      RETURN p
      SKIP toInteger($skip)
      LIMIT toInteger($limit)
    `;
    const result = await this.runQuery(query, { label, skip, limit });

    return result.records.map((record) => {
      const node = record.get('p');
      return {
        id: node.properties.id,
        name: node.properties.name,
        price: node.properties.price || null,
        imageUrl: node.properties.imageUrl || null,
        manufacturer: node.properties.manufacturer || null, // Assuming 'manufacturer' is a property
      };
    });
  }
  // Function to fetch all products with pagination
  async getAllProducts(limit: number, skip: number) {
    const query = `
      MATCH (p)
      WHERE p:CPU OR p:CPUCooler OR p:Case OR p:GraphicsCard OR p:InternalHardDrive
        OR p:Keyboard OR p:Monitor OR p:Motherboard OR p:Mouse OR p:PowerSupply
        OR p:RAM OR p:Speaker OR p:ThermalPaste OR p:WiFiCard OR p:WiredNetworkCard
      RETURN p
      SKIP toInteger($skip)
      LIMIT toInteger($limit)
    `;
    const result = await this.runQuery(query, { limit, skip });
    return result.records.map((record) => {
      const node = record.get('p');
      return {
        id: node.properties.id,
        name: node.properties.name,
        price: node.properties.price || null,
        imageUrl: node.properties.imageUrl || null,
      };
    });
  }
}
