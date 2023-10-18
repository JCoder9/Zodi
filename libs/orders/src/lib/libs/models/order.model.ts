import { OrderItem } from './order-item.model';

export class Order {
    id?: string;
    orderItems?: OrderItem[];
    shippingAddress1?: string;
    shippingAddress2?: string;
    city?: string;
    zip?: string;
    country?: string;
    phone?: string;
    status?: string;
    totalPrice?: number;
    user?: any;
    dateOrdered?: string;
}
