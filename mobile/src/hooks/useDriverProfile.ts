/**
 * @file useDriverProfile.ts
 * @description Custom hook managing driver identity, company/institution assignment,
 * real-time line catalogs, route stop sequences, and company switching.
 */

import { useEffect, useMemo, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { auth, database } from "../config/firebase";
import {
  getDriverCompanyId,
  setDriverCompanyId,
  getDriverBusLine,
} from "../utils/driverStorage";

export interface CompanyOption {
  id: string;
  name: string;
}

/**
 * Driver profile & line catalog hook managing assigned company ID,
 * real-time line catalogs, route stop sequences, and company switching.
 *
 * @param user - Authenticated Firebase user instance.
 * @returns Driver profile state, available companies, bus lines, active route, and selection handlers.
 */
export function useDriverProfile(user: any) {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyPickerVisible, setCompanyPickerVisible] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState<CompanyOption[]>([]);
  const [busLines, setBusLines] = useState<string[]>([]);
  const [selectedBusLine, setSelectedBusLine] = useState<string | null>(null);
  const [routeDefinitions, setRouteDefinitions] = useState<Record<string, any>>({});

  // Derive driver initials & display name
  const driverInitials = useMemo(() => {
    if (user?.displayName) {
      const parts = user.displayName.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    const name = user?.email?.split("@")[0] || "DR";
    return name.slice(0, 2).toUpperCase();
  }, [user]);

  const driverName = useMemo(() => {
    return user?.displayName || user?.email?.split("@")[0] || "Driver";
  }, [user]);

  // Derive active route definition with intermediate stops
  const activeRoute = useMemo(() => {
    if (!selectedBusLine) return null;
    return routeDefinitions[selectedBusLine.toLowerCase()] || null;
  }, [selectedBusLine, routeDefinitions]);

  useEffect(() => {
    let isSubscribed = true;

    /**
     * Subscribes to real-time driver profile assignment and company catalog nodes in RTDB.
     */
    const fetchDriverAndCompanyData = async () => {
      const activeUid = user?.uid || auth.currentUser?.uid;
      if (!activeUid) return;

      const storedLine = await getDriverBusLine();
      if (storedLine && isSubscribed) setSelectedBusLine(storedLine);

      // 1. Fetch live assigned lines & company from drivers/${uid}
      const driverRef = ref(database, `drivers/${activeUid}`);
      const unsubDriver = onValue(driverRef, async (driverSnap) => {
        if (!isSubscribed) return;
        const driverData = driverSnap.val();
        let assignedCompany = driverData?.companyId;
        const assignedLines: string[] = Array.isArray(driverData?.lines) ? driverData.lines : [];

        if (!assignedCompany) {
          assignedCompany = (await getDriverCompanyId()) || null;
        }
        if (assignedCompany) {
          setCompanyId(assignedCompany);
        }

        // 2. Fetch companies to resolve available bus lines and route definitions
        const compRef = ref(database, "companies");
        const unsubCompanies = onValue(compRef, (compSnap) => {
          if (!isSubscribed) return;
          const allComp = compSnap.val() || {};
          const routesMap: Record<string, any> = {};
          const companyLinesSet = new Set<string>();

          // Collect available company list
          const compList: CompanyOption[] = [];
          Object.keys(allComp).forEach((cid) => {
            compList.push({ id: cid, name: allComp[cid]?.name || cid.toUpperCase() });
          });
          setAvailableCompanies(compList);

          // Map all routes and collect lines
          Object.keys(allComp).forEach((cid) => {
            const c = allComp[cid];
            const isMatchComp = !assignedCompany || cid.toLowerCase() === assignedCompany.toLowerCase();

            // Collect busLines array
            if (Array.isArray(c.busLines)) {
              c.busLines.forEach((l: string) => {
                if (isMatchComp) companyLinesSet.add(l);
              });
            }

            // Collect buses & mandatory stops
            if (c.buses && typeof c.buses === "object") {
              Object.values(c.buses).forEach((b: any) => {
                if (b?.lineId) {
                  routesMap[b.lineId.toLowerCase()] = b;
                  if (isMatchComp) companyLinesSet.add(b.lineId);
                }
              });
            }
          });

          setRouteDefinitions(routesMap);

          // Filter driver assigned lines
          const matchedAssigned = assignedLines.filter((l) => companyLinesSet.has(l));
          const availableLines = matchedAssigned.length > 0
            ? matchedAssigned
            : (companyLinesSet.size > 0 ? Array.from(companyLinesSet) : assignedLines);

          setBusLines(availableLines);

          // Default line selection
          setSelectedBusLine((prev) => {
            if (prev && availableLines.includes(prev)) return prev;
            if (storedLine && availableLines.includes(storedLine)) return storedLine;
            return availableLines.length > 0 ? availableLines[0] : null;
          });
        }, (compErr) => {
          console.error("[DriverProfile] Companies RTDB subscription error:", compErr);
        });

        return () => off(compRef, "value", unsubCompanies);
      }, (driverErr) => {
        console.error("[DriverProfile] Driver RTDB subscription error:", driverErr);
      });

      return () => off(driverRef, "value", unsubDriver);
    };

    fetchDriverAndCompanyData();

    return () => {
      isSubscribed = false;
    };
  }, [user?.uid]);

  /**
   * Switches the active operating company or institution.
   */
  const handleSelectCompany = async (newCompanyId: string) => {
    setCompanyId(newCompanyId);
    await setDriverCompanyId(newCompanyId);
    setCompanyPickerVisible(false);
  };

  return {
    companyId,
    availableCompanies,
    busLines,
    selectedBusLine,
    setSelectedBusLine,
    routeDefinitions,
    activeRoute,
    driverInitials,
    driverName,
    companyPickerVisible,
    setCompanyPickerVisible,
    handleSelectCompany,
  };
}
