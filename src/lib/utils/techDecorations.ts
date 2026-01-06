// Cyberpunk tech decoration utilities

// Generate random hex code
export const generateHexCode = (length: number = 8): string => {
  return Math.random()
    .toString(16)
    .substring(2, 2 + length)
    .toUpperCase();
};

// Generate binary string
export const generateBinaryString = (length: number = 16): string => {
  return Array.from({ length }, () => (Math.random() > 0.5 ? "1" : "0")).join(
    ""
  );
};

// Generate formatted timestamp
export const generateTimestamp = (): string => {
  return new Date().toISOString().replace(/[-:T.]/g, "").substring(0, 14);
};

// Generate system code format
export const generateSystemCode = (): string => {
  const prefix = ["SYS", "SEC", "NET", "CPU", "MEM", "I/O"][
    Math.floor(Math.random() * 6)
  ];
  const code = generateHexCode(4);
  return `${prefix}:${code}`;
};

// Technical labels in Chinese/Japanese
export const TECH_LABELS = {
  status: "状態",
  system: "系統",
  processing: "處理中",
  complete: "完了",
  error: "錯誤",
  query: "問い合わせ",
  response: "應答",
  active: "有効",
  standby: "待機",
  analysis: "分析",
  decision: "決議",
  executing: "執行中",
} as const;

// Status display strings
export const STATUS_CODES = {
  idle: "STANDBY",
  processing: "PROCESSING",
  complete: "COMPLETE",
  error: "ERROR",
} as const;

// Generate decorative line pattern
export const generateLinePattern = (
  length: number,
  char: string = "-"
): string => {
  return char.repeat(length);
};

// Format number with leading zeros
export const formatNumber = (num: number, digits: number = 2): string => {
  return num.toString().padStart(digits, "0");
};

// Generate version string
export const generateVersionString = (): string => {
  const major = Math.floor(Math.random() * 10);
  const minor = Math.floor(Math.random() * 100);
  return `v${major}.${formatNumber(minor)}`;
};
