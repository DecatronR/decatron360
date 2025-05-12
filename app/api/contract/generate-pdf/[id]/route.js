import { fetchContractById } from "utils/api/contract/fetchContractById";
import { fetchPropertyData } from "utils/api/properties/fetchPropertyData";
import { fetchUserData } from "utils/api/user/fetchUserData";
import { fetchSignedRoles } from "utils/api/eSignature/fetchSignedRoles";
import { fetchSignatureByContractId } from "utils/api/eSignature/fetchSignatureByContractId";
import PDFDocument from "pdfkit";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log("Generating PDF for contract:", id);

    // Get the authorization token from headers
    const headersList = headers();
    const token = headersList.get("authorization")?.split(" ")[1];

    if (!token) {
      console.error("No authorization token found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch all required data
    console.log("Fetching contract data...");
    let contractRes;
    try {
      contractRes = await fetchContractById(id);
      console.log("Contract response:", contractRes);
    } catch (error) {
      console.error("Error fetching contract:", error);
      throw new Error(`Failed to fetch contract: ${error.message}`);
    }

    if (!contractRes?.data) {
      throw new Error("No contract data received");
    }
    const contract = contractRes.data;
    console.log("Contract data fetched:", contract);

    console.log("Fetching property data...");
    let propertyRes;
    try {
      propertyRes = await fetchPropertyData(contract.propertyId);
      console.log("Property response:", propertyRes);
    } catch (error) {
      console.error("Error fetching property:", error);
      throw new Error(`Failed to fetch property: ${error.message}`);
    }

    if (!propertyRes?.data) {
      throw new Error("No property data received");
    }
    const property = propertyRes.data;
    console.log("Property data fetched:", property);

    console.log("Fetching owner data...");
    let ownerRes;
    try {
      ownerRes = await fetchUserData(contract.ownerId);
      console.log("Owner response:", ownerRes);
    } catch (error) {
      console.error("Error fetching owner:", error);
      throw new Error(`Failed to fetch owner: ${error.message}`);
    }

    if (!ownerRes) {
      throw new Error("No owner data received");
    }
    const owner = ownerRes;
    console.log("Owner data fetched:", owner);

    console.log("Fetching tenant data...");
    let tenantRes;
    try {
      tenantRes = await fetchUserData(contract.clientId);
      console.log("Tenant response:", tenantRes);
    } catch (error) {
      console.error("Error fetching tenant:", error);
      throw new Error(`Failed to fetch tenant: ${error.message}`);
    }

    if (!tenantRes) {
      throw new Error("No tenant data received");
    }
    const tenant = tenantRes;
    console.log("Tenant data fetched:", tenant);

    console.log("Fetching signed roles...");
    let rolesRes;
    try {
      rolesRes = await fetchSignedRoles(id);
      console.log("Roles response:", rolesRes);
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw new Error(`Failed to fetch roles: ${error.message}`);
    }

    const signedRoles = rolesRes?.data || [];
    console.log("Signed roles fetched:", signedRoles);

    console.log("Fetching signatures...");
    let signaturesRes;
    try {
      signaturesRes = await fetchSignatureByContractId(id);
      console.log("Signatures response:", signaturesRes);
    } catch (error) {
      console.error("Error fetching signatures:", error);
      throw new Error(`Failed to fetch signatures: ${error.message}`);
    }

    const signatures = signaturesRes?.data || [];
    console.log("Signatures fetched:", signatures);

    // Create PDF
    console.log("Creating PDF document...");
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    // Create a buffer to store the PDF
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    // Add content to PDF
    doc.fontSize(20).text("TENANCY AGREEMENT", { align: "center" }).moveDown();

    // Property Details
    doc
      .fontSize(16)
      .text("Property Details")
      .moveDown(0.5)
      .fontSize(12)
      .text(`Property Name: ${property.propertyName}`)
      .text(
        `Address: ${property.houseNoStreet}, ${property.neighbourhood}, ${property.propertyState}`
      )
      .text(`Rent: NGN${property.price}`)
      .moveDown();

    // Agreement Sections
    if (!contract.agreement) {
      throw new Error("No agreement data found in contract");
    }

    Object.entries(contract.agreement).forEach(([title, content]) => {
      doc.fontSize(14).text(title).moveDown(0.5).fontSize(12);

      if (Array.isArray(content)) {
        content.forEach((item) => {
          doc.text(`• ${item}`);
        });
      } else {
        doc.text(content);
      }
      doc.moveDown();
    });

    // Signatures
    if (signedRoles.length > 0) {
      doc.fontSize(14).text("Signatures").moveDown();

      // Create a table for signatures
      const signatureTable = {
        headers: ["Role", "Name", "Date"],
        rows: signedRoles.map((role) => {
          const signature = signatures.find((sig) => sig.role === role);
          return [
            role.replace(/([A-Z])/g, " $1").trim(),
            signature?.signerName || "Not signed",
            signature?.timestamp
              ? new Date(signature.timestamp).toLocaleDateString()
              : "Not signed",
          ];
        }),
      };

      // Draw signature table
      let y = doc.y;
      const cellPadding = 10;
      const colWidths = [150, 150, 100];

      // Draw headers
      doc.fontSize(12).font("Helvetica-Bold");
      let x = 50;
      signatureTable.headers.forEach((header, i) => {
        doc.text(header, x, y);
        x += colWidths[i];
      });

      // Draw rows
      doc.fontSize(10).font("Helvetica");
      signatureTable.rows.forEach((row) => {
        y += 20;
        x = 50;
        row.forEach((cell, i) => {
          doc.text(cell, x, y);
          x += colWidths[i];
        });
      });
    }

    // Finalize PDF
    doc.end();

    // Wait for the PDF to be generated
    console.log("Waiting for PDF generation to complete...");
    const pdfBuffer = await new Promise((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });
    console.log("PDF generation completed");

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tenancy-agreement-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        message: "Error generating PDF",
        error: error.message,
        details: error.stack,
      },
      { status: 500 }
    );
  }
}
