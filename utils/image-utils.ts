/**
 * Resolves an image path to a full public URL.
 * Static implementation to avoid client/server conflicts during build.
 */
export function resolveImageUrl(path: string | null | undefined, bucket: string = "property-images"): string {
    if (!path) return "/placeholder.svg";

    const s = path.trim();
    if (!s) return "/placeholder.svg";

    // 1. Full URLs
    if (s.startsWith("http://") || s.startsWith("https://")) return s;

    // 2. Local public folder
    if (s.startsWith("/")) return s;

    // 3. Supabase Storage Manual Construction
    // Using the known URL from .env
    const supabaseUrl = "https://riteshkumarlenka.supabase.co";
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${s}`;
}
