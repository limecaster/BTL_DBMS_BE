import { RegisterUserDto, LoginUserDto, RegisterUserWithoutPasswordDto } from "dto/user.dto";
import { Injectable } from "@nestjs/common";
import { Neo4jConfigService } from "config/neo4j.config";
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly neo4jConfigService: Neo4jConfigService) {}

    async createUser(userDto: RegisterUserDto): Promise<number> {
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
            RETURN id(u) as id
        `;

        try {
            // Check if username already exists
            const result = await session.run(checkQuery, { username: userDto.username });

            if (result.records.length > 0) {
                throw new Error('Username already exists');
            }

            // Create new user and return the new user's ID
            const createResult = await session.run(createQuery, {
                username: userDto.username,
                password: userDto.password,
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                email: userDto.email,
                city: userDto.city,
                states: userDto.states,
            });

            const id = createResult.records[0].get('id');
            return id;

        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        } finally {
            await session.close();
        }
    }

    async getUserProfileById(id: number): Promise<LoginUserDto> {
        const session = this.neo4jConfigService.getSession();
        const query = `
            MATCH (u:User)
            WHERE id(u) = $id
            RETURN u.username as username, u.firstName as firstName, u.lastName as lastName, u.email as email, u.city as city, u.states as states, u.phone as phone
        `;
        const result = await session.run(query, {  id: Number(id) });
        session.close();

        if (result.records.length === 0) {
            throw new NotFoundException('User not found');
        }

        return result.records[0].toObject() as LoginUserDto;
    }

    async loginUser(userDto: LoginUserDto): Promise<{ success: boolean, id?: number }> {
        const session = this.neo4jConfigService.getSession();
        const query = `
            MATCH (u:User { username: $username, password: $password })
            RETURN id(u) as id
        `;
        
        const result = await session.run(query, {
            username: userDto.username,
            password: userDto.password,
        });
        
        session.close();

        if (result.records.length > 0) {
            const id = result.records[0].get('id').toNumber();
            return { success: true, id };
        } else {
            return { success: false };
        }
    }

    async updateUserProfileById(id: number, userDto: RegisterUserWithoutPasswordDto): Promise<void> {
        const session = this.neo4jConfigService.getSession();

        const checkQuery = `
            MATCH (u:User)
            WHERE id(u) = $id
            RETURN u
        `;

        const query = `
            MATCH (u:User)
            WHERE id(u) = $id
            SET u.firstName = $firstName, u.lastName = $lastName, u.email = $email, u.city = $city, u.states = $states, u.phone = $phone
        `;

        try {
            // Check if user exists by ID
            const result = await session.run(checkQuery, { id : Number(id) });
            if (result.records.length === 0) {
                throw new NotFoundException('User not found');
            }

            // Update user details
            await session.run(query, {
                id: Number(id),
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                email: userDto.email,
                city: userDto.city,
                states: userDto.states,
                phone: userDto.phone,
            });
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        } finally {
            await session.close();
        }
    }
}
