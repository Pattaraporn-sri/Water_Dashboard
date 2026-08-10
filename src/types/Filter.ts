export interface FilterResponse {
  provinces: string[];
  districts: string[];
  subdistricts: string[];
  types: string[];
}

export interface SelectedFilter {
  province: string;
  district: string;
  subdistrict: string;
  type: string;
}

export interface FilterBarProps {
  onFilterChange: (filter: SelectedFilter) => void;
}