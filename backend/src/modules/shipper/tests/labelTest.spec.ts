import request from "supertest";
import nock from "nock";
import { describe, it, expect } from "vitest";
import { app } from "../../../app";
import { createLabelInDB } from "../repository/labelRepository";

describe("Label [/shipper/labels]", () => {
  it("Should get all labels [GET /shipper/labels]", async () => {
    await createLabelInDB({
      b64: "test",
      fileFormat: "test",
      printFormat: "test",
    }).then(async () => {
      const response = await request(app).get("/shipper/labels").expect(200);

      expect(response.body.labels.length).toEqual(1);
    });
  });
});
