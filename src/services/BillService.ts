import { Request, Response } from "express";
import { IBill } from "../types/Bill";
import Bill from "../models/BillModel";
import mongoose from "mongoose";
import MonthAmount from "../models/MonthAmount";
import { ApiResponse } from "../types/ApiResponse";
import { formatDate } from "../helper";

export const BillService = {
  createBill: async (req: Request, res: Response) => {
    const request: IBill = req.body;
    const session = await mongoose.startSession();
    const reqTime = new Date(request.paymentDate);
    const reqMonth = reqTime.getMonth() + 1;
    const reqYear = reqTime.getFullYear();

    session.startTransaction();
    try {
      const newBill = await Bill.create({
        ...request,
      });
      const existMonthAmount = await MonthAmount.findOne({
        customerId: request.customerId,
        month: reqMonth,
        year: reqYear,
      });
      if (!existMonthAmount) {
        await MonthAmount.create({
          customerId: request.customerId,
          month: reqMonth,
          year: reqYear,
          totalAmount: newBill.amount,
        });
      } else {
        const newTotalAmount = existMonthAmount.totalAmount + newBill.amount;
        await MonthAmount.updateOne(
          { customerId: request.customerId, month: reqMonth, year: reqYear },
          { $set: { totalAmount: newTotalAmount } }
        );
      }
      await session.commitTransaction();
      const apiResponse: ApiResponse = {
        error: false,
        msg: "Success",
        object: newBill,
      };
      return res.json(apiResponse);
    } catch (err) {
      console.log(err);
      const apiResponse: ApiResponse = {
        error: true,
        msg: "Init Data Failed",
        object: null,
      };
      return res.json(apiResponse);
    } finally {
      session.endSession();
    }
  },
  getLatestBillByCustomerId: async (req: Request, res: Response) => {
    const { customerId } = req.body;
    const billData: number[] = [];
    const billCate: string[] = [];
    try {
      const listBill = await Bill.find({ customerId: customerId }).sort({paymentDate:-1}).limit(20)
      console.log(listBill)
      listBill.forEach((e) => {
        billData.push(e.amount);
        billCate.push(formatDate(e.paymentDate));
      });
      const apiResponse: ApiResponse = {
        error: false,
        msg: "Success",
        object: {
            billAmount:billData,
            billDate:billCate
        },
      };
      return res.json(apiResponse);
    } catch (err) {
      const apiResponse: ApiResponse = {
        error: true,
        msg: "failed",
        object: null,
      };
      return res.json(apiResponse);
    }
  },
  getAllBillByCustomer: async (req: Request, res: Response) => {
    const { customerId } = req.body;
    const billData: number[] = [];
    const billCate: string[] = [];
    try {
      const listBill = await Bill.find({ customerId: customerId }).sort({paymentDate:-1})

      const apiResponse: ApiResponse = {
        error: false,
        msg: "Success",
        object:listBill
      };
      return res.json(apiResponse);
    } catch (err) {
      const apiResponse: ApiResponse = {
        error: true,
        msg: "failed",
        object: null,
      };
      return res.json(apiResponse);
    }
  },
};
