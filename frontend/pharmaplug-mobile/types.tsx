export type UserType = {
    id: string,
    username: string,
    email: string,
    is_doctor: boolean,
    access: string,
    refresh: string,
    expiry: number
}

export type SimpleUserType = {
    id: string,
    username: string,
    email: string,
    is_doctor: boolean
}

export type FieldType = {
    id: string,
    name: string
}

export type DoctorType = {
    id: string,
    user: SimpleUserType,
    field: FieldType | string
}
export type ProductType = {
    id: string,
    name: string,
    image: string,
    description: string,
    price: number
}

export type CartItemType = {
    id: string,
    product: ProductType,
    quantity: number,
    alternatives: ProductType[]
}

export type CartType = {
    cart_items: CartItemType[]
}