export const BASE_URL =
  "https://script.google.com/macros/s/AKfycbwveSGwYzMTwIIT1SveBaLLj2DzAAf2E_y3mks9w546FP9ntEoSax_ZaeFXM9gqQBNR/exec";

export async function getFilterData(
  province = "",
  district = "",
  subdistrict = "",
) {
  const params = new URLSearchParams({
    action: "filter",
    province,
    district,
    subdistrict,
  });

  const res = await fetch(`${BASE_URL}?${params}`);

  return res.json();
}
