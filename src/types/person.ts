import type { Database } from "@/types/database.types";

export type PersonStatus = "active" | "inactive";

export type PersonRow = Database["public"]["Tables"]["persons"]["Row"];
export type PersonInsert = Database["public"]["Tables"]["persons"]["Insert"];
export type PersonUpdate = Database["public"]["Tables"]["persons"]["Update"];

export type Person = Omit<PersonRow, "status"> & { status: PersonStatus };

export interface PersonFormValues {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: PersonStatus;
}

export type PersonPayload = Omit<PersonFormValues, "role"> & {
  role: string | null;
};
