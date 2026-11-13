// What is left here is not a mock backend any more.
//
// `content` holds the guides and reference copy written for the site — real
// text, served statically. `clock` is date arithmetic. The rest of this
// directory (account, ai, catalog, pets, services, store) was a working fake
// backend whose invented pets, vets, clinics and prices were published as if
// they were real; it lives in parked/ now. See parked/README.md.
export * from "./clock";
export * from "./content";
