export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface IRoom {
    _id: string;
    name: string;
    type: string;
    price: number;
    capacity: number;
    sizeSqM?: number;
    bedType?: string;
    view?: string;
    amenities: string[];
    images: string[];
    description: string;
    isAvailable: boolean;
}

export interface IBooking {
    _id: string;
    user: IUser | string;
    room: IRoom | string;
    checkInDate: string | Date;
    checkOutDate: string | Date;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    addons?: string[];
    specialRequests?: string;
    createdAt?: string;
    updatedAt?: string;
}
