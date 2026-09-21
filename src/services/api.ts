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

export async function getDashboardData() {
  const params = new URLSearchParams({
    action: "dashboard",
  });

  const url = `${BASE_URL}?${params.toString()}`;

  console.log("🚀 DASHBOARD API");
  console.log("URL =", url);

  const response = await fetch(url);

  console.log("STATUS =", response.status);

  const text = await response.text();

  if (!response.ok) {
    console.error("❌ Dashboard API Error:", text);
    throw new Error(
      `Dashboard API failed: ${response.status}`
    );
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Dashboard JSON Parse Error");
    console.error("Response:", text);

    throw new Error(
      "Dashboard API returned invalid JSON"
    );
  }
}