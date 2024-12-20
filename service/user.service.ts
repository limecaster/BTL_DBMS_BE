import { RegisterUserDto, LoginUserDto } from "dto/user.dto";
import { Injectable } from "@nestjs/common";
import { Neo4jConfigService } from "config/neo4j.config";
import { NotFoundException } from '@nestjs/common';

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
            CREATE (u:User {
                username: $username,
                password: $password,
                firstName: $firstName,
                lastName: $lastName,
                email: $email,
                city: $city,
                states: $states
            })
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
                states: userDto.states,
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

  async loginUser(userDto: LoginUserDto): Promise<{ success: boolean, username?: string }> {
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

    if (result.records.length > 0) {
        const username = result.records[0].get('username'); // Extract username from the result
        console.log(username);
        return { success: true, username: username };
    } else {
        return { success: false };
    }
}
    async updateUser(userDto: RegisterUserDto): Promise<void> {
        const session = this.neo4jConfigService.getSession();

        const checkQuery = `
            MATCH (u:User { username: $username })
            RETURN u
        `;

        const query = `
            MATCH (u:User { username: $username })
            SET u.firstName = $firstName, u.lastName = $lastName, u.email = $email, u.city = $city, u.states = $states, u.phone = $phone
        `;

        try {

            // Check if username NOT exists
            const result = await session.run(checkQuery, { username: userDto.username });
            if (result.records.length === 0) {
                throw new NotFoundException('User not found');
            }

            await session.run(query, {
                username: userDto.username,
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                email: userDto.email,
                city: userDto.city,
                states: userDto.states,
                phone: userDto.phone
            });
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        } finally {
            await session.close(); // Ensure the session is properly closed
        }
    }

    async getUserProfile(username: string): Promise<RegisterUserDto> {
        const session = this.neo4jConfigService.getSession();
        const query = `
            MATCH (u:User { username: $username })
            RETURN u.username as username, u.firstName as firstName, u.lastName as lastName, u.email as email, u.city as city, u.states as states, u.phone as phone
        `;
        const result = await session.run(query, { username });
        session.close();
        return result.records[0].toObject() as RegisterUserDto;
    }

}