import carA97 from "../assets/vehicles/photos/nord-a9.jpg";
import maxCity from "../assets/vehicles/photos/nord-max.jpg";
import carChurch1 from "../assets/vehicles/photos/nord-a7.jpg";
import carA5 from "../assets/vehicles/photos/nord-a5.jpg";
import nordC3 from "../assets/vehicles/photos/nord-c3.jpg";
import nordA3 from "../assets/vehicles/photos/nord-a3.jpg";
import nordC9 from "../assets/vehicles/photos/nord-c9.jpg";
import nordDemir from "../assets/vehicles/photos/nord-demir.jpg";
import nordTusk from "../assets/vehicles/photos/nord-tusk.jpg";
import nordFlit from "../assets/vehicles/photos/nord-flit.jpg";
import nordTripper from "../assets/vehicles/photos/nord-tripper.jpg";
import tavetLuto from "../assets/vehicles/photos/tavet-luto.jpg";
import tavetGarent from "../assets/vehicles/photos/tavet-garent.jpg";
import tavetVant from "../assets/vehicles/photos/tavet-vant.jpg";

export type VehicleIconType = "sedan" | "coupe" | "suv" | "pickup" | "bus" | "ev" | "van";

export type Vehicle = {
  id: string;
  img?: string;
  imageDataUrl?: string;
  hideImage?: boolean;
  icon: VehicleIconType;
  name: string;
  category: string;
  groupCategory: string;
  brandName?: string;
  site: string;
  price: string;
  priceValue: number;
  year: string;
  url: string;
  enabled?: boolean;
};

export type VehicleGroup = {
  category: string;
  site: string;
  models: string[];
};

const fallbackImages: Record<string, string> = {
  nord_c3: nordC3.src,
  nord_a3: nordA3.src,
  nord_a5: carA5.src,
  nord_a7: carChurch1.src,
  nord_a9: carA97.src,
  nord_c9: nordC9.src,
  nord_demir: nordDemir.src,
  nord_max: maxCity.src,
  nord_tusk: nordTusk.src,
  nord_flit: nordFlit.src,
  nord_tripper: nordTripper.src,
  tavet_luto: tavetLuto.src,
  tavet_garent: tavetGarent.src,
  tavet_vant: tavetVant.src,
};

export const defaultVehicleCatalog: Vehicle[] = [
  { id: "nord_c3", icon: "coupe", name: "Nord C3", category: "Sport Coupé", groupCategory: "Sedans", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦32.5M", priceValue: 32_500_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-c3/", enabled: true },
  { id: "nord_a3", icon: "sedan", name: "Nord A3", category: "Sedan", groupCategory: "Sedans", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦46.94M", priceValue: 46_940_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-a3/", enabled: true },
  { id: "nord_a5", icon: "suv", name: "Nord A5", category: "SUV", groupCategory: "SUVs", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦34.5M", priceValue: 34_500_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-a5/", enabled: true },
  { id: "nord_a7", icon: "suv", name: "Nord A7", category: "SUV", groupCategory: "SUVs", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦72.83M", priceValue: 72_830_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-a7/", enabled: true },
  { id: "nord_a9", icon: "suv", name: "Nord A9", category: "SUV", groupCategory: "SUVs", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦56M", priceValue: 56_000_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-a9/", enabled: true },
  { id: "nord_c9", icon: "suv", name: "Nord C9", category: "SUV", groupCategory: "SUVs", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦54.5M", priceValue: 54_500_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-c9/", enabled: true },
  { id: "nord_demir", icon: "suv", name: "Nord Demir", category: "Luxury SUV", groupCategory: "SUVs", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦94M", priceValue: 94_000_000, year: "2026", url: "https://nordmotion.com/vehicle/demir/", enabled: true },
  { id: "nord_max", icon: "pickup", name: "Nord Max", category: "Pickup", groupCategory: "Pickup Trucks", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦38.5M", priceValue: 38_500_000, year: "2026", url: "https://nordmotion.com/vehicle/max/", enabled: true },
  { id: "nord_tusk", icon: "pickup", name: "Nord Tusk", category: "Pickup", groupCategory: "Pickup Trucks", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦49M", priceValue: 49_000_000, year: "2026", url: "https://nordmotion.com/vehicle/tusk/", enabled: true },
  { id: "nord_flit", icon: "van", name: "Nord Flit", category: "Van / Bus", groupCategory: "Buses", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦43M", priceValue: 43_000_000, year: "2026", url: "https://nordmotion.com/vehicle/flit/", enabled: true },
  { id: "nord_tripper", icon: "bus", name: "Nord Tripper", category: "Coach Bus", groupCategory: "Buses", brandName: "Nord Motion", site: "https://www.nordmotion.com", price: "From ₦65M", priceValue: 65_000_000, year: "2026", url: "https://nordmotion.com/vehicle/tripper/", enabled: true },
  { id: "tavet_luto", icon: "ev", name: "Tavet Luto", category: "Compact City EV", groupCategory: "Electric Vehicles", brandName: "Tavet Motion", site: "https://www.tavetmotion.com", price: "From ₦16.9M", priceValue: 16_900_000, year: "2026", url: "https://www.tavetmotion.com/vehicles/luto", enabled: true },
  { id: "tavet_garent", icon: "ev", name: "Tavet Garent", category: "Electric Sedan", groupCategory: "Electric Vehicles", brandName: "Tavet Motion", site: "https://www.tavetmotion.com", price: "From ₦54.9M", priceValue: 54_900_000, year: "2026", url: "https://www.tavetmotion.com/vehicles/garent", enabled: true },
  { id: "tavet_vant", icon: "van", name: "Tavet Vant", category: "Electric Logistics Van", groupCategory: "Electric Vehicles", brandName: "Tavet Motion", site: "https://www.tavetmotion.com", price: "From ₦39.5M", priceValue: 39_500_000, year: "2026", url: "https://www.tavetmotion.com/vehicles/vant", enabled: true },
];

const iconTypes = new Set<VehicleIconType>(["sedan", "coupe", "suv", "pickup", "bus", "ev", "van"]);

function slugifyVehicleId(value: string, fallback: string): string {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return slug || fallback;
}

function normalizeVehicle(item: Partial<Vehicle>, index: number): Vehicle {
  const fallback = defaultVehicleCatalog[index] ?? defaultVehicleCatalog[0];
  const id = slugifyVehicleId(String(item.id || item.name || fallback.id), `vehicle_${index + 1}`);
  const icon = iconTypes.has(item.icon as VehicleIconType) ? item.icon as VehicleIconType : fallback.icon;

  return {
    id,
    img: item.hideImage ? undefined : item.imageDataUrl || item.img || fallbackImages[id],
    imageDataUrl: typeof item.imageDataUrl === "string" ? item.imageDataUrl : undefined,
    hideImage: item.hideImage === true,
    icon,
    name: String(item.name || fallback.name || `Vehicle ${index + 1}`),
    category: String(item.category || fallback.category || "Vehicle"),
    groupCategory: String(item.groupCategory || fallback.groupCategory || "Vehicles"),
    brandName: String(item.brandName || fallback.brandName || (String(item.site || fallback.site || "").includes("tavetmotion.com") ? "Tavet Motion" : "Nord Motion")),
    site: String(item.site || fallback.site || ""),
    price: String(item.price || fallback.price || ""),
    priceValue: Number.isFinite(Number(item.priceValue)) ? Number(item.priceValue) : fallback.priceValue,
    year: String(item.year || fallback.year || new Date().getFullYear()),
    url: String(item.url || fallback.url || item.site || fallback.site || "#"),
    enabled: item.enabled !== false,
  };
}

export function normalizeVehicleCatalog(value: unknown): Vehicle[] {
  const source = Array.isArray(value) && value.length > 0 ? value : defaultVehicleCatalog;
  return source.map((item, index) => normalizeVehicle(item as Partial<Vehicle>, index));
}

export const vehicles: Vehicle[] = normalizeVehicleCatalog(defaultVehicleCatalog).filter((vehicle) => vehicle.enabled !== false);

export function getVehicleByNameMap(catalog: Vehicle[] = vehicles): Map<string, Vehicle> {
  return new Map(catalog.map((vehicle) => [vehicle.name, vehicle]));
}

export const vehicleByName = getVehicleByNameMap(vehicles);

export function getVehicleGroups(catalog: Vehicle[] = vehicles): VehicleGroup[] {
  return Array.from(
    catalog.reduce<Map<string, VehicleGroup>>((groups, vehicle) => {
      const group = groups.get(vehicle.groupCategory);

      if (group) {
        group.models.push(vehicle.name);
      } else {
        groups.set(vehicle.groupCategory, {
          category: vehicle.groupCategory,
          site: vehicle.site,
          models: [vehicle.name],
        });
      }

      return groups;
    }, new Map()).values()
  );
}

export const vehicleGroups: VehicleGroup[] = getVehicleGroups(vehicles);

export const MODEL_INDICATIVE_PRICES: Record<string, number> = Object.fromEntries(
  vehicles.map((vehicle) => [vehicle.name, vehicle.priceValue])
);

export function indicativePriceForModel(model: string): number {
  return vehicleByName.get(model)?.priceValue ?? 35_000_000;
}
