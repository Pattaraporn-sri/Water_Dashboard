export const BASE_URL =
  "https://script.google.com/macros/s/AKfycbwveSGwYzMTwIIT1SveBaLLj2DzAAf2E_y3mks9w546FP9ntEoSax_ZaeFXM9gqQBNR/exec";

// จำนวนครั้งที่ให้ลองใหม่
const MAX_RETRIES = 3;

// เวลารอก่อนลองใหม่แต่ละครั้ง
const RETRY_DELAY = 1000;

async function fetchWithRetry(url: string) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);

      const text = await response.text();

      // สำเร็จ
      if (response.ok) {
        try {
          return JSON.parse(text);
        } catch (error) {
          console.error("❌ JSON Parse Error");
          console.error("Response:", text);

          throw new Error("API returned invalid JSON");
        }
      }

      // Request ไม่สำเร็จ
      console.error(
        `❌ API Error (attempt ${attempt}/${MAX_RETRIES})`,
        response.status,
      );
      console.error("URL =", url);
      console.error("Response =", text);

      lastError = new Error(`API failed: ${response.status}`);

      // ถ้ายังมีรอบเหลือ ให้ลองใหม่
      if (attempt < MAX_RETRIES) {
        console.log(`🔄 Retrying in ${RETRY_DELAY}ms...`);

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    } catch (error) {
      console.error(
        `❌ API Request Error (attempt ${attempt}/${MAX_RETRIES})`,
        error,
      );

      lastError =
        error instanceof Error ? error : new Error("Unknown API error");

      if (attempt < MAX_RETRIES) {
        console.log(`🔄 Retrying in ${RETRY_DELAY}ms...`);

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  throw lastError ?? new Error("API request failed");
}

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

  const url = `${BASE_URL}?${params.toString()}`;

  return fetchWithRetry(url);
}

export async function getDashboardData() {
  const params = new URLSearchParams({
    action: "dashboard",
  });

  const url = `${BASE_URL}?${params.toString()}`;

  return fetchWithRetry(url);
}
