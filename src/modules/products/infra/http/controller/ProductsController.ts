import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;

    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({ name, price, quantity });

    return response.json({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
  }
}
