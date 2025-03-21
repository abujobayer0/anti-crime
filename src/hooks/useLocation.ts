import { useState, useEffect } from "react";
import axios from "axios";
import { handleAPIError } from "@/lib/Error";

interface Division {
  division: string;
  district: string;
  coordinates: string;
}

interface District {
  district: string;
  division: string;
  coordinates: string;
}

export const useLocation = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const { data } = await axios.get(
          "https://bdapi.vercel.app/api/v.1/division"
        );
        setDivisions(data.data);
      } catch (error) {
        handleAPIError(error);
      }
    };
    fetchDivisions();
  }, []);

  const fetchDistricts = async (division: any) => {
    if (!division) return;
    const ac = new AbortController();
    try {
      const { data } = await axios.get(
        `https://bdapi.vercel.app/api/v.1/district/${division.id}`,
        { signal: ac.signal }
      );

      setDistricts(data.data);
    } catch (error) {
      if (!axios.isCancel(error)) {
        handleAPIError(error);
      }
    }
    return () => ac.abort();
  };

  return {
    divisions,
    districts,
    fetchDistricts,
  };
};
