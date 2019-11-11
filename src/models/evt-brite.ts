export interface Event {
  name: String;
  description: String;
  id: Number;
  start: String;
  end: String;
  timezone: String;
  logoId: Number;
  logoUrl: String;
  venueAddress: String;
  categoryId: Number;
  subcategoryId: Number;
  favorite: Boolean;
}