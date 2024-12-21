import { Injectable } from '@nestjs/common';
import { Neo4jConfigService } from 'config/neo4j.config';
import { UserIdDto } from 'dto/user-id.dto.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(private readonly neo4jConfigService: Neo4jConfigService) {}

  private async runQuery(query: string, params: Record<string, any>) {
    const session = this.neo4jConfigService.getDriver().session();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  //create order with carts of user

  async createOrder(userId: UserIdDto) {
    const id = userId.id;
    const query = `
    MATCH (user:User {id: $id})-[:OWNS]->(cart:Cart)-[r:CONTAINS]->(product)
    WITH user, cart, product, r, SUM(r.quantity * product.price) AS totalPrice
    CREATE (user)-[:PLACED]->(order:Order {orderId: $orderId, date: datetime(), totalPrice: totalPrice, status: "Processing"})
    WITH user, cart, product, order, r
    MERGE (order)-[rel:CONTAINS]->(product)
    SET rel.quantity = r.quantity
    WITH order, r
    DELETE r
    RETURN order.orderId AS orderId
  `;
    if (!id) {
      throw new Error('UserID is required');
    }
    const orderId = uuidv4(); // Tạo UUID trên ứng dụng
    const result = await this.runQuery(query, { id, orderId });
    return result.records[0]?.get('orderId');
  }
}
