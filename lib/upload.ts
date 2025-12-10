import { supabase } from "./supabase";

export async function uploadImage(file: File) {
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("property-images")
    .upload(fileName, file);

  if (error) throw error;

  const url = supabase.storage
    .from("property-images")
    .getPublicUrl(fileName).data.publicUrl;

  return url;
}
