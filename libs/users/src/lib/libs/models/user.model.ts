export class User {
    id?: string;
    name?: string;
    password?: string;
    email?: string;
    phone?: string;
    token?: string;
    isAdmin?: string;
    street?: string;
    apartment?: string;
    zip?: string;
    city?: string;
    country?: string;
    savedProducts?: string[];
    savedCombos?: Array<{
        _id?: string;
        name: string;
        products: string[];
        createdAt?: Date;
    }>;
}
