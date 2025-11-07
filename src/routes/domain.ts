import express from "express";
import { NamecheapAPI } from "../lib/namecheap.js";
import { getVercelInstance } from "../lib/vercel.js";

const router = express.Router();

// Middleware to verify authorization
const verifyAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;
  const expectedSecret = process.env.BACKGROUND_PROCESSOR_SECRET;

  if (!authHeader || !expectedSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  if (token !== expectedSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

// Check domain availability
router.post("/check", verifyAuth, async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: "Domain is required" });
    }

    // Initialize Namecheap API
    const namecheap = new NamecheapAPI({
      apiUser: process.env.NAMECHEAP_API_USER!,
      apiKey: process.env.NAMECHEAP_API_KEY!,
      userName: process.env.NAMECHEAP_USERNAME!,
      clientIp: process.env.NAMECHEAP_CLIENT_IP || req.ip || "0.0.0.0",
      sandbox: process.env.NAMECHEAP_SANDBOX === "true",
    });

    // Check domain availability
    const result = await namecheap.checkDomain(domain);

    return res.json({
      success: true,
      result: {
        domain: result.domain,
        available: result.available,
        isPremiumName: result.isPremiumName,
        premiumRegistrationPrice: result.premiumRegistrationPrice,
        icannFee: result.icannFee,
      },
    });
  } catch (error) {
    console.error("Error checking domain:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to check domain",
    });
  }
});

// Purchase domain
router.post("/purchase", verifyAuth, async (req, res) => {
  try {
    const { domain, userId, siteId, websiteUrl, userInfo } = req.body;

    // Detailed validation logging
    const missingFields = [];
    if (!domain) missingFields.push("domain");
    if (!userId) missingFields.push("userId");
    if (!siteId) missingFields.push("siteId");
    if (!websiteUrl) missingFields.push("websiteUrl");
    if (!userInfo) missingFields.push("userInfo");

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      console.error("Received body:", JSON.stringify(req.body, null, 2));
      return res.status(400).json({
        error: "Missing required fields",
        missing: missingFields,
      });
    }

    // Initialize Namecheap API
    const namecheap = new NamecheapAPI({
      apiUser: process.env.NAMECHEAP_API_USER!,
      apiKey: process.env.NAMECHEAP_API_KEY!,
      userName: process.env.NAMECHEAP_USERNAME!,
      clientIp: process.env.NAMECHEAP_CLIENT_IP || req.ip || "0.0.0.0",
      sandbox: process.env.NAMECHEAP_SANDBOX === "true",
    });

    // Step 1: Check domain availability again
    console.log(`Checking availability for ${domain}...`);
    const checkResult = await namecheap.checkDomain(domain);

    if (!checkResult.available) {
      return res.status(400).json({ error: "Domain is not available" });
    }

    // Step 2: Register the domain
    console.log(`Registering domain ${domain}...`);
    const registrationResult = await namecheap.registerDomain(domain, 1, {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      city: userInfo.city,
      state: userInfo.state,
      zip: userInfo.zip,
      country: userInfo.country,
      organization: userInfo.organization,
    });

    if (!registrationResult.success) {
      console.error(
        `Domain registration failed: ${registrationResult.message}`
      );
      throw new Error(registrationResult.message);
    }

    console.log(
      `✅ Domain ${domain} registered successfully with Order ID: ${
        registrationResult.orderId || "N/A"
      }`
    );

    // Step 3: Add domain to Vercel project
    console.log(`\nStep 3: Adding ${domain} to Vercel project...`);

    // Extract project name from websiteUrl (e.g., juzbuild-homely-jason from jason.onjuzbuild.com)
    let vercelProjectName = "";

    try {
      // Parse the subdomain from websiteUrl
      const urlMatch = websiteUrl.match(/https?:\/\/([^.]+)/);
      if (urlMatch && urlMatch[1]) {
        vercelProjectName = urlMatch[1];
      } else {
        // Fallback: construct from siteId
        vercelProjectName = `juzbuild-${siteId}`;
      }

      console.log(`Vercel project name: ${vercelProjectName}`);

      const vercel = getVercelInstance();

      // Add both root domain and www subdomain
      const domains = [domain, `www.${domain}`];

      for (const domainToAdd of domains) {
        try {
          const result = await vercel.addProjectDomain(
            vercelProjectName,
            domainToAdd
          );

          // Log the full Vercel API response for debugging
          console.log(`\n📋 Full Vercel API response for ${domainToAdd}:`);
          console.log(JSON.stringify(result, null, 2));
          console.log(`\n✅ Added ${domainToAdd} to Vercel project`);
        } catch (vercelError: any) {
          // Check if domain already exists
          if (
            vercelError?.message?.includes("already exists") ||
            vercelError?.message?.includes("duplicate")
          ) {
            console.log(`   ℹ️  Domain ${domainToAdd} already added to Vercel`);
          } else {
            console.error(
              `   ⚠️  Failed to add ${domainToAdd} to Vercel:`,
              vercelError?.message || vercelError
            );
          }
        }
      }

      // Step 4: Configure DNS with Vercel's standard (old/stable) records
      console.log(
        `\nStep 4: Configuring Namecheap DNS with Vercel's standard records...`
      );

      // Using Vercel's old/stable records as recommended:
      // - A record: 76.76.21.21 for root domain
      // - CNAME: cname.vercel-dns.com for www subdomain
      const namecheapRecords = [
        {
          hostName: "@",
          recordType: "A",
          address: "76.76.21.21",
          ttl: "1800",
        },
        {
          hostName: "www",
          recordType: "CNAME",
          address: "cname.vercel-dns.com",
          ttl: "1800",
        },
      ];

      try {
        console.log(`\nConfiguring DNS records:`);
        console.log(`   A: ${domain} -> 76.76.21.21`);
        console.log(`   CNAME: www.${domain} -> cname.vercel-dns.com`);

        await namecheap.setDNSRecords(domain, namecheapRecords);

        console.log(`\n✅ DNS records configured successfully`);
        console.log(`   DNS propagation may take 24-48 hours`);
        console.log(
          `   Note: Using Vercel's stable/old records as recommended`
        );
      } catch (dnsUpdateError) {
        console.error("❌ Failed to configure DNS records:", dnsUpdateError);
        console.log("⚠️  Please manually configure the following DNS records:");
        console.log(`   A: @ -> 76.76.21.21`);
        console.log(`   CNAME: www -> cname.vercel-dns.com`);
      }
    } catch (vercelError) {
      console.error("❌ Vercel domain addition error:", vercelError);
      // Don't fail the purchase if Vercel addition fails - can be done manually
      console.log(
        "⚠️  Domain purchased and DNS configured, but Vercel addition failed - add domain manually in Vercel dashboard"
      );
    }

    return res.json({
      success: true,
      message: "Domain purchased and configured successfully",
      domain,
      orderId: registrationResult.orderId,
    });
  } catch (error) {
    console.error("Error purchasing domain:", error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to purchase domain",
    });
  }
});

export default router;
