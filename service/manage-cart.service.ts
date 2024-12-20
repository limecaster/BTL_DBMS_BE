import { Injectable } from '@nestjs/common';
import { Neo4jConfigService } from 'config/neo4j.config';

@Injectable()
export class ManageCartService {
  constructor(private readonly neo4jConfigService: Neo4jConfigService) {}

  private async runQuery(query: string, params: Record<string, any>) {
    const session = this.neo4jConfigService.getDriver().session();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  async viewCart(userId: string){
    const query = `
      MATCH (user:User {id: $userId})-[:OWNS]->(cart:Cart)-[r:CONTAINS]->(product)
      RETURN product, r.quantity AS quantity
    `;
    if (!userId) {
        throw new Error('UserID is required');
    }
    return this.runQuery(query, { userId });
  }

  async addProductToCart(productId: string, quantity: number, userId: string){
    const query = `MATCH (user:User {id: $userId})-[:OWNS]->(cart:Cart)
    CALL db.index.fulltext.queryNodes("searchProductId", $productId) 
    YIELD node AS product
    WITH user, cart, product
    LIMIT 1  
    MERGE (cart)-[r:CONTAINS]->(product)
    SET r.quantity = $quantity
    `;
    if (!productId) {
        throw new Error('ProductID is required');
    }
    if (!userId) {
        throw new Error('UserID is required');
    }
    return this.runQuery(query, { userId, productId, quantity});
    }

   async increaseQuantityProductInCart(productId: number, userId: string){
    const query = `MATCH (user:User {id: $userId})-[:OWNS]->(cart:Cart)
      CALL db.index.fulltext.queryNodes("searchProductId", $productId) 
      YIELD node AS product
      WITH user, cart, product
      MATCH (cart)-[r:CONTAINS]->(product)
      SET r.quantity = r.quantity + 1
      RETURN r
`;
    if (!productId) {
        throw new Error('ProductID is required');
    }
    if (!userId) {
        throw new Error('UserID is required');
    }
    return this.runQuery(query, { userId, productId });
   }

   async decreaseQuantityProductInCart(productId: number, userId: string){
    const query = `MATCH (user:User {id: $userId})-[:OWNS]->(cart:Cart)
CALL db.index.fulltext.queryNodes("searchProductId", $productId) 
YIELD node AS product
WITH user, cart, product
MATCH (cart)-[r:CONTAINS]->(product)
SET r.quantity = r.quantity - 1
RETURN r
`;
    if (!productId) {
        throw new Error('ProductID is required');
    }
    if (!userId) {
        throw new Error('UserID is required');
    }
    return this.runQuery(query, { userId, productId });
   }

   async deleteProductFromCart(productId: number, userId: string){
    const query = `MATCH (user:User {id: $userId})-[:OWNS]->(cart:Cart)
CALL db.index.fulltext.queryNodes("searchProductId", $productId) 
YIELD node AS product
WITH user, cart, product
MATCH (cart)-[r:CONTAINS]->(product)
DELETE r
    `;
    if (!productId) {
        throw new Error('ProductID is required');
    }
    if (!userId) {
        throw new Error('UserID is required');
    }
    return this.runQuery(query, { userId, productId });
    }

   async calTotalPrice(userId: string){
      const query = `MATCH (user:User {id: $userId})-[:OWNS]->(cart:Cart)-[r:CONTAINS]->(product)
      RETURN SUM(r.quantity * product.price) AS totalPrice
      `;
    
      if (!userId) {
          throw new Error('UserID is required');
      }
      return this.runQuery(query, { userId});
      }


}