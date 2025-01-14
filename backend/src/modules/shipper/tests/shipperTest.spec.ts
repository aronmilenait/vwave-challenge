import request from "supertest";
import nock from "nock";
import { describe, it, expect } from "vitest";
import { app } from "../../../app";

describe("Shipper [/shipper]", () => {
  it("Should create a new label [POST /shipper/labels]", async () => {
    const mockCreateLabelResponse = {
      items: [
        {
          label: {
            b64: "test",
            fileFormat: "test",
            printFormat: "test",
          },
        },
      ],
    };

    nock(process.env.SHIPPER_BASE_URL || "")
      .post("/parcel/de/shipping/v2/orders")
      .reply(200, mockCreateLabelResponse);

    nock(process.env.SHIPPER_BASE_URL || "")
      .post("/parcel/de/account/auth/ropc/v1/token")
      .reply(200, { access_token: "token" });

    const response = await request(app)
      .post("/shipper/labels")
      .send({
        name: "John Doe",
        street: "123 Main St",
        postalCode: "12345",
        city: "City",
      })
      .expect(201);

    expect(response.body).toEqual({ labelPdf: "test" });
  });
});
