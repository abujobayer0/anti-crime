import { useApi } from "./useApi";
import { ENDPOINTS } from "@/api/config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Report {
  _id: string;
  title: string;
  description: string;
  division: string;
  district: string;
  location: {
    lat: number;
    lng: number;
  };
  images: string[];
  crimeTime: string;
  userId: {
    _id: string;
    name: string;
  };
  upvotes: string[];
  downvotes: string[];
  comments: any[];
}

export const useReports = () => {
  const { client, handleError, handleSuccess } = useApi();
  const queryClient = useQueryClient();

  const getReports = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data } = await client.get(ENDPOINTS.reports.list);
      return data;
    },
  });

  // Get single report
  const getReport = (id: string) =>
    useQuery({
      queryKey: ["reports", id],
      queryFn: async () => {
        const { data } = await client.get(ENDPOINTS.reports.detail(id));
        return data.data;
      },
    });

  const createReport = useMutation({
    mutationFn: async (reportData: any) => {
      try {
        const { data } = await client.post(
          ENDPOINTS.reports.create,
          reportData
        );
        handleSuccess("Report created successfully");
        queryClient.invalidateQueries({ queryKey: ["reports"] });
        return data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
  const generateAiDescription = useMutation({
    mutationFn: async (reportData: {
      imageUrl: string[];
      division: string;
      district: string;
      crime_time: string;
    }) => {
      if (!reportData.imageUrl.length) {
        throw new Error("Images are required");
      }
      if (!reportData.division) {
        throw new Error("Division is required");
      }
      if (!reportData.district) {
        throw new Error("District is required");
      }

      const data = await client.post(
        ENDPOINTS.reports.generateAiDescription,
        reportData
      );

      return data.data;
    },
    onSuccess: (data) => {
      toast.success("AI description generated successfully");
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate AI description");
      handleError(error);
      throw error;
    },
  });

  // Update report
  const updateReport = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Report> }) => {
      const response = await client.patch(ENDPOINTS.reports.update(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports", variables.id] });
      toast.success("Report updated successfully");
    },
  });

  // Delete report
  const deleteReport = useMutation({
    mutationFn: async (id: string) => {
      await client.delete(ENDPOINTS.reports.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report deleted successfully");
    },
  });

  // Add vote mutations
  const voteReport = useMutation({
    mutationFn: async ({
      id,
      type,
    }: {
      id: string;
      type: "upvote" | "downvote";
    }) => {
      const { data } = await client.post(
        `${ENDPOINTS.reports.list}/${id}/${type}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  // Add evidence mutation
  const addEvidence = useMutation({
    mutationFn: async ({
      reportId,
      evidence,
    }: {
      reportId: string;
      evidence: any;
    }) => {
      const { data } = await client.post(
        `${ENDPOINTS.reports.list}/${reportId}/evidence`,
        evidence
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  return {
    getReports,
    getReport,
    createReport,
    updateReport,
    deleteReport,
    voteReport,
    addEvidence,
    generateAiDescription,
  };
};
