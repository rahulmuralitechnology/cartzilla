import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import axios from "axios";
import { ManagedIdentityCredential } from "@azure/identity";
import { DnsManagementClient } from "@azure/arm-dns";
import dns from "dns/promises";

export class CreateSiteController {
  private readonly zoneName = "mybloomi5.com";
  private readonly pipelineUrl: string;

  constructor() {
    this.pipelineUrl = process.env.PIPELINE_URL!;
    this.createSite = this.createSite.bind(this);
  }

  // private validateSubDomain(subDomain: string): boolean {
  //   return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(subDomain);
  // }

  getRepoDir(type: string, storeCategory: string): string {
    const templates: Record<string, Record<string, string>> = {
      webapp: {
        interior: "ecom_interior_template",
        grocery: "ecom_grocery_template",
        clothing: "ecom_clothing_template",
        electronics: "ecom_electronics_template",
        cosmetics: "ecom_cosmetics_template",
      },
      website: {
        realestate: "website_realestate_template",
        restaurant: "website_restaurant_template",
        interiors: "website_interiors_template",
      },
    };

    const categoryTemplates = templates[type];
    if (!categoryTemplates) {
      throw new Error(`Invalid type: ${type}`);
    }

    const template = categoryTemplates[storeCategory];
    if (!template) {
      throw new Error(`Invalid store category: ${storeCategory} for type: ${type}`);
    }

    return template;
  }

  async createSite(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const domain = req.query.domain || req.body.domain || "none";
      const uniqueId = req.query.uniqueId || req.body.uniqueId || "none";

      const params = {
        storeId: req.query.storeId || req.body.storeId,
        storeCategory: req.query.storeCategory || req.body.storeCategory,
        operation: req.query.operation || req.body.operation,
        environment: req.query.environment || req.body.environment,
        type: req.query.type || req.body.type,
        hostname: req.query.hostname || req.body.hostname || "none",
        domain: domain?.replace(/^https?:\/\//, ""),
        uniqueId: uniqueId,
      };

      if (!params.storeId || !params.storeCategory || !domain || !params.operation || !params.environment || !params.type) {
        return next(
          new CustomError("Missing required parameters: 'storeId', 'storeCategory', 'subDomain', 'operation', 'environment', 'type'", 400)
        );
      }

      const repoDirName = params.storeCategory;
      const pipelineParameters = {
        ...params,
        repoDirName,
      };

      const response = await axios.post(`${this.pipelineUrl}`, pipelineParameters, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          ...params,
        },
      });

      res.status(200).json({
        success: "SUCCESS",
        data: {
          website: `https://${domain}`,
          pipelineResponse: response.data,
        },
        message: "Site creation pipeline triggered successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating Static Web App: ${error.message}`, 500));
    }
  }

  async checkSubDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const subDomain = ((req.query.subDomain as string) || req.body.subDomain || "").toLowerCase().trim().replace(/\s+/g, "-");

      if (!subDomain) {
        return next(new CustomError("Sub-domain is required.", 400));
      }

      const dnsZoneName = "mybloomi5.com";
      const resourceGroupName = "bloomi5.com";
      const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID!;

      const credential = new ManagedIdentityCredential();
      const client = new DnsManagementClient(credential, subscriptionId);
      const recordSets = client.recordSets.listByDnsZone(resourceGroupName, dnsZoneName);
      const recordSetsArray = [];

      for await (const record of recordSets) {
        recordSetsArray.push(record);
      }

      const subDomainExists = recordSetsArray.some((record) => record.name === subDomain);

      if (subDomainExists) {
        return res.status(400).json({
          error: `Sub-domain "${subDomain}" already exists. Please choose another.`,
          success: false,
        });
      }

      return res.status(200).json({
        subdomain: subDomain,
      });
    } catch (error: any) {
      return next(new CustomError(`Error checking subdomain: ${error.message}`, 500));
    }
  }

  async validateDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const expectedIP = req.query.ipAddress || req.body.ipAddress;
      const domain = req.query.domain || req.body.domain;

      if (!domain) {
        return next(new CustomError("Domain is required.", 400));
      }

      const resolvedIPs = await dns.resolve4(domain);

      if (resolvedIPs.includes(expectedIP)) {
        return res.status(200).json({
          status: "SUCCESS",
          isValidated: true,
          message: "Domain is correctly pointed to the VM.",
        });
      } else {
        return res.status(400).json({
          status: "FAILED",
          isValidated: true,
          message: "Domain is NOT correctly pointed to the VM.",
        });
      }
    } catch (error: any) {
      return next(new CustomError(`Error validating domain: ${error.message}`, 500));
    }
  }
}

export default CreateSiteController;
