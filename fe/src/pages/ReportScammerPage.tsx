import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";
import { useAuth } from "../hooks/useAuth";
import { reportScammer } from "../api/scammerApi";

// Schema aggiornato per corrispondere ai valori enum del backend
const formSchema = z.object({
  profileLink: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) =>
        /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?.*$/.test(url),
      {
        message:
          "Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)",
      }
    ),
  name: z.string().optional(),
  company: z.string().optional(),
  scamType: z.enum(
    [
      "download-suspicios-repo",
      "download-suspicios-software",
      "investment-scam",
      "romance-scam",
      "other",
    ],
    {
      required_error: "Please select a scam type",
    }
  ),
  notes: z
    .string()
    .min(10, "Please provide more details (at least 10 characters)"),
});

// Componente per evidenziare i campi obbligatori
const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex items-center">
    {children} <span className="text-red-500 ml-1">*</span>
  </div>
);

const ReportScammerPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileLink: "",
      name: "",
      company: "",
      scamType: undefined,
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please login to report a scam",
        });
        navigate("/login");
        return;
      }

      console.log("Submitting report with values:", values);
      const response = await reportScammer(values, token);
      console.log("Server response:", response);

      toast({
        title: "Scammer reported successfully",
        description: "Thank you for helping keep LinkedIn safe.",
      });

      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error submitting report:", error);

      // Extract the specific error message if available from the server response
      const errorMessage =
        error.response?.data?.message ||
        (error instanceof Error ? error.message : "Please try again later.");

      toast({
        variant: "destructive",
        title: "Error reporting scammer",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-[color:var(--color-foreground)]">
        Report a LinkedIn Scammer
      </h1>

      <div className="bg-[color:var(--color-card)] border border-[color:var(--color-border)] p-6 rounded-lg">
        <p className="text-sm text-[color:var(--color-muted-foreground)] mb-4">
          Fields marked with <span className="text-red-500">*</span> are
          required
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Update each FormField with proper text colors */}
            <FormField
              control={form.control}
              name="profileLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[color:var(--color-foreground)]">
                    <RequiredLabel>LinkedIn Profile URL</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      {...field}
                      className="mt-2 bg-[color:var(--color-background)] text-[color:var(--color-foreground)] border-[color:var(--color-border)]"
                    />
                  </FormControl>
                  <FormDescription className="text-[color:var(--color-muted-foreground)]">
                    Copy the full URL of the scammer's LinkedIn profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Update other FormFields similarly */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[color:var(--color-foreground)]">
                    Scammer's Name (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name shown on their profile"
                      {...field}
                      className="mt-2 bg-[color:var(--color-background)] text-[color:var(--color-foreground)] border-[color:var(--color-border)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[color:var(--color-foreground)]">
                    Company Name (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company they claim to represent"
                      {...field}
                      className="mt-2 bg-[color:var(--color-background)] text-[color:var(--color-foreground)] border-[color:var(--color-border)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scamType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[color:var(--color-foreground)]">
                    <RequiredLabel>Type of Scam</RequiredLabel>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="mt-2">
                      <SelectTrigger className="bg-[color:var(--color-background)] text-[color:var(--color-foreground)] border-[color:var(--color-border)]">
                        <SelectValue placeholder="Select a type of scam" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[color:var(--color-card)] border-[color:var(--color-border)]">
                      <SelectItem
                        value="download-suspicios-repo"
                        className="text-[color:var(--color-foreground)]"
                      >
                        Suspicious Repository Download
                      </SelectItem>
                      <SelectItem
                        value="download-suspicios-software"
                        className="text-[color:var(--color-foreground)]"
                      >
                        Suspicious Software Download
                      </SelectItem>
                      <SelectItem
                        value="investment-scam"
                        className="text-[color:var(--color-foreground)]"
                      >
                        Investment Scam
                      </SelectItem>
                      <SelectItem
                        value="romance-scam"
                        className="text-[color:var(--color-foreground)]"
                      >
                        Romance Scam
                      </SelectItem>
                      <SelectItem
                        value="other"
                        className="text-[color:var(--color-foreground)]"
                      >
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[color:var(--color-foreground)]">
                    <RequiredLabel>Details</RequiredLabel>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe how you identified this as a scam..."
                      className="h-32 mt-2 bg-[color:var(--color-background)] text-[color:var(--color-foreground)] border-[color:var(--color-border)]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[color:var(--color-muted-foreground)]">
                    Include any red flags, suspicious language, or other details
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] hover:bg-[color:var(--color-primary-light)] dark:hover:bg-[color:var(--color-primary-dark)]"
            >
              Submit Report
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ReportScammerPage;
