import axios from "axios";
import { createShippingLabelError, getAccessTokenError } from "./errors";
import { CreateLabelResponse, ShipmentDetails } from "./interfaces";
import { createLabelInDB } from "../repository/labelRepository";

export const getAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `${process.env.SHIPPER_BASE_URL}/parcel/de/account/auth/ropc/v1/token`,
      new URLSearchParams({
        grant_type: "password",
        username: process.env.SHIPPER_USERNAME || "",
        password: process.env.SHIPPER_PASSWORD || "",
        client_id: process.env.SHIPPER_API_KEY || "",
        client_secret: process.env.SHIPPER_API_SECRET || "",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    return response.data.access_token;
  } catch {
    throw new Error(getAccessTokenError);
  }
};

export const createShippingLabel = async (
  token: string,
  shipmentDetails: ShipmentDetails
): Promise<string> => {
  try {
    const response = await axios.post<CreateLabelResponse>(
      `${process.env.SHIPPER_BASE_URL}/parcel/de/shipping/v2/orders`,
      {
        profile: "STANDARD_GRUPPENPROFIL",
        shipments: [
          {
            product: "V01PAK",
            billingNumber: "33333333330102",
            refNo: "Order No. 1234",
            shipper: {
              name1: "My Online Shop GmbH",
              addressStreet: "Sträßchensweg 10",
              additionalAddressInformation1: "2. Etage",
              postalCode: "53113",
              city: "Bonn",
              country: "DEU",
              email: "max@mustermann.de",
              phone: "+49 123456789",
            },
            consignee: {
              name1: "Maria Musterfrau",
              addressStreet: shipmentDetails.street,
              postalCode: shipmentDetails.postalCode,
              city: shipmentDetails.city,
              country: "DEU",
            },
            details: {
              dim: {
                uom: "mm",
                height: 100,
                length: 200,
                width: 150,
              },
              weight: {
                uom: "g",
                value: 500,
              },
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    createLabelInDB(response.data.items[0].label);

    return response.data.items[0].label.b64;
  } catch {
    throw new Error(createShippingLabelError);
  }
};
