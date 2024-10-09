
export interface IBill {
    customerId: string ,  
    productId:string,
    paymentDate: Date, 
    serviceDescription :string,
    status :string, 
    amount : number
}

export  interface IMonthAmount{
    customerId: string,
    month: number,
    year: number,
    totalAmount: number
}