type PerfEntryCallback = (entry: any) => void;

export function reportWebVitals(onPerfEntry?: PerfEntryCallback) {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    import("web-vitals")
      .then((module: any) => {
        const getCLS: (callback: PerfEntryCallback) => void =
          module.getCLS || function () {};
        const getFID: (callback: PerfEntryCallback) => void =
          module.getFID || function () {};
        const getFCP: (callback: PerfEntryCallback) => void =
          module.getFCP || function () {};
        const getLCP: (callback: PerfEntryCallback) => void =
          module.getLCP || function () {};
        const getTTFB: (callback: PerfEntryCallback) => void =
          module.getTTFB || function () {};

        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      })
      .catch((error) => {
        console.error("Error importing web-vitals module:", error);
      });
  }
}
