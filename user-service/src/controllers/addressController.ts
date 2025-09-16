import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
import { SourceKey } from "./authController";
import { AddressService } from "../service/erpNextService/addressService";
import { ERPNextClient } from "../service/erpNextService/client";

export class AddressController {
  async createAddress(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const {
        userId,
        name,
        line1,
        line2,
        city,
        state,
        country,
        zip,
        phone,
        isDefault,
        addressType, // "shipping", "billing", or "both"
        landmark,
        instructions,
      } = req.body;

      // If this is the first address or isDefault is true, handle default address logic
      if (isDefault) {
        await prisma.address.updateMany({
          where: {
            userId,
            // Only update the default status of addresses of the same type
            addressType: addressType === "both" ? undefined : addressType,
          },
          data: { isDefault: false },
        });
      }

      const filter: any = {
        userId,
      };

      if (addressType !== "both") {
        filter.addressType = addressType;
      }

      const updatedResult = await prisma.address.updateMany({
        where: filter,
        data: {
          userId,
          name,
          line1,
          line2,
          city,
          state,
          country,
          zip,
          phone,
          addressType: addressType || "both",
          landmark,
          instructions,
        },
      });

      console.log(`Updated ${updatedResult.count} address(es) successfully`);

      

      const address = await prisma.address.create({
        data: {
          userId,
          name,
          line1,
          line2,
          city,
          state,
          country,
          zip,
          phone,
          isDefault: isDefault || false,
          addressType: addressType || "both", // Default to "both" if not specified
          landmark,
          instructions,
        },
        include: {
          user: true,
        },
      });
      const userInfo = await prisma.user.findUnique({ where: { id: userId } });

      try {
        const store = await prisma.store.findUnique({ where: { id: userInfo?.storeId! }, include: { StoreErpNext: true } });
        const erpConfig: any = store?.StoreErpNext?.[0];

        if (erpConfig.apiKey) {
          const erpClient = new ERPNextClient({
            apiKey: erpConfig.apiKey,
            baseUrl: erpConfig.baseUrl,
            apiSecret: erpConfig.apiSecret,
            defaultCustomerGroup: store?.name!,
            defaultTerritory: store?.name!,
          });
          await new AddressService(erpClient).createAddress({
            address_line1: address.line1,
            address_line2: address?.line2!,
            city: address.city,
            state: address.state,
            address_title: address.name,
            country: address.country,
            pincode: address.zip,
            phone: address.phone,
            email_id: address?.user?.email,
            is_primary_address: true,
            is_shipping_address: true,
            linked_doctype: "Customer",
            id: address.id,
            linked_name: address?.user?.username!,
            address_type: "Shipping",
          });
        }
      } catch (error) {
        console.log("Error while create product", error);
      }

      res.status(201).json({
        success: "SUCCESS",
        data: { address },
        message: "Address created successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating address: ${error.message}`, 500));
    }
  }

  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingAddress = await prisma.address.findUnique({
        where: { id },
      });

      if (!existingAddress) {
        return next(new CustomError("Address not found", 404));
      }

      // If setting as default, update other addresses of the same type
      if (updateData.isDefault) {
        await prisma.address.updateMany({
          where: {
            userId: existingAddress.userId,
            id: { not: id },
            // Only update addresses of the same type
            addressType: updateData.addressType || existingAddress.addressType,
          },
          data: { isDefault: false },
        });
      }

      const updatedAddress = await prisma.address.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: "SUCCESS",
        data: { address: updatedAddress },
        message: "Address updated successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating address: ${error.message}`, 500));
    }
  }

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingAddress = await prisma.address.findUnique({
        where: { id },
      });

      if (!existingAddress) {
        return next(new CustomError("Address not found", 404));
      }

      await prisma.address.delete({
        where: { id },
      });

      // If deleted address was default, set another address of the same type as default
      if (existingAddress.isDefault) {
        const anotherAddress = await prisma.address.findFirst({
          where: {
            userId: existingAddress.userId,
            addressType: existingAddress.addressType,
          },
        });

        if (anotherAddress) {
          await prisma.address.update({
            where: { id: anotherAddress.id },
            data: { isDefault: true },
          });
        }
      }

      res.json({
        success: "SUCCESS",
        message: "Address deleted successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting address: ${error.message}`, 500));
    }
  }

  async getAddressesByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { type } = req.query; // Optional query parameter for filtering by type

      const whereClause: any = { userId };

      // Filter by address type if specified
      if (type && ["shipping", "billing", "both"].includes(type as string)) {
        whereClause.addressType = type;
      }

      const addresses = await prisma.address.findMany({
        where: whereClause,
        orderBy: { isDefault: "desc" },
      });

      res.json({
        success: "SUCCESS",
        data: { addresses },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching addresses: ${error.message}`, 500));
    }
  }

  async getDefaultAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { type } = req.query; // "shipping", "billing", or "both"

      const whereClause: any = {
        userId,
        isDefault: true,
      };

      // Filter by address type if specified
      if (type && ["shipping", "billing", "both"].includes(type as string)) {
        whereClause.addressType = type;
      }

      const address = await prisma.address.findFirst({
        where: whereClause,
      });

      if (!address) {
        return res.json({
          success: "SUCCESS",
          data: { address: null },
          message: "No default address found",
        });
      }

      res.json({
        success: "SUCCESS",
        data: { address },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching default address: ${error.message}`, 500));
    }
  }

  async getAddressById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const address = await prisma.address.findUnique({
        where: { id },
      });

      if (!address) {
        return next(new CustomError("Address not found", 404));
      }

      res.json({
        success: "SUCCESS",
        data: { address },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching address: ${error.message}`, 500));
    }
  }

  async setDefaultAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const address = await prisma.address.findUnique({
        where: { id },
      });

      if (!address) {
        return next(new CustomError("Address not found", 404));
      }

      // Remove default from all other addresses of the same type
      await prisma.address.updateMany({
        where: {
          userId: address.userId,
          id: { not: id },
          // Only update addresses of the same type
          addressType: address.addressType,
        },
        data: { isDefault: false },
      });

      // Set this address as default
      const updatedAddress = await prisma.address.update({
        where: { id },
        data: { isDefault: true },
      });

      res.json({
        success: "SUCCESS",
        data: { address: updatedAddress },
        message: "Default address updated successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error setting default address: ${error.message}`, 500));
    }
  }
}
