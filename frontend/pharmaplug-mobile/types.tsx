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

export type ThemeType = {
    font: {
        family: {
            normal: string;
            bold: string;
        },
        size: {
            small: number;
            caption: number;
            button1: number;
            button2: number;
            body: number;
            header: number;
            header1: number;
            smallText: number;
            smallText1: number;
            medium: number;
            large: number;
            xlarge: number;
            xxlarge: number;
        },
        weight: {
            regular: number,
            medium: number,
            mediumBold: number,
            bold: number,            
        },
      },
      color: {
        dark: Record<string, Record<string, string>>,
        light: Record<string, Record<string, string>>
      },
      size: {
        spacing: {
            ssm: number,
            container: number,
            sm: number,
            smd: number,
            md: number,
            lg: number,
            xl: number,
            xxl: number,
            xxxl: number,
          },
        radius: Record<string, number>,
        width: Record<string, any>,
      },
      currentTheme: string,
}

export type AuthStackParamList = {
    Landing: undefined;  
    Login: undefined; 
    SignUp: undefined;
}

export type GetStylesType = {
    theme: ThemeType,
    mode: "light" | "dark"
}