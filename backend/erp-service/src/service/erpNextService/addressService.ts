// services/address.service.ts
import { ERPNextClient } from "./client";
import { Address, ERPNextAddress, SyncResult } from "./types";
import { ERPNextResponse } from "./types";

export class AddressService {
  constructor(private erpClient: ERPNextClient) {}

  async createAddress(addressData: Address): Promise<ERPNextResponse<ERPNextAddress>> {
    const erpAddressData: ERPNextAddress = {
      doctype: "Address",
      address_title: addressData.address_title || `${addressData.city} Address`,
      address_type: addressData.address_type,
      address_line1: addressData.address_line1,
      address_line2: addressData.address_line2,
      city: addressData.city,
      state: addressData.state,
      country: addressData.country,
      pincode: addressData.pincode,
      phone: addressData.phone,
      email_id: addressData.email_id,
      is_primary_address: addressData.is_primary_address ? 1 : 0,
      is_shipping_address: addressData.is_shipping_address ? 1 : 0,
      custom_external_id: addressData.id,
      links:
        addressData.linked_doctype && addressData.linked_name
          ? [
              {
                link_doctype: addressData.linked_doctype,
                link_name: addressData.linked_name,
              },
            ]
          : undefined,
    };

    return await this.erpClient.create<ERPNextAddress>("Address", erpAddressData);
  }

  async updateAddress(addressName: string, addressData: Address): Promise<ERPNextResponse<ERPNextAddress>> {
    const erpAddressData: Partial<ERPNextAddress> = {
      address_title: addressData.address_title,
      address_type: addressData.address_type,
      address_line1: addressData.address_line1,
      address_line2: addressData.address_line2,
      city: addressData.city,
      state: addressData.state,
      country: addressData.country,
      pincode: addressData.pincode,
      phone: addressData.phone,
      email_id: addressData.email_id,
      is_primary_address: addressData.is_primary_address ? 1 : 0,
      is_shipping_address: addressData.is_shipping_address ? 1 : 0,
    };

    return await this.erpClient.update<ERPNextAddress>("Address", addressName, erpAddressData);
  }

  async syncAllAddresses(addresses: Address[]): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const address of addresses) {
      try {
        const existingAddress = await this.erpClient.findByExternalId<ERPNextAddress>("Address", address.id);

        if (existingAddress) {
          results.push({ item: address.address_title || address.city, action: "exists", success: true, customer: "" });
        } else {
          const result = await this.createAddress(address);
          results.push({ item: address.address_title || address.city, action: "created", success: true, data: result, customer: "" });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        results.push({ item: address.address_title || address.city, action: "failed", success: false, error: errorMessage, customer: "" });
      }
    }

    return results;
  }
}
