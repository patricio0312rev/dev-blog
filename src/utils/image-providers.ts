/**
 * Unsplash-compliant image providers
 */

export interface ImageSearchParams {
    query: string;
    orientation?: "landscape" | "portrait" | "squarish";
    size?: "small" | "regular" | "full";
  }
  
  export interface ImageResult {
    url: string;
    alt: string;
    author?: string;
    authorUrl?: string;
    unsplashUrl?: string; // Required for hotlinking compliance
    downloadLocation?: string; // Required for tracking downloads
    purpose?: string;
  }
  
  /**
   * Get image from Unsplash API with full metadata for compliance
   */
  export async function getUnsplashImage(
    params: ImageSearchParams
  ): Promise<ImageResult | null> {
    const accessKey = import.meta.env.UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      console.warn("UNSPLASH_ACCESS_KEY not configured, using fallback");
      return (await getPexelsImage(params)) || getPicsumImage(params);
    }

    try {
      const url = new URL("https://api.unsplash.com/photos/random");
      url.searchParams.set("query", params.query);
      url.searchParams.set("orientation", params.orientation || "landscape");
      url.searchParams.set("content_filter", "high");
      url.searchParams.set("client_id", accessKey);
  
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }
  
      const data = await response.json();
  
      return {
        // IMPORTANT: Use the original Unsplash URL (hotlinking requirement)
        url: data.urls.regular,
        alt: data.alt_description || data.description || params.query,
        author: data.user.name,
        authorUrl: data.user.links.html,
        // Store the Unsplash page URL for proper attribution
        unsplashUrl: data.links.html,
        // Store download location to trigger on view
        downloadLocation: data.links.download_location,
      };
    } catch (error) {
      console.error("Failed to fetch from Unsplash:", error);
      return (await getPexelsImage(params)) || getPicsumImage(params);
    }
  }
  
  /**
   * Get image from Pexels (alternative to Unsplash)
   */
  export async function getPexelsImage(
    params: ImageSearchParams
  ): Promise<ImageResult | null> {
    const apiKey = import.meta.env.PEXELS_API_KEY;
    
    if (!apiKey) {
      return null;
    }
  
    try {
      const url = new URL("https://api.pexels.com/v1/search");
      url.searchParams.set("query", params.query);
      url.searchParams.set("per_page", "1");
      url.searchParams.set("orientation", params.orientation || "landscape");
  
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: apiKey,
        },
      });
      
      if (!response.ok) {
        return null;
      }
  
      const data = await response.json();
      
      if (!data.photos || data.photos.length === 0) {
        return null;
      }
  
      const photo = data.photos[0];
  
      return {
        url: photo.src.large,
        alt: params.query,
        author: photo.photographer,
        authorUrl: photo.photographer_url,
      };
    } catch (error) {
      console.error("Failed to fetch from Pexels:", error);
      return null;
    }
  }
  
  /**
   * Fallback to Lorem Picsum
   */
  export function getPicsumImage(params: ImageSearchParams): ImageResult {
    const width = 1200;
    const height = params.orientation === "portrait" ? 1600 : 630;
    
    const seed = params.query
      .replace(/\s+/g, "-")
      .toLowerCase()
      .substring(0, 50);
    
    return {
      url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      alt: `Illustration for ${params.query}`,
    };
  }
  
  /**
   * Generate OG image URL
   */
  export function getOgImageUrl(
    heroImage: string | undefined,
    title: string
  ): string {
    if (heroImage) {
      // Keep original Unsplash URL for hotlinking compliance
      return heroImage;
    }
    return "/og-image.png";
  }
  
  /**
   * Get optimized image URL (Unsplash-compliant)
   * NOTE: We keep the original Unsplash URL and add query params for optimization
   */
  export function getOptimizedImageUrl(
    imageUrl: string,
    width: number = 800,
    quality: number = 85
  ): string {
    // For Unsplash images, we can add optimization params while keeping the original URL
    if (imageUrl.includes("images.unsplash.com")) {
      const url = new URL(imageUrl);
      // Unsplash supports these params for optimization
      url.searchParams.set("w", width.toString());
      url.searchParams.set("q", quality.toString());
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      return url.toString();
    }
  
    if (imageUrl.includes("picsum.photos")) {
      return imageUrl;
    }
  
    return imageUrl;
  }
  
  /**
   * Track Unsplash download (required for compliance)
   * Call this when an image is displayed to the user
   */
  export async function trackUnsplashDownload(downloadLocation: string): Promise<void> {
    const accessKey = import.meta.env.UNSPLASH_ACCESS_KEY;
    
    if (!accessKey || !downloadLocation) {
      return;
    }
  
    try {
      await fetch(downloadLocation, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      });
    } catch (error) {
      console.warn("Failed to track Unsplash download:", error);
    }
  }
