export interface TambonProperties {
  ADM3_PCODE: string;
  ADM2_PCODE: string;
  ADM1_PCODE: string;

  TAMBON_TH: string;
  AMPHOE_TH: string;
  Prov_TH: string;
}

export interface TambonGeoJSON {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: TambonProperties;
    geometry: {
      type: string;
      coordinates: any;
    };
  }[];
}
