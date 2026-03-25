export interface Product {
	id: string;
	name: string;
	description?: string;
	price: number;
	stock: number;
	category: string;
	imageUrl?: string;
	isActive: boolean;
	createdAt: string;
	stockStatus: string;
}

export interface CreatedProductDto{
	name: string;
	description?: string;
	price: number;
	stock: number;
	category: string;
	imageUrl?: string;
}

export interface UpdateProductDto extends CreatedProductDto{
	isActive: boolean;
}

export interface ProductQuery {
	name?: string;
  	category?: string;
  	availability?: 0 | 1 | 2;
  	sortBy?: string;
  	pageNumber?: number;
  	pageSize?: number;
}