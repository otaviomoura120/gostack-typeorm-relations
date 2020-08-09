import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('customer not found');
    }

    const productsData = await this.productsRepository.findAllById(products);

    const productsWithPrice = products.map(product => {
      const productPrice = productsData.find(
        productData => productData.id === product.id,
      );

      return {
        product_id: product.id,
        quantity: product.quantity,
        price: productPrice ? productPrice.price * product.quantity : 0,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: productsWithPrice,
    });

    return order;
  }
}

export default CreateOrderService;
