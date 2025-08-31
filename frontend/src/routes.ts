import Home from "./pages/Home.svelte";
import Listings from "@pages/Listings.svelte";
import About from "@pages/About.svelte";
import Statistics from "@pages/statistics/Statistics.svelte";
import Rent from "@pages/statistics/Rent.svelte";
import Released from "@pages/statistics/Released.svelte";
import Interested from "@pages/statistics/Interested.svelte"; // Assuming this is the correct import for the Interested page
import Map from "@pages/map/Map.svelte";
import Apartment from "@pages/Apartment.svelte"; // Assuming this is the correct import for the Apartment details page
import Test from "@pages/Test.svelte"; // Assuming this is the correct import for the Test page
import Features from "@pages/statistics/Features.svelte";
import Location from "@pages/Location/Location.svelte";


export default {
  "/": Home,
  "/listings": Listings,
  "/listings/:published/:objectId": Apartment, // Assuming this is the correct route for apartment details
  "/about": About,
  "/statistics": Statistics,
  "/statistics/rent": Rent, 
  "/statistics/released": Released,
  "/statistics/interested": Interested,
  "/statistics/feature": Features,
  "/map": Map,
  "/location/:area": Location,
  "/test": Test

};
