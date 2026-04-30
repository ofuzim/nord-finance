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
  img?: string;
  icon: VehicleIconType;
  name: string;
  category: string;
  groupCategory: string;
  site: string;
  price: string;
  priceValue: number;
  year: string;
  url: string;
};

export type VehicleGroup = {
  category: string;
  site: string;
  models: string[];
};

export const vehicles: Vehicle[] = [
  { img: nordC3.src, icon: "coupe", name: "Nord C3", category: "Sport Coupé", groupCategory: "Coupes", site: "https://www.nordmotion.com", price: "From ₦32.5M", priceValue: 32_500_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-c3/" },
  { img: nordA3.src, icon: "sedan", name: "Nord A3", category: "Sedan", groupCategory: "Sedans", site: "https://www.nordmotion.com", price: "From ₦46.94M", priceValue: 46_940_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-a3/" },
  { img: carA5.src, icon: "suv", name: "Nord A5", category: "SUV", groupCategory: "SUVs", site: "https://www.nordmotion.com", price: "From ₦34.5M", priceValue: 34_500_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-a5/" },
  { img: carChurch1.src, icon: "suv", name: "Nord A7", category: "SUV", groupCategory: "SUVs", site: "https://www.nordmotion.com", price: "From ₦72.83M", priceValue: 72_830_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-a7/" },
  { img: carA97.src, icon: "suv", name: "Nord A9", category: "SUV", groupCategory: "SUVs", site: "https://www.nordmotion.com", price: "From ₦56M", priceValue: 56_000_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-a9/" },
  { img: nordC9.src, icon: "suv", name: "Nord C9", category: "SUV", groupCategory: "SUVs", site: "https://www.nordmotion.com", price: "From ₦54.5M", priceValue: 54_500_000, year: "2026", url: "https://nordmotion.com/vehicle/nord-c9/" },
  { img: nordDemir.src, icon: "suv", name: "Nord Demir", category: "Luxury SUV", groupCategory: "SUVs", site: "https://www.nordmotion.com", price: "From ₦94M", priceValue: 94_000_000, year: "2026", url: "https://nordmotion.com/vehicle/demir/" },
  { img: maxCity.src, icon: "pickup", name: "Nord Max", category: "Pickup", groupCategory: "Pickup Trucks", site: "https://www.nordmotion.com", price: "From ₦38.5M", priceValue: 38_500_000, year: "2026", url: "https://nordmotion.com/vehicle/max/" },
  { img: nordTusk.src, icon: "pickup", name: "Nord Tusk", category: "Pickup", groupCategory: "Pickup Trucks", site: "https://www.nordmotion.com", price: "From ₦49M", priceValue: 49_000_000, year: "2026", url: "https://nordmotion.com/vehicle/tusk/" },
  { img: nordFlit.src, icon: "van", name: "Nord Flit", category: "Van / Bus", groupCategory: "Buses", site: "https://www.nordmotion.com", price: "From ₦43M", priceValue: 43_000_000, year: "2026", url: "https://nordmotion.com/vehicle/flit/" },
  { img: nordTripper.src, icon: "bus", name: "Nord Tripper", category: "Coach Bus", groupCategory: "Buses", site: "https://www.nordmotion.com", price: "From ₦65M", priceValue: 65_000_000, year: "2026", url: "https://nordmotion.com/vehicle/tripper/" },
  { img: tavetLuto.src, icon: "ev", name: "Tavet Luto", category: "Compact City EV", groupCategory: "Electric Vehicles", site: "https://www.tavetmotion.com", price: "From ₦16.9M", priceValue: 16_900_000, year: "2026", url: "https://www.tavetmotion.com/vehicles/luto" },
  { img: tavetGarent.src, icon: "ev", name: "Tavet Garent", category: "Electric Sedan", groupCategory: "Electric Vehicles", site: "https://www.tavetmotion.com", price: "From ₦54.9M", priceValue: 54_900_000, year: "2026", url: "https://www.tavetmotion.com/vehicles/garent" },
  { img: tavetVant.src, icon: "van", name: "Tavet Vant", category: "Electric Logistics Van", groupCategory: "Electric Vehicles", site: "https://www.tavetmotion.com", price: "From ₦39.5M", priceValue: 39_500_000, year: "2026", url: "https://www.tavetmotion.com/vehicles/vant" },
];

export const vehicleByName = new Map(vehicles.map((vehicle) => [vehicle.name, vehicle]));

export const vehicleGroups: VehicleGroup[] = Array.from(
  vehicles.reduce<Map<string, VehicleGroup>>((groups, vehicle) => {
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

export const MODEL_INDICATIVE_PRICES: Record<string, number> = Object.fromEntries(
  vehicles.map((vehicle) => [vehicle.name, vehicle.priceValue])
);

export function indicativePriceForModel(model: string): number {
  return vehicleByName.get(model)?.priceValue ?? 35_000_000;
}
