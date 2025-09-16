import express from "express";
import prisma from "../service/prisma";
import { slugify } from "../utils/helper";
import { create } from "xmlbuilder2";
const router = express.Router();

// Route to add a new plan
router.get("/:storeId/get", async (req: any, res: any, next) => {
  try {
    const { storeId } = req.params as { storeId: string };
    const storeInfo = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        domain: true,
      },
    });
    const BASE_URL = `https://${storeInfo?.domain}`;
    const [products, categories, blogs] = await Promise.all([
      prisma.product.findMany({ where: { storeId: storeId } }),
      prisma.productCategory.findMany({ where: { storeId: storeId } }),
      prisma.blog.findMany({ where: { storeId: storeId } }),
    ]);

    const urls = [
      ...products.map((p) => ({
        loc: `${BASE_URL}/product/${slugify(p?.category as string)}/${slugify(p.title)}`,
        lastmod: p.updatedAt.toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      })),
      ...categories.map((c) => ({
        loc: `${BASE_URL}/categories/${slugify(c.name)}`,
        lastmod: c?.updatedAt?.toISOString() || c.createdAt.toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      })),
      ...blogs.map((b) => ({
        loc: `${BASE_URL}/blog/${b.id}/${slugify(b.title)}`,
        lastmod: b.updatedAt?.toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      })),
    ];

    const xmlObj = {
      urlset: {
        "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        url: urls,
      },
    };

    const xml = create(xmlObj).end({ prettyPrint: true });

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Failed to generate sitemap");
  }
});

export default router;
