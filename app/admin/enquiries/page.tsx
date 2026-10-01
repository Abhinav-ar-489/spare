import { enquiryService } from "@/services";
import { EnquiriesView } from "@/components/admin/enquiries-view";

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const enquiries = await enquiryService.getEnquiries();

  return <EnquiriesView initialEnquiries={enquiries} />;
}
