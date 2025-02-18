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
          "https://bdapis.com/api/v1.2/divisions"
        );
        setDivisions(data.data);
      } catch (error) {
        handleAPIError(error);
      }
    };
    fetchDivisions();
  }, []);

  const fetchDistricts = async (division: string) => {
    if (!division) return;

    try {
      const { data } = await axios.get(
        `https://bdapis.com/api/v1.2/division/${division}`
      );
      setDistricts(data.data);
    } catch (error) {
      handleAPIError(error);
    }
  };

  return {
    divisions,
    districts,
    fetchDistricts,
  };
};
