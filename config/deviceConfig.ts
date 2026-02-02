export const DEVICE_CONFIG = {
  ID: "feeder_001",
  OFFLINE_THRESHOLD_SEC: 20,
  PORTIONS: {
    CLOSE: 0,
    SMALL: 90,
    LARGE: 180,
  },
  WEIGHT: {
    EMPTY_THRESHOLD: 0.1,
  },
  PATHS: {
    OWNER: (deviceId: string) => `devices/${deviceId}/owner`, 
    SERVO_TARGET: (deviceId: string) => `devices/${deviceId}/servo/targetAngle`,
    SERVO_APPLIED: (deviceId: string) => `devices/${deviceId}/servo/appliedAngle`,
    WEIGHT: (deviceId: string) => `devices/${deviceId}/weight`,
    SCHEDULE: (deviceId: string) => `devices/${deviceId}/schedule`,
  },
};
