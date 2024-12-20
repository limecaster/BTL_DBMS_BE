import { RegisterUserDto, LoginUserDto } from "dto/user.dto";
import { Injectable } from "@nestjs/common";
import { Neo4jConfigService } from "config/neo4j.config";

@Injectable()
export class UserService {
    constructor(private readonly neo4jConfigService: Neo4jConfigService) {}

    async createUser(userDto: RegisterUserDto): Promise<void> {
        const session = this.neo4jConfigService.getSession();
        const checkQuery = `
            MATCH (u:User { username: $username })
            RETURN u
        `;
        const createQuery = `
            CREATE (u:User { username: $username, password: $password , firstName: $firstName, lastName: $lastName, email: $email, city: $city, states: $states})
        `;

        try {
            // Check if username already exists
            const result = await session.run(checkQuery, { username: userDto.username });

            if (result.records.length > 0) {
                throw new Error('Username already exists');
            }

            // Create new user
            await session.run(createQuery, {
                username: userDto.username,
                password: userDto.password,
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                email: userDto.email,
                city: userDto.city,
                states: userDto.states
            });
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        } finally {
            await session.close(); // Ensure the session is properly closed
        }
    }

  async getUser(username: string): Promise<LoginUserDto> {
    const session = this.neo4jConfigService.getSession();
    const query = `
      MATCH (u:User { username: $username })
      RETURN u.username as username, u.password as password
    `;
    const result = await session.run(query, { username });
    session.close();
    return result.records[0].toObject() as LoginUserDto;
  }

  async loginUser(userDto: LoginUserDto): Promise<boolean> {
    const session = this.neo4jConfigService.getSession();
    const query = `
      MATCH (u:User { username: $username, password: $password })
      RETURN u.username as username
    `;
    const result = await session.run(query, {
      username: userDto.username,
      password: userDto.password,
    });
    session.close();
    return result.records.length > 0;
  }
}