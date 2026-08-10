export interface WaterSource {
  ec5_uuid: string;
  
  province: string;
  district: string;
  subdistrict: string;

  name: string;
  type: string;

  width: number;
  length: number;
  depth: number;
  
  volume: number;

  usage: string;
  usageDesc: string;
  problem: string;

  lat: number | null;
  lng: number | null;

  image: string;
}

