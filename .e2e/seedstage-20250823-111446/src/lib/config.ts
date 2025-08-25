export const cfg = {
  BASE: process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000",
  MATCHER_BASE_URL: process.env.MATCHER_BASE_URL || "",
  MATCHER_WS_URL: process.env.MATCHER_WS_URL || "",
  SAFE_MODE_DEFAULT: (process.env.SAFE_MODE_DEFAULT || "0") === "1",
  FEATURE_BLOCK_ON_VIOLATION: (process.env.FEATURE_BLOCK_ON_VIOLATION || "1") === "1",
  USE_MOCK: !process.env.MATCHER_BASE_URL, // true إذا لا يوجد Matcher خارجي
};
