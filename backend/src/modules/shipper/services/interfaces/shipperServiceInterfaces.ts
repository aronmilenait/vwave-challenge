export interface ShipmentDetails {
  name: string;
  street: string;
  postalCode: string;
  city: string;
}

interface Item {
  shipmentNo: string;
  sstatus: Sstatus;
  shipmentRefNo: string;
  label: Label;
  validationMessages: any[];
  routingCode: string;
}

interface Sstatus {
  title: string;
  status: number;
  statusCode: number;
}

interface Label {
  b64: string;
  fileFormat: string;
  printFormat: string;
}

export interface CreateLabelResponse {
  status: {
    title: string;
    status: number;
    detail: string;
    statusCode: number;
  };
  items: Item[];
}
