import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from 'service/list-products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Endpoint to get products by label with pagination
  @Get(':label')
  async getProductsByLabel(
    @Param('label') label: string,
    @Query('limit') limit: string = '10', // Default to '10' as string
    @Query('skip') skip: string = '0', // Default to '0' as string
  ) {
    // Convert limit and skip to integers and ensure they are non-negative
    const parsedLimit = Math.floor(parseInt(limit)); // Use parseFloat then Math.floor to ensure integer
    const parsedSkip = Math.floor(parseInt(skip));

    // Validate limit and skip are non-negative integers
    if (isNaN(parsedLimit) || parsedLimit < 0) {
      throw new BadRequestException('Limit must be a non-negative integer.');
    }
    if (isNaN(parsedSkip) || parsedSkip < 0) {
      throw new BadRequestException('Skip must be a non-negative integer.');
    }

    // Validate label if needed
    const validLabels = [
      'CPU',
      'CPUCooler',
      'Case',
      'GraphicsCard',
      'InternalHardDrive',
      'Keyboard',
      'Monitor',
      'Motherboard',
      'Mouse',
      'PowerSupply',
      'RAM',
      'Speaker',
      'ThermalPaste',
      'WiFiCard',
      'WiredNetworkCard',
    ];

    if (!validLabels.includes(label)) {
      throw new Error('Invalid product label');
    }

    const products = await this.productService.getProductsByLabel(
      label,
      parsedLimit,
      parsedSkip,
    );
    return {
      results: products,
      limit: parsedLimit,
      skip: parsedSkip,
    };
  }
  // New endpoint to get all products with pagination
  @Get()
  async getAllProducts(
    @Query('limit') limit: string = '10', // Default to '10' as string
    @Query('skip') skip: string = '0', // Default to '0' as string
  ) {
    // Convert limit and skip to integers and ensure they are non-negative
    const parsedLimit = Math.floor(parseFloat(limit)); // Use parseFloat then Math.floor to ensure integer
    const parsedSkip = Math.floor(parseFloat(skip));

    // Validate limit and skip are non-negative integers
    if (isNaN(parsedLimit) || parsedLimit < 0) {
      throw new BadRequestException('Limit must be a non-negative integer.');
    }
    if (isNaN(parsedSkip) || parsedSkip < 0) {
      throw new BadRequestException('Skip must be a non-negative integer.');
    }

    // Fetch all products across all labels
    const products = await this.productService.getAllProducts(
      parsedLimit,
      parsedSkip,
    );
    return {
      results: products,
      limit: parsedLimit,
      skip: parsedSkip,
    };
  }
}
